angular.module('starter.controllers').controller("timesCtrl", function ($scope, shareService, timesService, notificationService, $ionicLoading)
{
    $scope.filteredTimes = [];
    $scope.route_id = shareService.getRouteName();
    $scope.stop_id = shareService.getStopID();

    var stopPromise = timesService.getTimes($scope.route_id);
    stopPromise.then(function (data)
    {
        $scope.times = data.data;
        for (var i = 0; i < $scope.times.length; i ++)
        {
            if ($scope.times[i].stop_id == $scope.stop_id)
            {
                $scope.filteredTimes.push($scope.times[i]);
            }
        }
    });

    $scope.editNotification = function(c)
    {
        if (notificationService.hasItem(c))
        {
            notificationService.removeItem(c);
            notificationService.saveNotifications();
            $ionicLoading.show(
            {
                template: 'Notifications disabled.',
                duration: 500
            });
        }
        else
        {
            //This code sets up a date object to pass to the notification service.
            var time = c.arrival_time;
            var hms = time.split(':');//Splits arrival time into hours, minutes, seconds.

            //Cordova Local Notifications seem to lag in terms of when they arrive, and so do buses. To give the user a heads up we set the notification to arrive early.
            //Set up a setting variable so that the user can modify?
            var notifyDate = new Date();
            notifyDate.setHours(hms[0]);
            notifyDate.setMinutes(hms[1] - 12);//-12 minutes, javascript data object allows -minutes
            notifyDate.setSeconds(hms[2]);

            notificationService.scheduleNotificationLater('PG Bus', $scope.route_id + ' is due to arrive soon!', notifyDate, 1);
            notificationService.setNotification(c);
            notificationService.saveNotifications();
            $ionicLoading.show(
            {
                template: 'Notifications enabled.',
                duration: 500
            });
        }
    }

    //For setting notification bell icon.
    $scope.hasNotify = function(c)
    {
        if (notificationService.hasItem(c))
            return true;
        else
            return false;
    }
});