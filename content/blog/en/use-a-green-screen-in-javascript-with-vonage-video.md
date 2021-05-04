---
title: Use a Green Screen in Javascript With Vonage Video
description: Learn how to remove a green screen and replace it with a custom
  image that you can include in your video calls with Vonage Video API
thumbnail: /content/blog/use-a-green-screen-in-javascript-with-vonage-video/Blog_Greenscreen_1200x600.png
author: kevinlewis
published: true
published_at: 2020-06-24T07:20:24.000Z
updated_at: 2021-05-04T15:38:38.837Z
category: tutorial
tags:
  - greenscreen
  - video-api
  - javascript
comments: true
redirect: ""
canonical: ""
---
When creating a Vonage Video publisher, the stream can be sourced directly from a user camera, from a `<video>` element, or a HTML `<canvas>` element. Once pixels get drawn to the canvas, they can be easily manipulated before being used in a Video API session. 

In this tutorial, you'll learn how to remove a green screen and replace it with a new, custom image that you can include in your video calls. 

![Overview of the project components](/content/blog/use-a-green-screen-in-javascript-with-vonage-video/overview.png "Overview of the project components")

Several components are required to make the project work. Firstly, a `<video>` element will take a stream from the user's camera. Each frame, the video element content will be drawn on a canvas, where we will loop through pixels to remove those which are green. On a second canvas, we will draw the replacement background image and then layer the first canvas' non-green pixels on top. 

With our desired output on a canvas, we can use the canvas as a source for a Vonage Video API publisher, which we can use in our video sessions with friends.

If you want to look at the finished code, you can find it at <https://github.com/nexmo-community/video-green-screen>

## Scaffold Markup

Create a new project folder followed by a new file `index.html`, populating this file with the following code:

```html
<!DOCTYPE html>
<html>
<head></head>
<body>
  <video id="v1" width="320" height="240" autoplay></video>
  <canvas id="c1" width="320" height="240"></canvas>
  <canvas id="c2" width="320" height="240"></canvas>
  <div id="opentok-publishers"></div>
  <div id="opentok-subscribers"></div>
  <script>
    // Create references to the video and canvas elements
    const v1 = document.getElementById('v1')
    const c1 = document.getElementById('c1')
    const c2 = document.getElementById('c2')

    // Get canvas context
    const c1Ctx = c1.getContext('2d')
    const c2Ctx = c2.getContext('2d')
  </script>
</body>
</html>
```

You'll also need the image that you want to replace your green screen within the project folder. This tutorial will use one of the [Vonage brand gradients](https://www.nexmo.com/wp-content/uploads/2020/06/vonage-gradient.png). After you get the canvas contexts, load the image:

```js
const backgroundImage = new Image()
backgroundImage.src = 'vonage-gradient.png'
```

## Get Webcam Video

Set the `<video>` element's source to the stream from the user's webcam. This snippet will pick the default camera:

```js
navigator.mediaDevices.getUserMedia({ video: true })
  .then(stream => { v1.srcObject = stream })
```

Create an empty `process()` function. Once the user's video device is ready and 'playing', run the function every frame:

```js
v1.addEventListener('play', () => {
  setInterval(process, 0)
})

function process() {

}
```

## Draw Video Stream to the Canvas

Update `process()`:

```js
function process() {
  c1Ctx.drawImage(v1, 0, 0, 320, 240)
  c2Ctx.drawImage(backgroundImage, 0, 0, 320, 240)
}
```

Refresh your page, and you should see your `<video>` element, your first `<canvas>` with a duplicate image, and your second `<canvas>` with the new background image. The goal is to get any non-green pixels on top of the background in the second canvas.

## Loop Through Pixels

In a canvas, the entire image represented in a single long array of pixels. While you may initially believe that our 320x240 image will have 76,800 entries in the array, you'd be mistaken. 

![Canvas pixels](/content/blog/use-a-green-screen-in-javascript-with-vonage-video/canvas-pixels.png "Canvas pixels")

Each visible pixel is made up of four array items - one for its red value, one for green, one for blue, and the final to set its opacity. These values are important as we build and use the loop. 

Get this frame's pixels array inside of the `process()` function, and build the loop:

```js
const frame = c1Ctx.getImageData(0, 0, 320, 240)
const pixels = frame.data

for(let i=0; i<pixels.length; i+=4) {

}
```

Notice that the counter is set to increment by 4. Each time this loop runs, `i` will be the array index of the next visible pixel's red value. 

## Understanding HSL

Before green pixels can be removed, I'd like to introduce you to the Hue Saturation Lightness (HSL) color format.

![Hue is a color wheel, sauturation is the amount of grey, lightness is a scale of black to white](/content/blog/use-a-green-screen-in-javascript-with-vonage-video/hsl.png "Hue is a color wheel, sauturation is the amount of grey, lightness is a scale of black to white")

