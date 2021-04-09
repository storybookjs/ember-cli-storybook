const test = require('tape');
const fs = require('fs');
const path = require('path');
const {
  generatePreviewHead,
  objectToHTMLAttributes,
  parse,
} = require('../util');

test('@objectToHTMLAttributes', (t) => {
  t.test('should be able to turn object into html attributes', (t) => {
    t.plan(1);

    t.equal(
      objectToHTMLAttributes({
        src: 'http://foo.com/?hi',
        rel: 'stylesheet',
      }),
      'src="http://foo.com/?hi" rel="stylesheet"'
    );
  });
});

test('@parse', (t) => {
  t.test('should be able to parse built html file', (t) => {
    t.plan(1);

    const fileContent = fs.readFileSync(
      path.resolve(__dirname, 'fixtures', 'build.html'),
      'utf8'
    );

    t.deepEqual(parse(fileContent), {
      meta: [
        {
          name: 'storybook-ember-3-1/config/environment',
          content:
            '%7B%22modulePrefix%22%3A%22storybook-ember-3-1%22%2C%22environment%22%3A%22test%22%2C%22rootURL%22%3A%22/%22%2C%22locationType%22%3A%22none%22%2C%22EmberENV%22%3A%7B%22FEATURES%22%3A%7B%7D%2C%22EXTEND_PROTOTYPES%22%3A%7B%22Date%22%3Afalse%7D%7D%2C%22APP%22%3A%7B%22LOG_ACTIVE_GENERATION%22%3Afalse%2C%22LOG_VIEW_LOOKUPS%22%3Afalse%2C%22rootElement%22%3A%22%23ember-testing%22%2C%22autoboot%22%3Afalse%2C%22name%22%3A%22storybook-ember-3-1%22%2C%22version%22%3A%220.0.0+eebe77e5%22%7D%2C%22exportApplicationGlobal%22%3Atrue%7D',
        },
      ],
      link: [
        {
          rel: 'stylesheet',
          href: './assets/vendor.css',
        },
        {
          rel: 'stylesheet',
          href: './assets/storybook-ember-3-1.css',
        },
        {
          rel: 'stylesheet',
          href: './assets/test-support.css',
        },
        {
          rel: 'icon',
          href: './favicon.png'
        },
        {
          rel: 'stylesheet',
          href: 'http://example.com/external/style.css'
        }
      ],
      script: [
        {
          src: './testem.js',
        },
        {
          src: './assets/vendor.js',
        },
        {
          src: './assets/test-support.js',
        },
        {
          src: './assets/storybook-ember-3-1.js',
        },
        {
          src: './assets/tests.js',
        },
          src: 'http://example.com/external/script.js'
        },
      ]
    });
  });

  t.test(
    'should strip rootURL found in config href and src attributes',
    (t) => {
      t.plan(1);

      const fileContent = fs.readFileSync(
        path.resolve(__dirname, 'fixtures', 'root-url.html'),
        'utf8'
      );

      t.deepEqual(parse(fileContent), {
        meta: [
          {
            name: 'vault/config/environment',
            content:
              '%7B%22modulePrefix%22%3A%22vault%22%2C%22environment%22%3A%22development%22%2C%22rootURL%22%3A%22/ui/%22%2C%22locationType%22%3A%22auto%22%2C%22EmberENV%22%3A%7B%22FEATURES%22%3A%7B%7D%2C%22EXTEND_PROTOTYPES%22%3A%7B%22Date%22%3Afalse%7D%7D%2C%22APP%22%3A%7B%22POLLING_URLS%22%3A%5B%22sys/health%22%2C%22sys/replication/status%22%2C%22sys/seal-status%22%5D%2C%22NAMESPACE_ROOT_URLS%22%3A%5B%22sys/health%22%2C%22sys/seal-status%22%2C%22sys/license/features%22%5D%2C%22DEFAULT_PAGE_SIZE%22%3A15%2C%22LOG_TRANSITIONS%22%3Atrue%7D%2C%22flashMessageDefaults%22%3A%7B%22timeout%22%3A7000%2C%22sticky%22%3Afalse%2C%22preventDuplicates%22%3Atrue%7D%2C%22contentSecurityPolicyHeader%22%3A%22Content-Security-Policy%22%2C%22contentSecurityPolicyMeta%22%3Atrue%2C%22contentSecurityPolicy%22%3A%7B%22connect-src%22%3A%5B%22%27self%27%22%5D%2C%22img-src%22%3A%5B%22%27self%27%22%2C%22data%3A%22%5D%2C%22form-action%22%3A%5B%22%27none%27%22%5D%2C%22script-src%22%3A%5B%22%27self%27%22%5D%2C%22style-src%22%3A%5B%22%27unsafe-inline%27%22%2C%22%27self%27%22%5D%2C%22default-src%22%3A%5B%22%27none%27%22%5D%2C%22font-src%22%3A%5B%22%27self%27%22%5D%2C%22media-src%22%3A%5B%22%27self%27%22%5D%7D%2C%22emberData%22%3A%7B%22enableRecordDataRFCBuild%22%3Afalse%7D%2C%22exportApplicationGlobal%22%3Atrue%7D',
          },
        ],
        link: [
          {
            rel: 'stylesheet',
            href: './assets/vendor.css',
          },
          {
            rel: 'stylesheet',
            href: './assets/vault.css',
          },
          {
            rel: 'icon',
            href: './favicon.png',
          },
        ],
        script: [
          {
            src: './ember-cli-live-reload.js',
          },
          {
            src: './assets/vendor.js',
          },
          {
            src: './assets/vault.js',
          },
        ],
      });
    }
  );

  t.test(
    'should be able to parse built html file and strip out test related files',
    (t) => {
      t.plan(1);

      const fileContent = fs.readFileSync(
        path.resolve(__dirname, 'fixtures', 'build.html'),
        'utf8'
      );

      t.deepEqual(parse(fileContent, true), {
        meta: [
          {
            name: 'storybook-ember-3-1/config/environment',
            content:
              '%7B%22modulePrefix%22%3A%22storybook-ember-3-1%22%2C%22environment%22%3A%22test%22%2C%22rootURL%22%3A%22/%22%2C%22locationType%22%3A%22none%22%2C%22EmberENV%22%3A%7B%22FEATURES%22%3A%7B%7D%2C%22EXTEND_PROTOTYPES%22%3A%7B%22Date%22%3Afalse%7D%7D%2C%22APP%22%3A%7B%22LOG_ACTIVE_GENERATION%22%3Afalse%2C%22LOG_VIEW_LOOKUPS%22%3Afalse%2C%22rootElement%22%3A%22%23ember-testing%22%2C%22autoboot%22%3Afalse%2C%22name%22%3A%22storybook-ember-3-1%22%2C%22version%22%3A%220.0.0+eebe77e5%22%7D%2C%22exportApplicationGlobal%22%3Atrue%7D',
          },
        ],
        link: [
          {
            rel: 'stylesheet',
            href: './assets/vendor.css',
          },
          {
            rel: 'stylesheet',
            href: './assets/storybook-ember-3-1.css',
          },
        ],
        script: [
          {
            src: './testem.js',
          },
          {
            src: './assets/vendor.js',
          },
          {
            src: './assets/storybook-ember-3-1.js',
          },
        ],
      });
    }
  );

  t.test(
    'should be able to parse metas from a built html file from an app that uses engines',
    (t) => {
      t.plan(1);

      const fileContent = fs.readFileSync(
        path.resolve(__dirname, 'fixtures', 'engines.html'),
        'utf8'
      );
      const metas = parse(fileContent, true).meta;

      t.deepEqual(metas, [
        {
          name: 'vault/config/environment',
          content:
            '%7B%22modulePrefix%22%3A%22vault%22%2C%22environment%22%3A%22development%22%2C%22rootURL%22%3A%22/ui/%22%2C%22locationType%22%3A%22auto%22%2C%22EmberENV%22%3A%7B%22FEATURES%22%3A%7B%7D%2C%22EXTEND_PROTOTYPES%22%3A%7B%22Date%22%3Afalse%7D%7D%2C%22APP%22%3A%7B%22POLLING_URLS%22%3A%5B%22sys/health%22%2C%22sys/replication/status%22%2C%22sys/seal-status%22%5D%2C%22NAMESPACE_ROOT_URLS%22%3A%5B%22sys/health%22%2C%22sys/seal-status%22%2C%22sys/license/features%22%5D%2C%22DEFAULT_PAGE_SIZE%22%3A15%2C%22LOG_TRANSITIONS%22%3Atrue%7D%2C%22flashMessageDefaults%22%3A%7B%22timeout%22%3A7000%2C%22sticky%22%3Afalse%7D%2C%22contentSecurityPolicyHeader%22%3A%22Content-Security-Policy%22%2C%22contentSecurityPolicyMeta%22%3Atrue%2C%22contentSecurityPolicy%22%3A%7B%22connect-src%22%3A%5B%22%27self%27%22%5D%2C%22img-src%22%3A%5B%22%27self%27%22%2C%22data%3A%22%5D%2C%22form-action%22%3A%5B%22%27none%27%22%5D%2C%22script-src%22%3A%5B%22%27self%27%22%5D%2C%22style-src%22%3A%5B%22%27unsafe-inline%27%22%2C%22%27self%27%22%5D%2C%22default-src%22%3A%5B%22%27none%27%22%5D%2C%22font-src%22%3A%5B%22%27self%27%22%5D%2C%22media-src%22%3A%5B%22%27self%27%22%5D%7D%2C%22emberData%22%3A%7B%22enableRecordDataRFCBuild%22%3Afalse%7D%2C%22exportApplicationGlobal%22%3Atrue%7D',
        },
        {
          name: 'replication/config/environment',
          content:
            '%7B%22modulePrefix%22%3A%22replication%22%2C%22environment%22%3A%22development%22%7D',
        },
        {
          name: 'vault/config/asset-manifest',
          content:
            '%7B%22bundles%22%3A%7B%22replication%22%3A%7B%22assets%22%3A%5B%7B%22uri%22%3A%22/ui/engines-dist/replication/assets/engine-vendor.js%22%2C%22type%22%3A%22js%22%7D%2C%7B%22uri%22%3A%22/ui/engines-dist/replication/assets/engine.js%22%2C%22type%22%3A%22js%22%7D%5D%7D%7D%7D',
        },
      ]);
    }
  );
});

