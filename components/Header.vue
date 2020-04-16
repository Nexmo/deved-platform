<template>
  <header class="Blog-header">
    <div class="Vlt-header">
      <NLink to="/" no-prefetch class="Vlt-header__logo">
        <img class="Vlt-M-plus" src="../node_modules/@vonagevolta/volta2/images/logos/Vonage-wordmark.svg" />
        <img class="Vlt-S-only" src="../node_modules/@vonagevolta/volta2/images/logos/Vonage-lettermark.svg" />
        <div class="Vlt-badge Vlt-M-plus Vlt-badge--small Vlt-badge--transparent" style="margin: 8px">Developer Blog</div>
        <div class="Vlt-badge Vlt-S-only Vlt-badge--small Vlt-badge--transparent" style="margin: 8px">Dev Blog</div>
      </NLink>
      <div class="Vlt-header__menu Vlt-M-plus">
        <div class="Vlt-tabs">
          <ul class="Vlt-tabs__header">
            <NLink to="/nodejs" no-prefetch class="Vlt-tabs__link Tabs__Node" exact-active-class="Vlt-tabs__link_active" tag="li"><span>Node.js</span></NLink>
            <NLink to="/dotnet" no-prefetch class="Vlt-tabs__link Tabs__DotNet" exact-active-class="Vlt-tabs__link_active" tag="li"><span>.NET</span></NLink>
            <NLink to="/ruby" no-prefetch class="Vlt-tabs__link Tabs__Ruby" exact-active-class="Vlt-tabs__link_active" tag="li"><span>Ruby</span></NLink>
            <NLink to="/python" no-prefetch class="Vlt-tabs__link Tabs__Python" exact-active-class="Vlt-tabs__link_active" tag="li"><span>Python</span></NLink>
            <NLink to="/php" no-prefetch class="Vlt-tabs__link Tabs__PHP" exact-active-class="Vlt-tabs__link_active" tag="li"><span>PHP</span></NLink>
            <NLink to="/java" no-prefetch class="Vlt-tabs__link Tabs__Java" exact-active-class="Vlt-tabs__link_active" tag="li"><span>Java</span></NLink>
          </ul>
        </div>
      </div>
      <div class="Vlt-header__menu Vlt-header__menu--right Vlt-M-plus">
        <form action="/search" method="GET" name="quick-search" class="Blog-search__form">
          <div class="Vlt-composite">
            <div class="Vlt-composite__prepend Vlt-composite__prepend--icon">
              <svg><use xlink:href="../node_modules/@vonagevolta/volta2/images/icons/Vlt-icon-search.svg#Layer_1" /></svg>
            </div>
            <div class="Vlt-input Vlt-input--round">
              <input name="q" id="example-input-icon-button" type="text" placeholder="Search">
            </div>
          </div>
        </form>
        <NLink to="/search" no-prefetch class="Vlt-btn Vlt-btn--small Vlt-btn--tertiary Blog-search__button">
            <svg><image width="16" height="16" viewBox="0 0 16 16" xlink:href="../node_modules/@vonagevolta/volta2/images/icons/Vlt-icon-search.svg" /></svg>
            Search
        </NLink>
        <a href="https://dashboard.nexmo.com/sign-up?utm_source=blog&utm_medium=deved&utm_campaign=sign-up-link" class="Vlt-btn Vlt-btn--small Vlt-btn--secondary">Sign up</a>
        <TwitterSocialButton link="https://twitter.com/VonageDev" class="Vlt-btn--small" />
      </div>
      <div class="Vlt-header__menu Vlt-header__menu--right Vlt-S-only">
        <a href="#" v-on:click="isOpen = !isOpen" class="Vlt-btn Vlt-btn--small Vlt-btn--white">
          <svg><image width="16" height="16" viewBox="0 0 16 16" xlink:href="../node_modules/@vonagevolta/volta2/images/icons/Vlt-icon-menu.svg" /></svg>
        </a>
      </div>
    </div>
    <nav class="Blog-nav Blog-nav__elevation--1 " v-bind:class="{
      'Blog-nav__expandable': !isOpen
    }">
      <ul class="Blog-nav__list">
        <li class="Blog-nav__item Vlt-center">
          <NLink v-on:click.native="isOpen = false" to="/search" no-prefetch class="Vlt-btn Vlt-btn--tertiary">
            <svg><image width="16" height="16" viewBox="0 0 16 16" xlink:href="../node_modules/@vonagevolta/volta2/images/icons/Vlt-icon-search.svg" /></svg>
            Search
          </NLink>
        </li>
        <NLink v-on:click.native="isOpen = false" to="/nodejs" no-prefetch class="Blog-nav__item Blog-nav__item--Node" tag="li"><span>Node.js</span></NLink>
        <NLink v-on:click.native="isOpen = false" to="/dotnet" no-prefetch class="Blog-nav__item Blog-nav__item--DotNet" tag="li"><span>.NET</span></NLink>
        <NLink v-on:click.native="isOpen = false" to="/ruby" no-prefetch class="Blog-nav__item Blog-nav__item--Ruby" tag="li"><span>Ruby</span></NLink>
        <NLink v-on:click.native="isOpen = false" to="/python" no-prefetch class="Blog-nav__item Blog-nav__item--Python" tag="li"><span>Python</span></NLink>
        <NLink v-on:click.native="isOpen = false" to="/php" no-prefetch class="Blog-nav__item Blog-nav__item--PHP" tag="li"><span>PHP</span></NLink>
        <NLink v-on:click.native="isOpen = false" to="/java" no-prefetch class="Blog-nav__item Blog-nav__item--Java" tag="li"><span>Java</span></NLink>
        <li class="Blog-nav__item Vlt-center">
          <TwitterSocialButton link="https://twitter.com/VonageDev">Follow us</TwitterSocialButton>
        </li>
      </ul>
    </nav>
  </header>
</template>

<script>
import TwitterSocialButton from '~/components/SocialButtons/TwitterSocialButton'

export default {
  components: {
    TwitterSocialButton
  },
  data () { 
    return { 
      isOpen: false 
    } 
  }
};
</script>

<style scoped>
.Blog-header {
  width: 100vw;
  min-height: 64px;
  /* box-shadow: 0 4px 4px rgba(19,20,21,.1); */
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
  width: 100vw;
  margin-bottom: 12px;
}

.Blog-nav__item {
  display: block;
  width: 100vw;
  font-size: 1.1em;
  font-weight: 600;
  line-height: 48px;
  border-left: 5px solid white;
}

.Blog-nav__item span {
  padding-left: 24px;
}

.Blog-nav__item .Vlt-btn {
  width: 80vw;
}

.Blog-nav__item--Node {
  border-color: rgba(61, 136, 54, 0.5);
}

.Blog-nav__item--DotNet {
  border-color: rgba(93, 37, 144, 0.5);
}

.Blog-nav__item--Ruby {
  border-color: rgba(204, 52, 45, 0.5);
}

.Blog-nav__item--Python {
  border-color: rgba(30, 56, 187, 0.5);
}

.Blog-nav__item--PHP {
  border-color: rgba(35, 161, 170, 0.5);
}

.Blog-nav__item--Java {
  border-color: rgba(1, 71, 110, 0.5);
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

li a:visited,
li a:visited:hover:not([class]),
li a:hover:not([class]) {
  text-decoration: none;
  color: #131415;
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
</style>
