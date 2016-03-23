'use strict';

class HttpService {

  constructor($http, bpConfigService, bpAuthService) {
    this.$http = $http;
    this.bpConfigService = bpConfigService;
    this.bpAuthService = bpAuthService;

    this.__proto__.get = this.httpMethod('get');
    this.__proto__.post = this.httpMethod('post');
    this.__proto__.put = this.httpMethod('put');
    this.__proto__.patch = this.httpMethod('patch');
    this.__proto__.delete = this.httpMethod('delete');

    this.apiUrl = bpConfigService.apiUrl;

    console.log(`[HttpService] api url points to '${this.apiUrl}'`);
  }

  httpMethod(method) {
    return function requestUrl(url, ...args) {
      const authorization = this.bpAuthService.authToken;
      if (authorization !== null) {
        this.$http.defaults.headers.common['Authorization'] = authorization;
      } else {
        delete this.$http.defaults.headers.common.Authorization;
      }

      return this.$http[method](`${this.apiUrl}${url}`, ...args)
        .then((response) => {
          return response.data;
        })
        .catch((error) => {
          // manage status
          console.log('HTTP ERROR STATUS:',error.status);

          console.log('HTTP ERROR:',error);
          throw(error.data);
        });
    };
  }

}

angular
  .module("bp.common")
  .service("bpHttpService", HttpService);



// /*global angular, WyshConfig, R, WyshUtils */

// (function() {
//   'use strict';

//   angular
//     .module('wysh.common')
//     .service('wyHttp', HttpService)
//   ;

//   function HttpService($http, $log, $rootScope, wySession) {
//     this.apiUrl = WyshConfig.apiUrl;
//     this.http = $http;
//     this.log = $log;
//     this.scope = $rootScope;
//     this.session = wySession;

//     this.log.debug(`[HttpService] api url points to '${this.apiUrl}'`);
//   }

//   const supportedResponseCodes = [200, 201, 202, 204,
//                                   301, 302, 303, 304, 307, 308,
//                                   400, 401, 403, 404, 405, 406, 409,
//                                   500];

//   HttpService.prototype.getAuthorizationHeader = getAuthorizationHeader;
//   HttpService.prototype.getAcceptLanguageHeader = getAcceptLanguageHeader;
//   HttpService.prototype.getAbsoluteUrl = getAbsoluteUrl;
//   HttpService.prototype.supportedMethods = new Set();

//   HttpService.prototype.get = httpMethod(HttpService, 'get');
//   HttpService.prototype.post = httpMethod(HttpService, 'post');
//   HttpService.prototype.put = httpMethod(HttpService, 'put');
//   HttpService.prototype.patch = httpMethod(HttpService, 'patch');
//   HttpService.prototype.delete = httpMethod(HttpService, 'delete');

//   for (let code of supportedResponseCodes) {
//     HttpService.prototype[`is${code}`] = R.compose(R.eq(code), R.prop('status'));
//   }
//   HttpService.prototype.isConnectionError = R.compose(R.eq(0), R.prop('status'));
//   HttpService.prototype.isResponseSuccess = R.compose(R.and(R.gte(R.__, 200), R.lt(R.__, 300)), R.prop('status'));
//   HttpService.prototype.isResponseRedirect = R.compose(R.and(R.gte(R.__, 300), R.lt(R.__, 400)), R.prop('status'));
//   HttpService.prototype.isResponseClientError = R.compose(R.and(R.gte(R.__, 400), R.lt(R.__, 500)), R.prop('status'));
//   HttpService.prototype.isServerError = R.compose(R.gte(R.__, 500), R.prop('status'));

//   function getAbsoluteUrl(url='') {
//     return `${this.apiUrl}${url}`;
//   }

//   function getAuthorizationHeader() {
//     const { token } = this.session.get();
//     if (token !== null) {
//       return `Bearer ${token}`;
//     } else {
//       return null
//     }
//   }

//   function getAcceptLanguageHeader() {
//     const { locale } = this.session.get();
//     return locale;
//   }

//   function httpMethod(obj, method) {
//     obj.prototype.supportedMethods.add(method.toUpperCase());

//     return function requestUrl(url, ...args) {
//       const isNotLoginRequest = () => url !== '/auth';
//       const logResponse = (resp) => {
//         this.log.debug(`[HttpService] ${method.toUpperCase()} ${this.getAbsoluteUrl(url)} -> ${resp.status}`);
//         this.log.debug(`[HttpService] Accept-Language: ${this.http.defaults.headers.common['Accept-Language']}`);
//       };

//       const authorization = this.getAuthorizationHeader();
//       if (authorization !== null) {
//         this.http.defaults.headers.common['Authorization'] = authorization;
//       } else {
//         delete this.http.defaults.headers.common.Authorization;
//       }

//       this.http.defaults.headers.common['Accept-Language'] = this.getAcceptLanguageHeader();

//       return Promise.resolve(this.http[method](this.getAbsoluteUrl(url), ...args))
//         .then(WyshUtils.P.wrap(logResponse))
//         .catch(WyshUtils.P.raise(logResponse))
//         .catch(this.isConnectionError, WyshUtils.P.raise(emitConnectionError(this.scope)))
//         .catch(this.isServerError, WyshUtils.P.raise(emitServerError(this.scope)))
//         .catch(R.both(this.is401, isNotLoginRequest), WyshUtils.P.raise(emitAuthenticationError(this.scope)))
//         .catch(this.is403, WyshUtils.P.raise(emitAuthorizationError(this.scope)))
//         .catch(this.is404, WyshUtils.P.raise(emitNotFoundError(this.scope)))
//       ;
//     };
//   }

//   const emitConnectionError = R.curry(function emitConnectionError(scope, error) {
//     scope.$emit('wyHttpConnectionError');
//   });

//   const emitServerError = R.curry(function emitServerError(scope, error) {
//     scope.$emit('wyHttpServerError');
//   });

//   const emitAuthenticationError = R.curry(function emitAuthenticationError(scope, error) {
//     scope.$emit('wyHttpAuthenticationError', error);
//   });

//   const emitAuthorizationError = R.curry(function emitAuthorizationError(scope, error) {
//     scope.$emit('wyHttpAuthorizationError');
//   });

//   const emitNotFoundError = R.curry(function emitNotFoundError(scope, error) {
//     scope.$emit('wyHttpNotFoundError');
//   });

// })();
