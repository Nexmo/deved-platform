<template>
  <div class="Vlt-grid">
    <div class="Vlt-col Blog-error">
      <h1>Ooops, wrong way</h1>
      <p>
        You've reached the edge of the ocean. <br />
        The page you requested could not be found.
      </p>
      <NLink to="/" no-prefetch class="Vlt-btn Vlt-btn--app Vlt-btn--secondary">Home page</NLink>
    </div>
    
    <div class="Vlt-col Blog-error">
      <img src="../../node_modules/@vonagevolta/volta2/demo/templates/assets/img/error-404.svg">
    </div>
  </div>
</template>

<script>
export default {}
</script>

<style scoped>
.Vlt-error-page .Blog-error {
  margin-top: 100px;
}
</style>