/*jslint node: true */
'use strict';

var utils = require('../lib/utils'),
    insecurity = require('../lib/insecurity'),
    models = require('../models/index'),
    cache = require('../data/datacache'),
    challenges = cache.challenges,
    users = cache.users,
    products = cache.products;

exports.forgedFeedbackChallenge = function () {
    return function (req, res, next) {
        /* jshint eqeqeq:false */
        if (utils.notSolved(challenges.forgedFeedbackChallenge)) {
            var user = insecurity.authenticatedUsers.from(req);
            var userId = user ? user.data.id : undefined;
            if (req.body.UserId && req.body.UserId != userId) {
                utils.solve(challenges.forgedFeedbackChallenge);
            }
        }
        next();
    };
};

exports.accessControlChallenges = function () {
    return function (req, res, next) {
        if (utils.notSolved(challenges.scoreBoardChallenge) && utils.endsWith(req.url, '/scoreboard.png')) {
            utils.solve(challenges.scoreBoardChallenge);
        } else if (utils.notSolved(challenges.adminSectionChallenge) && utils.endsWith(req.url, '/administration.png')) {
            utils.solve(challenges.adminSectionChallenge);
        }
        next();
    };
};

exports.errorHandlingChallenge = function () {
    return function (err, req, res, next) {
        if (utils.notSolved(challenges.errorHandlingChallenge) && err && res.statusCode > 401) {
            utils.solve(challenges.errorHandlingChallenge);
        }
        next(err);
    };
};

exports.databaseRelatedChallenges = function () {
    return function (req, res, next) {
        if (utils.notSolved(challenges.changeProductChallenge) && products.osaft) {
            products.osaft.reload().success(function () {
                if (!utils.contains(products.osaft.description, '<a href="https://www.owasp.org/index.php/O-Saft" target="_blank">')) {
                    if (utils.contains(products.osaft.description, '<a href="http://kimminich.de" target="_blank">')) {
                        utils.solve(challenges.changeProductChallenge);
                    }
                }
            });
        }
        if (utils.notSolved(challenges.csrfChallenge) && users.bender) {
            users.bender.reload().success(function () {
                if (users.bender.password === insecurity.hash('slurmCl4ssic')) {
                    utils.solve(challenges.csrfChallenge);
                }
            });
        }
        if (utils.notSolved(challenges.feedbackChallenge)) {
            models.Feedback.findAndCountAll({where: {rating: 5}}).success(function (feedbacks) {
                if (feedbacks.count === 0) {
                    utils.solve(challenges.feedbackChallenge);
                }
            });
        }
        if (utils.notSolved(challenges.knownVulnerableComponentChallenge)) {
            models.Feedback.findAndCountAll({where: models.Sequelize.and(['comment LIKE \'%sanitize-html%\''], ['comment LIKE \'%1.4.2%\''])}
            ).success(function (data) {
                    if (data.count > 0) {
                        utils.solve(challenges.knownVulnerableComponentChallenge);
                    }
                });
        }
        if (utils.notSolved(challenges.weirdCryptoChallenge)) {
            models.Feedback.findAndCountAll({where: models.Sequelize.or(['comment LIKE \'%z85%\''], ['comment LIKE \'%base85%\''], ['comment LIKE \'%rot13%\''])}
            ).success(function (data) {
                    if (data.count > 0) {
                        utils.solve(challenges.weirdCryptoChallenge);
                    }
                });
        }
        next();
    };
};