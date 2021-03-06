## A lightweight (stupid) solution to save beta forms.

### Installation

    npm install beta-middleware --save

### Integration as route

```javascript
var beta = require('beta-middleware');

app.get('/beta/beta.js', beta.provideClientAPI());

app.post('/beta/:type', beta.route(function(data, callback) {
    mongoose.save(data, callback);
}));
```

| Option | Default value | Description |
|---|---|---|
| saveHeaders | true | Includes `req.headers` into the persistent information. |
| saveCookies | false | Includes `req.cookies` into the persistent information. |
| saveSignedCookies | false | Includes `req.signedCookies` into the persistent information. |
| saveSession | false | Includes `req.session` into the persistent information. |

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

Additional options (+ save options from above):

| Option | Default value | Description |
|---|---|---|
| successLocation | - | Redirect URL when information are saved successfully.<br/>If defined the `Location` will set with status code 201. Status 201 without any data will be returned otherwise. |
| errorLocation | - | Redirect URL when an error occurred.<br/>If defined the `Location` will set with status code 301. Next middleware will be called with an error otherwise. |

### Full REST service based on Express

```javascript
var express = require('express'),
	mongoose = require('mongoose'),
	beta = require('beta-middleware/integration/express-mongoose');

app.use('/beta', beta(express, mongoose, {
    readSecret:   'sWZGTh7GiCXTuE3qJHmz5B3tNDwdV3Fb',  // replace this
    deleteSecret: 'MNI2kToBnuIhjFk26IvVBrz83UFnfzcw'   // secret keys!
}));
```

| Route | Status code |
|---|---|
| `POST /beta` | 201 when successful<br/>301 when an error occurs |
| `GET /beta[?filter]`<br/><br/>filter example: ?query.abtesting=42 | 200 when successful, json array<br/>401 when unauthorized<br/>403 when secret doesn't match<br/>500 for other errors |
| `GET /beta/:id` | 200 when successful, json object<br/>401 when unauthorized<br/>403 when secret doesn't match<br/>404 if id could not be found<br/>500 for other errors |
| `DELETE /beta/:id` | 204 when successful deleted<br/>401 when unauthorized<br/>403 when secret doesn't match<br/>404 if id could not be found<br/>500 for other errors |
