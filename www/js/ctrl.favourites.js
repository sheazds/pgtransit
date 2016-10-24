angular.module('starter.controllers')

.controller("favouritesCtrl", function($scope, $ionicPlatform, favouritesService)
{
    //$scope.favs = ["test"];

    $scope.$on("$ionicView.enter", function(event, data)
    {
        $scope.favs = favouritesService.getFavourites();

        //if ($scope.favs.length < 1)
        //$scope.favs = ["You have no favourite routes :("];
    });
});