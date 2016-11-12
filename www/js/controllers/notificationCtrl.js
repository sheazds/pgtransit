angular.module('starter.controllers')

.controller("notificationCtrl", function($scope, $cordovaLocalNotification, $ionicPlatform, notificationService) {

    $scope.routes = notificationService.getNotifications();

    $scope.removeItem = function(item)//Remove item from the list.
    {
        if (notificationService.hasItem(item))
        {
            notificationService.removeItem(item);
            notificationService.saveNotifications();
        }
    }
});