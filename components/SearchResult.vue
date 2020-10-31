<template>
  <li>
    <NLink :to="item.path" class="inner">
      <div class="li-img">
        <img :src="item.image" :alt="item.title" />
      </div>
      <div class="li-text">
        <p class="li-meta">{{ meta | truncate(60, '...') }}</p>
        <h3 class="li-head Vlt-text-link">{{ title | truncate(60, '...') }}</h3>
        <div class="li-sub">
          <p>{{ item.description | truncate(120, '...') }}</p>
        </div>
      </div>
    </NLink>
  </li>
</template>

<script>
import config from '~/modules/config'

export default {
  props: {
    item: {
      type: Object,
      required: true,
    },
  },

  computed: {
    title() {
      return this.item.title.replace(
        `${config.baseSplitter}${config.baseTitle}`,
        ''
      )
    },

    meta() {
      const path = this.item.path.replace(/^\/+|\/+$/g, '')
      const dateExp = /\d{4}\/\d{2}\/\d{2}/
      const pathDateMatch = path.match(new RegExp(dateExp.source))

      let split = '/'

      if (pathDateMatch) {
        split = new RegExp(`/(${dateExp.source})/`)
      }

      return `${path.split(split).join(' » ')}`
    },
  },
}
</script>

<style scoped>
.img-list a {
  text-decoration: none;
}

.li-sub p {
  margin: 0;
}

li {
  display: table;
  border-collapse: collapse;
  width: 100%;
  margin-bottom: 32px;
}

.inner {
  display: table-row;
  overflow: hidden;
}

.li-img {
  display: table-cell;
  vertical-align: middle;
  width: 30%;
  padding-right: 1em;
}

.li-img img {
  display: block;
  width: 100%;
  height: auto;
}

.li-text {
  display: table-cell;
  vertical-align: middle;
  width: 70%;
}

.li-head {
  margin: 10px 0 0 0;
}

.li-meta {
  margin: 0;
  color: #2d966f;
}

.li-sub {
  margin: 0;
}

@media all and (min-width: 45em) {
  .list li {
    float: left;
    width: 50%;
  }
}

@media all and (min-width: 75em) {
  .list li {
    width: 33.33333%;
  }
}

/* for flexbox */
@supports (display: flex) {
  .list {
    display: flex;
    flex-wrap: wrap;
  }

  .li-img,
  .li-text,
  .list li {
    display: block;
    float: none;
  }

  .li-img {
    align-self: center; /* to match the middle alignment of the original */
  }

  .inner {
    display: flex;
  }
}

/* for grid */
@supports (display: grid) {
  .list {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(400px, 1fr));
  }

  .list li {
    width: auto; /* this overrides the media queries */
  }
}

h3 {
  font-size: 16px;
  line-height: 1.3;
  padding: 0px 0px 3px 0px;
  margin: 0px;
  max-width: 500px;
}
</style>
