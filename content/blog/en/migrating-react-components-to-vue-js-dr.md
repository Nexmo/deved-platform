---
title: Migrating React Components to Vue.js
description: We recently migrated a few components on the Vonage API Developer
  Portal from React to Vue.js. Learn more about why and how in this post.
thumbnail: /content/blog/migrating-react-components-to-vue-js-dr/E_Migrating-to-Vue-js_1200x600.png
author: fabianrodiguez
published: true
published_at: 2020-02-20T18:50:31.000Z
updated_at: 2020-11-05T02:39:52.050Z
category: tutorial
tags:
  - react
  - vue
comments: true
redirect: ""
canonical: ""
---
In this blog post, I'm going to share the journey we went through when we migrated our [Developer Platform](https://developer.nexmo.com/) from [React](https://reactjs.org/) to [Vue.js](https://vuejs.org/). I'll go through the reasons behind the change, how we did it, and a few lessons we learned along the way.

## The Application

The Vonage API Developer Platform is a Ruby on Rails application with a few React components we used in isolation to handle very specific use cases that involve a lot of user interaction. We migrated a total of four components, which were responsible for a feedback widget, the search bar, an SMS character counter, and a JWT (JSON Web Token) generator. The app is open source and you can find it on [Github](https://github.com/Nexmo/nexmo-developer/).

The reason behind the migration was that different teams within the company were using different Javascript frameworks, which was not only preventing us from reusing components across different applications, but also imposed a higher barrier of entry for engineers switching between projects. With this in mind, we chose Vue.js as our go-to Javascript framework mostly because of its simplicity. It's quite easy for someone with Javascript experience to build something within minutes after reading the Vue.js guides.

React and Vue.js share some similarities: they both utilize a virtual DOM, provide reactive and composable view components, and focus on a small core library, leaving the routing and global state management to extra libraries. But what we really liked about Vue.js is how it builds on top of classic web technologies. In React, components express their UI using JSX and render functions. Vue.js, on the other hand, treats any valid HTML as a valid Vue template, separating the logic from the presentation (although they do support render functions and JSX as well 😉).

There are a few other Vue.js features that made it attractive to us: the convenient and simple way it handles state management using `data` and `props` compared to React's `setState`, how Vue.js tracks changes and updates a component state accordingly using *reactive data*, and finally computed properties, which allow you to extract logic from the templates by defining properties that depend on other properties. 

The approach that we took was an iterative one. We added Vue.js to the project, then we migrated one component at a time. Fortunately, Rails comes with webpack and with basic out-of-the-box integrations for React, Vue.js, and Elm. You can read more about it in the [docs](https://github.com/rails/webpacker#vue), but all we had to was to run:

```
bundle exec rails webpacker:install:vue
```

That took care of installing Vue.js and all its dependencies while updating the corresponding configuration files for us 🎉.

## Tests

The first thing we realized was that we didn't have any tests 😢. I cannot express how important having an automated test suite for this type of migration is (or in general for that matter). Manual QA takes a lot of time, and also, who doesn't like automation?

So the first thing we did was to add [Jest](https://jestjs.io/) to the project, along with tests for the different components. We focused on testing behavior, how the UI changed in response to user interactions in a framework-agnostic way, so we could use them while we rewrote the components. Below, you can see a small example of one of the tests:

```javascript
describe('Concatenation', function() {
  describe('Initial rendering', function() {
    it('Renders the default message', async function() {
      const wrapper = shallowMount(Concatenation);

      expect(wrapper.find('h2').text()).toEqual('Try it out');
      expect(wrapper.html()).toContain('<h4>Message</h4>');
      expect(wrapper.find('textarea').element.value).toEqual(
        "It was the best of times, it was the worst of times, it was the age of wisdom..."
      );

    it('notifies the user if unicode is required and updates the UI accordingly', function() {
      const wrapper = shallowMount(Concatenation);

      wrapper.find('textarea').setValue('😀');
      expect(wrapper.find('i.color--success').exists()).toBeTruthy();
      expect(wrapper.find('#sms-composition').text()).toEqual('2 characters sent in 1 message part');
      expect(wrapper.find('code').text()).toContain('😀');

      wrapper.find('textarea').setValue('not unicode');
      expect(wrapper.find('i.color--error').exists()).toBeTruthy();
      expect(wrapper.find('#sms-composition').text()).toEqual('11 characters sent in 1 message part');
      expect(wrapper.find('code').text()).toContain('not unicode');
    });
```

As you can see, there isn't anything framework specific. We mount the `Concatenation` component, then check that it renders some default values and updates the UI after an interaction.

While we were rewriting the components, we spent time not only understanding their implementation, but also how they were supposed to work. In this process, we found several bugs that we fixed and wrote tests for. The test suite also acts as documentation 🎉🎉🎉, given that it describes how the components work and how they handle different interactions.

## Migration

To illustrate our migration process, we'll focus on the SMS character counter component. The main functionality of this component is to tell if the user input text will span into several SMS messages based on its content, encoding, and length. You can refer to our [docs](https://developer.nexmo.com/messaging/sms/guides/concatenation-and-encoding) if you want to know more about how these things affect what gets sent. The component looks like this:

![SMS character counter component](/content/blog/migrating-react-components-to-vue-js/component-image.png "SMS character counter component")

It has a `textarea` with a placeholder where the user can type/paste the content,. Then the component will tell you how many parts the message will be split into, its length, and the type of encoding used (whether it is `unicode` or `text`).

We have a small library, `CharacterCounter`, that handles all the SMS processing and returns all the necessary information, such as the number of messages needed, their content, etc. So the Vue.js component only handles the user interaction, processes the information, and renders the content accordingly.

We followed the Vue.js [Style Guides](https://vuejs.org/v2/style-guide/) and decided to use single-file components. This makes it easier to find and edit components rather than having multiple components defined in one file. The code for the component is as follows:

```html
<template>
  <div class="Vlt-box">
    <h2>Try it out</h2>

    <h4>Message</h4>
    <div class="Vlt-textarea">
      <textarea v-model="body" />
    </div>

    <div class="Vlt-margin--top2" />

    <h4>Data</h4>
    <div class="Vlt-box Vlt-box--white Vlt-box--lesspadding">
      <div class="Vlt-grid">
        <div class="Vlt-col Vlt-col--1of3">
          <b>Unicode is Required?</b>
          <i v-if="unicodeRequired" class="icon icon--large icon-check-circle color--success"></i>
          <i v-else class="icon icon--large icon-times-circle color--error"></i>
        </div>
        <div class="Vlt-col Vlt-col--2of3">
        </div>
        <hr class="hr--shorter"/>
        <div class="Vlt-col Vlt-col--1of3">
          <b>Length</b>
        </div>
        <div class="Vlt-col Vlt-col--2of3" v-html="smsComposition" id="sms-composition"></div>
      </div>
    </div>

    <h4>Parts</h4>
    <div class="Vlt-box Vlt-box--white Vlt-box--lesspadding" id="parts">
      <div v-for= "(message, index) in messages" class="Vlt-grid">
        <div class="Vlt-col Vlt-col--1of3"><b>Part {{index + 1}}</b></div>
        <div class="Vlt-col Vlt-col--2of3">
          <code>
            <span v-if="messages.length > 1">
              <span class="Vlt-badge Vlt-badge--blue">User Defined Header</span>
              <span>&nbsp;</span>
            </span>
            {{message}}
          </code>
        </div>
        <hr v-if="index + 1 !== messages.length" class="hr--shorter"/>
      </div>
    </div>
  </div>
</template>

<script>
import CharacterCounter from './character_counter';

export default {
  data: function () {
    return {
      body: 'It was the best of times, it was the worst of times, it was the age of wisdom...
    };
  },
  computed: {
    smsInfo: function() {
      return new CharacterCounter(this.body).getInfo();
    },
    messages: function() {
      return this.smsInfo.messages;
    },
    unicodeRequired: function() {
      return this.smsInfo.unicodeRequired;
    },
    smsComposition: function() {
      let count = this.smsInfo.charactersCount;
      let characters = this.pluralize('character', count);
      let messagesLength = this.messages.length;
      let parts = this.pluralize('part', messagesLength);

      return `${count} ${characters} sent in ${messagesLength} message ${parts}`;
    }
  },
  methods: {
    pluralize: function(singular, count) {
      if (count === 1) { return singular; }
      return `${singular}s`;
    }
  }
}
</script>

<style scoped>
  textarea {
    width: 100%;
    height: 150px;
    resize: vertical;
  }
  code {
    whiteSpace: normal;
    wordBreak: break-all;
 }
</style>
```

First, we defined the template. You may have noticed that we used some Vue.js directives for [conditional rendering](https://vuejs.org/v2/guide/conditional.html), like `v-if` and `v-else`. This is one of the best features of Vue.js that React doesn't provide. React handles [conditional rendering](https://reactjs.org/docs/conditional-rendering.html) differently, by either using the ternary operator inline, inline if with the logical `&&` operator, or by invoking a function that returns different content based on the arguments. Below is a comparison of how we render that the encoding is `unicode` in Vue.js vs. React:

```javascript
  // Vue.js
  <div class="Vlt-col Vlt-col--1of3">
    <b>Unicode is Required?</b>
    <i v-if="unicodeRequired" class="icon icon--large icon-check-circle color--success"></i>
    <i v-else class="icon icon--large icon-times-circle color--error"></i>
  </div>
```

```javascript
  // React
  renderUtfIcon(required) {
    if (required) {
      return (<i className="icon icon--large icon-check-circle color--success"/>)
    } else {
      return (<i className="icon icon--large icon-times-circle color--error"/>)
    }
  }
  <div className="Vlt-col Vlt-col--1of3">
    <b>Unicode is Required?</b>
    { this.renderUtfIcon(smsInfo.unicodeRequired) }
  </div>
```

In both cases, the value of a property was used. In the case of Vue.js, the directives make it quite simple to render everything inline. With React, on the other hand, we had to create a helper method that returns the different content based on the property passed to it, which led to not only more code, but also having the markup split across the `render` function and helper methods. 

The migration was fairly simple, given that the component kept all the information in its state without the need to share it with others. All that was needed was to implement a few methods, computed properties, and conditionals in the HTML.

The `textarea` is bound to a data property called `body`. The following [computed properties](https://vuejs.org/v2/guide/computed.html) were defined:

* `smsInfo`
* `messages`
* `unicodeRequired`
* `smsComposition`

*Computed properties* are essentially properties, with the difference that they are only reevaluated when one of their *reactive dependencies* change. These dependencies are the properties used within their body definition. Let's see an example:

```javascript
  data: function () {
    return {
      body: 'It was the best of times, it was the worst of times, it was the age of wisdom...'
    };
  },
  computed: {
    smsInfo: function() {
      return new CharacterCounter(this.body).getInfo();
    },
  }
```

Here, `smsInfo` is cached until the value of `body` changes. If you need to reevaluate it every time it is invoked, then you probably want to use a `method` instead. 

Once we had the Vue.js component, we made sure that our tests were passing, and finally, we replaced the components in our application. And that was it! All the code is open source and you can find it [on GitHub](https://github.com/Nexmo/nexmo-developer). We ❤️ contributions! If you want to take a look at the full migration, you can check the corresponding [Pull Request](https://github.com/Nexmo/nexmo-developer/pull/2011/files).

We are planning to make all of our components available as packages in the near future, so we can share them with you all!