function OnConfig($stateProvider, $locationProvider, $urlRouterProvider) {
  'ngInject';

  $locationProvider.html5Mode(true);

  $stateProvider
    .state('SnapShot', {
      url: '/',
      controller: 'SnapShot as snapshot',
      templateUrl: 'snapshots.html',
      title: 'SnapShot'
    })
    .state('Home', {
      url: '/home',
      controller: 'HomeCtrl as home',
      templateUrl: 'home.html',
      title: 'Home'
    });

  $urlRouterProvider.otherwise('/');

}

export default OnConfig;
