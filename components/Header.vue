<template>
  <header class="Vlt-header Vlt-margin--bottom4 Vlt-margin--M-bottom3 Vlt-margin--S-bottom2">
    <NLink to="/" class="Vlt-header__logo">
      <img class="Vlt-M-plus" src="../node_modules/@vonagevolta/volta2/images/logos/Vonage-wordmark.svg" />
      <div class="Vlt-M-plus Vlt-badge Vlt-badge--small Vlt-badge--transparent" style="margin: 8px">Developer Blog</div>
      <img class="Vlt-S-only" src="../node_modules/@vonagevolta/volta2/images/logos/Vonage-lettermark.svg" />
    </NLink>
    <div class="Vlt-header__menu">
      <div class="Vlt-tabs">
        <ul class="Vlt-tabs__header">
          <NLink to="/nodejs" class="Vlt-tabs__link Tabs__Node" exact-active-class="Vlt-tabs__link_active" tag="li"><span>Node.js</span></NLink>
          <NLink to="/dotnet" class="Vlt-tabs__link Tabs__DotNet" exact-active-class="Vlt-tabs__link_active" tag="li"><span>.NET</span></NLink>
          <NLink to="/ruby" class="Vlt-tabs__link Tabs__Ruby" exact-active-class="Vlt-tabs__link_active" tag="li"><span>Ruby</span></NLink>
          <NLink to="/python" class="Vlt-tabs__link Tabs__Python" exact-active-class="Vlt-tabs__link_active" tag="li"><span>Python</span></NLink>
          <NLink to="/php" class="Vlt-tabs__link Tabs__PHP" exact-active-class="Vlt-tabs__link_active" tag="li"><span>PHP</span></NLink>
          <NLink to="/java" class="Vlt-tabs__link Tabs__Java" exact-active-class="Vlt-tabs__link_active" tag="li"><span>Java</span></NLink>
        </ul>
      </div>
    </div>
    <div class="Vlt-header__menu Vlt-header__menu--right">
      <form action="/search" method="GET" name="quick-search" class="Blog-search__form">
        <div class="Vlt-composite">
          <div class="Vlt-composite__prepend Vlt-composite__prepend--icon">
            <svg><use xlink:href="../node_modules/@vonagevolta/volta2/images/icons/Vlt-icon-search.svg#Layer_1" /></svg>
          </div>
          <div class="Vlt-input Vlt-input--round">
            <input name="q" id="example-input-icon-button" type="text" placeholder="Search" />
          </div>
        </div>
      </form>
      <NLink to="/search" class="Vlt-btn Vlt-btn--small Vlt-btn--tertiary Blog-search__button">Search</NLink>
      <a href="https://dashboard.nexmo.com/sign-up?utm_source=blog&utm_medium=deved&utm_campaign=sign-up-link" class="Vlt-btn Vlt-btn--small Vlt-btn--secondary">Sign up</a>
      <a href="https://twitter.com/VonageDev" class="Vlt-btn Vlt-btn--small Vlt-btn--white">
        <svg><use xlink:href="../node_modules/@vonagevolta/volta2/images/brand-icons/Brand-icon-twitter-color.svg#Brand-icon-twitter-color" /></svg>
      </a>
    </div>
  </header>
</template>

<script>
export default {}
</script>

<style scoped>
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
