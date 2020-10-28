<template>
  <div class="Blog-hero">
    <div class="Blog-hero__content">
      <h3>
        <slot />
      </h3>
    </div>
  </div>
</template>

<style scoped>
.Blog-hero {
  background: white
    url('../assets/images/illustrations/Brand-mobile-apis-services.png')
    no-repeat scroll 12px 24px;
  background-size: 150px;
  width: 100%;
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

.Blog-hero__content h3 {
  margin-bottom: 40px;
  text-align: center;
  line-height: 1;
  font-size: 21px;
  font-weight: normal;
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
    padding: 10px;
    background-color: rgba(255, 255, 255, 0.8);
  }
}
</style>