test('@generatePreviewHead', (t) => {
  t.test('should work with file created with `ember build`', (t) => {
    t.plan(1);

    const fileContent = fs.readFileSync(
      path.resolve(__dirname, 'fixtures', 'build.html'),
      'utf8'
    );

    t.deepEqual(
      generatePreviewHead(parse(fileContent)),
      `<!-- This file is auto-generated by ember-cli-storybook -->\n<meta name="storybook-ember-3-1/config/environment" content="%7B%22modulePrefix%22%3A%22storybook-ember-3-1%22%2C%22environment%22%3A%22test%22%2C%22rootURL%22%3A%22/%22%2C%22locationType%22%3A%22none%22%2C%22EmberENV%22%3A%7B%22FEATURES%22%3A%7B%7D%2C%22EXTEND_PROTOTYPES%22%3A%7B%22Date%22%3Afalse%7D%7D%2C%22APP%22%3A%7B%22LOG_ACTIVE_GENERATION%22%3Afalse%2C%22LOG_VIEW_LOOKUPS%22%3Afalse%2C%22rootElement%22%3A%22%23ember-testing%22%2C%22autoboot%22%3Afalse%2C%22name%22%3A%22storybook-ember-3-1%22%2C%22version%22%3A%220.0.0+eebe77e5%22%7D%2C%22exportApplicationGlobal%22%3Atrue%7D" />\n<link rel="stylesheet" href="./assets/vendor.css" />\n<link rel="stylesheet" href="./assets/storybook-ember-3-1.css" />\n<link rel="stylesheet" href="./assets/test-support.css" />\n<script src="./testem.js"></script>\n<script src="./assets/vendor.js"></script>\n<script>runningTests = true; Ember.testing=true;</script>\n<script src="./assets/test-support.js"></script>\n<script src="./assets/storybook-ember-3-1.js"></script>\n<script src="./assets/tests.js"></script>`
    );
  });

  t.test(
    'should work with file created with `ember serve` (should append livereload pointing at serve instance)',
    (t) => {
      t.plan(1);

      const fileContent = fs.readFileSync(
        path.resolve(__dirname, 'fixtures', 'serve.html'),
        'utf8'
      );

      t.deepEqual(
        generatePreviewHead(parse(fileContent)),
        `<!-- This file is auto-generated by ember-cli-storybook -->\n<meta name="storybook-ember-3-1/config/environment" content="%7B%22modulePrefix%22%3A%22storybook-ember-3-1%22%2C%22environment%22%3A%22test%22%2C%22rootURL%22%3A%22/%22%2C%22locationType%22%3A%22none%22%2C%22EmberENV%22%3A%7B%22FEATURES%22%3A%7B%7D%2C%22EXTEND_PROTOTYPES%22%3A%7B%22Date%22%3Afalse%7D%7D%2C%22APP%22%3A%7B%22LOG_ACTIVE_GENERATION%22%3Afalse%2C%22LOG_VIEW_LOOKUPS%22%3Afalse%2C%22rootElement%22%3A%22%23ember-testing%22%2C%22autoboot%22%3Afalse%2C%22name%22%3A%22storybook-ember-3-1%22%2C%22version%22%3A%220.0.0+eebe77e5%22%7D%2C%22exportApplicationGlobal%22%3Atrue%7D" />\n<link rel="stylesheet" href="./assets/vendor.css" />\n<link rel="stylesheet" href="./assets/storybook-ember-3-1.css" />\n<link rel="stylesheet" href="./assets/test-support.css" />\n<script>\n            (function() {\n              var srcUrl = null;\n              var host = location.hostname || 'localhost';\n              var defaultPort = location.protocol === 'https:' ? 443 : 80;\n              var port = undefined;\n              var path = '';\n              var prefixURL = '';\n              var src = srcUrl || prefixURL + '/_lr/livereload.js?port=' + port + '&host=' + host + path;\n              var script = document.createElement('script');\n              script.type = 'text/javascript';\n              script.src = location.protocol + '//' + host + ':undefined' + src;\n              document.getElementsByTagName('head')[0].appendChild(script);\n            }());\n          </script>\n<script src="./testem.js"></script>\n<script src="./assets/vendor.js"></script>\n<script>runningTests = true; Ember.testing=true;</script>\n<script src="./assets/test-support.js"></script>\n<script src="./assets/storybook-ember-3-1.js"></script>\n<script src="./assets/tests.js"></script>`
      );
    }
  );
});
