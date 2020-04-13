<template>
  <section class="Blog">
    <header class="Vlt-grid">
      <div class="Vlt-col">
        <h3>Featured Post</h3>
      </div>
	    <div class="Vlt-grid__separator"></div>
      <Card :post="featured" featured />
      <div class="Vlt-col">
        <div class="Vlt-grid">
          <CommunityUpdatesCard class="Blog-card__community" />
	        <div class="Vlt-grid__separator"></div>
          <div class="Vlt-col Blog-card__slack">
            <a href="https://developer.nexmo.com/community/slack?utm_source=blog&utm_medium=deved&utm_campaign=join-slack-link" class="Vlt-card Blog-card Vlt-card--border-top-blue">
              <div class="Vlt-card__header" style="text-align: center;">
                <h3 class="Vlt-title--icon">
                  <svg><use xlink:href="../node_modules/@vonagevolta/volta2/dist/symbol/volta-brand-icons.svg#Brand-icon-slack-color" /></svg>
                  Join us on the Vonage Developer Community Slack
                </h3>
              </div>
            </a>
          </div>
        </div>
      </div>
    </header>
    <main class="Vlt-grid">
      <div class="Vlt-col">
        <h3>Latest Posts</h3>
      </div>
	    <div class="Vlt-grid__separator"></div>
      <Card v-for="post in posts" :key="post.attributes.title" :post="post" />
    </main>
    <footer class="Vlt-center">
      <NLink to="/archive" class="Vlt-btn Vlt-btn--quaternary">View Older Posts</NLink>
    </footer>
  </section>
</template>

<script>
import CommunityUpdatesCard from '~/components/CommunityUpdatesCard'
import Card from '~/components/Card'
import path from 'path'

export default {
  components: {
    Card,
    CommunityUpdatesCard
  },

  data () {
    const resolve = require.context("~/content/", true, /\.md$/);
    const imports = resolve.keys().map(key => {
      const [, name] = key.match(/\/(.+)\.md$/);
      return resolve(key);
    }).filter(content => content.attributes.published != false);

    imports.sort((a, b) => {
      const aPublishedDate = new Date(a.attributes.published_at);
      const bPublishedDate = new Date(b.attributes.published_at);
      return bPublishedDate - aPublishedDate;
    });

    const featured = imports.shift()

    return {
      featured: featured,
      posts: imports.slice(0,6) // limit to 6 "latest posts"
    };
  },

  head () {
    return {
      title: 'Vonage Developer Blog',
      script: [{ src: 'https://identity.netlify.com/v1/netlify-identity-widget.js' }],
    };
  },
};
</script>