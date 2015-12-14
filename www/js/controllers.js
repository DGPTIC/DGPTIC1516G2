angular.module('starter.controllers', [])

.controller('SidemenuController', function ($scope, $ionicSideMenuDelegate) {
  $scope.initialize = function () {
    $ionicSideMenuDelegate.canDragContent(false);
  }

  $scope.toggleLeft = function () {
    $ionicSideMenuDelegate.toggleLeft();
  };
})

.controller('MenuController', function ($scope) {
  $scope.filter = function () {
    var prefix = "";

    function queryStr (b, value) {
      var str = "";

      if (b === true) {
        str = prefix + "Valoración = '" + value + "'";
        prefix = " OR ";
      }

      return str;
    };

    var query = queryStr($scope.excelCheck, 3) +
                queryStr($scope.mbCheck,    2) +
                queryStr($scope.bCheck,     1) +
                queryStr($scope.rCheck,     0) +
                queryStr($scope.mCheck,    -1) +
                queryStr($scope.mmCheck,   -2) +
                queryStr($scope.pCheck,    -3);

    responsePoints.setDefinitionExpression(query);
    map.addLayers([responsePoints]);
    map.setExtent(map.extent);
  };
})

.controller('MapController', function ($scope, $state, $ionicModal) {
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

.controller('AddController', function ($scope, $state, $ionicHistory) {
  // TODO: Añadir a $scope.userImage la imagen del usuario actual (si inició sesión)
  $scope.postForm = function () {
    // TODO Enviar todos los datos del formulario y la posición seleccionada en el mapa al servidor
    // TODO Posiblemente mostrar un popup cuando el envío haya terminado para avisar al usuario

    // Deshabilitar el volver atrás y cambiar a la pantalla principal
    $ionicHistory.nextViewOptions({
      disableBack: true,
      historyRoot: true
    });

    $state.go('map');
  };

});
