<template>
  <div>
    <div class="Vlt-form__element">
      <label class="Vlt-label" for="title-maker"
        >Capitalize your title here
        <small class="Vlt-grey-dark">(by writing it in the box)</small></label
      >
      <div class="Vlt-input">
        <input id="title-maker" v-model="title" type="text" />
      </div>
      <small class="Vlt-form__element__hint"
        >Text will automatically format the input, uppercasing the first letter
        of the first or last words and every other word that isn't one of these;
        “a,” “an,” “and,” “at,” “but,” “by,” “for,” “in,” “nor,” “of,” “on,”
        “or,” "out," “so,” “the,” “to,” “up,” and “yet.”. This is based on
        capitalizemytitle.com.</small
      >
    </div>
    <div class="Tag-tests Vlt-center">
      <h2></h2>
    </div>
  </div>
</template>

<script>
import titleCase from 'ap-style-title-case'

export default {
  data() {
    return {
      title: 'a quick brown fox jumped over the lazy dog',
    }
  },

  watch: {
    title() {
      this.title = this.title ? titleCase(this.title) : ''
    },
  },

  mounted() {
    this.title = this.title ? titleCase(this.title) : ''
  },
}
</script>

<style scoped>
.Tag-tests >>> a {
  font-size: 1.1rem !important;
}
.Tag-tests >>> .Tag-test {
  font-size: 3rem !important;
  border-radius: 27px;
  padding: 4px 16px;
  margin-bottom: 50px;
}
</style>
