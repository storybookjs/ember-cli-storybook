const fs = require('fs');
const path = require('path');
const {
  generatePreviewHead,
  objectToHTMLAttributes,
  findEnvironment,
  overrideEnvironment,
  extendEnvironment,
  parse
} = require('../lib/util');

describe('util', () => {
  describe('objectToHTMLAttributes', () => {
    it('should be able to turn object into html attributes', () => {
      expect.assertions(1);
  
      expect(objectToHTMLAttributes({
  src: 'http://foo.com/?hi',
  rel: 'stylesheet' })).
toMatchInlineSnapshot(`"src=\\"http://foo.com/?hi\\" rel=\\"stylesheet\\""`);
    });
  });

  describe('@parse', () => {
    it('should be able to parse built html file', () => {
      expect.assertions(1);
  
      const fileContent = fs.readFileSync(path.resolve(__dirname, 'fixtures', 'build.html'), 'utf8');
  
      expect(parse(fileContent)).toMatchInlineSnapshot(`
Object {
  "link": Array [
    Object {
      "href": "./assets/vendor.css",
      "rel": "stylesheet",
    },
    Object {
      "href": "./assets/storybook-ember-3-1.css",
      "rel": "stylesheet",
    },
    Object {
      "href": "./assets/test-support.css",
      "rel": "stylesheet",
    },
  ],
  "meta": Array [
    Object {
      "content": "%7B%22modulePrefix%22%3A%22storybook-ember-3-1%22%2C%22environment%22%3A%22test%22%2C%22rootURL%22%3A%22/%22%2C%22locationType%22%3A%22none%22%2C%22EmberENV%22%3A%7B%22FEATURES%22%3A%7B%7D%2C%22EXTEND_PROTOTYPES%22%3A%7B%22Date%22%3Afalse%7D%7D%2C%22APP%22%3A%7B%22LOG_ACTIVE_GENERATION%22%3Afalse%2C%22LOG_VIEW_LOOKUPS%22%3Afalse%2C%22rootElement%22%3A%22%23ember-testing%22%2C%22autoboot%22%3Afalse%2C%22name%22%3A%22storybook-ember-3-1%22%2C%22version%22%3A%220.0.0+eebe77e5%22%7D%2C%22exportApplicationGlobal%22%3Atrue%7D",
      "name": "storybook-ember-3-1/config/environment",
    },
  ],
  "script": Array [
    Object {
      "src": "./testem.js",
    },
    Object {
      "src": "./assets/vendor.js",
    },
    Object {
      "src": "./assets/test-support.js",
    },
    Object {
      "src": "./assets/storybook-ember-3-1.js",
    },
    Object {
      "src": "./assets/tests.js",
    },
    Object {
      "src": "./assets/component.js",
      "type": "module",
    },
  ],
}
`);
    });
  
  
    it('should strip rootURL found in config href and src attributes', () => {
      expect.assertions(1);
  
      const fileContent = fs.readFileSync(path.resolve(__dirname, 'fixtures', 'root-url.html'), 'utf8');
  
      expect(parse(fileContent)).toMatchInlineSnapshot(`
Object {
  "link": Array [
    Object {
      "href": "./assets/vendor.css",
      "rel": "stylesheet",
    },
    Object {
      "href": "./assets/vault.css",
      "rel": "stylesheet",
    },
    Object {
      "href": "./favicon.png",
      "rel": "icon",
    },
    Object {
      "href": "http://example.com/external/style.css",
      "rel": "stylesheet",
    },
  ],
  "meta": Array [
    Object {
      "content": "%7B%22modulePrefix%22%3A%22vault%22%2C%22environment%22%3A%22development%22%2C%22rootURL%22%3A%22/ui/%22%2C%22locationType%22%3A%22auto%22%2C%22EmberENV%22%3A%7B%22FEATURES%22%3A%7B%7D%2C%22EXTEND_PROTOTYPES%22%3A%7B%22Date%22%3Afalse%7D%7D%2C%22APP%22%3A%7B%22POLLING_URLS%22%3A%5B%22sys/health%22%2C%22sys/replication/status%22%2C%22sys/seal-status%22%5D%2C%22NAMESPACE_ROOT_URLS%22%3A%5B%22sys/health%22%2C%22sys/seal-status%22%2C%22sys/license/features%22%5D%2C%22DEFAULT_PAGE_SIZE%22%3A15%2C%22LOG_TRANSITIONS%22%3Atrue%7D%2C%22flashMessageDefaults%22%3A%7B%22timeout%22%3A7000%2C%22sticky%22%3Afalse%2C%22preventDuplicates%22%3Atrue%7D%2C%22contentSecurityPolicyHeader%22%3A%22Content-Security-Policy%22%2C%22contentSecurityPolicyMeta%22%3Atrue%2C%22contentSecurityPolicy%22%3A%7B%22connect-src%22%3A%5B%22%27self%27%22%5D%2C%22img-src%22%3A%5B%22%27self%27%22%2C%22data%3A%22%5D%2C%22form-action%22%3A%5B%22%27none%27%22%5D%2C%22script-src%22%3A%5B%22%27self%27%22%5D%2C%22style-src%22%3A%5B%22%27unsafe-inline%27%22%2C%22%27self%27%22%5D%2C%22default-src%22%3A%5B%22%27none%27%22%5D%2C%22font-src%22%3A%5B%22%27self%27%22%5D%2C%22media-src%22%3A%5B%22%27self%27%22%5D%7D%2C%22emberData%22%3A%7B%22enableRecordDataRFCBuild%22%3Afalse%7D%2C%22exportApplicationGlobal%22%3Atrue%7D",
      "name": "vault/config/environment",
    },
  ],
  "script": Array [
    Object {
      "src": "./assets/vendor.js",
    },
    Object {
      "src": "./assets/vault.js",
    },
    Object {
      "src": "http://example.com/external/script.js",
    },
    Object {
      "src": "./ember-cli-live-reload.js",
      "type": "text/javascript",
    },
  ],
}
`);
    });
  
    it('should be able to parse built html file and strip out test related files', () => {
      expect.assertions(1);
  
      const fileContent = fs.readFileSync(path.resolve(__dirname, 'fixtures', 'build.html'), 'utf8');
  
      expect(parse(fileContent, true)).toMatchInlineSnapshot(`
Object {
  "link": Array [
    Object {
      "href": "./assets/vendor.css",
      "rel": "stylesheet",
    },
    Object {
      "href": "./assets/storybook-ember-3-1.css",
      "rel": "stylesheet",
    },
  ],
  "meta": Array [
    Object {
      "content": "%7B%22modulePrefix%22%3A%22storybook-ember-3-1%22%2C%22environment%22%3A%22test%22%2C%22rootURL%22%3A%22/%22%2C%22locationType%22%3A%22none%22%2C%22EmberENV%22%3A%7B%22FEATURES%22%3A%7B%7D%2C%22EXTEND_PROTOTYPES%22%3A%7B%22Date%22%3Afalse%7D%7D%2C%22APP%22%3A%7B%22LOG_ACTIVE_GENERATION%22%3Afalse%2C%22LOG_VIEW_LOOKUPS%22%3Afalse%2C%22rootElement%22%3A%22%23ember-testing%22%2C%22autoboot%22%3Afalse%2C%22name%22%3A%22storybook-ember-3-1%22%2C%22version%22%3A%220.0.0+eebe77e5%22%7D%2C%22exportApplicationGlobal%22%3Atrue%7D",
      "name": "storybook-ember-3-1/config/environment",
    },
  ],
  "script": Array [
    Object {
      "src": "./testem.js",
    },
    Object {
      "src": "./assets/vendor.js",
    },
    Object {
      "src": "./assets/storybook-ember-3-1.js",
    },
    Object {
      "src": "./assets/component.js",
      "type": "module",
    },
  ],
}
`);
    });

    it('should be able to parse metas from a built html file from an app that uses engines', () => {
      expect.assertions(1);

      const fileContent = fs.readFileSync(path.resolve(__dirname, 'fixtures', 'engines.html'), 'utf8');
      const metas = parse(fileContent, true).meta;

      expect(metas).toMatchSnapshot();
    });
  });

  describe('@generatePreviewHead', () => {
    it('should work with file created with `ember build`', () => {
      expect.assertions(1);

      const fileContent = fs.readFileSync(path.resolve(__dirname, 'fixtures', 'build.html'), 'utf8');

      expect(generatePreviewHead(parse(fileContent))).toMatchSnapshot()
    })

    it('should work with file created with `ember build` in production env', () => {
      expect.assertions(1);

      const fileContent = fs.readFileSync(path.resolve(__dirname, 'fixtures', 'build-production.html'), 'utf8');

      expect(generatePreviewHead(parse(fileContent))).toMatchSnapshot()
    })

    it('should work with file created with `ember serve` (should append livereload pointing at serve instance)', () => {
      expect.assertions(1);

      const fileContent = fs.readFileSync(path.resolve(__dirname, 'fixtures', 'serve.html'), 'utf8');

      expect(generatePreviewHead(parse(fileContent))).toMatchSnapshot();
    });
  });

  describe('@findEnvironment', () => {
    it('should return the meta node with name config/environment (which has the app env encoded as its content)', () => {
      expect.assertions(1);

      const fileContent = fs.readFileSync(path.resolve(__dirname, 'fixtures', 'serve.html'), 'utf8');
      const config = parse(fileContent, true);
      const env = findEnvironment(config);

      expect(env.name).toBe('storybook-ember-3-1/config/environment');
    });

    it('should be robust against a file with no environment node', () => {
      expect.assertions(1);

      const fileContent = fs.readFileSync(path.resolve(__dirname, 'fixtures', 'no-env.html'), 'utf8');
      const config = parse(fileContent, true);
      const env = findEnvironment(config);

      expect(env).toBeUndefined();
    });
  });

  describe('@extendEnvironment', () => {
    it('deeply merges the original env object with override objects', () => {
      const env = {
        one: 'fish',
        two: {
          fishes: [ 'red', 'blue' ]
        }
      };

      expect(
        extendEnvironment(
          env,
          { two: { fishes: [ 'yellow', 'purple' ], updated: true } },
          { hello: 'world' }
        )
      ).toEqual({
        one: 'fish',
        two: {
          fishes: [ 'yellow', 'purple' ],
          updated: true,
        },
        hello: 'world',
      });
    });

    it('should be robust against undefined input', () => {
      const env = {
        one: 'fish',
        two: {
          fishes: [ 'red', 'blue' ]
        }
      };

      expect(extendEnvironment(env, undefined, undefined)).toEqual({
        one: 'fish',
        two: {
          fishes: [ 'red', 'blue' ]
        }
      });
    });
  });

  describe('@overrideEnvironment', () => {
    // Take a parsed fixture, get env node, override, assert strings as well as intermediates
    // Assert works fine with undefined argument
    it('returns a properly encoded meta value for an environment with overrides', () => {
      expect.assertions(1);

      const fileContent = fs.readFileSync(path.resolve(__dirname, 'fixtures', 'serve.html'), 'utf8');
      const config = parse(fileContent, true);
      const env = findEnvironment(config);
      const overridden = overrideEnvironment(env, {
        rootURL: '/foobar/',
        meta: 'data',
        APP: {
          name: 'new-name-from-test',
        },
      });

      const envObject = JSON.parse(decodeURIComponent(env.content));
      envObject.rootURL = '/foobar/';
      envObject.meta = 'data';
      envObject.APP.name = 'new-name-from-test';

      expect(overridden).toBe(encodeURIComponent(JSON.stringify(envObject)));
    });
  });
});

