const fs = require("fs")
const logger = require("consola")

const defaults = {
  path: "/output.json",
  items: () => {},
}

export default function (moduleOptions) {
  const options = Object.assign(
    defaults,
    this.options.jsonOutput,
    moduleOptions
  )

  this.nuxt.hook("generate:done", async () => {
    logger.info("Generating json output")

    try {
      fs.writeFileSync(`./dist${options.path}`, JSON.stringify(options.items()))
      logger.success("Generated", options.path)
    } catch (err) {
      logger.warn("Failed to generate", options.path)
      console.err(err)
    }
  })
}
