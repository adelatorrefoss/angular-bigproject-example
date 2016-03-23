'use strict';

class LoginController {
  constructor($filter, $cookies, $location, $routeParams,
              bpConfigService, bpAuthService, bpHttpService) {

    this.$filter = $filter;
    this.$cookies = $cookies;
    this.$location = $location;
    this.$routeParams = $routeParams;
    this.bpConfigService = bpConfigService;
    this.bpAuthService = bpAuthService;
    this.bpHttpService = bpHttpService;

    this.user = {
      email: 'Insert email',
      password: ''
    };

    this.errors = {};
    this.inProgress = false;
  }

  loginRequest(user) {

    // loginservice
    // httpService
    // - config.apiUrl
    // - add authentication header
    //    if token
    //        insert header
    // configService

    this.inProgress = true;

    // this.bpHttpService.post('/login',
    //   change to posts for api fake
    this.bpHttpService.post('/posts',
      {
        "email": user.email,
        "password": user.password
      })
      .then((data) => this.loginOk(data))
      .catch((data) => this.loginError(data))
      .finally(() => this.loginFin());
  }

  loginOk(data) {
    // const token = data.token;

    const token = "a0c875d5-a418-4139-8c1f-f358e7ab9f79";

    // save token in state and cookie
    this.bpAuthService.authToken = token;
    this.$cookies.put('token', token);

    // redirect
    let nextPath = '/dashboard';
    if (this.$routeParams.next) {
      nextPath = this.$routeParams.next;
    }
    this.$location.search('next',null);
    this.$location.path(nextPath);

    // errors
    this.errors = {};
  }

  loginError(data) {
    this.errors = data;
  }

  loginFin() {
    this.inProgress = false;
  }

}

angular
  .module('bp.login')
  .component('login', {
    templateUrl: 'login/login.html',
    controller: LoginController
  })
  .controller('LoginController', LoginController);
