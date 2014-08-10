
var os = require('os');

/**
 * Return a middleware-function based on the given options!
 *
 * Available options:
 *
 * saveHeaders will persist req.headers, default is true
 * saveCookies will persist req.cookies, default is false
 * saveSignedCookies will persist req.signedCookies, default is false
 * saveSession will persist req.session, default is false
 *
 * @param options
 * @returns {Function}
 */
module.exports.middleware = function(options) {
	options = options || {};

	var saveHeaders = !!options['saveHeaders'] || true;
	var saveCookies = !!options['saveCookies'] || false;
	var saveSignedCookies = !!options['saveSignedCookies'] || false;
	var saveSession = !!options['saveSession'] || false;

	return function(req, res, next) {
		var data = {};

		// Route, if available
		if (req.route) {
			data.route = req.method + ' ' + req.route.path;
		}

		data.method = req.method;
		data.originalUrl = req.originalUrl;
		data.path = req.path;
		data.url = req.url;

		// If baseURL is available
		if (req.baseUrl && req.baseUrl !== '') {
			data.baseUrl = req.baseUrl;
		}

		// Client IP
		data.client = req.ip;
		if (req.ips && req.ips.length > 0) {
			data.clientVia = req.ips;
		}

		// Used server instance (hostname)
		data.server = os.hostname();
		data.timestamp = new Date();

		// Params if present
		if (req.params && Object.keys(req.params).length > 0) {
			data.params = req.params;
		}

		// Query if present
		if (req.query && Object.keys(req.query).length > 0) {
			data.query = req.query;
		}

		// Optional user which will be set by some middlewares
		if (req.user) {
			data.user = req.user;
		}

		// Headers, default is true
		if (saveHeaders) {
			data.headers = req.headers;
		}

		// The data, content, body, ... itself
		data.data = req.body;

		// Cookies and sessions, default is false
		if (saveCookies) {
			data.cookies = req.cookies;
		}
		if (saveSignedCookies) {
			data.signedCookies = req.signedCookies;
		}
		if (saveSession) {
			data.session = req.session;
		}

		if (next) {
			next(null, data);
		}
	};
};

/**
 * Return a routing-function based on the given options!
 *
 * See also module.exports.middleware for the available options.
 *
 * @param options
 * @returns {Function}
 */
module.exports.route = function(options) {

	var middleware = module.exports.middleware(options);

	return function(req, res) {
		middleware(req, res, function(err, data) {
			res.status(200).json(data);
		});
	};
};

module.exports.provideClientAPI = function(options) {
	return function(req, res) {
		res.sendFile(__dirname + '/../client/beta.js');
	}
};
