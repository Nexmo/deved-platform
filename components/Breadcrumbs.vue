<template>
  <ol class="breadcrumb Vlt-margin--A-top1 Vlt-margin--A-bottom2" vocab="http://schema.org/" typeof="BreadcrumbList">
    <li property="itemListElement" typeof="ListItem">
      <NLink property="item" typeof="WebPage" to="/">
        <span property="name">Vonage Developer Blog</span>
      </NLink>
      <meta property="position" content="1">
    </li>
    <li v-for="(route, index) in routes" :key="route.route" property="itemListElement" typeof="ListItem" :class="route.current ? 'current' : ''">
      <NLink property="item" typeof="WebPage" :to="route.route">
        <span property="name">{{ route.title }}</span>
      </NLink>
      <meta property="position" :content="index + 2">
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