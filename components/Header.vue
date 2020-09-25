<template>
  <header class="Blog-header">
    <div class="Vlt-header">
      <NLink :to="`${$i18n.locale === 'en' ? '/' : `/${$i18n.locale}`}`" no-prefetch class="Vlt-header__logo">
        <img
          class="Vlt-M-plus"
          src="../node_modules/@vonagevolta/volta2/images/logos/Vonage-wordmark.svg"
          alt="Vonage Logo :: Now we're talking"
        >
        <img
          class="Vlt-S-only"
          src="../node_modules/@vonagevolta/volta2/images/logos/Vonage-lettermark.svg"
          alt="Vonage Logo :: Now we're talking"
        >
        <div
          class="Vlt-badge Vlt-M-plus Vlt-badge--small Vlt-badge--transparent"
          style="margin: 8px;"
        >
          Learn
        </div>
        <div
          class="Vlt-badge Vlt-S-only Vlt-badge--small Vlt-badge--transparent"
          style="margin: 8px;"
        >
          Learn
        </div>
      </NLink>
      <div class="Vlt-header__menu Vlt-header__menu--right Vlt-M-plus">
        <div class="Vlt-native-dropdown Vlt-native-dropdown--small">
          <select v-model="selectedLocale" @change="switchLocale(selectedLocale)">
            <option :value="currentLocale.code" selected="selected">
              {{ currentLocale.name }}
            </option>
            <option
              v-for="(locale, index) in availableLocales"
              :key="index"
              :value="locale.code"
            >
              {{ locale.name }}
            </option>
          </select>
        </div>

        <SlackSocialButton
          link="https://developer.nexmo.com/community/slack"
          class="Vlt-btn--small"
        >
          Join our Slack
        </SlackSocialButton>
        <TwitterSocialButton
          link="https://twitter.com/VonageDev"
          class="Vlt-btn--small"
        />
        <a
          href="https://dashboard.nexmo.com/sign-up?utm_source=blog&utm_medium=deved&utm_campaign=sign-up-link"
          class="Vlt-btn Vlt-btn--small Vlt-btn--secondary"
          rel="noreferrer"
        >Sign up</a>
      </div>
      <div class="Vlt-header__menu Vlt-header__menu--right Vlt-S-only">
        <a
          href="#"
          class="Vlt-btn Vlt-btn--small Vlt-btn--white"
          @click="isOpen = !isOpen"
        >
          <svg>
            <image
              width="16"
              height="16"
              viewBox="0 0 16 16"
              xlink:href="../node_modules/@vonagevolta/volta2/images/icons/Vlt-icon-menu.svg"
            />
          </svg>
        </a>
      </div>
    </div>
    <nav
      class="Blog-nav Blog-nav__elevation--1"
      :class="{
        'Blog-nav__expandable': !isOpen,
      }"
    >
      <ul class="Blog-nav__list">
        <li class="Blog-nav__item Vlt-center">
          <SlackSocialButton link="https://developer.nexmo.com/community/slack">
            Join us on Slack
          </SlackSocialButton>
        </li>
        <li class="Blog-nav__item Vlt-center">
          <a
            href="https://dashboard.nexmo.com/sign-up?utm_source=blog&utm_medium=deved&utm_campaign=sign-up-link"
            class="Vlt-btn Vlt-btn--secondary Vlt-text-white"
            rel="noreferrer"
          >Sign up</a>
        </li>
        <li class="Blog-nav__item Vlt-center">
          <TwitterSocialButton link="https://twitter.com/VonageDev">
            Follow us
          </TwitterSocialButton>
        </li>
      </ul>
    </nav>
  </header>
</template>

<script>
import TwitterSocialButton from "~/components/SocialButtons/TwitterSocialButton"
import SlackSocialButton from "~/components/SocialButtons/SlackSocialButton"

export default {
  components: {
    TwitterSocialButton,
    SlackSocialButton
  },

  data() {
    return {
      selectedLocale: this.$i18n.locale,
      isOpen: false,
    }
  },

  computed: {
    availableLocales () {
      return this.$i18n.locales.filter(i => i.code !== this.$i18n.locale)
    },
    currentLocale() {
      return this.$i18n.locales.filter(l => l.code === this.$i18n.locale)[0]
    },
  },

  methods: {
    switchLocale(event) {
      this.$router.replace(this.switchLocalePath(event))
    }
  }
}
</script>

