angular.module('starter.controllers').controller('settingsCtrl', function($scope, $cordovaLocalNotification, $cordovaGeolocation, $ionicPlatform, $ionicLoading, $window)
   {
    $ionicPlatform.ready(function ()
    {
        $scope.scheduleSingleNotification = function ()
        {
            $cordovaLocalNotification.schedule(
            {
                id: 1,
                title: 'PG Transit',
                text: 'You have enabled Notifications',
                data: {
                        customProperty: 'custom value'
                      }
            }).then(function (result)
            {
            console.log('Notification "Enable" triggered');
            });
        };
    });

    $scope.pushNotification = { checked: JSON.parse(localStorage.getItem("Notifications")) };

     $scope.pushNotificationChange = function()
     {
       console.log('Push Notification Change', $scope.pushNotification.checked);
       localStorage.setItem("Notifications", JSON.stringify($scope.pushNotification.checked));
       if ($scope.pushNotification.checked)
       {
           $scope.scheduleSingleNotification();
           console.log('Notifications enabled taking action');
       }
     }

     $scope.requestLocationAccess = function()
     {
        var posOptions = {timeout: 10000, enableHighAccuracy: true};
                $cordovaGeolocation.getCurrentPosition(posOptions).then(function(position)
                {
                  //Execute code on Success
                  //Requests location access from user.
                },
                function(err)//Called when permission isn't acquired.
                {
                  $ionicLoading.hide();
                  $ionicLoading.show(
                  {
                    template: 'Could not get access to location. Please try again.',
                    duration: 1000
                  });
                });
     }

    $scope.goToLocation = function()
    {
        cordova.plugins.diagnostic.switchToLocationSettings();
    }

   });