You can think of hue as a color wheel - and use the position on the wheel to specify a color, from 0 to 360. The green 'range' might be different for each person, but 90 to 200 works well for me. 

However, when reading and writing pixels to a `<canvas>` you must use the Red Green Blue (RGB) color format. At the very bottom of your `<script>`, add this `RGBToHSL()` function [provided on CSS Tricks](https://css-tricks.com/converting-color-spaces-in-javascript/#rgb-to-hsl):

```js
function RGBToHSL(r, g, b) {
  r /= 255; g /= 255; b /= 255;
  let cmin = Math.min(r,g,b), 
      cmax = Math.max(r,g,b), 
      delta = cmax - cmin, 
      h = 0, s = 0, l = 0;
  if (delta == 0) h = 0;
    else if (cmax == r) h = ((g - b) / delta) % 6;
    else if (cmax == g) h = (b - r) / delta + 2;
    else h = (r - g) / delta + 4;
  h = Math.round(h * 60);
  if (h < 0) h += 360;
  l = (cmax + cmin) / 2;
  s = delta == 0 ? 0 : delta / (1 - Math.abs(2 * l - 1));
  s = +(s * 100).toFixed(1);
  l = +(l * 100).toFixed(1);
  return [h, s, l]
}
```

## Making Green Pixels Transparent

Inside the `process()` loop, get the RGB and HSL values for each pixel, and set pixels which are green to be transparent:

```js
const [r, g, b] = [pixels[i], pixels[i+1], pixels[i+2]]
const [h, s, l] = RGBToHSL(r, g, b)

if(h > 90 && h < 200) {
  pixels[i+3] = 0
}
```

After the loop, update the canvas image:

```js
frame.data = pixels
c1Ctx.putImageData(frame, 0, 0)
```

You may find that `90` and `200` needs updating, given the color of your screen and lighting. 

![The first canvas has no background - appearing white](/content/blog/use-a-green-screen-in-javascript-with-vonage-video/removing-green.png "The first canvas has no background - appearing white")

## Draw Remaining Pixels on Replacement Background

For each pixel that is remaining in the first canvas, draw it on the second. After the `if` statement in the `process()` loop, add an `else` condition:

```js
if(h > 90 && h < 200) {
  pixels[i+3] = 0
} else {
  c2Ctx.fillStyle = `rgba(${r}, ${g}, ${b}, 1)`
  const x = (i/4) % 320
  const y = Math.floor((i / 4) / 320)
  c2Ctx.fillRect(x, y, 1, 1)
}
```

The `x` and `y` values are the visual pixels, so the `i` value should be divided by 4.

![The second canvas now has the non-removed pixels](/content/blog/use-a-green-screen-in-javascript-with-vonage-video/replacement-bg.png "The second canvas now has the non-removed pixels")

## Include Canvas in Video API Session

Create a new project in your [Vonage Video Dashboard](https://tokbox.com/account). Once created, scroll down to Project Tools and create a new Routed session. Take the Session ID and create a new token. 

At the top of your `<script>`, create three new variables with data from the project dashboard:

```js
const sessionId = 'YOUR_SESSION_ID'
const apiKey = 'YOUR_PROJECT_API_KEY'
const token = 'YOUR_TOKEN'
```

Next, copy the `<script>` tag from the [Vonage Video API Client SDK page](https://tokbox.com/developer/sdks/js/#loading) and put it above your existing `<script>` tag.

At the bottom of your `<script>` tag, get your basic Vonage Video API session initialized and publish from the second canvas:

```js
// Initialize session
const session = OT.initSession(apiKey, sessionId)

// Create publisher
const publisher = OT.initPublisher("opentok-publishers", {
  videoSource: c2.captureStream().getVideoTracks()[0],
  width: 320,
  height: 240
})

// Once connected to session, publish the publisher
session.connect(token, () => {
  session.publish(publisher)
})

// Show other users' streams
session.on('streamCreated', event => {
  session.subscribe(event.stream, "opentok-subscribers")
})
```

## Hide Elements

The `<video>` and `<canvas>` elements are required to make this work, but you probably don't want them visible in your webpage. In your `<head>`, add the following CSS to hide them:

```html
<style>
  #v1, #c1, #c2 { display: none }
</style>
```

## What Will Your Background Be?

Hopefully, you found this blog post useful and can now create custom backgrounds to your heart's content. While we focused on greenscreens, any pixel-level manipulation can be done with the same approach. 

To take this further, you may choose to provide users with controls that alter the HSL values which are 'in range' to be replaced, or a file selector to change the image. 

You can find the final project at <https://github.com/nexmo-community/video-green-screen>

As ever, if you need any support feel free to reach out in the [Vonage Developer Community Slack](https://developer.nexmo.com/community/slack). We hope to see you there.