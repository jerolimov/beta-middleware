/**
 * Collect some beta meta data. ;-)
 *
 * @returns object with informations about the user, the browser and the hardware/device.
 */
var getBetaMetaData = function() {

	// Functions adopted from Fingerprint.js
	// MIT licensed, see https://github.com/Valve/fingerprintjs/blob/master/fingerprint.js
	var hasCanvasSupported = function () {
		var elem = document.createElement('canvas');
		return !!(elem.getContext && elem.getContext('2d'));
	};

	// https://bugzilla.mozilla.org/show_bug.cgi?id=781447
	var hasLocalStorage = function () {
		try{
			return !!window.localStorage;
		} catch(e) {
			return true; // SecurityError when referencing it means it exists
		}
	};

	var hasSessionStorage = function () {
		try{
			return !!window.sessionStorage;
		} catch(e) {
			return true; // SecurityError when referencing it means it exists
		}
	};

	var hasIndexedDB = function() {
		return !!window.indexedDB
	};

	var getUserAgentVersions = function() {
		var matches = navigator.userAgent.match(/([A-Za-z]+\/[0-9\.]+)/g);
		var versions = {};
		for (var i = 0; i < matches.length; i++) {
			var key = matches[i].substring(0, matches[i].indexOf('/')),
				value = matches[i].substring(matches[i].indexOf('/') + 1);
			versions[key] = value;
		}
		return versions;
	};

	var _join = function() {
		var result = [];
		for (var i = 0; i < arguments.length - 1; i++) {
			if (arguments[i]) result.push(arguments[i]);
		}
		return result.join(arguments[arguments.length - 1]);
	};

	return {
		user: {
			language: navigator.language,
			dateTime: new Date().toString(),
			timeZone: new Date().getTimezoneOffset() / 60.0
		},
		browser: {
			userAgent: navigator.userAgent,
			app: _join(navigator.appCodeName, navigator.appName, ' '),
			vendor: _join(navigator.vendor, navigator.vendorSub, ' '),
			product: _join(navigator.product, navigator.productSub, ' '),
			versions: getUserAgentVersions(),
			features: {
				canvas: hasCanvasSupported(),
				localStorage: hasLocalStorage(),
				sessionStorage: hasSessionStorage(),
				indexDB: hasIndexedDB()
			}
		},
		hardware: {
			platform: _join(navigator.platform, navigator.cpuClass, ' '),
			screen: { width: screen.width, height: screen.height, colorDepth: screen.colorDepth },
			window: {
				available: { width: screen.availWidth, height: screen.availHeight },
				currentFrameSize: { width: window.outerWidth, height: window.outerHeight },
				currentContentSize: { width: window.innerWidth, height: window.outerHeight }
			}
		}
	};
};
