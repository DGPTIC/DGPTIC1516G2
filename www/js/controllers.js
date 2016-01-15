var newAttributesG;
var datosIncidencia;

var valoresValoracion = {
  'Excelente': 3,
  'Muy bueno': 2,
  'Bueno': 1,
  'Regular': 0,
  'Malo': -1,
  'Muy malo': -2,
  'Pésimo': -3
};

var loggedIn = false;
var index = 0;

angular.module('starter.controllers', ['starter.services', 'ngOpenFB'])

.controller('SidemenuController', function ($scope, $ionicSideMenuDelegate) {
  $scope.initialize = function () {
    $ionicSideMenuDelegate.canDragContent(false);
  };

  $scope.toggleLeft = function () {
    $ionicSideMenuDelegate.toggleLeft();
  };
})


.controller('MenuController', function ($scope) {
  $scope.publicoCheck = $scope.privadoCheck = false;

  $scope.filter = function () {
    var prefix = "";
    var rating = false;

    function queryStr (b, value) {
      var str = "";

      if (b === true) {
        rating = true;
        str = prefix + "Valoración = '" + value + "'";
        prefix = " OR ";
      }

      return str;
    };

    var query = '(' + queryStr($scope.excelCheck, 3) +
                      queryStr($scope.mbCheck,    2) +
                      queryStr($scope.bCheck,     1) +
                      queryStr($scope.rCheck,     0) +
                      queryStr($scope.mCheck,    -1) +
                      queryStr($scope.mmCheck,   -2) +
                      queryStr($scope.pCheck,    -3) + ')';

    if (!rating) query = '';

    if ($scope.publicoCheck != $scope.privadoCheck) {
      if (rating)
        query += " AND Organismo = '";
      else
        query += "Organismo = '";

      if ($scope.publicoCheck === true)
        query += "Público";
      else
        query += "Privado";

      query += "'";
    }

    responsePoints.setDefinitionExpression(query);
  };
})

.controller('MapController', function ($scope, $state, $ionicPopup, ngFB) {
  // TODO: Añadir a $scope.userImage la imagen del usuario actual (si inició sesión)
  loadMap();

  $scope.goProfile = function () {
    if (loggedIn)
      $state.go('profile');
    else {
      index = 0;
      $scope.showLoginAlert();
    }
  };

  $scope.showLoginAlert = function () {
    var alertPopup = $ionicPopup.show({
      title: 'Autenticación necesaria',
      template: 'No has accedido a través de tus redes sociales',
      scope: $scope,
      buttons: [
        {
          text: 'Cancelar'
        },
        {
          text: 'Login',
          type: 'button-positive',
          onTap: function () { $scope.fbLogin(); }
        }
      ]
    });
  };

  $scope.fbLogin = function () {
    ngFB.login({scope: 'email,publish_actions'}).then(function (response) {
      if (response.status === 'connected') {
        loggedIn = true;

        if (index == 0)
          $state.go('profile');
        else if (index == 1)
          $state.go('add.map');

        $scope.closeLogin();
      }
      else {
        alert('Facebook login failed');
        loggedIn = false;
      }
    });
  };

  $scope.addNotification = function () {
    if (loggedIn)
      $state.go('add.map');
    else {
      index = 1;
      $scope.showLoginAlert();
    }
  };

  $scope.cargarIncidencia = function(content) {
    datosIncidencia = content;
  };

  $scope.cargarImagenesIncidencia = function(imagenes) {
    imagenesG = imagenes;
    $state.go('incidencia');
  };

  $scope.iniciar = function() {
    $scope.images = [];
    for (var i = 0; i < imagenesG.length; i++)
      $scope.images.push(imagenesG[i].url);
  };

  $scope.initIncidencia = function(content) {
    cargarIncidencia();
  };
})

.controller('ProfileController', function ($scope, $state, ngFB) {
  $scope.logout = function() {
    loggedIn = false;
    $state.go('map');

    ngFB.logout().then(function () {
      alert('Logout successful');
    },
    errorHandler);
  };

  $scope.loggedIn = true;

  ngFB.api({
    path: '/me',
    params: {fields: 'id,name'}
  }).then(
    function (user) {
      $scope.user = user;
    },
    function (error) {
      alert('Facebook error: ' + error.message);
    }
  );
})

.controller('AddController', function ($scope, $state, $ionicHistory, $ionicPopup) {
  // TODO: Añadir a $scope.userImage la imagen del usuario actual (si inició sesión)

  $scope.init = function () {
    var center = [map.extent.getCenter().getLongitude(), map.extent.getCenter().getLatitude()];
    loadMapAnadir(center, map.getZoom());
  };

  $scope.postForm = function () {
    getAtributos();
    post();
    $scope.mostrarIncidenciaEnviada();

    // Deshabilitar el volver atrás y cambiar a la pantalla principal
    $ionicHistory.nextViewOptions({
      disableBack: true,
      historyRoot: true
    });

    $state.go('map');
  };

  $scope.goFormulario = function () {
    if (appGlobals.hayMapPoint == false)
      $scope.showAlert();
    else {
      $state.go('add.form');
      appGlobals.hayMapPoint = false;
    }
  };

  $scope.initFormulario = function () {
    cargarFormulario();
  };

  $scope.showAlert = function () {
    var alertPopup = $ionicPopup.alert({
      title: 'Selecciona una ubicación!',
      template: 'No has seleccionado una ubicación, por favor, pincha sobre el lugar de la incidendcia'
    });
  };

  $scope.mostrarIncidenciaEnviada = function () {
    var alertPopup = $ionicPopup.alert({
      title: 'Incidendcia enviada!',
      template: 'Intentaremos solucionarla lo antes posible'
    });
  };

});


