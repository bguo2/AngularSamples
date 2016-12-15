var app = angular.module('EcommerceApp', ['ngRoute'])
   .config([
    '$locationProvider', '$routeProvider',
    function ($locationProvider, $routeProvider) {
        $locationProvider.html5Mode({
            enabled: true,
            requireBase: false
        }).hashPrefix('!');

        $routeProvider
        .when('/', { // For Home Page
            controller: 'HomeController'
        })
        .when('/Login', { // For Login Page
            templateUrl: '/Static/Login.html',
            controller: 'LoginController'
        })
        .when('/Admin', { // For Admin Page
            templateUrl: '/Static/Admin.html',
            controller: 'AdminController'
        })
        .otherwise({   // This is when any route not matched => error
            controller: 'ErrorController'
        })
    }]);