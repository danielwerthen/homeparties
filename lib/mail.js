'use strict';

var Mailgun = require('mailgun-js'),
		config = require('./config/config'),
		apiKey = config.mailgun_apikey,
		domain = config.mailgun_domain,
		gun = new Mailgun({ apiKey: apiKey, domain: domain });

exports.send = function (data, fn) {
	var req = {
		from: data.from || 'webmaster@' + domain,
		to: data.to,
		subject: data.subject || 'This was unfortunate..',
		text: data.text || 'Something bad appears to have appened, we are very sorry for this unexpected occurence!'
	};
	if (!data.to) {
		return fn('No recipient');
	}
	gun.messages().send(req, function (err, body) {
		if (err) {
			return fn(err);
		}
		fn(null, body);
	});
};
