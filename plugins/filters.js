import Vue from 'vue'

Vue.filter('truncate', function (text, length, suffix) {
  if (text && text.length > length) {
    return text.substring(0, length) + suffix
  } else {
    return text
  }
})

Vue.filter('dateParse', (dateString) => {
  return new Date(dateString)
})

Vue.filter('dateFormat', (dateObject, options) => {
  return new Intl.DateTimeFormat('default', options).format(dateObject)
})
