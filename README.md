### A lightweight (stupid) solution to save beta forms.

### Integration as route

```javascript
var beta = require('beta-middleware');

routes.get('/beta/beta.js', beta.provideClientAPI());
routes.post('/beta/:type', beta.route());
```

### Integration as middleware

```javascript
var beta = require('beta-middleware');

routes.get('/beta/beta.js', beta.provideClientAPI());
routes.post('/beta/:type', beta.middleware(), function(req, res) {
    res.render('registration_successful');
});
```
