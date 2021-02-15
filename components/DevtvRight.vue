<template>
  <fragment>
    <!-- right date -->
    <div class="flex md:contents">
      <DevtvLine no-dot />
      <div class="col-start-6 col-end-10 mr-auto">
        <p
          class="pt-4 text-sm font-bold leading-tight text-justify text-gray-400"
        >
          {{
            date | dateParse | dateFormat({ day: 'numeric', month: 'short' })
          }}
        </p>
      </div>
    </div>
    <!-- right -->
    <div
      v-for="(episode, index) in episodes"
      :key="index"
      class="flex md:contents"
    >
      <DevtvLine />
      <div class="col-start-6 col-end-10 mr-auto">
        <CardDevtvEpisode :episode="episode" />
      </div>
    </div>
  </fragment>
</template>

<script>
export default {
  props: {
    date: {
      type: Date,
      required: true,
    },
    episodes: {
      type: Array,
      required: true,
    },
  },
}
</script>
