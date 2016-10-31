angular.module('starter.controllers').controller('settingsName', function($scope)
 {
   $scope.userName = localStorage.getItem('username');
   $scope.saveName = function()
   {
     localStorage.setItem('username', document.getElementById('userNameBox').value);
   };
 });
