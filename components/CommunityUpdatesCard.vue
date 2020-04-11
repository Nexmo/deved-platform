<template>
  <div class="Vlt-col Vlt-col--1of2">
    <div class="Vlt-card Blog__Blog-card Vlt-bg-grey-light">
      <div class="Vlt-card__header">
        <h3 class="Vlt-title">
          Get Vonage Developer Community updates delivered to your inbox!
        </h3>
      </div>
      <div class="Vlt-card__content">
        <form name="contact" netlify>
          <p class="p-large">Subscribe to receive updates, tutorials, and news on Vonage communications APIs, libraries, SDKs, and developer tools.</p>
          <div class="Vlt-form__element Vlt-form__element--big">
            <div class="Vlt-composite">
              <div class="Vlt-composite__wrapper Vlt-input">
                <input type="text" placeholder="email@example.com" id="ex-input" value=""/>
                <label for="ex-input">Email</label>
              </div>
              <div class="Vlt-composite__append">
                <button class="Vlt-btn">Subscribe</button>
              </div>
            </div>
            <small class="Vlt-form__element__hint">By signing up to our communications blog, you accept our <a href="https://www.nexmo.com/privacy-policy" target="_blank">privacy policy</a>, which sets out how we use your data and the rights you have in respect of your data. You can opt out of receiving our updates by clicking the unsubscribe link in the email or by emailing us at <a href="mailto:privacy@nexmo.com" target="_blank">privacy@nexmo.com</a>.</small>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<style scoped>
.Vlt-card__header {
  margin-top: 24px;
}
</style>