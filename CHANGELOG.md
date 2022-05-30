# Unreleased

# 0.6.0 (05/23/2022)

- [Updates Ember scenario to have latest LTS version and test against Ember4](https://github.com/storybookjs/ember-cli-storybook/pull/113)
- [Support Storybook on Ember 4.1+](https://github.com/storybookjs/ember-cli-storybook/pull/116)
- [Handle src-less script tags without error](https://github.com/storybookjs/ember-cli-storybook/pull/104)

# 0.5.0 (04/09/2022)

- [feature - enable config overrides](https://github.com/storybookjs/ember-cli-storybook/pull/80)
- [fix: do nothing if no meta found in removeRootURL() ](https://github.com/storybookjs/ember-cli-storybook/pull/98)
- [Maintain type attribute on script tags](https://github.com/storybookjs/ember-cli-storybook/pull/96)

# 0.4.0 (04/09/2021)

- [fixes defaultBlueprint path to point to scoped package path](https://github.com/storybookjs/ember-cli-storybook/pull/57)
- [Makes sure that only URLs that begin with the rootURL get converted to relative paths](https://github.com/storybookjs/ember-cli-storybook/pull/36)

# 0.3.1 (11/27/2020)

- [Restore config key](https://github.com/storybookjs/ember-cli-storybook/pull/54)

# 0.3.0 (11/27/2020)

- [Add renderStory test helper](https://github.com/storybookjs/ember-cli-storybook/pull/51)
- [Bump ember-cli-update to 3.20.2](https://github.com/storybookjs/ember-cli-storybook/pull/50)

# 0.2.1 (03/28/2020)

- [Add defaultBlueprint declaration to package.json](https://github.com/storybookjs/ember-cli-storybook/pull/27)

# 0.2.0 (12/06/2019)

- [Auto doc generation from YUI doc comments](https://github.com/storybookjs/ember-cli-storybook/pull/24)

# 0.1.1 (02/05/2019)

- [Fix rootUrl path replace](https://github.com/storybookjs/ember-cli-storybook/pull/13)

# 0.1.0 (02/05/2019)

- [enables blueprints](https://github.com/storybooks/ember-cli-storybook/pull/3)

# 0.0.1 (10/26/2018)

- Ensures dist is available by using outputReady instead of postBuild
- Bring in all meta tags that are in output (that have an id)
- Allows parse to accept multiple selectors per block
- By default ignores all test related files, can be toggled with package.json settings

# 0.0.0 (10/24/2018)

- basic functionality for creating a `preview-head.html` and `.env` work for static builds and serve builds, that acknowledge live reload capabilities of ember serve
