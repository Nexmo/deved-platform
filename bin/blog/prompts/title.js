module.exports = (getPost) => ({
  type: 'input',
  name: 'title',
  message: "What's the title for this post? <max 70 chars>",
  default: ({ post: file }) => {
    if (file) {
      const post = getPost(file)

      return post.title
    } else {
      return ''
    }
  },
})
