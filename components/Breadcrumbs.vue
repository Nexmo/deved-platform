<template>
  <ol class="breadcrumb Vlt-margin--A-top1 Vlt-margin--A-bottom2">
    <li itemscope itemtype="http://data-vocabulary.org/Breadcrumb">
      <NLink to="/" itemprop="url">
        <span itemprop="title">Vonage Developer Blog</span>
      </NLink>
    </li>
    <li itemscope itemtype="http://data-vocabulary.org/Breadcrumb" class="current">
      <NLink :to="route" itemprop="url">
        <span itemprop="title">{{ title }}</span>
      </NLink>
    </li>  
  </ol>
</template>

<script>
export default {
  props: {
    title: {
      type: String,
      required: true,
    },
    route: {
      type: String,
      required: true,
    },
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
	content: ' ›› ';
	display: inline;
	font-size: 1.2em;
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