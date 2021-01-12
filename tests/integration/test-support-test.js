import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { renderStory } from '@storybook/ember-cli-storybook/test-support';
import { hbs } from 'ember-cli-htmlbars';

function storyFn(args) {
  return {
    template: hbs`
    <h1>Story Time</h1>
    <p>
      Hello Friends, I have {{this.count}} {{this.name}} {{this.emoji}}
    </p>
    `,
    context: {
      count: '2',
      name: 'pickles',
      emoji: '🥒',
      ...args,
    },
  };
}

const storyFnWithArgs = storyFn.bind({});
storyFnWithArgs.args = {
  count: '10',
};

module('Integration | Test Support', function (hooks) {
  setupRenderingTest(hooks);

  test('render story function', async function (assert) {
    await renderStory(storyFn);

    assert.dom().includesText('2 pickles 🥒');
  });

  test('render story function with args', async function (assert) {
    await renderStory(storyFnWithArgs);

    assert.dom().includesText('10 pickles 🥒');
  });

  test('passing additional args', async function (assert) {
    await renderStory(storyFn, {
      name: 'apples',
      emoji: '🍎',
    });

    assert.dom().includesText('2 apples 🍎');
  });
});
