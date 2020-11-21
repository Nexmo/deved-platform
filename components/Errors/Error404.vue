<template>
  <div
    class="flex flex-col items-center justify-center max-w-screen-xl gap-6 p-6 mx-auto my-16 md:flex-row"
  >
    <div>
      <h1 class="text-3xl font-bold">Ooops, wrong way!</h1>
      <p class="my-2">
        You've reached the edge of the ocean. <br />
        The page you requested could not be found.
      </p>
      <nuxt-link to="/" class="button button--primary"> Home page </nuxt-link>
    </div>
    <div class="max-w-md object-fit">
      <img class="" src="~/assets/images/illustrations/Error-404.svg" />
    </div>
  </div>
</template>
