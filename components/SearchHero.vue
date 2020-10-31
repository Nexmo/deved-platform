<template>
  <div class="Blog-hero">
    <div class="Blog-hero__content">
      <h3>
        {{ $t('component_search_hero_title') }}
        <img
          src="../node_modules/@vonagevolta/volta2/images/logos/Vonage-wordmark.svg"
          alt="Vonage"
          class="Logo__inline"
        />
      </h3>
      <form class="Blog-form__block" @submit.prevent="search()">
        <div class="Vlt-form__element Vlt-form__element--big">
          <div class="Vlt-composite">
            <div class="Vlt-composite__wrapper Vlt-input">
              <input
                id="search-input"
                v-model="query"
                type="text"
                :placeholder="$t('component_search_hero_placeholder')"
              />
              <label for="search-input">{{
                $t('component_search_hero_label')
              }}</label>
            </div>
            <div class="Vlt-composite__append">
              <button
                type="submit"
                class="Vlt-btn Vlt-btn--white Vlt-btn--icon Vlt-btn--large"
              >
                <svg>
                  <use
                    xlink:href="../node_modules/@vonagevolta/volta2/dist/symbol/volta-icons.svg#Vlt-icon-search"
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      query: '',
    }
  },

  methods: {
    search() {
      this.$router.push({ path: 'search', query: { query: this.query } })
    },
  },
}
</script>

<style scoped>
.Logo__inline {
  height: 26px;
  vertical-align: middle;
  margin-left: 6px;
}

.Blog-hero {
  background: white
    url('../assets/images/illustrations/Brand-activate-conversations.png')
    no-repeat scroll 12px 24px;
  background-size: 250px;
  width: 100%;
  min-height: 300px;
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
  text-align: center;
  line-height: 1.4;
  margin-bottom: 40px;
  font-size: 1.5em;
  font-weight: normal;
}

.Blog-form__block {
  width: 100%;
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
  .Blog-hero > * {
    transition: all 0.5s ease;
  }

  .Blog-hero {
    background: white;
  }

  .Blog-hero__content {
    width: 90%;
  }
}

@media only screen and (max-width: 495px) {
  .Blog-hero__content h3 {
    line-height: 1.7;
  }

  .Logo__inline {
    height: 36px;
  }
}
</style>
