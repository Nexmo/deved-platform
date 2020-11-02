---
title: Use Web Components in Vue 2 and 3 + Composition API
description: Learn how to incorporate a Web Component into a Vue application.
  Examples will include Vue versions 2 and 3, plus the Composition API.
thumbnail: /content/blog/use-web-components-in-vue-2-and-3-composition-api-dr/Blog_WebComponents_Vue_1200x600-1.png
author: dwanehemmings
published: true
published_at: 2020-10-30T14:30:54.000Z
category: inspiration
redirect: ""
canonical: ""
comments: true
old_categories:
  - developer
  - tutorial
updated_at: 2020-11-02T12:04:24.528Z
tags:
  - vue
  - javascript
  - web-components
---
This post will go over how to incorporate a Web Component into a Vue application. Examples will include Vue versions 2 and 3, plus the Composition API. Version 3 was just released at the time of this writing. It's so new that a little “New content is available.” notification frequently pops up in the [documentation](https://v3.vuejs.org/guide/). Then the demo application is extended to use the [Vonage Verify API](https://www.vonage.com/communications-apis/verify/).

![Test results from custom-elements-everywhere.com showing Vue 2.6.12 scored 100%, passed 16/16 Basic tests, and 14/14 advanced tests with an explanation.](/content/blog/use-web-components-in-vue-2-and-3-composition-api/vue2-custom-elements-everywhere.jpg "Test results from custom-elements-everywhere.com showing Vue 2.6.12 scored 100%, passed 16/16 Basic tests, and 14/14 advanced tests with an explanation.")

<small><a href="https://custom-elements-everywhere.com">Test results from custom-elements-everywhere.com</a></small>

> Note: This is for Vue 2. Vue 3 has not been tested at the time of this post.

Vue passes all the tests from `custom-elements-everywhere.com`, scores 100% on compatibility, and makes your laptop happy. As developers, isn’t making computers happy the main goal?

