angular.module('starter.controllers', [])

.controller('SidemenuController', function ($scope, $ionicSideMenuDelegate) {
  $scope.initialize = function () {
    $ionicSideMenuDelegate.canDragContent(false);
  }

  $scope.toggleLeft = function () {
    $ionicSideMenuDelegate.toggleLeft();
  };
})

.controller('MapController', function ($scope, $ionicModal, $state) {
  // TODO: Añadir a $scope.userImage la imagen del usuario actual (si inició sesión)
  loadMap();

  // Creación del popup que pide que el usuario inicie sesión
  $ionicModal.fromTemplateUrl('templates/login-modal.html', {
    scope: $scope,
    animation: 'slide-in-up'
  }).then(function(modal) {
    $scope.modal = modal;
  });

  $scope.addNotification = function () {
    var loggedIn = true;
    if (loggedIn) {
      $state.go('add.map');
    }
    else {
      $scope.modal.show();
    }
  };

  $scope.closeModal = function () {
    $scope.modal.hide();
  };

  $scope.$on('$destroy', function () {
    $scope.modal.remove();
  });
})

.controller('ProfileController', function ($scope) {
  // TODO: Añadir a $scope todos los datos del usuario actual (si inició sesión)
  // Dependiendo de esta variable se muestra la pantalla de inicio de sesión o el perfil
  $scope.loggedIn = false;
})

.controller('AddController', function ($scope) {
  // TODO: Añadir a $scope.userImage la imagen del usuario actual (si inició sesión)
});
