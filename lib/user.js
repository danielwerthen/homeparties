'use strict';
var moment = require('moment'),
	bcrypt = require('bcrypt'),
	mail = require('./mail'),
	userStore = (function () {
		var storage = {};
		return {
			store: function (usr, fn) {
				storage[usr.email] = usr;
				return fn(null, usr);
			}, get: function (email, fn) {
				var usr = storage[email];
				if (!usr) {
					return fn('Not found');
				}
				fn(null, usr);
			}
		};
	})();

function hash(password, fn) {
	bcrypt.hash(password, 10, fn);
}

function getActivationCode(email) {
	return 'secret';
}

function initActivation(usr, retry) {
	mail.send({
		to: usr.email,
		subject: 'Aktivera ditt homeparty konto',
		text: 'Hej!\n\nSurfa in på denna adress så kommer ditt konto att aktiveras:\nhttp://homeparti.es/activate/' + usr.activationCode
	}, function (err) {
		if (err && retry < 5) {
			setTimeout(function () {
				initActivation(usr, retry + 1);
			}, 10000);
		}
	});
}

exports.create = function (data) {
	var activationCode = getActivationCode(),
		usr = {
		name: data.name,
		email: data.email,
		activated: false,
		created: moment()
	};
	hash(data.password, function (err, phash) {
		if (err) {
			return console.dir('Something bad happend with password hashing');
		}
		hash(activationCode, function (err, ahash) {
			if (err) {
				return console.dir('Something bad happend with activationCode hashing');
			}
			usr.password = phash;
			usr.activationCode = ahash;
			userStore.store(usr, function (err) {
				if (err) {
					return console.dir('Something bad happend with user store at create');
				}
			});
		});
	});
	initActivation(usr, activationCode);
	return usr;
};

exports.store = function (usr, fn) {
	userStore.store(usr, fn);
};

exports.get = function (email, fn) {
	userStore.get(email, fn);
};

exports.login = function (email, password, fn) {
	userStore.get(email, function (err, usr) {
		if (err) {
			return fn(err);
		}
		bcrypt.compare(password, usr.password, function (err, res) {
			if (err) {
				return fn(err);
			} else if (!res) {
				return fn('Password did not match');
			}
			fn(null, usr);
		});
	});
};
