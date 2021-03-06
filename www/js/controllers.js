var camposDiscretos = {};
var camposContinuos = {};
var datosIncidencia;
var userId;
var valoresValoracion = {
  'Excelente': 3,
  'Muy bueno': 2,
  'Bueno': 1,
  'Regular': 0,
  'Malo': -1,
  'Muy malo': -2,
  'Pésimo': -3
};

function getKeyForValue(obj, value) {
  for (var name in obj) {
    if (obj[name] == value) {
      return name;
    }
  }
}

var loggedIn = false;
var index = 0;
var scopeMapController;
angular.module('starter.controllers', ['ngOpenFB'])

.controller('SidemenuController', function($scope, $ionicSideMenuDelegate) {
  $scope.initialize = function() {
    $ionicSideMenuDelegate.canDragContent(false);
  };

  $scope.toggleLeft = function() {
    $ionicSideMenuDelegate.toggleLeft();
  };
})

.controller('MenuController', function($scope) {
  $scope.publicoCheck = $scope.privadoCheck = false;

  $scope.filter = function() {
    var prefix = "";
    var rating = false;

    function queryStr(b, value) {
      var str = "";

      if (b === true) {
        rating = true;
        str = prefix + "Valoración = '" + value + "'";
        prefix = " OR ";
      }

      return str;
    };

    var query = '(' + queryStr($scope.excelCheck, 3) +
      queryStr($scope.mbCheck, 2) +
      queryStr($scope.bCheck, 1) +
      queryStr($scope.rCheck, 0) +
      queryStr($scope.mCheck, -1) +
      queryStr($scope.mmCheck, -2) +
      queryStr($scope.pCheck, -3) + ')';

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

.controller('MapController', function($scope, $state, $ionicPopup, ngFB) {
  loadMap();
  $scope.source = "img/person.png";
  scopeMapController = $scope;
  $scope.goProfile = function() {
    if (loggedIn)
      $state.go('profile');
    else {
      index = 0;
      $scope.showLoginAlert();
    }
  };

  $scope.showLoginAlert = function() {
    $ionicPopup.show({
      title: 'Autenticación necesaria',
      template: 'No has accedido a través de tus redes sociales',
      scope: $scope,
      buttons: [{
        text: 'Cancelar'
      }, {
        text: 'Login',
        type: 'button-positive',
        onTap: function() {
          $scope.fbLogin();
        }
      }]
    });
  };

  $scope.fbLogin = function() {
    ngFB.login({
      scope: 'email,publish_actions'
    }).then(function(response) {
      if (response.status === 'connected') {
        loggedIn = true;
        ngFB.api({
          path: '/me',
          params: {
            fields: 'id,name'
          }
        }).then(
          function(user) {
            userId = user.id;
            $scope.user = user;
            $scope.source = "http://graph.facebook.com/" + user.id + "/picture?width=270&height=270"
          },
          function(error) {
            userId = "";
            $ionicPopup.alert({
              title: "Error al recuperar los datos",
              template: error.message
            });
          }
        );
        if (index == 0)
          $state.go('profile');
        else if (index == 1)
          $state.go('add.map');

        //$scope.closeLogin();
      } else {
        userId = "";
        $ionicPopup.alert({
          title: "Inicio de sesión",
          template: "No se ha podido iniciar sesión"
        });

        loggedIn = false;
      }
    });
  };

  $scope.addNotification = function() {
    if (loggedIn)
      $state.go('add.map');
    else {
      index = 1;
      $scope.showLoginAlert();
    }
  };

  $scope.cargarIncidencia = function(content) {
    datosIncidencia = content;
  }


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
    
    $scope.atributos = [];

    for(bar in datosIncidencia) {
      var element = {
        name: bar,
        value: datosIncidencia[bar]
      };
      if(element.name == "Descripción" ||
         element.name == "Nombre_Organismo" ||
         element.name == "Organismo" ||
         element.name == "Temática")
        $scope.atributos.push(element);
      else if(element.name == "Valoración") {
        element.value = getKeyForValue(valoresValoracion, element.value);
        $scope.atributos.push(element);
      }
    }
  };
})

.controller('ProfileController', function($scope, $state, $ionicPopup, ngFB) {
  $scope.logout = function() {
    loggedIn = false;
    userId = "";
    scopeMapController.source = "img/person.png";
    $state.go('map');
    ngFB.logout().then(function() {
        $ionicPopup.alert({
          title: "Cierre de sesión",
          template: "Se ha cerrado la sesión satisfactoriamente"
        });
      },
      function() {
        $ionicPopup.alert({
          title: "Cierre de sesión",
          template: "Un error ha ocurrido al iniciar sesión"
        });
      });
  };

  $scope.loggedIn = true;
  $scope.incidenciasUsuario = [];
  getIncidenciasUsuario($scope);
  ngFB.api({
    path: '/me',
    params: {
      fields: 'id,name'
    }
  }).then(
    function(user) {

      $scope.user = user;
    },
    function(error) {
      $ionicPopup.alert({
        title: "Error al recuperar los datos",
        template: error.message
      });
    }
  );
})

.controller('AddController', function($scope, $state, $ionicHistory, $ionicPopup) {
  $scope.atributosDiscretos = {};
  $scope.atributosContinuos = {};

  $scope.atributosDiscretos = camposDiscretos;
  $scope.atributosContinuos = camposContinuos;

  $scope.init = function() {
    var center = [map.extent.getCenter().getLongitude(), map.extent.getCenter().getLatitude()];
    loadMapAnadir(center, map.getZoom());
  };

  $scope.postForm = function() {
    console.log($scope);
    post($scope);
    //$scope.mostrarIncidenciaEnviada();

    // Deshabilitar el volver atrás y cambiar a la pantalla principal
    $ionicHistory.nextViewOptions({
      disableBack: true,
      historyRoot: true
    });
  };

  $scope.goFormulario = function() {
    if (appGlobals.hayMapPoint == false)
      $scope.showAlert();
    else {
      $state.go('add.form');
      appGlobals.hayMapPoint = false;
    }
  };

  $scope.initFormulario = function() {
   
  };

  $scope.showAlert = function() {
    $ionicPopup.alert({
      title: 'Selecciona una ubicación!',
      template: 'No has seleccionado una ubicación. Por favor, pincha sobre el lugar de la notificación'
    });
  };

  $scope.mostrarIncidenciaEnviada = function(editComplete) {
    if (editComplete)
      $ionicPopup.alert({
        title: "Notificación enviada",
        template: "Tendremos en cuenta tu opinión"
      });
    else
      $ionicPopup.alert({
        title: "Error",
        template: "No se ha podido enviar la notificación"
      });
    document.getElementById("fileinput").value = "";
    $state.go('map');
  };

  $scope.mostrarNoHayConexion = function() {
    $ionicPopup.alert({
      title: "Error",
      template: "No se ha podido enviar la notificación. Comprueba tu conexión."
    });
    document.getElementById("fileinput").value = "";
    $state.go('map');
  };

  $scope.mostrarFormularioIncompleto = function() {
    $ionicPopup.alert({
      title: "Campos vacíos.",
      template: "Rellene los campos para poder enviar la notificación."
    });
  };

  $scope.mostrarImagenEnviada = function(editComplete) {
    if (!editComplete)
      $ionicPopup.alert({
        title: "Error",
        template: "No se ha podido enviar la imagen"
      });
    $state.go('map');
  };
});