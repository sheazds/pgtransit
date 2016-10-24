angular.module('starter.controllers', ['ionic', 'ngCordova'])

 .controller('settingsName', function($scope)
 {
   $scope.userName = localStorage.getItem('username');
   $scope.saveName = function()
   {
     localStorage.setItem('username', document.getElementById('userNameBox').value);
   };
 })


  .controller("stopCtrl2", function ($scope, stopService1)
  {
    var promise = stopService1.getCo();
    promise.then(function (data)
    {
      $scope.co = data.data;
      console.log($scope.co);
    });
  })