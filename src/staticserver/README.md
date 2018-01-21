# Simple configuration based static server.

Usage:

```
node src/staticserver/server.js path/to/configuration
```

Configuration file is a JSON file. The JSON object's key is the request parameter to match, while
the value are the pointer to the file to return.

The request matcher accepts a Regex as described by Express js. The file names can access the
matching params using `$`. So `$param` matches a parameter named `param`. The param names must be
one of: [a-zA-Z0-9_-]

Note that all paths are relative to the configuration.