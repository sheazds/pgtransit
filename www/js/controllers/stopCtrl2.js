angular.module('starter.controllers').controller("stopCtrl2", function ($scope, stopService1)
{
  var promise = stopService1.getCo();
  promise.then(function (data)
  {
    $scope.co = data.data;
    console.log($scope.co);
  });
});