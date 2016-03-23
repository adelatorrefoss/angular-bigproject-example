// Declare app level module

'use strict';

angular.module('myApp', ['ngRoute', 'ngCookies', 'templates',
                             'bp.home', 'bp.login', 'bp.dashboard', 'bp.reports', 'bp.common',
                             'test.detail'
                            ]);

function RouterConfig($routeProvider, $locationProvider) {
  $routeProvider

    .when('/', {
      template: '<home/>'
    })

    .when('/login', {
      template: '<login/>',
      requiresNoAuthentication: true,
      reloadOnSearch: false
    })

    .when('/dashboard', {
      template: '<dashboard/>',
      requiresAuthentication: true
    })

    .when('/reports', {
      template: '<reports/>',
      requiresAuthentication: true
    })

  // test
    .when('/detail/:id', {
      template: '<detail/>'
    })

    .otherwise({
      templateUrl: 'errors/404.html'
    });

  $locationProvider.html5Mode({
    enabled: true,
    requireBase: false});
}

function appInit($cookies, $location, $rootScope, bpAuthService) {
  // get token
  const token = $cookies.get('token');
  bpAuthService.authToken = token;

  // url requires authentication
  $rootScope.$on('$routeChangeStart',  (event, current) => {
    const nextUrl = current.originalPath;
    const noAuthUrl = '/login';

    if (current.requiresAuthentication) {
      if (bpAuthService.authToken === undefined) {
        $location.path(noAuthUrl).search("next",nextUrl);
      }
    } else if (current.requiresNoAuthentication) {
      if (bpAuthService.authToken) {
        $location.path("/");
      }
    }
  });
}


function AppController() {}

angular.module('myApp')
  .config(RouterConfig)
  .controller('AppController', AppController)
  .run(appInit);