<style scoped>
.Blog-header {
  width: 100%;
  min-height: 64px;
  box-shadow: 0 4px 4px rgba(19, 20, 21, 0.1);
  margin-bottom: 12px;
}

.Blog-nav {
  transition: margin 700ms;
  margin-top: 74px;
}

.Blog-nav__expandable {
  margin-top: calc(-100%);
}

.Blog-nav__list {
  display: block;
  margin-bottom: 12px;
}

.Blog-nav__item {
  display: block;
  font-size: 1.1em;
  font-weight: 600;
  line-height: 48px;
  border-left: 5px solid white;
}

.Blog-nav__item .Vlt-btn {
  width: 80vw;
}

@media only screen and (max-width: 575px) {
  .Vlt-header__logo {
    flex: 0 0 120px;
  }
}

.Vlt-tabs__header {
  border-bottom: none;
}

.Vlt-header__menu .Vlt-btn svg:only-child {
  margin-right: 0;
}

.Vlt-tabs__link_active span {
  background: 0 0;
  color: #131415;
  font-weight: 600;
  font-size: 15px;
}

.Vlt-tabs__link:not(.Vlt-tabs__link_active) span {
  font-size: 15px;
  color: #616266;
}

@media only screen and (min-width: 768px) {
  .Vlt-tabs__link:hover:not(.Vlt-tabs__link_active) span {
    background: 0 0;
    color: #131415;
  }
}

.Vlt-tabs__link.Tabs__Node:after {
  background: rgba(61, 136, 54, 0.5);
}

.Vlt-tabs__link_active.Tabs__Node:after {
  background: rgb(61, 136, 54);
}

.Vlt-tabs__link.Tabs__DotNet:after {
  background: rgba(93, 37, 144, 0.5);
}

.Vlt-tabs__link_active.Tabs__DotNet:after {
  background: rgb(93, 37, 144);
}

.Vlt-tabs__link.Tabs__Ruby:after {
  background: rgba(204, 52, 45, 0.5);
}

.Vlt-tabs__link_active.Tabs__Ruby:after {
  background: rgb(204, 52, 45);
}

.Vlt-tabs__link.Tabs__Python:after {
  background: rgba(30, 56, 187, 0.5);
}

.Vlt-tabs__link_active.Tabs__Python:after {
  background: rgb(30, 56, 187);
}

.Vlt-tabs__link.Tabs__PHP:after {
  background: rgba(35, 161, 170, 0.5);
}

.Vlt-tabs__link_active.Tabs__PHP:after {
  background: rgb(35, 161, 170);
}

.Vlt-tabs__link.Tabs__Java:after {
  background: rgba(1, 71, 110, 0.5);
}

.Vlt-tabs__link_active.Tabs__Java:after {
  background: rgb(1, 71, 110);
}

.Vlt-header .Vlt-composite .Vlt-composite__prepend--icon {
  padding: 8px 12px;
}

.Blog-search__form {
  display: inline-block;
  padding: 8px 0;
}

@media only screen and (max-width: 1099px) {
  .Blog-search__form {
    display: none !important;
  }
}

.Blog-search__button {
  display: none !important;
}

@media only screen and (max-width: 1099px) {
  .Blog-search__button {
    display: inline-block !important;
  }
}

.Vlt-header .Vlt-composite input {
  height: 32px;
  border: none;
  width: 150px;
  -webkit-transition: all 0.5s;
  -moz-transition: all 0.5s;
  transition: all 0.5s;
}

.Vlt-header .Vlt-composite:hover input {
  background: #d0d2d8;
}

.Vlt-header .Vlt-composite input:focus {
  background: #fff;
  border: 1px solid #c2c4cc;
  width: 250px;
}

.Vlt-header .Vlt-composite input::-webkit-input-placeholder,
.Vlt-header .Vlt-composite input::-moz-placeholder,
.Vlt-header .Vlt-composite input::-ms-input-placeholder,
.Vlt-header .Vlt-composite input::placeholder {
  font-size: 12px;
  font-weight: 600;
  color: #131415;
  line-height: 1.6rem;
}

.Vlt-native-dropdown--small {
  margin-right: 8px;
}
.Vlt-native-dropdown--small select {
  font-size: 1.2rem;
  line-height: 1.6rem;
  min-height: 32px;
  min-width: 32px;
}
</style>
