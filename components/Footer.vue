<template>
  <footer class="Vlt-footer">
    &copy; {{ year }} —
    <span>Vonage 2020</span>
    <a href="#top" class="footer__top-page">^</a>
  </footer>
</template>

<script>
export default {
  computed: {
    year() {
      return new Date().getFullYear()
    }
  }
}
</script>

<style scoped>
.Vlt-footer {
  margin: 24px 20px 0 20px;
  border-top: 1px solid #c2c4cc;
  bottom: 0;
  padding: 24px 5px;
  width: 100%;
}
</style>
