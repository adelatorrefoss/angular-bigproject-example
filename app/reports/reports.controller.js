'use strict';

class ReportsController {
  constructor() {
    console.log('reports controller');
  }
}

angular.module('bp.reports')
  .component('reports', {
    templateUrl: 'reports/reports.html',
    controller: ReportsController
  })
  .controller('ReportsController', ReportsController);
