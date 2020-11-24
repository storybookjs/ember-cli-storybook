ember-cli-storybook
==============================================================================

📒 Ember storybook adapter


Compatibility
------------------------------------------------------------------------------

* Ember.js v3.16 or above
* Ember CLI v2.13 or above
* Node.js v10 or above


Installation
------------------------------------------------------------------------------

```
ember install @storybook/ember-cli-storybook
```

Usage
------------------------------------------------------------------------------

This will be triggered automatically as a post build action when running `ember build`


> package.json options (defaults)

```json
"storybook": {
  "ignoreTestFiles": true
}
```

Troubleshooting
------------------------------------------------------------------------------

### Components that need routing for query parameters

The Storybook integration for Ember [renders stories into a custom component](https://github.com/storybookjs/storybook/blob/27210146d605e5a8fc630c0a70b7743be61d8f3f/app/ember/src/client/preview/render.js#L31-L34) in a router-less environment. This works for many situations but is insufficient when you have a story that requires query parameters, like a component that persists sorting or pagination information to the URL. There’s no official way to accomplish this as of yet, but you can work around it by dynamically adding a route, visiting it using the [private `startRouting` API](https://api.emberjs.com/ember/3.14/classes/EmberRouter/methods/startRouting?anchor=startRouting&show=inherited%2Cprivate), and injecting a pseudo-controller, such as in this utility function:

```javascript
function injectRoutedController(controllerClass) {
  return on('init', function() {
    let container = getOwner(this);
    container.register('controller:storybook', controllerClass);

    let routerFactory = container.factoryFor('router:main');
    routerFactory.class.map(function() {
      this.route('storybook');
    });

    let router = container.lookup('router:main');
    router.initialURL = 'storybook';
    router.startRouting(true);

    this.set('controller', container.lookup('controller:storybook'));
  });
}
```

Then you can use it in a story like this:

```javascript
export let SortableColumns = () => {
  return {
    template: hbs`
      <ListTable @source={{sortedShortList}} @sortProperty={{controller.sortProperty}} @sortDescending={{controller.sortDescending}} as |t|>
        <t.head>
          <t.sort-by @prop="name">Name</t.sort-by>
          <t.sort-by @prop="lang">Language</t.sort-by>
        </t.head>
        <t.body @key="model.name" as |row|>
          <tr>
            <td>{{row.model.name}}</td>
            <td>{{row.model.lang}}</td>
          </tr>
        </t.body>
      </ListTable>
      `,
    context: {
      injectRoutedController: injectRoutedController(
        Controller.extend({
          queryParams: ['sortProperty', 'sortDescending'],
          sortProperty: 'name',
          sortDescending: false,
        })
      ),

      sortedShortList: computed('controller.sortProperty', 'controller.sortDescending', function() {
        let sorted = productMetadata.sortBy(this.get('controller.sortProperty') || 'name');
        return this.get('controller.sortDescending') ? sorted.reverse() : sorted;
      }),
    },
  };
};
```

### Working with store
As said above, Storybook integration for Ember renders stories into a custom component, that are store-less. 
If your component relies on an Ember model, for example, you can work around with the same way you would do for query params.  

```javascript
function createUser() {
  return on('init', function () {
    this.user = getOwner(this)
      .lookup('service:store')
      .createRecord('user', { lastName: 'Doe', email: 'john.doe@qonto.eu' });
  });
}
```

And then in your story:
```javascript
export const storeExample = () => {
  return {
    template: hbs`
      <SomeComponent
        @model={{this.user}}
        />
    `,
    context: {
      createUser: createUser(),
    },
  };
};
```

### Making Ember import work
Because Ember uses a mapping to resolve import like `@ember/array` or `@ember/object` for example, they may not work in Storybook.
However, and because the module is already declared in the [babel preset for ember](https://github.com/storybookjs/storybook/blob/next/app/ember/src/server/framework-preset-babel-ember.ts#L19), you should be able to make them work by adding 
[babel-plugin-ember-modules-api-polyfill](https://github.com/ember-cli/babel-plugin-ember-modules-api-polyfill) to our `package.json`.

### `preview-head` generation race condition

The `.storybook/preview-head.html` file is auto-generated and changes based on your `config/environment.js` and whether it’s a static or live-updating build of Storybook. This means that you’ll often see version control diffs for it, which can be bothersome.

Since the file is auto-generated, it would be nice to add it to `.gitignore` so it no longer shows up in diffs. Unfortunately, the [documented way](https://github.com/storybookjs/storybook/blob/ada7868f432f43a5787fa1294ddb86c28163b07c/docs/src/pages/guides/guide-ember/index.md#add-storybookember) of starting a live-updating Storybook launches Ember CLI and Storybook in parallel, which means that in many cases, the `preview-head` file will not have been generated by the time Storybook needs it. To work around this if you want to ignore `preview-head`, you could either start Ember CLI and Storybook separately or create a script to launch them in sequence.

### Stories that render blank or distorted

In some situations, components don’t render properly in stories, such as when dynamically-calculated container widths are zero or contents are blank. The cause for this is as-yet unknown, but an unfortunate workaround like this utility class can help in the meantime, by delaying the insertion of the component until the container element has been fully rendered:

```javascript
import EmberObject from '@ember/object';
import { next } from '@ember/runloop';

export default EmberObject.extend({
  init() {
    this._super(...arguments);
    this.set('complete', false);

    next(this, () => {
      this.set('complete', true);
    });
  },
});

```

Here’s an example of it being used in a story:

```javascript
export let Standard = () => {
  return {
    template: hbs`
      <div class="block" style="height:50px; width:200px;">
        {{#if delayedTruth.complete}}
          <DistributionBar @data={{distributionBarData}} />
        {{/if}}
      </div>
      `,
    context: {
      delayedTruth: DelayedTruth.create(),
      distributionBarData: [
        { label: 'one', value: 10 },
        { label: 'two', value: 20 },
      ],
    },
  };
};
```

See the [Contributing](CONTRIBUTING.md) guide for details.

License
------------------------------------------------------------------------------

This project is licensed under the [MIT License](LICENSE.md).
