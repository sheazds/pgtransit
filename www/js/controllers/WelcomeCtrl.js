angular.module('starter.controllers').controller('WelcomeCtrl', function($scope, $ionicSideMenuDelegate, $state, $ionicHistory, $ionicSlideBoxDelegate, favouritesService)
  {
      $scope.firstLoad = function()
      {
          if(localStorage.getItem('loadToken')!==null)
          {
              favouritesService.loadFavs();
              $scope.startApp();
          }
      }

      $ionicSideMenuDelegate.canDragContent(false);

      $scope.options =
      {
          loop: false,
          effect: 'scroll',
          speed: 500,
      };

      $scope.startApp = function()
      {
          localStorage.setItem('loadToken', 'Loaded')
          $ionicSideMenuDelegate.canDragContent(true);
          $ionicHistory.nextViewOptions(
          {
              disableBack: true
          });
          $state.go('app.route');
      };

      $scope.next = function()
      {
          $ionicSlideBoxDelegate.next();
      };

      $scope.previous = function()
      {
          $ionicSlideBoxDelegate.previous();
      };

      $scope.slideChanged = function(index)
      {
          $scope.slideIndex = index;
      };

  });