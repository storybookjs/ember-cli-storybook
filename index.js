'use strict';

const fs = require('fs');
const path = require('path');
const Funnel = require('broccoli-funnel');
const { parse, generatePreviewHead, overrideEnvironment, findEnvironment } = require('./lib/util');

let YUIDocsGenerator;

module.exports = {
  name: require('./package').name,

  configKey: 'ember-cli-storybook',

  _getOptions() {
    let addonOptions = (this.parent && this.parent.options) || (this.app && this.app.options) || {};
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

  postprocessTree(type, tree) {
    if (type !== 'all') {
      return tree;
    }

    return this._prerenderTree(tree);
  },

  /**
   * This function is *not* called by ember-cli directly, but supposed to be imported by an app to wrap the app's
   * tree, to add the prerendered HTML files. This workaround is currently needed for Embroider-based builds that
   * don't support the `postprocessTree('all', tree)` hook used here.
   */
  prerender(app, tree) {
    let storybookAddon = app.project.addons.find(
      ({ name }) => name === '@storybook/ember-cli-storybook'
    );

    if (!storybookAddon) {
      throw new Error(
        "Could not find initialized ember-cli-storybook addon. It must be part of your app's dependencies!"
      );
    }

    return storybookAddon._prerenderTree(tree);
  },

  _prerenderTree(tree) {
    let options = this._getOptions();
    if (!options.enableAddonDocsIntegration) {
      return tree;
    }

    let componentFilePathPatterns = options.componentFilePathPatterns || [
      'app/components/*.js',
      'lib/**/addon/components/*.js',
      'addon/components/*.js',
    ];

    let componentJS = new Funnel('.', {
      include: componentFilePathPatterns,
    });

    if (!YUIDocsGenerator) {
      YUIDocsGenerator = require('ember-cli-addon-docs-yuidoc/lib/broccoli/generator');
    }

    let componentDocsTree = new YUIDocsGenerator([componentJS], {
      project: this.project,
      destDir: 'storybook-docgen',
      packages: [ this.project.name() ]
    });

    let Merge = require('broccoli-merge-trees');

    return new Merge(
      [
        tree,
        componentDocsTree,
      ],
      {
        overwrite: true,
      }
    );
  },

  outputReady: function(result) {
    if (!this.app) {
      // You will need ember-cli >= 1.13 to use ember-cli-deploy's postBuild integration.
      // This is because prior to 1.13, `this.app` is not available in the outputReady hook.
      this.ui.writeErrorLine('please upgrade to ember-cli >= 1.13')
      return;
    }

    const { name } = this.app;
    const { storybook={} } = this.app.project.pkg;
    const { ignoreTestFiles=true, config={ 'link': [] } } = storybook;

    const distFilePath = path.resolve(result.directory, 'index.html');
    const testFilePath = path.resolve(result.directory, 'tests/index.html');
    const previewHeadFilePath = path.resolve(process.cwd(), '.storybook/preview-head.html');
    const previewHeadDirectory = path.dirname(previewHeadFilePath);
    const envFilePath = path.resolve(process.cwd(), '.env');
    const environmentOverridePath = path.resolve(process.cwd(), '.storybook/environment.js');

    let fileContents = '';

    this.ui.writeDebugLine('Generating files needed by Storybook');

    if(fs.existsSync(testFilePath)) {
      fileContents = fs.readFileSync(testFilePath);

      this.ui.writeDebugLine(`Parsing ${testFilePath}`);
    } else {
      fileContents = fs.readFileSync(distFilePath);

      this.ui.writeDebugLine(`Parsing ${distFilePath}`);
    }

    const parsedConfig = parse(fileContents, ignoreTestFiles);

    this.ui.writeDebugLine('Generating preview-head.html');

    const environment = findEnvironment(parsedConfig);

    if (environment) {
      // When rootURL is anything other than "/" routing can't be started without erroring, so
      // this is a sensible default.
      const defaultOverride = { rootURL: '/' };

      // Allow arbitrary overriding in the storybook environment
      const environmentOverride = fs.existsSync(environmentOverridePath) && require(environmentOverridePath)(process.env);

      // Apply overrides to the environment meta node
      environment.content = overrideEnvironment(environment, defaultOverride, environmentOverride);
    }

    if(config) {
      this.ui.writeDebugLine('Setting up overrides.');

      for(const key in config) {
        if(!parsedConfig[key]) {
          parsedConfig[key] = []
        }

        parsedConfig[key] = parsedConfig[key].concat(config[key])
      }
    }

    const previewHead = generatePreviewHead(parsedConfig);

    this.ui.writeDebugLine('Generating files needed by Storybook');

    fs.mkdirSync(previewHeadDirectory, { recursive: true });
    fs.writeFileSync(previewHeadFilePath, previewHead);

    this.ui.writeDebugLine('Generating .env');

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
