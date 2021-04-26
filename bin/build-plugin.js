const path = require('path')
const fs = require('fs')
const homedir = require('os').homedir()
const cwd = process.cwd()

const SOURCE_PATH = path.join(cwd, 'build','main.js')
const MANIFEST_PATH = path.join(cwd, 'manifest.json')
const STYLES_PATH = path.join(cwd, 'src', 'styles','index.css')

const PLUGIN_DIR_NAME = 'obsidian-google-docs-share'
const VAULT_FOLDER = path.join(homedir, 'Documents', 'Obsidian', 'obsidian', '.obsidian', 'plugins')

const DESTINATION_FOLDER = path.join(VAULT_FOLDER, PLUGIN_DIR_NAME)

fs.existsSync(DESTINATION_FOLDER) || fs.mkdirSync(DESTINATION_FOLDER)

fs.copyFileSync(SOURCE_PATH, path.join(DESTINATION_FOLDER, 'main.js'))
fs.copyFileSync(MANIFEST_PATH, path.join(DESTINATION_FOLDER, 'manifest.json'))
fs.copyFileSync(STYLES_PATH, path.join(DESTINATION_FOLDER, 'styles.css'))
