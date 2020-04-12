<template>
  <div class="Vlt-template">
    <Header />
    <div class="Vlt-container">
      <Nuxt />
    </div>
    <Footer />
  </div>
</template>


<script>
import Footer from '~/components/Footer'
import Header from '~/components/Header'

export default {
  components: {
    Footer,
    Header
  }
}
</script>

<style>
.Vlt-container {
  width: 100%;
  margin: 0 auto;
}

.Blog main .Vlt-card.Blog-card {
  min-height: 400px;
}
.Blog header .Blog-card__slack .Vlt-title--icon {
  padding: 32px 10px 36px;
}
.Blog .Blog-card__featured .Vlt-card__image {
  min-height: 300px;
}
.Blog .Vlt-card .Vlt-card__image {
  height: 200px;
}
.Blog .Vlt-card .Vlt-card__header {
  padding-bottom: 6px;
}
.Blog .Vlt-card .Vlt-title--icon,
.Blog .Vlt-card .Vlt-title {
  font-size: 20px;
}
</style>
