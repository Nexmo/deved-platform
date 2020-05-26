---
title: Create a Party With Ruby on Rails and the Vonage Video API – Part 2
thumbnail: https://www.nexmo.com/wp-content/uploads/2020/05/Blog_Ruby_Video-API-Part2_1200x600.png
author: ben-greenberg
published: true
published_at: 2020-05-13T10:30:00.000Z
comments: true
category: tutorial
series: create-a-party-with-ruby-on-rails-and-the-vonage-video
tags:
  - javascript
  - ruby
  - rails
  - video-api
description: Build a custom video watch party app. In this second post of the series, you will learn how to add Javascript frontend to the Ruby backend
---

This is the second part of a two-part series on creating a video watch party application using the Vonage Video API and Ruby on Rails. 

In the [first article](https://www.nexmo.com/blog/2020/05/12/create-a-party-with-ruby-on-rails-and-the-vonage-video-api-part-1-building-the-backend-dr), we went through the steps of building the backend of the app. If you have not read that post yet, it would be a good place to start. Now we are going to focus on the frontend of our application. While the backend was written mainly in Ruby, the frontend will be a lot of client-side JavaScript. 

Once we are done, we will have a video watch party app that we can use to chat with our friends and watch videos together!

![Landing Page](https://www.nexmo.com/wp-content/uploads/2020/05/landing_page.png)

Let's get started!

<em>tl;dr If you would like to skip ahead and get right to deploying it, you can find all the code for the app and a one-click <img style="display:inline" src="https://www.herokucdn.com/deploy/button.svg" alt="Deploy to Heroku"> button on <a href="https://github.com/nexmo-community/rails-video-watch-party-app">GitHub</a>.</em>

### Table of Contents

* [What Will We Be Building](#what-will-we-be-building)
* [Creating the JavaScript Packs](#creating-the-javascript-packs)
* [Styling the Application](#styling-the-application)
* [Putting It All Together](#putting-it-all-together)

<h2 id="what-will-we-be-building">What Will We Be Building</h2>

Before we start coding, it is a good idea to take a moment and discuss what we will be building.

If you recall from the first post, we had instantiated a Video API Session ID, and are actively creating tokens for each participant. That information is being passed to the frontend by newly created JavaScript variables in the ERB view files. Additionally, we are also passing data from our environment variables to the frontend. We will be using all that information in the code we will write to create the experience of the app.

Ruby on Rails has come a long way in integrating client-side JavaScript directly into the stack with the introduction of Webpack in Rails starting with version 5.1. JavaScript is incorporated through *packs* placed inside `/app/javascript/packs` and added as either `import` or `require()` statements inside the `application.js` file inside the directory. 

We will be separating out the various concerns of our code into different files so that at the end your folder will have the following files:

```bash
# app/javascript/packs

- application.js
- app_helpers.js
- chat.js
- opentok_screenshare.js
- opentok_video.js
- party.js
- screenshare.js
```

Each file, besides `application.js`, will contain code to cover distinct concerns:

* `app_helpers.js`: Cross-functional code that is needed across the frontend
* `chat.js`: Creating a `Chat` class that will be used to instantiate instances of the text chat
* `opentok_screenshare.js`: The client-side code for the Screenshare view
* `opentok_video.js`: The client-side code for the Video Chat view
* `party.js`: Creating a `Party` class that will be used to instantiate instances of the video chat
* `screenshare.js`: Creating a `Screenshare` class that will be used to instantiate instances of the screenshare functionality

Prior to creating the code, let's add these files to the `application.js` file, which will instruct Webpack to compile them at runtime:

```js
// application.js

import './app_helpers.js'
import './opentok_video.js'
import './opentok_screenshare.js'
```

<h2 id="creating-the-javascript-packs">Creating the JavaScript Packs</h2>

In each subsection, we will create the JavaScript files that we enumerated above.

### The `app_helpers.js` File

The `app_helpers.js` file will contain generic helper functions that we will export to the rest of the code to use throughout the app. We will create `screenshareMode()`, `setButtonDisplay()`, `formatChatMsg()`, and `streamLayout()` functions.

The `screenshareMode()` function will take advantage of the Vonage Video API Signal API to send a message to the browsers of all the participants that will trigger a `window.location` change. The Signal API is the same API we will use for the text chat, which is its simplest use case. However, as we will see in this function, the Signal API provides an intuitive and powerful way to direct the flow of your application simultaneously for all the participants without needing to write lots of code:

```js
export function screenshareMode(session, mode) {
  if (mode == 'on') {
    window.location = '/screenshare?name=' + name;
    session.signal({
      type: 'screenshare',
      data: 'on'
    });
  } else if (mode == 'off') {
    window.location = '/party?name=' + name;
    session.signal({
      type: 'screenshare',
      data: 'off'
    });    
  };
};
```

The next function, `setButtonDisplay()` changes the style for the HTML element containing the "Watch Mode On/Off" button to either be `block` or `none` depending on whether the participant is the moderator or not. There are many other ways to do this, including more secure methods. However, in order to keep things simple for this app to watch videos amongst friends, we will keep the keep minimalist:

```js
export function setButtonDisplay(element) {
  if (name == moderator_env_name) {
    element.style.display = "block";
  } else {
    element.style.display = "none";
  };
};
```

The `formatChatMsg()` function takes in the text message the participant sent as an argument and formats it for presentation on the site. This function looks for any text bracketed by two colons and attempts to parse the text inside those colons as an emoji. It also appends the participant's name to each message so everyone knows who is talking. 

In order to add the emojis, we need to install a node package called `node-emoji` and we can do that by adding `const emoji = require('node-emoji);` to the top of the file and running `yarn add node-emoji` in the command line. The function will utilize `match()` with a regular expression to search for strings of text bookmarked by two colons, and if it matches, it will invoke the `emoji` const we defined to turn that string into an emoji:

```js
export function formatChatMsg(message) {
  var message_arr;
  message_arr = message.split(' ').map(function(word) {
    if (word.match(/(?:\:)\b(\w*)\b(?=\:)/g)) {
      return word = emoji.get(word);
    } else {
      return word;
    }
  })
  message = message_arr.join(' ');
  return `${name}: ${message}`
};
```

The last function inside `app_helpers.js` we need to create is `streamLayout()` that takes in arguments of the HTML element and the count of participants. The function will add or remove CSS classes to the element depending on the number of participants in order to change the video chat presentation into a grid format:

```js
export function streamLayout(element, count) {
  if (count >= 6) {
    element.classList.add("grid9");
  } else if (count == 5) {
    element.classList.remove("grid9");
    element.classList.add("grid4");
  } else if (count < 5) {
    element.classList.remove("grid4");
  }
};
```

### The `chat.js` File

The `chat.js` code is going to create the `Chat` class using a `constructor()`. This `Chat` class will be called and instantiated in both the video chat and screenshare views:

```js
// chat.js

import { formatChatMsg } from './app_helpers.js';

export default class Chat {
  constructor(session) {
    this.session = session;
    this.form = document.querySelector('form');
    this.msgTxt = document.querySelector('#message');
    this.msgHistory = document.querySelector('#history');
    this.chatWindow = document.querySelector('.chat');
    this.showChatBtn = document.querySelector('#showChat');
    this.closeChatBtn = document.querySelector('#closeChat');
    this.setupEventListeners();
  }
```

We have given several properties to `Chat`, mostly based on different elemnts in the DOM and the Video API session. The last one, `this.setupEventListeners()` is invoking a function that we need to now add to the file:

```js
  setupEventListeners() {
    let self = this;
    this.form.addEventListener('submit', function(event) {
      event.preventDefault();

      self.session.signal({
        type: 'msg',
        data: formatChatMsg(self.msgTxt.value)
      }, function(error) {
        if (error) {
          console.log('Error sending signal:', error.name, error.message);
        } else {
          self.msgTxt.value = '';
        }
      });
    });

    this.session.on('signal:msg', function signalCallback(event) {
      var msg = document.createElement('p');
      msg.textContent = event.data;
      msg.className = event.from.connectionId === self.session.connection.connectionId ? 'mine' : 'theirs';
      self.msgHistory.appendChild(msg);
      msg.scrollIntoView();
    });

    this.showChatBtn.addEventListener('click', function(event) {
      self.chatWindow.classList.add('active');
    });

    this.closeChatBtn.addEventListener('click', function(event) {
      self.chatWindow.classList.remove('active');
    });
  }
}
```

`setupEventListeners()` creates an `EventListener` for the text chat `submit` button. When a new message is submitted it is sent to the Signal API to be processed and sent to all the participants. Similarly, when a new message is received a new `<p>` tag is added to the chat element, and the participant's text chat window is scrolled to view it. 

The next two files we will create perform similar functionality in creating new classes for the video chat party and for the screenshare view.

### The `party.js` File

In this file we will create the `Party` class that will be used to instantiate new instances of the video chat:

```js
// party.js

import { screenshareMode, setButtonDisplay, streamLayout } from './app_helpers.js';

export default class Party {
  constructor(session) {
    this.session = session;
    this.watchLink = document.getElementById("watch-mode");
    this.subscribers = document.getElementById("subscribers");
    this.participantCount = document.getElementById("participant-count");
    this.videoPublisher = this.setupVideoPublisher();
    this.clickStatus = 'off';
    this.setupEventHandlers();
    this.connectionCount = 0;
    setButtonDisplay(this.watchLink);
  }
```

The `constructor()` function is given the Video API session as an argument and passes that to `this.session`. The rest of the properties are defined and given values. The `watchLink`, `subscribers`, `participantCount` properties come from the HTML elements, while `videoPublisher` is provided a function as its value, and `clickStatus` is given default of `off`.

We will create the `setupVideoPublisher()` function at this point. The function invokes the Video API JavaScript SDK `initPublisher()` function to start the video publishing. It can take in optional arguments, and as such, we specify that the video should occupy 100% of the width and height of its element and should be appended to the element:

```js
  setupVideoPublisher() {
    return OT.initPublisher('publisher', {
      insertMode: 'append',
      width: "100%",
      height: "100%"
    }, function(error) {
      if (error) {
        console.error('Failed to initialise publisher', error);
      };
    });
  }
```

There are several actions we also must create event listeners for and add them to the class. We need to listen for when the session is connected, when a video stream has been created, when a connction has been added and when a connection has been destroyed. When a connection has been added or destroyed, we either increment or decrement the participant count, and share the number of participants in the participant count `<div>` element on the page:

```js
  setupEventHandlers() {
    let self = this;
    this.session.on({
      // This function runs when session.connect() asynchronously completes
      sessionConnected: function(event) {
        // Publish the publisher we initialzed earlier (this will trigger 'streamCreated' on other
        // clients)
        self.session.publish(self.videoPublisher, function(error) {
          if (error) {
            console.error('Failed to publish', error);
          }
        });
      },

      // This function runs when another client publishes a stream (eg. session.publish())
      streamCreated: function(event) {
        // Subscribe to the stream that caused this event, and place it into the element with id="subscribers"
        self.session.subscribe(event.stream, 'subscribers', {
          insertMode: 'append',
          width: "100%",
          height: "100%"
        }, function(error) {
          if (error) {
            console.error('Failed to subscribe', error);
          }
        });
      },

      // This function runs whenever a client connects to a session
      connectionCreated: function(event) {
        self.connectionCount++;
        self.participantCount.textContent = `${self.connectionCount} Participants`;
        streamLayout(self.subscribers, self.connectionCount);
      },

      // This function runs whenever a client disconnects from the session
      connectionDestroyed: function(event) {
        self.connectionCount--;
        self.participantCount.textContent = `${self.connectionCount} Participants`;
        streamLayout(self.subscribers, self.connectionCount);
      }
    });
```

Lastly, we add one more event listener. This event listener is attached to the `click` action on the "Watch Mode On/Off" button. When it is clicked it goes to the screenshare view, if the click status was off. You will recall that the click status is given a default of off in the construction of the class:

```js
    this.watchLink.addEventListener('click', function(event) {
      event.preventDefault();
      if (self.clickStatus == 'off') {
        // Go to screenshare view
        screenshareMode(self.session, 'on');
      };
    });
  }
}
```

### The `screenshare.js` File

The final class we will create is a `Screenshare` class that will be responsible for defining the video screenshare. The `constructor()` function takes the Video API session and the participant's name as arguments:

```js
// screenshare.js

import { screenshareMode } from './app_helpers.js';

export default class Screenshare {
  constructor(session, name) {
    this.session = session;
    this.name = name;
    this.watchLink = document.getElementById("watch-mode");
    this.clickStatus = 'on';
  }
```

Unlike the `Party` class, the `clickStatus` here defaults to `on` since we want to move away from the screenshare and back to the video chat mode, if the moderator clicks the "Watch Mode On/Off" button. 

We also utilize `toggle()` to either share the participant's screen, if the participant is the moderator, or subscribe to the screenshare for everyone else:

```js
  toggle() {
    if (this.name === moderator_env_name) {
      this.shareScreen();
    } else {
      this.subscribe();
    }
  }
```

The `shareScreen()` function invoked in the `toggle()` needs to be defined:

```js
  shareScreen() {
    this.setupPublisher();
    this.setupAudioPublisher();
    this.setupClickStatus();
  }
```

This function itself has three functions that need to also be created. The first function will publish the screen of the moderator. However, the screen publishing by itself does not also include audio. Therefore, a second function will publish the audio from the moderator's computer. Then, the final function in `shareScreen()` will move back to the video chat view if the "Watch Mode On/Off" button is clicked:

```js
setupClickStatus() {
    // screen share mode off if clicked off
    // Set click status
    let self = this;
    this.watchLink.addEventListener('click', function(event) {
      event.preventDefault();
      if (self.clickStatus == 'on') {
        self.clickStatus = 'off';
        screenshareMode(self.session, 'off');
      };
    });
  }

  setupAudioPublisher() {
    var self = this;
    var audioPublishOptions = {};
    audioPublishOptions.insertMode = 'append';
    audioPublishOptions.publishVideo = false;
    var audio_publisher = OT.initPublisher('audio', audioPublishOptions,
      function(error) {
        if (error) {
          console.log(error);
        } else {
          self.session.publish(audio_publisher, function(error) {
            if (error) {
              console.log(error);
            }
          });
        };
      }
    );
  }

  setupPublisher() {
    var self = this;
    var publishOptions = {};
    publishOptions.videoSource = 'screen';
    publishOptions.insertMode = 'append';
    publishOptions.height = '100%';
    publishOptions.width = '100%';
    var screen_publisher = OT.initPublisher('screenshare', publishOptions,
      function(error) {
        if (error) {
          console.log(error);
        } else {
          self.session.publish(screen_publisher, function(error) {
            if (error) {
              console.log(error);
            };
          });
        };
      }
    );
  }
```

All the above is in order to create the screenshare for the moderator. Everyone else in the app will want to subscribe to that screenshare. We will use the `subscribe()` function to do that. This will be the last function inside the file:

```js
  subscribe() {
    var self = this;
    this.watchLink.style.display = "none";
    this.session.on({
      streamCreated: function(event) {
        console.log(event);
        if (event.stream.hasVideo == true) {
          self.session.subscribe(event.stream, 'screenshare', {
            insertMode: 'append',
            width: '100%',
            height: '100%'
          }, function(error) {
            if (error) {
              console.error('Failed to subscribe to video feed', error);
            }
          });
        } else if (event.stream.hasVideo == false ) {
          self.session.subscribe(event.stream, 'audio', {
            insertMode: 'append',
            width: '0px',
            height: '0px'
          }, function(error) {
            if (error) {
              console.error('Failed to subscribe to audio feed', error);
            }
          });
        };
      }
    });
  }
}
```

We are now ready to make all these classes we have defined work in the application by creating instances of them inside the `opentok_screenshare.js` and `opentok_video.js` files.

### Creating `opentok_video.js`

The `opentok_video.js` file will build a new video chat experience. Most of the work was done in the classes we defined above, so this file is relatively small. First, let's import the `Chat` and `Party` classes:

```js
// opentok_video.js

import Chat from './chat.js'
import Party from './party.js'
```

Then, we will define a global empty variable to hold the Video API session:

```js
var session = ''
```

Then we wrap the rest of the code in three checks to make sure we are on the correct website path, that the DOM is fully loaded and that the participant name is not empty:

```js
if (window.location.pathname == '/party') {
  document.addEventListener('DOMContentLoaded', function() {
    if (name != '') {
```

The rest of the code initiates a new Video API session if one does not exist and instantiates a new `Chat` and new `Party`. At the end, we also listen for the Signal API to send a `screenshare` data message with the value of `on`. When that message is received the `window.location` is moved to `/screenshare`:

```js
      // Initialize an OpenTok Session object
      if (session == '') {
        session = OT.initSession(api_key, session_id);
      }

      new Chat(session);
      new Party(session);

      // Connect to the Session using a 'token'
      session.connect(token, function(error) {
        if (error) {
          console.error('Failed to connect', error);
        }
      });

      // Listen for Signal screenshare message
      session.on('signal:screenshare', function screenshareCallback(event) {
        if (event.data == 'on') {
          window.location = '/screenshare?name=' + name;
        };
      });
    };
  });
}
```

### Creating `opentok_screenshare.js`

The last JavaScript file we will create is mightily similar to the last one. It is responsible for the screenshare view and leverages the `Screenshare` and `Chat` classes we defined earlier:

```js

import Screenshare from './screenshare.js'
import Chat from './chat.js'

// declare empty global session variable
var session = ''

if (window.location.pathname == '/screenshare') {
  document.addEventListener('DOMContentLoaded', function() {
    // Initialize an OpenTok Session object
    if (session == '') {
      session = OT.initSession(api_key, session_id);
    }

    // Hide or show watch party link based on participant
    if (name != '' && window.location.pathname == '/screenshare') {
      new Chat(session);
      new Screenshare(session, name).toggle();

      // Connect to the Session using a 'token'
      session.connect(token, function(error) {
        if (error) {
          console.error('Failed to connect', error);
        }
      });

      // Listen for Signal screenshare message
      session.on('signal:screenshare', function screenshareCallback(event) {
        if (event.data == 'off') {
          window.location = '/party?name=' + name;
        };
      });
    }
  });
};
```

Before we can wrap this up, last but certainly not least, we need to define the frontend style of the application. All this code is useless if it is not accessible by the participants.

<h2 id="styling-the-application">Styling the Application</h2>

The stylesheet for this application would not have happened without the help of my friend and former colleague, [Hui Jing Chen](https://www.nexmo.com/blog/author/huijing) who taught me a lot about front-end design through this process. The app primarily uses [Flexbox Grid](http://flexboxgrid.com/) to order the elements.

Let's start by creating a `custom.css` file inside `app/javascript/stylesheets`. We want to make sure that it is included in our application so add an import line to `application.scss` in the same folder, `@import './custom.css';`. 

First, let's add the core styling in `custom.css`:

```css
:root {
  --main: #343a40;
  --txt-alt: white;
  --txt: black;
  --background: white;
  --bgImage: url('~images/01.png');
  --chat-bg: rgba(255, 255, 255, 0.75);
  --chat-mine: darkgreen;
  --chat-theirs: indigo;
}

html {
  box-sizing: border-box;
  height: 100%;
}
 
*,
*::before,
*::after {
  box-sizing: inherit;
  margin: 0;
  padding: 0;
}
 
body {
  height: 100%;
  display: flex;
  flex-direction: column;
  background-color: var(--background);
  background-image: var(--bgImage);
  overflow: hidden;
}
 
main {
  flex: 1;
  display: flex;
  position: relative;
}

input {
  font-size: inherit;
  padding: 0.5em;
  border-radius: 4px;
  border: 1px solid currentColor;
}

button,
input[type="submit"] {
  font-size: inherit;
  padding: 0.5em;
  border: 0;
  background-color: var(--main);
  color: var(--txt-alt);
  border-radius: 4px;
}

header {
  background-color: var(--main);
  color: var(--txt-alt);
  padding: 0.5em;
  height: 4em;
  display: flex;
  align-items: center;
  justify-content: space-between;
}
```

Then, let's add the styling for the landing page:

```css
.landing {
  margin: auto;
  text-align: center;
  font-size: 125%;
}

.landing form {
  display: flex;
  flex-direction: column;
  margin: auto;
  position: relative;
}

.landing input,
.landing p {
  margin-bottom: 1em;
}

.landing .error {
  color: maroon;
  position: absolute;
  bottom: -2em;
  width: 100%;
  text-align: center;
}
```

We also want to add the styling for the text chat, especially making sure that it stays in place and does not scroll the whole page as it progresses:

```css
.chat {
  width: 100%;
  display: flex;
  flex-direction: column;
  height: 100%;
  position: fixed;
  top: 0;
  left: 0;
  z-index: 2;
  background-color: var(--chat-bg);
  transform: translateX(-100%);
  transition: transform 0.5s ease;
}

.chat.active {
  transform: translateX(0);
}

.chat-header {
  padding: 0.5em;
  box-shadow: 0 1px 5px rgba(0, 0, 0, 0.12), 0 1px 3px rgba(0, 0, 0, 0.24);
  display: flex;
  justify-content: space-between;
}

.btn-chat {
  height: 5em;
  width: 5em;
  border-radius: 50%;
  box-shadow: 0 3px 6px 0 rgba(0, 0, 0, .2), 0 3px 6px 0 rgba(0, 0, 0, .19);
  position: fixed;
  right: 1em;
  bottom: 1em;
  cursor: pointer;
}

.btn-chat svg {
  height: 4em;
  width: 2.5em;
}

.btn-close {
  height: 2em;
  width: 2em;
  background: transparent;
  border: none;
  cursor: pointer;
}

.btn-close svg {
  height: 1em;
  width: 1em;
}

.messages {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow-y: scroll;
  padding: 1em;
  box-shadow: 0 1px 5px rgba(0, 0, 0, 0.12), 0 1px 3px rgba(0, 0, 0, 0.24);
  scrollbar-color: #c1c1c1 transparent;
}

.messages p {
  margin-bottom: 0.5em;
}

.mine {
  color: var(--chat-mine);
}

.theirs {
  color: var(--chat-theirs);
}

.chat form {
  display: flex;
  padding: 1em;
  box-shadow: 0 1px 5px rgba(0, 0, 0, 0.12), 0 1px 3px rgba(0, 0, 0, 0.24);
}

.chat input[type="text"] {
  flex: 1;
  border-top-left-radius: 0px;
  border-bottom-left-radius: 0px;
  background-color: var(--background);
  color: var(--txt);
  min-width: 0;
}

.chat input[type="submit"] {
  border-top-right-radius: 0px;
  border-bottom-right-radius: 0px;
}
```

Now let's create the styling for the video chat and screenshare elements:

```css
.videos {
  flex: 1;
  display: flex;
  position: relative;
}

.subscriber.grid4 {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(25em, 1fr));
}

.subscriber.grid9 {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(18em, 1fr));
}
 
.subscriber,
.screenshare {
  width: 100%;
  height: 100%;
  display: flex;
}
 
.publisher {
  position: absolute;
  width: 25vmin;
  height: 25vmin;
  min-width: 8em;
  min-height: 8em;
  align-self: flex-end;
  z-index: 1;
}

.audio {
  position: absolute;
  opacity: 0;
  z-index: -1;
}

.audio {
  display: none;
}

.dark {
  --background: black;
  --chat-mine: lime;
  --chat-theirs: violet;
  --txt: white;
}
```

Lastly, we will add a media query that will keep the text chat in proportion on smaller screens:

```css
@media screen and (min-aspect-ratio: 1 / 1) {
  .chat {
    width: 20%;
    min-width: 16em;
  }
}
```

That's it! The application, both the backend and the frontend, has been created. We are now ready to put it all together.

<h2 id="putting-it-all-together">Putting It All Together</h2>

Even though the application is a combination of multiple programming languages, namely Ruby and JavaScript, with an intertwined backend and frontend, it is relatively straightforward to run it. This is because Rails allows us to seamlessly integrate it all together with one command.

From the command line, you can execute `bundle exec rails s` and watch your Rails server start. You will also see the following almost magical line in your console output the first time you run the app:

```bash
[Webpacker] Compiling...
```

In fact, you will see that every time you make a change to any of your JavaScript or CSS packs. That output tells you that Rails is using Webpack to compile and incorporate all of your packs into the application. Once the `[Webpacker] Compiling...` is done you will see a list of all your compiled packs:

```bash
Version: webpack 4.42.1
Time: 1736ms
Built at: 05/01/2020 12:01:37 PM
                                             Asset      Size               Chunks                         Chunk Names
            js/app_helpers-31c49752d24631573287.js   100 KiB          app_helpers  [emitted] [immutable]  app_helpers
        js/app_helpers-31c49752d24631573287.js.map  44.3 KiB          app_helpers  [emitted] [dev]        app_helpers
            js/application-d253fe0e7db5e2b1ca60.js   564 KiB          application  [emitted] [immutable]  application
        js/application-d253fe0e7db5e2b1ca60.js.map   575 KiB          application  [emitted] [dev]        application
                   js/chat-451fca901a39ddfdf982.js   103 KiB                 chat  [emitted] [immutable]  chat
               js/chat-451fca901a39ddfdf982.js.map  46.1 KiB                 chat  [emitted] [dev]        chat
    js/opentok_screenshare-2bc51be74c7abf27abe2.js   110 KiB  opentok_screenshare  [emitted] [immutable]  opentok_screenshare
js/opentok_screenshare-2bc51be74c7abf27abe2.js.map    51 KiB  opentok_screenshare  [emitted] [dev]        opentok_screenshare
          js/opentok_video-15ed35dc7b01325831c0.js   109 KiB        opentok_video  [emitted] [immutable]  opentok_video
      js/opentok_video-15ed35dc7b01325831c0.js.map  50.6 KiB        opentok_video  [emitted] [dev]        opentok_video
                  js/party-f5d6c0ccd3bb1fcc225e.js   105 KiB                party  [emitted] [immutable]  party
              js/party-f5d6c0ccd3bb1fcc225e.js.map  47.5 KiB                party  [emitted] [dev]        party
            js/screenshare-4c13687e1032e93dc59a.js   105 KiB          screenshare  [emitted] [immutable]  screenshare
        js/screenshare-4c13687e1032e93dc59a.js.map  47.9 KiB          screenshare  [emitted] [dev]        screenshare
                                     manifest.json  2.38 KiB                       [emitted]              
```

The file names reflect that they have been compiled down, but you can still see your pack names in there if you look closely, like `opentok_screenshare`, `party`, `app_helpers`, etc. 

Running your application locally is great for testing with yourself, but you probably would like to invite friends to participate with you! 

You can create an externally accessible link to your application running locally using a tool like ngrok. It gives an external URL for your local environment. The Nexmo Developer Platform has a guide on [getting up and running with ngrok](https://developer.nexmo.com/tools/ngrok) that you can follow.

If you would like to just get up and running, you can also deploy with one click this application from [GitHub](https://github.com/nexmo-community/rails-video-watch-party-app) directly to Heroku. Click on the <img style="display:inline" src="https://www.herokucdn.com/deploy/button.svg" alt="Deploy to Heroku"> button and within moments you will have a watch party app ready to be used and enjoyed.

I would love to hear what you built using the Vonage Video API! Please join the conversation on our [Community Slack](https://developer.nexmo.com/community/slack) and share your story!