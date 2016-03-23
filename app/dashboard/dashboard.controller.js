'use strict';

class DashboardController {
  constructor(bpCommentService) {
    this.bpCommentService = bpCommentService;

    // this.comments = [];
    Object.defineProperty(this, 'comments', {
      get: () => this.bpCommentService.comments
    });

    this.error = {};

    this.bpCommentService.fetchComments()
      .catch((error) => this.error = error);
  }
}

angular.module('bp.dashboard')
  .component('dashboard', {
    templateUrl: 'dashboard/dashboard.html',
    controller: DashboardController
  })
  .controller('DashboardController', DashboardController);
