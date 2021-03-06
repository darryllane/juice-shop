/*jslint node: true */

var frisby = require('frisby');

var URL = 'http://localhost:3000';

frisby.create('GET redirected to https://github.com/bkimminich/juice-shop when this URL is passed as "to" parameter')
    .get(URL + "/redirect?to=https://github.com/bkimminich/juice-shop")
    .expectStatus(200)
    .expectHeaderContains('content-type', 'text/html')
    .expectBodyContains('<title>bkimminich/juice-shop · GitHub</title>')
    .toss();

frisby.create('GET redirected to https://gratipay.com/bkimminich when this URL is passed as "to" parameter')
    .get(URL + "/redirect?to=https://gratipay.com/bkimminich")
    .expectStatus(200)
    .expectHeaderContains('content-type', 'text/html')
    .expectBodyContains('<title>bkimminich - Gratipay</title>')
    .toss();

frisby.create('GET redirected to https://blockchain.info/address/1FXJq5yVANLzR6ZWfqPKhJU3zWT3apnxmN when this URL is passed as "to" parameter')
    .get(URL + "/redirect?to=https://blockchain.info/address/1FXJq5yVANLzR6ZWfqPKhJU3zWT3apnxmN")
    .expectStatus(200)
    .expectHeaderContains('content-type', 'text/html')
    .expectBodyContains('1FXJq5yVANLzR6ZWfqPKhJU3zWT3apnxmN</title>')
    .toss();

frisby.create('GET error message with information leakage when calling /redirect without query parameter')
    .get(URL + "/redirect")
    .expectStatus(500)
    .expectHeaderContains('content-type', 'text/html')
    .expectBodyContains('<h1>Juice Shop (Express ~')
    .expectBodyContains('TypeError: Cannot call method &#39;indexOf&#39; of undefined')
    .toss();

frisby.create('GET error message with information leakage when calling /redirect with unrecognized query parameter')
    .get(URL + "/redirect?x=y")
    .expectStatus(500)
    .expectHeaderContains('content-type', 'text/html')
    .expectBodyContains('<h1>Juice Shop (Express ~')
    .expectBodyContains('TypeError: Cannot call method &#39;indexOf&#39; of undefined')
    .toss();

frisby.create('GET error message hinting at whitelist validation when calling /redirect with an unrecognized "to" target')
    .get(URL + "/redirect?to=whatever")
    .expectStatus(406)
    .expectHeaderContains('content-type', 'text/html')
    .expectBodyContains('<h1>Juice Shop (Express ~')
    .expectBodyContains('Unrecognized target URL for redirect: whatever')
    .toss();

frisby.create('GET redirected to target URL when https://github.com/bkimminich/juice-shop is part of the as "to" parameter')
    .get(URL + "/redirect?to=/score-board?satisfyIndexOf=https://github.com/bkimminich/juice-shop")
    .expectStatus(200)
    .expectHeaderContains('content-type', 'text/html')
    .expectBodyContains('<title>Juice Shop</title>')
    .toss();