/* use strict */
var app = angular.module("NameApp", []);

app.service("nameService", function ($http, $q)
{
	var deferred = $q.defer();
	$http.get('resource/sample.json').then(function (data)
	{
		deferred.resolve(data);
	});

	this.getNames = function ()
	{
		return deferred.promise;
	}
})

.controller("nameCtrl", function ($scope, nameService)
{
	var promise = nameService.getNames();
	promise.then(function (data)
	{
		$scope.names = data.data;
		console.log($scope.names);
	});
})
