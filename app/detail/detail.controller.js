angular.module('test.detail')
.component('detail', {
    templateUrl: 'detail/detail.html',
    controller: DetailController
  })
  .controller('DetailController', ['$routeParams', DetailController]);

function DetailController ($routeParams) {
  this.id = $routeParams.id;
}
