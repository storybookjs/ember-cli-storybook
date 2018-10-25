'use strict';

const fs = require('fs');
const path = require('path');

const { parse, generatePreviewHead } = require('./util');

module.exports = {
  name: 'ember-cli-storybook',

  postBuild: function() {
    const { name } = require(path.resolve(process.cwd(), 'package.json'));

    const distFilePath = path.resolve(process.cwd(), 'dist/index.html');
    const testFilePath = path.resolve(process.cwd(), 'dist/tests/index.html');
    const previewHeadFilePath = path.resolve(process.cwd(), '.storybook/preview-head.html');
    const envFilePath = path.resolve(process.cwd(), '.env');

    let fileContents = '';

    this.ui.writeLine('Generating files needed by Storybook');

    if(fs.existsSync(testFilePath)) {
      fileContents = fs.readFileSync(testFilePath);

      this.ui.writeLine('Parsing dist/tests/index.html');
    } else {
      fileContents = fs.readFileSync(distFilePath);

      this.ui.writeLine('Parsing dist/index.html');
    }

    const parsedConfig = parse(fileContents);

    this.ui.writeLine('Generating preview-head.html');

    const previewHead = generatePreviewHead(parsedConfig);

    this.ui.writeLine('Generating files needed by Storybook');

    fs.writeFileSync(previewHeadFilePath, previewHead)

    this.ui.writeLine('Generating .env');

    if(fs.existsSync(path.resolve(process.cwd(), '.env'))) {
      let fileContent = fs.readFileSync(envFilePath, 'utf8');

      if(fileContent.indexOf('STORYBOOK_NAME') === -1) {
        fileContent += `\nSTORYBOOK_NAME=${name}`;

        fs.writeFileSync(envFilePath, fileContent)
      }
    } else {
      fs.writeFileSync(envFilePath, `STORYBOOK_NAME=${name}`)
    }
  }
};
