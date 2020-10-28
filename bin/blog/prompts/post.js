module.exports = (posts) => ({
  type: 'autocomplete',
  name: 'post',
  message: 'What post would you like to translate?',
  source: (answers, input) => {
    let opts = posts.find({})

    if (input !== undefined && input !== '') {
      opts = posts.find({
        $or: [
          {
            title: { $regex: [input, 'i'] },
          },
          {
            file: { $regex: [input, 'i'] },
          },
        ],
      })
    }

    return opts.map((o) => ({ name: o.title, value: o.file }))
  },
})
