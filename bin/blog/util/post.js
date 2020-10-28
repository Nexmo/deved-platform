module.exports = (data) => ({
  title: data.title,
  description: data.description,
  author: data.author,
  comments: data.comments,
  category: data.category,
  spotlight: data.spotlight,
  thumbnail: data.thumbnail || 'tbc',
  published: data.published || true,
  published_at: data.published_at || new Date().toISOString(),
  tags: data.tags || ['your', 'tags', 'here'],
})
