---
title: Record a Call in Ruby with Vonage Voice API WebSockets
description: Learn how to build a small webserver to work with WebSockets in
  Ruby. The server will handle incoming voice calls, WebSocket connections, and
  render HTML
thumbnail: /content/blog/record-a-call-in-ruby-with-vonage-voice-api-websockets/Blog_Ruby_Record-Voice-Call_1200x600.png
author: ben-greenberg
published: true
published_at: 2020-08-04T13:25:34.000Z
updated_at: 2020-11-05T13:48:36.256Z
category: tutorial
tags:
  - websockets
  - voice-api
  - ruby
comments: true
redirect: ""
canonical: ""
---
The [Vonage Voice API WebSockets](https://developer.nexmo.com/voice/voice-api/guides/websockets) feature recently left Beta status and became generally available. WebSockets allows you to create two-way communication over a single persistent TCP connection. You do not need to handle multiple HTTP requests and responses with WebSockets. A single WebSocket connection can enable text and binary data communication continuously, with only a single connection opened.

While WebSockets can simplify the HTTP response and request cycle, it is a different paradigm to build an application with. Thankfully, most commonly used programming languages have WebSocket tooling that can help take some complexity out of the process.

In this tutorial, we are going to build a small webserver to work with WebSockets in Ruby. The server will handle incoming voice calls, WebSocket connections, and render HTML. We will be using [Rack](https://github.com/rack/rack) as our web interface and [Thin](https://github.com/macournoyer/thin) as our web server. This tutorial does not require any existing knowledge about working with WebSockets, but it does assume some light experience working with web servers in Ruby.

*tl;dr If you would like to skip ahead and just run the app, you can find a fully working version on [GitHub](https://github.com/nexmo-community/nexmo-ruby-websockets).*

## Prerequisites

This tutorial requires Ruby v2.7 or higher to be installed on your machine. Also, several gems are used in the application. Each one of them is listed in the `Gemfile` we will create later on and will be installed via executing `bundle install` from the command line:

* [WaveFile](https://github.com/jstrait/wavefile)
* [Faye-WebSocket](https://github.com/faye/faye-websocket-ruby)
* [JSON](https://github.com/flori/json)
* [Rack](https://github.com/rack/rack)
* [Thin](https://github.com/macournoyer/thin)

We can now move on to begin our application implementation.

## Vonage API Account

<sign-up></sign-up>

This tutorial also uses a virtual phone number. To purchase one, go to *Numbers > [Buy Numbers](https://dashboard.nexmo.com/buy-numbers)* and search for one that meets your needs. 

Our last step in setting up our API account is to create a Voice API Application. We will link the virtual phone number we provisioned to this application and set the webhook URLs.

From the Vonage API Dashboard navigate to *Your applications* and click on *Create a new application*. This will present you with the following page:

![Dashboard Create Application](https://www.nexmo.com/wp-content/uploads/2020/08/create_application.png "Dashboard Create Application")

The key areas to focus on to create your application are highlighted in purple:

* Name: You can give your application any name you choose.
* Public and Private Key: This will generate a public and private key pair for authentication. A private key file will download to your machine. Our application is only handling inbound voice calls, so we do not need to do anything with it.
* Capabilities: Each application can handle multiple features. For our purposes, we only need to turn on *Voice*.

Once you have finished the options, you can press the *Generate new application* button to finish.

Now that your application is created let's link it to your newly provisioned phone number and set the webhook URLs.

Like before, navigate to *Your applications* in the Dashboard, click on the ellipses next to your application's name, and click on the *Edit* link.

Within the *Capabiltiies* section of the page you will see the following options:

![Application Webhook URL settings](https://www.nexmo.com/wp-content/uploads/2020/08/voice_app_url_settings.png "Application Webhook URL settings")

We need to fill out the *Event URL* and the *Answer URL*. The former is where Vonage will send all the event lifecycle data of the voice call to. The latter is where Vonage will send each new voice call to when it is initiated. The URLs provided here must be externally accessible so that Vonage can reach them. In other words, using `localhost` does not work. A popular development option is ngrok, and you can follow [our tutorial](https://developer.nexmo.com/tools/ngrok) on working with it.

Ensure that both our Event URL and Answer URL end with `/webhooks/event` and `/webhooks/answer`, respectively.

We also need to connect our Vonage phone number to this application. To do so, navigate to *Numbers>Your Numbers* and click on the pencil icon next to your number. You can then select your new application from the options to link the phone number to it. Once you press *Save*, this will mean that all inbound calls to this number will be forwarded to your application.

## Creating the Folder Structure

Now that our Vonage API account and settings are ready let's move on to create the folder structure for our application. It will look like the following at the end:

```
.
+-- recordings/
+-- views/
|   +-- index.html.erb
+-- app.rb
+-- Gemfile
```

Our application's root folder will contain `app.rb`, which will be our web server that will handle all incoming voice calls and WebSocket connection. It will also include the `Gemfile`, which is where we will define our dependencies. There will be two more folders: `recordings/` and `views/`. The `recordings/` folder will be where the call phone recording from the Voice API WebSockets connection will be saved. The `views/` folder is where we will keep the one view for the application.

## Defining the Dependencies

Inside the `Gemfile` add the following gems that we will be using in the application:

```ruby
source 'https://rubygems.org'

gem 'wavefile'
gem 'faye-websocket'
gem 'json'
gem 'rack'
gem 'thin'
```

Each gem will serve a specific function:

* Wavefile: We will use this gem to convert the raw audio data into a WAV file
* Faye: We will use this gem to handle the WebSockets connection
* JSON: This gem will be used to convert our call instruction we send back to the Vonage Voice API into JSON
* Rack: We will use Rack as our web framework
* Thin: This gem provides us with our web server on top of Rack

You can now run `bundle install` from the command line to make all these gems available to your application.

## Building the Server

### Dependencies and Variable Definition

We are now ready to build our web server. The first item we will do in building the server is adding several `require` and `include` statements at the top to add the functionality of the gems mentioned above into our application:

```ruby
require 'rack'
require 'erb'
require 'faye/websocket'
require 'json'
require "wavefile"
include Rack
include WaveFile
```

At this point, we will also define a constant variable that will equal the externally accessible URL for our WebSockets connection requests. We will be using this URL in the instructions we send back to the Vonage Voice API when we receive a new call:

```ruby
EXTERNAL_WS_URL = 'ws://example.com/cable'
```

Replace the `example.com` in the above snippet with your externally accessible URL.

### Helper Methods

Our application will take advantage of two helper methods. We can create them now and add them after the constant variable declaration. 

The first method, `#create_wav_file`, will help in going through the process of turning the binary audio data received through the WebSocket into a WAV file. It will utilize functionality from the Wavefile gem to create the WAV file, and it will also return the name of the file to be used later in the application:

```ruby
def create_wav_file(data, file_name)
  buffer = Buffer.new(data, Format.new(:mono, :pcm_16, 16000)) 
  puts "Audio Buffer Created..."
  writer = Writer.new(file_name, Format.new(:mono, :pcm_16, 16000))
  puts "New Audio File Created..."
  puts "Writing to the Buffer..."
  writer.write(buffer)
  puts "Closing Buffer Writing..."
  writer.close
  puts "WAV File Created..."
  file_name
end
```

The above method specifies that the incoming audio is from a `mono` source instead of a `stereo` source. The difference is that there is a single audio track, defined by a flat array of binary data, and not an array of arrays of data. The audio is defined as `pcm_16`, which means that the source is Linear PCM 16-bit. Lastly, the source is defined as `16000`, which means that it is a 16KHz sample rate. The new WAV file is created with the same audio settings as the audio binary source data.

The second method, `#erb`, is a short method that we will use to render ERB template files to the user:

```ruby
def erb(template)
  path = File.expand_path("#{template}")
  ERB.new(File.read(path)).result(binding)
end
```

The remaining of our code will be a series of `map` statements connecting URL routes to specific actions wrapped inside `Rack::Handler` middleware.

### Defining the Routes

The routes for our application need to be defined inside Rack middleware that links Rack with Thin. We will also use the `Rack::Static` middleware to serve the static audio file in the view. We will initialize the Faye WebSocket handler here as well:

```ruby
Rack::Handler::Thin.run(Rack::Builder.new {
  Faye::WebSocket.load_adapter('thin')
  use(Rack::Static, urls: ["/recording"], root: 'recording')
```

There are four routes we need to build `map` statements for: `/cable`, `/`, `/webhooks/answer`, and `/webhooks/answer`. Let's do that now.

The first route will handle the WebSockets connection:

```ruby
map('/cable') do
  run(->env{
    if Faye::WebSocket.websocket?(env)
      puts "WebSockets connection opened..."
      @call_data = []
      ws = Faye::WebSocket.new(env)
  
      ws.on :message do |event|
        if event.data.is_a?(Array)
          @call_data.append(event.data.pack('c*').unpack('s*'))
        else
          puts event.data
        end
      end
  
      ws.on :close do |event|
        puts 'WebSocket connection closed...'
        create_wav_file(@call_data.flatten, 'recording/recording.wav')
      end
  
      ws.rack_response
    end
  })
end
```

In the above route, we check if the connection request is a WebSocket request. If it is, then we instantiate a new instance of `Faye::WebSocket`. There are two types of possible data sent to a WebSocket, either text or binary data. The latter is always sent in the form of byte-sized integers in an array. 

As such, we can check if the `event.data` is either an array object or not. If it is an array, we know that it is the binary audio data we will use to make our WAV file. If it is not, then it is status updates from the Vonage Voice API. In that case, we can log them to the console.

**An important note to consider: The Faye WebSockets gem converts the binary data into byte-sized integers, as we noted above. This, though, means it converts it into exactly 1 byte or 8 bit-sized integers. The Vonage Voice API sends the audio binary data in 16-bit integers, a common standard for human speech. This means that our application needs to convert the 8 bits of binary data into 16 bits. We use the Ruby standard library methods of `#pack` and `#unpack` as we append it to our `@call_data` instance variable. This a necessary step to produce understandable audio.**

The next route will serve the `index` view. It will check if there is a file, and if so, pass it to the view with instance variables:

```ruby
map('/') do
  if File.exist?('recording.wav')
    @call_status = 'Audio Loaded!'
    @file = 'recording.wav'
  end
  run(->env{
    [200, { 'Content-Type' => 'text/html'}, [erb("views/index.html.erb")]]})
end
```

The `/webhooks/answer` route will return to the Vonage Voice API specialized instructions called an [NCCO (Nexmo Call Control Object)](https://developer.nexmo.com/voice/voice-api/ncco-reference) informing the API what to do with the call it just received. The instruction we send back as JSON will tell the Voice API that we want to open a WebSocket connection and provide it with the WebSocket URL to begin the connection. We also tell the Voice API that we want it to speak to the caller a short message letting them know that they will be streaming their call momentarily:

```ruby
map('/webhooks/answer') do
  run(->env{
    ncco = [
      {
        "action": "talk",
        "text": "You will be streaming momentarily."
      },
      {
        "action": "connect",
        "endpoint": [
          {
            "type": "websocket",
            "uri": "#{EXTERNAL_WS_URL}",
            "content-type": "audio/l16;rate=16000",
          }
        ]
      }
    ].to_json

    [200, { 'Content-Type' => 'application/json' }, [ncco]]
  })
end
```

The final route we will create will handle the call's event lifecycle data the Voice API sends to our application. We do not want to do anything with it, except to acknowledge back to the API that we received it with a `200` status code:

```ruby
  map('/webhooks/event') do
  run(->env{
    [200, { 'Content-Type' => 'text/html'}, ['']]
  })
end
```

Lastly, we close the `Rack::Builder` block we opened at the very beginning specifying a port to run our application on:

```ruby
}, Port: 9292)
```

The final item we need to create before we can run our application is our view.

### Creating the View

The application only has a single view. This view can be accessed by going to the root URL of the application, i.e. `localhost:9292` or `127.0.0.1:9292`. The view will present the audio to play with an `<audio>` HTML element:

```html
<html>
  <head>
    <title>Ruby Vonage WebSockets Demo</title>
  </head>
  <body>
    <h1>Vonage WebSockets + Ruby == ♥</h1>
    <p>Welcome to the Vonage WebSockets demo in Ruby</p>  
    <h2>Your Audio To Playback</h2>
    <p>Once you have finished your call, your audio will be available to playback from here.</p>
    <div id="audio-status">
      <%= @call_status %>
      <br />
      <% if @file %>
        <audio
          controls
          src="recording/<%= @file %>">
            Your browser does not support the
            <code>audio</code> element.
        </audio>
      <% end %>
    </div>
  </body>
</html>
```

The view uses the instance variables we created in the route to determine whether or not to show the `<audio>` element.

We are now ready to run the application!

## Running the Application

The application is now ready to be run. To run it, execute the following from the command line in the root folder of the app: 

```bash
$ bundle exec rackup app.rb
```

Remember also to make sure your web server is externally accessible using ngrok or another similar tool.

At this point, give your application a call by calling your Vonage virtual phone number. When you are finished speaking, you can hang up the call. If you visit your app with your web browser, you will now see an audio player and play your recorded audio. Congrats!

## Further Reading

This tutorial demonstrated basic functionality for getting up and running with the Vonage Voice API WebSockets feature in Ruby. There is a lot more you can do with this feature. To learn more about Vonage Voice API WebSockets check out the following:

* [Voice API WebSockets Guide](https://developer.nexmo.com/voice/voice-api/guides/websockets)
* [Sentiment Analysis with WebSockets](https://github.com/nexmo-community/sentiment-analysis-websockets)
* [Vonage Voice API Reference](https://developer.nexmo.com/api/voice)
* [Vonage Voice API Webhooks Reference](https://developer.nexmo.com/voice/voice-api/webhook-reference)