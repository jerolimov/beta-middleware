'use strict';

var beta = require('..');

module.exports = function(express, mongoose, options) {

	var router = express.Router(),
		model = mongoose.model('Beta', {});

	options = options || {};

	var readSecret = options.readSecret;
	var deleteSecret = options.deleteSecret || options.readSecret;

	router.get('/beta.js', beta.provideClientAPI());

	/**
	 * Create a new beta entry
	 */
	router.post('/', beta.route(options, function (data, callback) {
		new model(data, false).save(callback);
	}));

	/**
	 * Read list of beta entries
	 */
	router.get('/', function (req, res) {
		if (!readSecret || !req.headers.authtoken) {
			res.status(401).end();
		} else if (req.headers.authtoken !== readSecret) {
			res.status(403).end();
		} else {
			model.find(req.query, function (err, entries) {
				if (err) {
					res.status(500).end();
				} else {
					res.status(200).json(entries);
				}
			});
		}
	});

	/**
	 * Read beta entry by id
	 */
	router.get('/:id', function (req, res) {
		if (!readSecret || !req.headers.authtoken) {
			res.status(401).end();
		} else if (req.headers.authtoken !== readSecret) {
			res.status(403).end();
		} else {
			model.findById(req.params.id, function (err, entry) {
				if (err) {
					res.status(500).end();
				} else if (!entry) {
					res.status(404).end();
				} else {
					res.status(200).json(entry);
				}
			});
		}
	});

	/**
	 * Remove a beta entry
	 */
	router.delete('/:id', function (req, res) {
		if (!deleteSecret || !req.headers.authtoken) {
			res.status(401).end();
		} else if (req.headers.authtoken !== deleteSecret) {
			res.status(403).end();
		} else {
			model.findByIdAndRemove(req.params.id, function (err, entry) {
				if (err) {
					res.status(500).end();
				} else if (!entry) {
					res.status(404).end();
				} else {
					res.status(204).end();
				}
			});
		}
	});

	return router;
};
