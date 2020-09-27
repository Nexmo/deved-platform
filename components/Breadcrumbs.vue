<template>
  <ol class="breadcrumb Vlt-margin--A-top1 Vlt-margin--A-bottom2" vocab="http://schema.org/" typeof="BreadcrumbList">
    <li property="itemListElement" typeof="ListItem">
      <NLink property="item" typeof="WebPage" :to="localePath('index')">
        <span property="name">Vonage Learn</span>
      </NLink>
      <meta property="position" content="1">
    </li>
    <li v-for="(route, index) in allRoutes" :key="route.route" property="itemListElement" typeof="ListItem">
      <NLink property="item" typeof="WebPage" :to="localePath(route.route)">
        <span property="name">{{ route.title }}</span>
      </NLink>
      <meta property="position" :content="index + 2">
    </li>  
    <li vproperty="itemListElement" typeof="ListItem" class="current">
      <a property="item" typeof="WebPage" href="#">
        <span property="name">{{ currentRoute.title | truncate(40, '...') }}</span>
      </a>
      <meta property="position" :content="allRoutes.length + 1">
    </li>  
  </ol>
</template>

<script>
export default {
  props: {
    routes: {
      type: Array,
      required: true
    }
  },

  computed: {
    allRoutes() {
      return this.routes.filter(r => !r.current)
    },
    currentRoute() {
      return this.routes.filter(r => !!r.current)[0]
    }
  }
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
</style>