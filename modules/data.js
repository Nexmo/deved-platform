import { resolve } from "path"
import config from "./config"
import defu from "defu"
import glob from "glob"

/**
 * Default options for processing a file.
 */
const options = defu(
  {
    charType: "utf8",
    metaGlob: "*.json",
    dir: "content",
    contentGlob: "**/*.md"
  },
  config
)

/**
 * Finds files using the meta glob and returns processed objects.
 * 
 * @param {object} options Options to use when finding files to process.
 * @see _process
 *
 * @return {object} The returns the processed files.
 */
export const data = () => {
  options.dir = resolve(options.dir)

  const paths = glob.sync(options.metaGlob, { cwd: options.dir })
  const objects = {}

  paths.forEach(path => {
    const data = require(resolve(options.dir, path))

    Object.keys(data).forEach(key => {
      objects[key] = data[key]
    })
  })

  return objects
}