This shouldn’t be too surprising since in the [Vue documentation](https://vuejs.org/v2/guide/index.html#Relation-to-Custom-Elements) it states:

> "You may have noticed that Vue components are very similar to Custom Elements, which are part of the Web Components Spec. That's because Vue's component syntax is loosely modeled after the spec."

Things to look for when using a Web Component in a JavaScript framework like Vue. How does the framework:

* know that you are using a Web Component in the first place?
* handle passing data to the Web Component?
* handle custom events coming from the Web Component?
* get a reference to a Web Component so that a developer can gain access to things like the Web Component's methods?

There are multiple ways of configuring and installing a Vue application. (See guides for [v2](https://vuejs.org/v2/guide/installation.html) and for [v3](https://v3.vuejs.org/guide/installation.html).) The example code shown in this post is pretty standard.

Luckily, Vue handles data and events through the template syntax, which stays the same across the different versions.

## Passing Data to a Web Component

In the previous [post](https://www.nexmo.com/blog/2020/10/07/using-web-components-in-a-react-application-dr), one issue with using a Web Component in a React application was the way React passed data. Regardless of the type of data (e.g., strings, arrays, objects, booleans, etc.), React would stringify the values. To tell Vue that the data being passed is not a string, `v-bind` or `:` for short is used as noted in the [documentation](https://vuejs.org/v2/guide/components-props.html#Passing-a-Number).

For example, to access and set the placeholder in the keypad component, this bit of code is added to the component's tag:

```js
:placeholder="placeholder"
```

Then in the data section of the Vue app, setting the initial value of the placeholder is done by

```js
placeholder: "Enter Security Code"
```

To change the value, the code is 

```js
this.placeholder = "SUCCESS!!!";
```

This is standard operation for a Vue application.

I’ve recently added the ability to customize the keys in the keypad components, so I would be able to add the following to my tag and rearrange the keypad: 

```js
:keys = “[‘0’,’9’,’8’,’7’,’6’,’5’,’4’,’3’,’2’,’1’,’#’,’*’]”
```

An example of this will be done in an upcoming blog post using another framework.

## Listening to Events From the Web Component

Vue can listen for DOM events (i.e., click, scroll, submit etc.) with `v-on` or the shorthand `@`. Since Web Components are treated as regular HTML elements, their custom events will work as well. To listen for the keypad component's `digits-sent` event, the code added to the element would look like this: 

```js
@digit-sent=”digitsSent”
```

`digitsSent` is the function that will handle what comes out of the event.

Now, letting Vue know that there is a Web Component and the ways to interact with it are slightly different depending on the version of Vue and if the Composition API is used or not. Either way, Vue will let you know if you are doing it wrong by displaying a warning in the console.

![Vue console warning that it failed to resolve a component.](/content/blog/use-web-components-in-vue-2-and-3-composition-api/vue-warn.jpg "Vue console warning that it failed to resolve a component.")

## Vue 2

<p class="codepen" data-height="800" data-theme-id="default" data-default-tab="js,result" data-user="conshus" data-slug-hash="KKzjWdo" style="height: 800px; box-sizing: border-box; display: flex; align-items: center; justify-content: center; border: 2px solid; margin: 1em 0; padding: 1em;" data-pen-title="Web Components x Vue 2">
  <span>See the Pen <a href="https://codepen.io/conshus/pen/KKzjWdo">
  Web Components x Vue 2</a> by conshus de OUR show (<a href="https://codepen.io/conshus">@conshus</a>)
  on <a href="https://codepen.io">CodePen</a>.</span>
</p>
<script async src="https://static.codepen.io/assets/embed/ei.js"></script>

To let a Vue 2 application know that a Web Component is present, we use [`ignoredElements`](https://vuejs.org/v2/api/#ignoredElements). It's an array that contains strings and/or regular expressions that expose the tag names of the Web Components. This `ignoredElements` is passed into the Vue configuration so that it knows to "ignore" those "elements".
In the sample code, it looks like this:

```js
Vue.config.ignoredElements = [/dwanes-\w*/];
```

At times we might need to call a Web Component's method. For example, to clear the keypad component's display, the `cancelAction` method is called. Before the method can be used, a reference to the keypad element needs to be created. Vue has a similar way to [React](https://www.nexmo.com/blog/2020/10/07/using-web-components-in-a-react-application-dr) of achieving this: by adding a `ref` [tag](https://vuejs.org/v2/guide/components-edge-cases.html#Accessing-Child-Component-Instances-amp-Child-Elements) to the Web Component. 

In the keypad component, that looks like: 

```html
<dwanes-keypad ref="keypad" ...>
```

Then the `cancelAction` is called with: 

```js
this.$refs.keypad.cancelAction();
```

## Vue 3

<p class="codepen" data-height="800" data-theme-id="default" data-default-tab="js,result" data-user="conshus" data-slug-hash="gOrNgXb" style="height: 800px; box-sizing: border-box; display: flex; align-items: center; justify-content: center; border: 2px solid; margin: 1em 0; padding: 1em;" data-pen-title="Web Components x Vue 3">
  <span>See the Pen <a href="https://codepen.io/conshus/pen/gOrNgXb">
  Web Components x Vue 3</a> by conshus de OUR show (<a href="https://codepen.io/conshus">@conshus</a>)
  on <a href="https://codepen.io">CodePen</a>.</span>
</p>
<script async src="https://static.codepen.io/assets/embed/ei.js"></script>

Vue 3 has just come out! It's still shiny and new (and changing)!

As stated earlier, the Vue component syntax is loosely based on the Web Components Spec. So, using a Web Component in Vue 3 would be the same as Vue 2, right? Nope! There is a breaking change in letting the application know that a Web Component is being used.

More details on the change can be found in the Migration Guide under:
 [`config.ignoredElements` Is Now `config.isCustomElement`](https://v3.vuejs.org/guide/migration/global-api.html#config-ignoredelements-is-now-config-iscustomelement)\
[Custom Elements Interop](https://v3.vuejs.org/guide/migration/custom-elements-interop.html#autonomous-custom-elements).

In summary, the `ignoredElements` in Vue 2 becomes `isCustomElement` in Vue 3. Instead of an array, `isCustomElement` expects a function that describes what to look for. Also, now in Vue 3, the check to see if the element is an outside custom element (i.e., Web Component) is done during the template compilation.

If that template compilation is done "on-the-fly", `isCustomElement` is passed in the application's configuration. In the demo code, that looks like:

```js
const app = Vue.createApp(App);
app.config.isCustomElement = tag => tag.startsWith('dwanes-')
app.mount('#app');
```

If the project has `.vue` files, then a build step is used to compile the application into code the browser can understand. In this case, the `isCustomElement` is passed into the options of the library doing the compiling. The library depends on what the developer decides to use. 
In the next section, the demo code uses webpack and will show how to include `isCustomElement` in the config file.

Getting a reference to a Web Component in [Vue 3](https://v3.vuejs.org/guide/component-template-refs.html) is thankfully done the same way as in Vue 2, at the time of this blog post.

## Composition API

<iframe src="https://codesandbox.io/embed/mystifying-dew-736rf?fontsize=14&hidenavigation=1&module=%2Fsrc%2FApp.vue&theme=dark"
     style="width:100%; height:800px; border:0; border-radius: 4px; overflow:hidden;"
     title="mystifying-dew-736rf"
     allow="accelerometer; ambient-light-sensor; camera; encrypted-media; geolocation; gyroscope; hid; microphone; midi; payment; usb; vr; xr-spatial-tracking"
     sandbox="allow-forms allow-modals allow-popups allow-presentation allow-same-origin allow-scripts"
   ></iframe>

Vue's Composition API was created to help address some limitations developers were facing as applications grew over time and became more complex.
From the [documentation](https://composition-api.vuejs.org/#motivation):

> "The APIs proposed in this RFC provide the users with more flexibility when organizing component code. Instead of being forced to always organize code by options, code can now be organized as functions, each dealing with a specific feature. The APIs also make it more straightforward to extract and reuse logic between components, or even outside components." 

I strongly suggest reading the Composition API [documentation](https://composition-api.vuejs.org/) to get a better understanding. Here, I will focus on getting a Web Component working with it. That deals with how the reference to the component is used.

Letting a Vue application know that there is a Web Component has changed from [version 2 to 3](https://v3.vuejs.org/guide/migration/custom-elements-interop.html#_3-x-syntax).

Depending on how the application compiles the template, it determines where to place the configuration. In the previous example, the template compilation was done "on-the-fly". This Composition API example is using Webpack to compile the template. That means the `isCustomElement` configuration goes in the `webpack.config.js` file. There you will find this code:

```js
{
    test: /\.vue$/,
    use: {
        loader: "vue-loader",
        options: {
            compilerOptions: {
                isCustomElement: (tag) => {
                    return /^dwanes-/.test(tag);
                }
            }
        }
    }
}
```

Regardless of the compilation engine, there probably is a `.config.js` file, and that is where you would put the snippet above.

In the Composition API, the `ref` has grown to include tracking other values, not just DOM elements. 

The `ref` added to the keypad component stays the same:

```html
<dwanes-keypad ref="keypad" ...>
```

The first change is that `ref` needs to be imported: 

```js
import { ref } from 'vue';
```

Then, the reference needs to be initialized inside setup():

```js
const keypad = ref(null);
```

Make sure to add `keypad` to the `return`.

This is how to access the `cancelAction()` method on the component:

```js
keypad.value.cancelAction();
```

Make sure to take note of [`value`](https://composition-api.vuejs.org/api.html#ref).

The same is done for setting and changing the `placeholder` text.

## Vonage Vuerify

One thing I learned when researching for this blog post is that projects based on Vue love putting it in the name if they can. See Vuetify, Vuex, Revue, Vuedo, etc. So how could I pass up the opportunity to take the Vonage [Verify API](https://developer.nexmo.com/verify/overview) and create Vonage Vuerify?!

Give it a try!

<iframe src="https://codesandbox.io/embed/frosty-snowflake-qtebx?fontsize=14&hidenavigation=1&module=%2Fsrc%2FApp.vue&theme=dark"
     style="width:100%; height:800px; border:0; border-radius: 4px; overflow:hidden;"
     title="frosty-snowflake-qtebx"
     allow="accelerometer; ambient-light-sensor; camera; encrypted-media; geolocation; gyroscope; hid; microphone; midi; payment; usb; vr; xr-spatial-tracking"
     sandbox="allow-forms allow-modals allow-popups allow-presentation allow-same-origin allow-scripts"
   ></iframe>

Want to try it for yourself? First, fork the code on [codesandbox.io](https://codesandbox.io/s/frosty-snowflake-qtebx?file=/src/App.vue). 

> Note: You will need to be signed in.

Here's how it works:

### The Setup

First, you'll need a Vonage developer account. Take a note of your API key and API secret found in the [dashboard](https://dashboard.nexmo.com/sign-up?utm_source=DEV_REL&utm_medium=blog&utm_campaign=wc-vue); you'll need these values for authentication.

Next, in your newly forked `codesandbox.io` project, click on the "Server Control Panel".

![Screen capture of codesandbox.io code editor with the icon for the server control panel circled in red with a red arrow pointing to it.](/content/blog/use-web-components-in-vue-2-and-3-composition-api/codesandbox-server-control-panel.jpg "Screen capture of codesandbox.io code editor with the icon for the server control panel circled in red with a red arrow pointing to it.")

Towards the bottom, there is the "Secret Keys" section. Take the `API Key` and `API Secret` from the [Vonage Dashboard](https://dashboard.nexmo.com/sign-up?utm_source=DEV_REL&utm_medium=blog&utm_campaign=wc-vue) and place them where appropriate. `Brand Name` is the string that will be sent along with the security code to the user. In this case, it is VonageVuerify.

The `App.vue` code looks almost the same as the Composition API's code, except for how the digits sent from the Web Component are handled and sent to the Node Express backend.

### Requesting the Security Code

If the user requests the security code, a `POST` request is made to the `/request` endpoint on the server sending along the phone number entered in the body. 

Once the response comes back and is valid, the request ID is saved, the mode is changed, some text on the keypad component is changed, and the display is cleared. Otherwise, an error is displayed.

Here's the code:

App.vue

```js
if (mode === "request") {
    // Request security code
    postData("https://qtebx-8081.sse.codesandbox.io/request", {
    number: entered,
    })
    .then((data) => {
        if (data.status === "0") {
            requestId = data.request_id;
            mode = "verify";
            placeholder.value = "Enter verification code.";
            actionText.value = "Verify Code";
            keypad.value.cancelAction();
        } else {
            keypad.value.cancelAction();
            status.value = data.error;
        }
    })
    .catch((error) => {
        console.error("Error: ", error);
    });
}
```

server.js

```js
app.post("/request", (request, response) => {
  console.log("request.body: ", request.body);
  nexmo.verify.request(
    {
      number: request.body.number,
      brand: process.env.BRAND_NAME,
      workflow_id: 6
    },
    (err, result) => {
      if (err) {
        console.error(err);
        response.json(err);
      } else {
        console.log("request result: ", result);
        if (result.status === 0) {
          response.json({
            status: result.status,
            request_id: result.request_id
          });
        } else {
          response.json({
            status: result.status,
            request_id: result.request_id,
            error: result.error_text
          });
        }
      }
    }
  );
});
```

> Note: The `workflow_id` is the fallback strategy used to deliver the security code to the user. Find the various options in the [documentation](https://developer.nexmo.com/verify/guides/workflows-and-events). This application is using Workflow 6, which sends only one SMS message.

### Verifying the Code

When the user attempts to verify with the code they received, another `POST` request is sent to the `/check` endpoint on the server with the `requestId` saved earlier and the security code.

If the status comes back as a success, the mode is changed, the image is changed, the keypad component's text is changed, and displayed cleared. If the status is an error, it is displayed.

Here's the code:

App.vue

```js
else if (mode === "verify") {
    // verify code
    postData("https://qtebx-8081.sse.codesandbox.io/check", {
    request_id: requestId,
    code: entered,
    })
    .then((data) => {
        if (data.status === "0") {
        //verified!!!
        mode = "success";
        placeholder.value = "Woohoo!!";
        actionText.value = "SUCCESS!!!";
        image.value = {
            src: "https://media.giphy.com/media/oobNzX5ICcRZC/source.gif",
            alt: "minion giving the thumbs up",
        };
        keypad.value.cancelAction();
        } else {
        keypad.value.cancelAction();
        status.value = data.error;
        }
    })
    .catch((error) => {
        console.error("Error: ", error);
    });
}
```

server.js

```js
app.post("/check", (request, response) => {
  console.log("check request.body: ", request.body);
  nexmo.verify.check(
    {
      request_id: request.body.request_id,
      code: request.body.code
    },
    (err, result) => {
      if (err) {
        console.error(err);
        response.json(err);
      } else {
        console.log("check result: ", result);
        if (result.status === 0) {
          response.json({ status: result.status });
        } else {
          response.json({ status: result.status, error: result.error_text });
        }
      }
    }
  );
});
```

> Note: If you fork the demo code, the endpoints called in the `App.vue` will need to be changed to reflect your project's server.

To learn more about the Vonage Verify API, you can check out the [documentation](https://developer.nexmo.com/verify/overview).

Any questions on what was covered in this post? Have you incorporated Web Components into a Vue application another way? Got an example of how you are using the Vonage Verify API? Let us know on our [Community Slack Channel](https://developer.nexmo.com/slack).

<style>
img.alignnone {
  border-width: 0px !important;
}
</style>