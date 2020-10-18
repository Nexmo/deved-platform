const consola = require("consola")
const inquirer = require("./util/inquirer")

const create = require("./create")
const translate = require("./translate")

consola.info("`Vonage` DevEd Post CLI")
consola.info("by `@lukeocodes`\n")

inquirer
  .prompt([
    {
      type: "list",
      name: "action",
      message: "Would you like to create or translate a blog post?",
      choices: [
        {
          name: "Create a blog post",
          value: "create",
          short: "Create"
        },
        {
          name: "Translate a blog post",
          value: "translate",
          short: "Translate"
        }
      ]
    }
  ])
  .then(answers => {
    if (answers.action === "create") {
      return create()
    }

    if (answers.action === "translate") {
      return translate()
    }
  })
  .catch(error => {
    consola.error(error)
  })


