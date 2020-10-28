import moment from 'moment'
import { data } from './data'

/**
 * Return the routes generated from the attributes of a post, including
 *   dated archive routes and the post route itself.
 *
 * @param {object} postAttr Object containing the attributes of a post
 *
 * @return {array}
 */
export const getPostRoutes = (postAttr) => {
  const postDate = moment(postAttr.published_at)

  return [
    `/${postAttr.type}/${postDate.format('YYYY/MM/DD')}`,
    `/${postAttr.type}/${postDate.format('YYYY/MM')}`,
    `/${postAttr.type}/${postDate.format('YYYY')}`,
  ]
}

export const getPostRoute = (postAttr) => {
  const postDate = moment(postAttr.published_at)

  return `/${postAttr.type}/${postDate.format('YYYY/MM/DD')}/${postAttr.slug}`
}

export const getCategory = (slug) => {
  const meta = data()

  return meta.categories.find((c) => c.slug === slug)
}
