'use strict';

class HomeController {
  constructor() {
    this.name = 'Friend';
  }
}
angular.module('bp.home')
  .component('home', {
    templateUrl: 'home/home.html',
    controller: HomeController
  })
  .controller('HomeController', HomeController);
