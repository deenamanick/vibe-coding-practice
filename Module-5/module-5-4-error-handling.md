## Practical 4: Error handling

### Why

Beginners often return different error formats everywhere. A consistent error style makes APIs easier to debug.

### What

Add:

- a `notFound` handler for unknown routes
- a global error handler middleware

### How

#### Exercise A: 404 handler

At the bottom of `index.js` add a handler for routes that don’t exist.

Expected:

- response code: `404`
- JSON:

```json
{"error":"Not Found"}
```

#### Exercise B: Global error handler

Add an Express error middleware:

- takes `(err, req, res, next)`
- logs the error
- returns:

```json
{"error":"Internal Server Error"}
```

Checklist:

- [ ] Unknown routes return 404 JSON
- [ ] Unhandled exceptions return 500 JSON
- [ ] Error responses do not leak secrets
