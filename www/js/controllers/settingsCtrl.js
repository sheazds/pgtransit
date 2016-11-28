angular.module('starter.controllers').controller('settingsCtrl', function ($scope, $state, $cordovaLocalNotification, $cordovaGeolocation, $ionicPlatform, $ionicLoading, $window, notificationService)
{
  mixpanel.track("Setting", {"setting": 'settingsCtrl'});

  //Loads the saved state of the notification toggle.
  if (JSON.parse(localStorage.getItem("Notifications")) === null)
    $scope.pushNotification = {checked: false};
  else
    $scope.pushNotification = {checked: JSON.parse(localStorage.getItem("Notifications"))};

  //Enable notifications for the app.
  $scope.pushNotificationChange = function ()
  {
    console.log('Push Notification Change', $scope.pushNotification.checked);
    localStorage.setItem("Notifications", JSON.stringify($scope.pushNotification.checked)); //Saves toggle.
    if ($scope.pushNotification.checked)
    {
      notificationService.scheduleNotificationNow('PG Transit', 'You have enabled notifications');
      console.log('Notifications reloading taking action');
    }
    else
        notificationService.cancelNotifications();
  }

  //Request location access from the user.
  $scope.requestLocationAccess = function ()
  {
    var posOptions = {timeout: 10000, enableHighAccuracy: true};
    $cordovaGeolocation.getCurrentPosition(posOptions).then(function (position)
      {
        //Execute code on Success
        //Requests location access from user.
      },
      function (err)//Called when permission isn't acquired.
      {
        $ionicLoading.hide();
        $ionicLoading.show(
          {
            template: 'Could not get access to location. Please try again.',
            duration: 1000
          });
      });
  }

  //Opens up location services on android devices.
  $scope.goToLocation = function ()
  {
    cordova.plugins.diagnostic.switchToLocationSettings();
  }

  //Loads about us page
  $scope.goToAbout = function ()
  {
    $state.go('app.about')
  }

});
