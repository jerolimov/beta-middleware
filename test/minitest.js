'use strict';

var beta = require('..'),
	assert = require('assert');

describe('Beta', function() {

	describe('middleware', function() {
		it('should return a function without options', function() {
			var middleware = beta.middleware(function() {});
			assert.strictEqual(typeof middleware, 'function');
		});

		it('should return a function with options', function() {
			var middleware = beta.middleware({}, function() {});
			assert.strictEqual(typeof middleware, 'function');
		});

		it('should run successful without options and with simple fake objects', function(done) {
			var middleware = beta.middleware(function(data, callback) {
				callback(null, data);
			});
			var req = {}, res = {};
			middleware(req, res, function(err, data) {
				assert(!err);
				assert(data);
				done();
			});
		});

		it('should run successful with options and simple fake objects', function(done) {
			var middleware = beta.middleware({}, function(data, callback) {
				callback(null, data);
			});
			var req = {}, res = {};
			middleware(req, res, function(err, data) {
				assert(!err);
				assert(data);
				done();
			});
		});
	});

	describe('route', function() {
		it('should return a function without options', function() {
			var route = beta.route(function() {});
			assert.strictEqual(typeof route, 'function');

		});

		it('should return a function with options', function() {
			var route = beta.route({}, function() {});
			assert.strictEqual(typeof route, 'function');
		});

		it('should run successful without options and with simple fake objects', function() {
			var route = beta.route(function(data, callback) {
				callback(null, data);
			});
			var req = {}, res = {}, status;
			res.status = function(_status) { status = _status; return res; };
			res.json = function() { return res; };
			route(req, res);
		});

		it('should run successful with options and simple fake objects', function() {
			var route = beta.route({}, function(data, callback) {
				callback(null, data);
			});
			var req = {}, res = {}, status;
			res.status = function(_status) { status = _status; return res; };
			res.json = function() { return res; };
			route(req, res);
		});
	});

	describe('provideClientAPI', function() {
		it('should return a function without options', function() {
			var provideClientAPI = beta.provideClientAPI();
			assert.strictEqual(typeof provideClientAPI, 'function');

		});

		it('should return a function with options', function() {
			var provideClientAPI = beta.provideClientAPI({});
			assert.strictEqual(typeof provideClientAPI, 'function');
		});

		it('should send a file', function() {
			var provideClientAPI = beta.provideClientAPI({});
			var req = {}, res = { sendFile: function() {} };
			provideClientAPI(req, res);
		});
	});

});
