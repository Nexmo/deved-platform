<template>
  <div class="Blog-hero">
    <div class="Blog-hero__content">
      <h3>
        Developer <strong>{{ title }}</strong> content from the team at Vonage.
      </h3>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    title: {
      type: String,
      required: true,
    },
  },
}
</script>

<style scoped>
.Blog-hero {
  background: white
    url("../assets/images/illustrations/Brand-mobile-apis-services.png")
    no-repeat scroll 12px 24px;
  background-size: 150px;
  width: 100vw;
  height: 200px;
  display: -webkit-box;
  display: flex;
  margin-top: -12px;
  box-shadow: 0 4px 4px rgba(19, 20, 21, 0.1);
  margin-bottom: 12px;
}

.Blog-hero__content {
  width: 500px;
  display: -webkit-box;
  display: flex;
  -webkit-box-orient: vertical;
  -webkit-box-direction: normal;
  flex-direction: column;
  -webkit-box-align: center;
  align-items: center;
  margin: auto;
}

@media only screen and (max-width: 775px) {
  .Blog-hero {
    background-position-x: -34px;
  }
}

@media only screen and (max-width: 675px) {
  .Blog-hero {
    background-position-x: -84px;
  }
}

@media only screen and (max-width: 575px) {
  .Blog-hero {
    background-position-y: calc(100% - 24px);
    background-position-x: 24px;
    background-size: 200px;
  }

  .Blog-hero__content {
    width: 90%;
  }

  .Blog-hero__content h3 {
    background-color: rgba(255, 255, 255, 0.623);
  }
}

.Blog-hero__content h3 {
  text-align: center;
  color: black;
  line-height: 1;
  margin-bottom: 40px;
  font-size: 1.5em;
  font-weight: normal;
}
</style>
