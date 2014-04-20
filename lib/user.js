'use strict';
var moment = require('moment'),
	mail = require('./mail');

function hashPassword(password) {
	return password;
}

function getActivationCode(email) {
	return email + '|' + 'secret';
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

exports.createUser = function (data) {
	var usr = {
		name: data.name,
		email: data.email,
		password: data.password,
		activated: false,
		activationCode: getActivationCode(data.email),
		created: moment()
	};
	initActivation(usr);
	return usr;
};
