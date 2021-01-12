import { getContext, render } from '@ember/test-helpers';

export default async function renderStory(story, args) {
  let testContext = getContext();
  const { context, template } = story(Object.assign({}, story.args, args));
  Object.assign(testContext, context);
  await render(template);
  return context;
}
