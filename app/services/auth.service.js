'use strict';

class AuthService {
  constructor() {
    this._authToken = undefined;
  }

  get authToken() {
    return this._authToken;
  }

  set authToken(newValue){
    if(newValue){
      this._authToken = newValue;
    }
  }
}

angular
  .module("bp.common")
  .service("bpAuthService", AuthService);
