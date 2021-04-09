'use strict';

const fs = require('fs');
const path = require('path');
const YUIDocsGenerator = require('ember-cli-addon-docs-yuidoc/lib/broccoli/generator');
const Funnel = require('broccoli-funnel');
const mergeTrees = require('broccoli-merge-trees');
const { parse, generatePreviewHead } = require('./util');

module.exports = {
  name: require('./package').name,

  configKey: 'ember-cli-storybook',

  _getOptions() {
    let addonOptions =
      (this.parent && this.parent.options) ||
      (this.app && this.app.options) ||
      {};
    return addonOptions[this.configKey] || {};
  },

  included(app) {
    this._super.included.apply(this, arguments);

    // see: https://github.com/ember-cli/ember-cli/issues/3718
    if (typeof app.import !== 'function' && app.app) {
      app = app.app;
    }

    this.app = app;
  },

  postprocessTree(type, appTree) {
    this._super.postprocessTree.apply(this, arguments);
    let options = this._getOptions();

    let componentFilePathPatterns = options.componentFilePathPatterns || [
      'app/components/*.js',
      'lib/**/addon/components/*.js',
      'addon/components/*.js',
    ];

    if (type !== 'all' || !options.enableAddonDocsIntegration) {
      return appTree;
    }

    let componentJS = new Funnel('.', {
      include: componentFilePathPatterns,
    });
    let componentDocsTree = new YUIDocsGenerator([componentJS], {
      project: this.project,
      destDir: 'storybook-docgen',
      packages: [this.project.name()],
    });

    return mergeTrees([appTree, componentDocsTree]);
  },

  outputReady: function (result) {
    if (!this.app) {
      // You will need ember-cli >= 1.13 to use ember-cli-deploy's postBuild integration.
      // This is because prior to 1.13, `this.app` is not available in the outputReady hook.
      this.ui.writeErrorLine('please upgrade to ember-cli >= 1.13')
      return;
    }

    const { name } = this.app;
    const { storybook = {} } = this.app.project.pkg;
    const { ignoreTestFiles = true } = storybook;

    const distFilePath = path.resolve(result.directory, 'index.html');
    const testFilePath = path.resolve(result.directory, 'tests/index.html');
    const previewHeadFilePath = path.resolve(
      process.cwd(),
      '.storybook/preview-head.html'
    );
    const previewHeadDirectory = path.dirname(previewHeadFilePath);
    const envFilePath = path.resolve(process.cwd(), '.env');

    let fileContents = '';

    this.ui.writeDebugLine('Generating files needed by Storybook');

    if (fs.existsSync(testFilePath)) {
      fileContents = fs.readFileSync(testFilePath);

      this.ui.writeDebugLine(`Parsing ${testFilePath}`);
    } else {
      fileContents = fs.readFileSync(distFilePath);

      this.ui.writeDebugLine(`Parsing ${distFilePath}`);
    }

    const parsedConfig = parse(fileContents, ignoreTestFiles);

    this.ui.writeDebugLine('Generating preview-head.html');

    const previewHead = generatePreviewHead(parsedConfig);

    this.ui.writeDebugLine('Generating files needed by Storybook');

    fs.mkdirSync(previewHeadDirectory, { recursive: true });
    fs.writeFileSync(previewHeadFilePath, previewHead);

    this.ui.writeDebugLine('Generating .env');

    if (fs.existsSync(path.resolve(process.cwd(), '.env'))) {
      let fileContent = fs.readFileSync(envFilePath, 'utf8');

      if (fileContent.indexOf('STORYBOOK_NAME') === -1) {
        fileContent += `\nSTORYBOOK_NAME=${name}`;

        fs.writeFileSync(envFilePath, fileContent);
      }
    } else {
      fs.writeFileSync(envFilePath, `STORYBOOK_NAME=${name}`);
    }
  },
};
