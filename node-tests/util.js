const test = require('tape');
const fs = require('fs');
const path = require('path');
const {
  generatePreviewHead,
  objectToHTMLAttributes,
  parse
} = require('../util');

test('@objectToHTMLAttributes', (t) => {
  t.test('should be able to turn object into html attributes', (t) => {
    t.plan(1);

    t.equal(objectToHTMLAttributes({
      src: 'http://foo.com/?hi',
      rel: 'stylesheet'
    }), 'src="http://foo.com/?hi" rel="stylesheet"');
  });
});

test('@parse', (t) => {
  t.test('should be able to parse built html file', (t) => {
    t.plan(1);

    const fileContent = fs.readFileSync(path.resolve(__dirname, 'fixtures', 'build.html'), 'utf8');

    t.deepEqual(parse(fileContent), {
      meta: [{
        name: 'storybook-ember-3-1/config/environment',
        content: '%7B%22modulePrefix%22%3A%22storybook-ember-3-1%22%2C%22environment%22%3A%22test%22%2C%22rootURL%22%3A%22/%22%2C%22locationType%22%3A%22none%22%2C%22EmberENV%22%3A%7B%22FEATURES%22%3A%7B%7D%2C%22EXTEND_PROTOTYPES%22%3A%7B%22Date%22%3Afalse%7D%7D%2C%22APP%22%3A%7B%22LOG_ACTIVE_GENERATION%22%3Afalse%2C%22LOG_VIEW_LOOKUPS%22%3Afalse%2C%22rootElement%22%3A%22%23ember-testing%22%2C%22autoboot%22%3Afalse%2C%22name%22%3A%22storybook-ember-3-1%22%2C%22version%22%3A%220.0.0+eebe77e5%22%7D%2C%22exportApplicationGlobal%22%3Atrue%7D'
      }],
      link: [{
          rel: 'stylesheet',
          href: '/assets/vendor.css'
        },
        {
          rel: 'stylesheet',
          href: '/assets/storybook-ember-3-1.css'
        },
        {
          rel: 'stylesheet',
          href: '/assets/test-support.css'
        }
      ],
      script: [{
          src: '/testem.js'
        },
        {
          src: '/assets/vendor.js'
        },
        {
          src: '/assets/test-support.js'
        },
        {
          src: '/assets/storybook-ember-3-1.js'
        },
        {
          src: '/assets/tests.js'
        }
      ]
    });
  });
});

test('@generatePreviewHead', (t) => {
  t.test('should work with file created with `ember build`', (t) => {
    t.plan(1);

    const fileContent = fs.readFileSync(path.resolve(__dirname, 'fixtures', 'build.html'), 'utf8');

    t.deepEqual(generatePreviewHead(parse(fileContent)), `<meta name="storybook-ember-3-1/config/environment" content="%7B%22modulePrefix%22%3A%22storybook-ember-3-1%22%2C%22environment%22%3A%22test%22%2C%22rootURL%22%3A%22/%22%2C%22locationType%22%3A%22none%22%2C%22EmberENV%22%3A%7B%22FEATURES%22%3A%7B%7D%2C%22EXTEND_PROTOTYPES%22%3A%7B%22Date%22%3Afalse%7D%7D%2C%22APP%22%3A%7B%22LOG_ACTIVE_GENERATION%22%3Afalse%2C%22LOG_VIEW_LOOKUPS%22%3Afalse%2C%22rootElement%22%3A%22%23ember-testing%22%2C%22autoboot%22%3Afalse%2C%22name%22%3A%22storybook-ember-3-1%22%2C%22version%22%3A%220.0.0+eebe77e5%22%7D%2C%22exportApplicationGlobal%22%3Atrue%7D" />\n<link rel="stylesheet" href="/assets/vendor.css" />\n<link rel="stylesheet" href="/assets/storybook-ember-3-1.css" />\n<link rel="stylesheet" href="/assets/test-support.css" />\n<script src="/testem.js"></script>\n<script>runningTests = true;</script>\n<script src="/assets/vendor.js"></script>\n<script src="/assets/test-support.js"></script>\n<script src="/assets/storybook-ember-3-1.js"></script>\n<script src="/assets/tests.js"></script>`);
  })

  t.test('should work with file created with `ember serve` (should append livereload pointing at serve instance)', (t) => {
    t.plan(1);

    const fileContent = fs.readFileSync(path.resolve(__dirname, 'fixtures', 'serve.html'), 'utf8');

    t.deepEqual(generatePreviewHead(parse(fileContent)), `<meta name="storybook-ember-3-1/config/environment" content="%7B%22modulePrefix%22%3A%22storybook-ember-3-1%22%2C%22environment%22%3A%22test%22%2C%22rootURL%22%3A%22/%22%2C%22locationType%22%3A%22none%22%2C%22EmberENV%22%3A%7B%22FEATURES%22%3A%7B%7D%2C%22EXTEND_PROTOTYPES%22%3A%7B%22Date%22%3Afalse%7D%7D%2C%22APP%22%3A%7B%22LOG_ACTIVE_GENERATION%22%3Afalse%2C%22LOG_VIEW_LOOKUPS%22%3Afalse%2C%22rootElement%22%3A%22%23ember-testing%22%2C%22autoboot%22%3Afalse%2C%22name%22%3A%22storybook-ember-3-1%22%2C%22version%22%3A%220.0.0+eebe77e5%22%7D%2C%22exportApplicationGlobal%22%3Atrue%7D" />\n<link rel="stylesheet" href="/assets/vendor.css" />\n<link rel="stylesheet" href="/assets/storybook-ember-3-1.css" />\n<link rel="stylesheet" href="/assets/test-support.css" />\n<script>\n            (function() {\n              var srcUrl = null;\n              var host = location.hostname || 'localhost';\n              var defaultPort = location.protocol === 'https:' ? 443 : 80;\n              var port = undefined;\n              var path = '';\n              var prefixURL = '';\n              var src = srcUrl || prefixURL + '/_lr/livereload.js?port=' + port + '&host=' + host + path;\n              var script = document.createElement('script');\n              script.type = 'text/javascript';\n              script.src = location.protocol + '//' + host + ':undefined' + src;\n              document.getElementsByTagName('head')[0].appendChild(script);\n            }());\n          </script>\n<script src="/testem.js"></script>\n<script>runningTests = true;</script>\n<script src="/assets/vendor.js"></script>\n<script src="/assets/test-support.js"></script>\n<script src="/assets/storybook-ember-3-1.js"></script>\n<script src="/assets/tests.js"></script>`);
  });
});
