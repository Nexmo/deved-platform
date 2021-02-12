<template>
  <div class="relative col-start-5 col-end-6 mr-10 md:mx-auto">
    <div class="flex items-center justify-center w-6 h-full">
      <div class="w-1 h-full pointer-events-none bg-purple-dark"></div>
    </div>
    <div
      v-if="!noDot"
      class="absolute w-6 h-6 -mt-3 bg-black rounded-full shadow top-1/2"
    ></div>
  </div>
</template>

<script>
export default {
  props: {
    noDot: {
      type: Boolean,
      default: false,
    },
  },
}
</script>
