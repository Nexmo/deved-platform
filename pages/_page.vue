<template>
  <section class="Blog__Full-width">
    <article
      class="Blog__post Vlt-container"
      vocab="http://schema.org/"
      typeof="BlogPosting"
    >
      <div class="Vlt-grid Vlt-grid--stack-flush">
        <div class="Vlt-col" />
        <div class="Vlt-col Vlt-col--2of3">
          <div
            class="Vlt-card Vlt-card--lesspadding"
            property="mainEntityOfPage"
          >
            <div class="Vlt-card__header Vlt-margin--A-top3">
              <h1 property="headline">
                {{ post.title }}
              </h1>
              <BackToTop />
            </div>
            <hr class="hr--short Vlt-gradient--blue-to-pink" />
            <div
              class="Vlt-card__content Vlt-margin--A-top3"
              property="articleBody"
            >
              <nuxt-content :document="post" />
            </div>
          </div>
        </div>
        <div class="Vlt-col" />
      </div>
    </article>
  </section>
</template>

<script>
export default {
  async asyncData({ $content, app: { i18n }, params, error }) {
    try {
      const post = await $content(`page/${i18n.locale}`, params.page)
        .where({ published: { $ne: false } })
        .fetch()
        .catch((err) => {
          error({ statusCode: 404, message: 'Page not found', err })
        })

      return {
        post,
      }
    } catch (e) {
      error(e)
      return false
    }
  },
}
</script>

<style scoped>
.Blog__post .nuxt-content {
  padding: auto 50px;
}

.Blog__post .nuxt-content >>> a,
.Blog__post .nuxt-content >>> li,
.Blog__post .nuxt-content >>> p {
  font-size: 16px;
  line-height: 1.55em;
}

.Blog__post .nuxt-content >>> ol,
.Blog__post .nuxt-content >>> ul {
  list-style: none;
  margin-bottom: 16px;
  padding-left: 16px;
}

.Blog__post .nuxt-content >>> ol {
  counter-reset: list;
  padding-left: 20px;
}

.Blog__post .nuxt-content >>> li {
  margin-bottom: 0.2em;
  position: relative;
  margin-left: 24px;
}

.Blog__post .nuxt-content >>> ul li:before {
  color: #000;
  content: '•';
  left: -16px;
  position: absolute;
  top: 0em;
}

.Blog__post .nuxt-content >>> ol li:before {
  color: #000;
  content: counter(list) '.';
  counter-increment: list;
  font-weight: 600;
  left: -20px;
  position: absolute;
  top: 0em;
}

.Blog__post .nuxt-content >>> h2 {
  margin-top: 25px;
}

.Blog__post .nuxt-content >>> h3 {
  margin-top: 25px;
}

.Blog__post .nuxt-content >>> pre {
  border-radius: 8px;
  padding: 1em;
  background: #131415;
  color: #c2c4cc;
  margin: 35px -30px;
  font-size: 16px;
  line-height: 1.4;
  padding-left: 27px;
}

.Blog__post .nuxt-content >>> pre code {
  background: #131415;
  color: #c2c4cc;
}

.Blog__post .nuxt-content >>> p {
  text-align: justify;
  -webkit-hyphens: auto;
  -ms-hyphens: auto;
  hyphens: auto;
  -ms-word-break: normal;
  word-break: normal;
}

.Blog__post .nuxt-content >>> blockquote {
  margin: 24px auto;
  background-color: #ffffff;
  border-radius: 6px;
  box-shadow: inset 0 0 0 1px #9b9da3;
  display: -ms-flexbox;
  display: flex;
  opacity: 1;
  overflow: hidden;
  padding: 20px;
  padding-left: 21px;
  position: relative;
  text-align: left;
  transition: all 0.3s ease-out;
}

.Blog__post .nuxt-content >>> blockquote:before {
  bottom: 0;
  content: '';
  left: 0;
  position: absolute;
  top: 0;
  width: 5px;
  background-color: #871fff;
}

.Blog__post .nuxt-content >>> blockquote p {
  -ms-flex-item-align: center;
  -ms-grid-row-align: center;
  align-self: center;
  -ms-flex: 2;
  flex: 2;
  margin-left: 4px;
  word-break: break-word;
}

.Blog__post .nuxt-content >>> p code {
  border: 1px solid silver;
  background: #f9f9fa;
}

.Blog__post .nuxt-content >>> .language-diff .token {
  width: 100%;
  display: inherit;
  white-space: pre-wrap;
}

.Blog__post .nuxt-content >>> .language-diff .token.inserted {
  color: #e84545;
  background: #270404;
}

.Blog__post .nuxt-content >>> .language-diff .token.deleted {
  color: #86d8b9;
  background: #021a10;
}

.Blog__post .nuxt-content >>> p img {
  display: block;
  margin: 24px auto;
  max-height: 50vh;
  max-width: 100%;
}

@media only screen and (max-width: 767px) {
  .Blog__post .nuxt-content >>> pre[class*='language-'] {
    margin: 24px 10px;
    padding-left: 12px;
  }
}

.Vlt-grid >>> .Author-col {
  flex: 0 0 66.66%;
  max-width: 66.66%;
}
</style>
