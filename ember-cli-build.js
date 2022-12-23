'use strict';

const EmberAddon = require('ember-cli/lib/broccoli/ember-addon');

module.exports = function(defaults) {
  let app = new EmberAddon(defaults, {
    // Add options here
  });

  const { maybeEmbroider } = require('@embroider/test-setup');
  const appTree = maybeEmbroider(app);
  
  if ('@embroider/core' in app.dependencies()) {
    return require('./index').prerender(app, appTree);
  } else {
    return appTree;
  }
};
