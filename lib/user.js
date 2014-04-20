'use strict';
var moment = require('moment'),
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

function hash(password) {
	return password;
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
		password: hash(data.password),
		activated: false,
		activationCode: hash(activationCode),
		created: moment()
	};
	initActivation(usr, activationCode);
	return usr;
};

exports.store = function (usr, fn) {
	userStore.store(usr, fn);
};

exports.get = function (email, fn) {
	userStore.get(email, fn);
};
