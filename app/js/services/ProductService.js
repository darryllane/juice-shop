angular.module('myApp').factory('ProductService', ['$http', function ($http) {
    'use strict';

    var host = '/api/Products';

    function find(params) {
        return $http.get(host + '/', {
            params: params
        });
    }

    function get(id) {
        return $http.get(host + '/' + id);
    }

    function search(criteria) {
        return $http.get('/rest/product/search?q=' + criteria);
    }

    return {
        find: find,
        get: get,
        search: search
    };
}]);