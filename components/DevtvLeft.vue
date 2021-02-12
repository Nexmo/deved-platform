<template>
  <fragment>
    <!-- left date -->
    <div class="flex flex-row-reverse md:contents">
      <div class="col-start-1 col-end-5 ml-0 mr-auto md:mr-0 md:ml-auto">
        <p
          class="pt-4 text-sm font-bold leading-tight text-justify text-gray-400"
        >
          {{
            date | dateParse | dateFormat({ day: 'numeric', month: 'short' })
          }}
        </p>
      </div>
      <DevtvLine no-dot />
    </div>
    <!-- left -->
    <div
      v-for="(episode, index) in episodes"
      :key="index"
      class="flex flex-row-reverse md:contents"
    >
      <div class="col-start-1 col-end-5 ml-0 mr-auto md:mr-0 md:ml-auto">
        <CardDevtv :episode="episode" />
      </div>
      <DevtvLine />
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
