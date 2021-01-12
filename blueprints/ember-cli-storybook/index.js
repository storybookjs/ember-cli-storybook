module.export = {
  normalizeEntityName() {},

  afterInstall() {
    return this.addPackagesToProject([
      { name: '@storybook/ember' },
      { name: '@babel/core' },
      { name: 'babel-loader@next' },
    ]);
  },
};
