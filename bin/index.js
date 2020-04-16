#!/usr/bin/env node
const program = require('commander')
const { version } = require('../package.json')
const init = require('../command/init')

program.version(version, '-v, --version')
       .command('init <name>')
       .action( projectName => {
          init(projectName)
       })

program.parse(process.argv)
