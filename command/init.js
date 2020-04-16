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
        name: 'name',
        message: 'Project name ?'
      },
      {
        name: 'description',
        message: 'Project description ?'
      },
      {
        name: 'template',
        message: 'Use aidol default template ? (A git repository address to use your custom template or a empty string to use aidol default template)'
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

          const pck = `${projectName}/package.json`
          
          const meta = {
            name: answers.name || 'aidol',
            author: answers.author || 'elenh',
            description: answers.description || 'A personal blog based on aidol.'
          }
          
          if (fs.existsSync(pck)){
            const pck_str = fs.readFileSync(pck).toString()
            const pck_json = JSON.parse(pck_str)
            
            pck_json.name = meta.name
            pck_json.description = meta.description
            pck_json.author = meta.author

            fs.writeFileSync(pck, JSON.stringify(pck_json))
          }

          spinner.succeed()
          console.log(symbols.success, chalk.green(`${projectName} init completed...`))
          
          if (!answers.template) {
            console.log(symbols.success, chalk.green(`cd ${projectName}`))
            console.log(symbols.success, chalk.green(`npm install`))
            console.log(symbols.success, chalk.green(`npm run dev`))
          }
        })
      })
  } else {
    console.log(symbols.error, chalk.red(`the project [${projectName}] is exist.`))
  }
}