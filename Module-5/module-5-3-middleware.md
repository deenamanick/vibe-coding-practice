## Practical 3: Middleware

### Why

Middleware is how you add cross-cutting behavior to every request:

- logging
- authentication
- validation
- rate limiting

### What

Add 2 middlewares to your Express notes API:

1. Request logger
2. Input validator for `POST /notes` and `PUT /notes/:id`

### How

#### Exercise A: Logger middleware

Create:

- `function logger(req, res, next) { ... }`

It should print:

- method
- path
- timestamp

Then add:

```js
app.use(logger);
```

Checklist:

- [ ] Every request prints one log line
- [ ] Log includes method + path

#### Exercise B: Validation middleware

Create:

- `validateNote(req, res, next)`

Rules:

- `title` must exist and be at least 1 character
- `content` must exist and be at least 1 character

On failure:

- return `400` with JSON: `{ "error": "..." }`

Checklist:

- [ ] Invalid payload returns 400
- [ ] Valid payload passes to route
- [ ] Error response is consistent
