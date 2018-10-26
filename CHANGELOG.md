# 0.0.1 (10/26/2018)

- Ensures dist is available by using outputReady instead of postBuild
- Bring in all meta tags that are in output (that have an id)
- Allows parse to accept multiple selectors per block
- By default ignores all test related files, can be toggled with package.json settings

# 0.0.0 (10/24/2018)

- basic functionality for creating a `preview-head.html` and `.env` work for static builds and serve builds, that acknowledge live reload capabilities of ember serve
