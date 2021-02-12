<template>
  <div class="max-w-screen-xl px-4 mx-auto sm:px-6 lg:px-8">
    <div class="flex flex-col grid-cols-9 mx-auto md:grid text-blue-50">
      <template v-for="(date, index) in datesWithEpisodes">
        <DevtvLeft
          v-if="evenNumber(index)"
          :key="index"
          :date="date"
          :episodes="episodesByDate(date)"
        />
        <DevtvRight
          v-else
          :key="index"
          :date="date"
          :episodes="episodesByDate(date)"
        />
      </template>
    </div>
  </div>
</template>

<script>
const getDates = () => {
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  const dateArray = Array.from(Array(12).keys())

  dateArray.forEach((value, index, arr) => {
    arr[index] = new Date(today.setDate(today.getDate() + 1))
  })

  return dateArray
}

export default {
  async asyncData({ $content }) {
    const dates = getDates()
    const episodes = await $content(`shows/episodes`)
      // .where({
      //   date: { $gte: dates[0] },
      // })
      .sortBy('date', 'asc')
      .fetch()

    return {
      episodes,
      dates,
    }
  },

  computed: {
    datesWithEpisodes() {
      return this.dates.filter((date) => {
        return this.episodesByDate(date).length > 0
      })
    },
  },

  methods: {
    evenNumber(number) {
      return number % 2 === 0
    },

    episodesByDate(date) {
      const episodes = this.episodes.filter((episode) => {
        const thisDate = new Date(date)
        const episodeDate = new Date(episode.date)

        return thisDate.toDateString() === episodeDate.toDateString()
      })

      return episodes
    },
  },
}
</script>
