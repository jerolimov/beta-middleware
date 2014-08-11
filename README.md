### A lightweight (stupid) solution to save beta forms.

### Integration as route

```javascript
var beta = require('beta-middleware');

app.get('/beta/beta.js', beta.provideClientAPI());
app.post('/beta/:type', beta.route(function(data, callback) {
    mongoose.save(data, callback);
}));
```

### Integration as middleware

```javascript
var beta = require('beta-middleware');

app.get('/beta/beta.js', beta.provideClientAPI());
app.post('/beta/:type', beta.middleware(function(data, callback) {
   mongoose.save(data, callback);
}), function(req, res) {
    res.render('registration_successful');
});
```
