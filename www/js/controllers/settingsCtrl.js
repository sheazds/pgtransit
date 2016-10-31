angular.module('starter.controllers').controller('settingsCtrl', function($scope, $cordovaLocalNotification, $ionicPlatform, $window)
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
                }).then(function (result) {
                  console.log('Notification 1 triggered');
                });
              };
               $scope.scheduleLocationNotification = function ()
              {

              $cordovaLocalNotification.schedule(
              {
                id: 2,
                title: 'PG Transit',
                text: 'You have enabled Locations',
                data:
                {
                    customProperty: 'custom value'
                }
                }).then(function (result)
                {
                   console.log('Notification 2 triggered');
                });
                };
          });
     $scope.pushNotificationChange = function()
     {
       console.log('Push Notification Change', $scope.pushNotification.checked);
       if ($scope.pushNotification.checked == true)
       {
           $scope.scheduleSingleNotification();
           console.log('Notifications enabled taking action');
       }
     };
     $scope.enableLocationChange = function()
     {
        console.log('Enable Location Change', $scope.pushLocationNotification.checked);
        if($scope.pushLocationNotification.checked == true && $scope.pushNotification.checked == true)
        {
            $scope.scheduleLocationNotification();
            console.log('Location enabled taking action')
        }
     }
      $scope.userName = localStorage.getItem('username');
        $scope.saveName = function()
        {
          localStorage.setItem('username', document.getElementById('userNameBox').value);
        };
   });
