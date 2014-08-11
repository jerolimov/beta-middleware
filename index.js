
var os = require('os');

/**
 * Return a middleware-function based on the given (optional) options
 * and the save routine to persist the data.
 *
 * Available options:
 *
 * saveHeaders will persist req.headers, default is true
 * saveCookies will persist req.cookies, default is false
 * saveSignedCookies will persist req.signedCookies, default is false
 * saveSession will persist req.session, default is false
 *
 * @param options
 * @param saveRoutine
 * @returns {Function}
 */
module.exports.middleware = function(options, saveRoutine) {
	if (typeof options === 'function') {
		saveRoutine = options;
		options = {};
	} else {
		options = options || {};
	}

	if (typeof saveRoutine !== 'function') {
		throw new Error('Storage not implemented for beta-middleware!');
	}

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

		saveRoutine(data, function(err) {
			next(err, data);
		});
	};
};

/**
 * Return a routing-function based on the given (optional) options
 * and the save routine to persist the data.
 *
 * See also module.exports.middleware for the available options.
 *
 * @param options
 * @param saveRoutine
 * @returns {Function}
 */
module.exports.route = function(options, saveRoutine) {
	if (typeof options === 'function') {
		saveRoutine = options;
		options = {};
	} else {
		options = options || {};
	}

	var middleware = module.exports.middleware(options, saveRoutine);

	return function(req, res, next) {
		middleware(req, res, function(err, data) {
			if (err) {
				if (typeof options.errorLocation === 'string') {
					res.redirect(301, options.errorLocation).end();
				} else {
					next(err);
				}
			} else {
				if (typeof options.successLocation === 'string') {
					res.redirect(201, options.successLocation).end();
				} else {
					res.status(201).end();
				}
			}
		});
	};
};

module.exports.provideClientAPI = function(options) {
	return function(req, res, next) {
		if (res.sendFile) {
			res.sendFile(__dirname + '/client/beta.js');
		} else if (res.sendfile) {
			res.sendfile(__dirname + '/client/beta.js');
		} else {
			next(new Error('Response has neither sendFile nor sendfile method.'));
		}
	}
};
