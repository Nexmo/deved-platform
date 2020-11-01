<template>
  <div>
    <prism lang="scss">
      .VueToNuxtLogo { display: inline-block; animation: turn 2s linear forwards
      1s; transform: rotateX(180deg); position: relative; overflow: hidden;
      height: 180px; width: 245px; }
    </prism>
  </div>
</template>

<script>
export default {
  data() {
    return {
      code: 'npm install vue-prismjs --save',
    }
  },
}
</script>
