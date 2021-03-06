/*jslint node: true */
'use strict';

var spawn = require('win-spawn'),
    SauceLabs = require('saucelabs'),
    colors = require('colors/safe'),
    server = require('./../server.js');

server.start({ port: 3000 }, function () {
    var protractor = spawn('protractor', [ 'protractor.conf.js' ]);

    function logToConsole(data) {
        console.log(String(data));
    }

    protractor.stdout.on('data', logToConsole);
    protractor.stderr.on('data', logToConsole);

    protractor.on('exit', function (exitCode) {
        console.log('Protractor exited with code ' + exitCode + ' (' + (exitCode === 0 ? colors.green('SUCCESS') : colors.red('FAILED')) + ')');
        if (process.env.TRAVIS_BUILD_NUMBER && process.env.SAUCE_USERNAME && process.env.SAUCE_ACCESS_KEY) {
            setSaucelabJobResult(exitCode);
        } else {
            server.close(exitCode);
        }
    });
});

function setSaucelabJobResult(exitCode) {
    var sauceLabs = new SauceLabs({ username: process.env.SAUCE_USERNAME, password: process.env.SAUCE_ACCESS_KEY });
    sauceLabs.getJobs(function (err, jobs) {
        for (var j in jobs) {
            if (jobs.hasOwnProperty(j)) {
                sauceLabs.showJob(jobs[j].id, function (err, job) {
                    var tags = job.tags;
                    if (tags.indexOf(process.env.TRAVIS_BUILD_NUMBER) > -1 && tags.indexOf('e2e') > -1) {
                        sauceLabs.updateJob(job.id, { passed : exitCode === 0 }, function(err, res) {
                            console.log('Marked job ' + job.id + ' for build #' + process.env.TRAVIS_BUILD_NUMBER + ' as ' + (exitCode === 0 ? colors.green('PASSED') : colors.red('FAILED')) + '.');
                            server.close(exitCode);
                        });
                    }
                });
            }
        }
    });
}