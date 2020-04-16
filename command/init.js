const download = require('download-git-repo')
const fs = require('fs')
const inquirer = require('inquirer')
const ora = require('ora')
const chalk = require('chalk')
const symbols = require('log-symbols')
const { template } = require('../config')

module.exports = function(projectName) {
  const dist_path = projectName
  
  if (!fs.existsSync(dist_path)) {
    inquirer.prompt([
      {
        name: 'author',
        message: 'Author name ?'
      },
      {
        name: 'description',
        message: 'Project description ?'
      },
      {
        name: 'template',
        message: 'Use your custom template ? (a git repository address to use your custom template or empty string to use aidol default template)'
      }

    ]).then(answers => {
       
        const repo = answers.template || template.git
        const spinner = ora('Downloading template, Please wait a moment...')

        spinner.start()

        download(repo, dist_path, { clone: true }, (err) => {
          if (err) {
            spinner.fail()
            console.log(symbols.error, chalk.red(err))
            return
          }

          spinner.succeed()
          console.log(symbols.success, chalk.green(`${projectName} init completed...`))
          console.log(symbols.success, chalk.green(`cd ${projectName}`))
          console.log(symbols.success, chalk.green(`npm install`))
          console.log(symbols.success, chalk.green(`npm run dev`))
        })
      })
  } else {
    console.log(symbols.error, chalk.red(`the project ${projectName} is exist.`))
  }
}