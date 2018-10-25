const cheerio = require('cheerio');

const lookupTable = {
  meta: {
    selector: 'meta[name*="/config/environment"]',
    attributes: ['name', 'content']
  },
  link: {
    selector: 'link',
    attributes: ['rel', 'href']
  },
  script: {
    selector: 'script',
    attributes: ['src']
  }
};

function getDocumentValues($, selector, attributes=[]) {
  let $tags = $(selector);
  let config = [];

  $tags.each(function() {
    var $tag = $(this);

    var data = attributes.reduce(function(data, attribute) {
      const value = $tag.attr(attribute);

      if(value) {
        data[attribute] = value
      }

      return data;
    }, {})

    if(Object.keys(data).length > 0) {
      config.push(data);
    }
  });

  return config;
}

function parse(data) {
  var $ = cheerio.load(data);
  var json = {};

  for(var prop in lookupTable) {
    var value = lookupTable[prop];

    if ('selector' in value && ('attributes' in value || 'includeContent' in value)) {
      json[prop] = getDocumentValues($, value.selector, value.attributes, value.includeContent, value.includeHtmlContent);
    }
  }

  return json;
}

function objectToHTMLAttributes(obj) {
  return Object.keys(obj).map((key) => {
    return `${key}="${obj[key]}"`
  }).join(' ')
}

function generatePreviewHead(parsedConfig) {
  const doc = [];

  for(const key of Object.keys(parsedConfig)) {
    for(const value of parsedConfig[key]) {
      if(key == 'script') {
        if(value.src.indexOf('ember-cli-live-reload.js') > -1) {
          doc.push(`<script>
            (function() {
              var srcUrl = null;
              var host = location.hostname || 'localhost';
              var defaultPort = location.protocol === 'https:' ? 443 : 80;
              var port = ${process.env.EMBER_CLI_INJECT_LIVE_RELOAD_PORT};
              var path = '';
              var prefixURL = '';
              var src = srcUrl || prefixURL + '/_lr/livereload.js?port=' + port + '&host=' + host + path;
              var script = document.createElement('script');
              script.type = 'text/javascript';
              script.src = location.protocol + '//' + host + ':${process.env.EMBER_CLI_INJECT_LIVE_RELOAD_PORT}' + src;
              document.getElementsByTagName('head')[0].appendChild(script);
            }());
          </script>`);
          continue;
        }
        if(value.src.indexOf('assets/vendor.js') > -1) {
          // make sure we push this before vendor gets loaded to ensure the application does not bind to the window
          doc.push('<script>runningTests = true;</script>');
        }

        doc.push(`<${key} ${objectToHTMLAttributes(value)}></${key}>`);
      } else {
        doc.push(`<${key} ${objectToHTMLAttributes(value)} />`);
      }
    }
  }

  return doc.join('\n')
}

module.exports = {
  getDocumentValues,
  parse,
  objectToHTMLAttributes,
  generatePreviewHead,
};
