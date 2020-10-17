const consola = require("consola")
const inquirer = require("inquirer")

const create = require("./create")

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
        }
      ]
    }
  ])
  .then(answers => {
    if (answers.action === "create") {
      return create()
    }
  })
  .catch(error => {
    consola.error(error)
  })


