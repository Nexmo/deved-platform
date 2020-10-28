module.exports = (getPost) => ({
  type: 'input',
  name: 'description',
  message: "What's the description? <max 240 chars>",
  default: ({ post: file }) => {
    if (file) {
      const post = getPost(file)

      return post.title
    } else {
      return ''
    }
  },
})
