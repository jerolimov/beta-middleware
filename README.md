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

### Full REST service integration for Express

```javascript
var express = require('express'),
	mongoose = require('mongoose'),
	beta = require('beta-middleware/integration/express-mongoose');

app.use('/beta', beta(express, mongoose, {
    readSecret:   'sWZGTh7GiCXTuE3qJHmz5B3tNDwdV3Fb',  // replace this
    deleteSecret: 'MNI2kToBnuIhjFk26IvVBrz83UFnfzcw'   // secret keys!
}));
```
