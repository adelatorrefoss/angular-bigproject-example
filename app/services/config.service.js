'use strict';

class ConfigService {
  constructor() {
    this.apiUrl = 'http://jsonplaceholder.typicode.com';
  }
}

angular
  .module("bp.common")
  .service("bpConfigService", ConfigService);
