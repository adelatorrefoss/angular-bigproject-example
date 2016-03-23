'use strict';


describe('home', function() {

  var $controller;

  beforeEach(module('bp.home'));

  beforeEach(inject(function(_$controller_) {
    // The injector unwraps the underscores (_) from around the parameter names when matching
    $controller = _$controller_;
  }));

  // beforeEach(function () {
    // sinon.stub(dataservice, 'getAvengers', function() {
    //     var deferred = $q.defer();
    //     deferred.resolve(mockData.getMockAvengers());
    //     return deferred.promise;
    // });

    // sinon.stub(dataservice, 'ready', function() {
    //     var deferred = $q.defer();
    //     deferred.resolve({test: 123});
    //     return deferred.promise;
    // });

  // });


  describe('home controller', function(){
    it('should be created successfully', function () {
      var controller = $controller('HomeController');
      // var controller = $controller('PasswordController', { $scope: $scope });

      expect(controller).to.be.defined;
    });


  });
});

// describe('PasswordController', function() {
//   beforeEach(module('app'));

//   var $controller;

//   beforeEach(inject(function(_$controller_){
//     // The injector unwraps the underscores (_) from around the parameter names when matching
//     $controller = _$controller_;
//   }));

//   describe('$scope.grade', function() {
//     var $scope, controller;

//     beforeEach(function() {
//       $scope = {};
//       controller = $controller('PasswordController', { $scope: $scope });
//     });

//     it('sets the strength to "strong" if the password length is >8 chars', function() {
//       $scope.password = 'longerthaneightchars';
//       $scope.grade();
//       expect($scope.strength).toEqual('strong');
//     });

//     it('sets the strength to "weak" if the password length <3 chars', function() {
//       $scope.password = 'a';
//       $scope.grade();
//       expect($scope.strength).toEqual('weak');
//     });
//   });
// });
