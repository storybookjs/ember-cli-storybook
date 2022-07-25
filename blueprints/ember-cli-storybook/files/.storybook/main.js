module.exports = {
  stories: [
    "../stories/**/*.stories.mdx",
    "../stories/**/*.stories.@(js|jsx|ts|tsx)",
  ],
  addons: ["@storybook/addon-links", "@storybook/addon-essentials"],
  features: {
    postcss: false,
  },
  framework: "@storybook/ember",
  core: {
    builder: "@storybook/builder-webpack4",
  },
};
