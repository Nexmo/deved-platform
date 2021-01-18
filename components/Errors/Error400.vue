<template>
  <div
    class="flex flex-col items-center justify-center max-w-screen-xl gap-6 p-6 mx-auto my-16 md:flex-row"
  >
    <div>
      <h1 class="text-3xl font-bold">Our bad!</h1>
      <p class="my-2">
        Don't worry you definitely typed the correct URL, it's the keyboard's
        fault.
      </p>
      <nuxt-link to="/" class="button button--primary"> Home page </nuxt-link>
    </div>
    <div class="max-w-md object-fit">
      <img class="" src="~/assets/images/illustrations/Error-400.svg" />
    </div>
  </div>
</template>
