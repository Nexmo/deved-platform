<template>
  <div class="Vlt-grid">
    <div class="Vlt-col Blog-error">
      <h1>Bad request</h1>
      <p>
        Don't worry you definitely typed the correct URL, it's the keyboard's
        fault.
      </p>
      <NLink to="/" no-prefetch class="Vlt-btn Vlt-btn--app Vlt-btn--secondary">
        Home page
      </NLink>
    </div>

    <div class="Vlt-col Blog-error">
      <img
        src="../../node_modules/@vonagevolta/volta2/demo/templates/assets/img/error-400.svg"
        alt="An image showing that an error has occured"
      />
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
