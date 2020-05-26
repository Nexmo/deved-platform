<template>
  <ol class="breadcrumb Vlt-margin--A-top1 Vlt-margin--A-bottom2">
    <li itemscope itemtype="http://data-vocabulary.org/Breadcrumb">
      <NLink to="/" itemprop="url">
        <span itemprop="title">Vonage Developer Blog</span>
      </NLink>
    </li>
    <li v-for="route in routes" :key="route.route" itemscope itemtype="http://data-vocabulary.org/Breadcrumb" :class="route.current ? 'current' : ''">
      <NLink :to="route.route" itemprop="url">
        <span itemprop="title">{{ route.title }}</span>
      </NLink>
    </li>  
  </ol>
</template>

<script>
export default {
  props: {
    routes: {
      type: Array,
      required: true,
      // validator: function(array) {
      //   array.forEach(item => {
      //     return 'title' in item && 'route' in item
      //   })
      // }
    }
  },
}
</script>

<style scoped>
ol {
	list-style: none;
}

li {
  display: inline;
}

li:after {
	content: ' » ';
	display: inline;
	font-size: 0.9em;
	color: #AAA;
	
	padding: 0 .0725em 0 .15em;
}

li:last-child:after {
	content: '';
}

li a {
  color: black
}

li.current a {
  color: grey
}

span {
  text-transform: capitalize;
}
</style>