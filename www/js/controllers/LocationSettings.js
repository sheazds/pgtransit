angular.module('starter.controllers').controller('LocationSettings', function($scope, $cordovaGeolocation, $ionicPlatform)
 {
     $scope.checkLocation = function()
     {
       if (window.cordova)
       {
       cordova.plugins.diagnostic.isLocationEnabled(
                     function(e) {
                         if (e){
                            alert("Location already turned on");
                         }
                         else {
                           alert("Location Not Turned ON");
                           cordova.plugins.diagnostic.switchToLocationSettings();
                         }
                     },
                     function(e) {
                         alert('Error ' + e);
                     }
                 );
             }
     }
     $scope.getLocation = function(){
         $scope.checkLocation();
         $scope.supportsGeo = $window.navigator;
         $scope.position = null;
         $window.navigator.geolocation.getCurrentPosition(function(position) {
                     $scope.$apply(function() {
                         $scope.position = position;
                         var link = "http://maps.google.com/maps?saddr="+$scope.position.coords.latitude+","+$scope.position.coords.longitude+"&daddr="+$scope.address;

                         $window.open(encodeURI(link), '_blank', 'location=no');
                     });
                   }, function(error) {
                       alert(error);
                   },{enableHighAccuracy: true});

         }

 });
