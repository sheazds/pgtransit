angular.module('starter.controllers').controller('settingsCtrl', function ($scope, $state, $cordovaLocalNotification, $cordovaGeolocation, $ionicPlatform, $ionicLoading, $window)
{
    mixpanel.track("Setting", {"setting": 'settingsCtrl'});
    $ionicPlatform.ready(function ()
    {
        //Wrap notifications in a ready function to prevent issues with android devices.
        //Maybe move to a more generic notification system that could be implemented?
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

    //Loads the saved state of the notification toggle.
    $scope.pushNotification = {checked: JSON.parse(localStorage.getItem("Notifications"))};
    //Enable notifications for the app.
    $scope.pushNotificationChange = function ()
    {
        console.log('Push Notification Change', $scope.pushNotification.checked);
        localStorage.setItem("Notifications", JSON.stringify($scope.pushNotification.checked)); //Saves toggle.
        if ($scope.pushNotification.checked)
        {
            $scope.scheduleSingleNotification();
            console.log('Notifications enabled taking action');
        }
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
