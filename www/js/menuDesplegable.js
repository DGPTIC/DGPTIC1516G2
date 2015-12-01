
var app = angular.module('ionicApp', ['ionic']);

app.controller('Controller1', function($scope, $ionicSideMenuDelegate) {

  $scope.initialize = function() {
	$ionicSideMenuDelegate.canDragContent(false);
  }

  $scope.toggleLeft = function() {

    $ionicSideMenuDelegate.toggleLeft();

  };


});


app.controller('Controller2', function($scope, $ionicModal) {
  
  $scope.contacts = [
    { name: 'Gordon Freeman' },
    { name: 'Barney Calhoun' },
    { name: 'Lamarr the Headcrab' },
  ];

  $ionicModal.fromTemplateUrl('profile.html', {
    scope: $scope
  }).then(function(modal) {
    $scope.modal = modal;
  });
  
  $scope.createContact = function(u) {        
    $scope.contacts.push({ name: u.firstName + ' ' + u.lastName });
    $scope.modal.hide();
  };

});

