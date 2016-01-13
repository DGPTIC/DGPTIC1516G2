var newAttributesG;
var valoresValoracion = {};
var datosIncidencia;
valoresValoracion['Excelente'] = 3;
valoresValoracion['Muy bueno'] = 2;
valoresValoracion['Bueno'] = 1;
valoresValoracion['Regular'] = 0;
valoresValoracion['Malo'] = -1;
valoresValoracion['Muy malo'] = -2;
valoresValoracion['Pésimo'] = -3;

var loggedIn = false;
angular.module('starter.controllers', ['ngOpenFB'])

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

.controller('MapController', function ($scope, $state, $ionicModal, $ionicPopup, ngFB) {
  // TODO: Añadir a $scope.userImage la imagen del usuario actual (si inició sesión)
  loadMap();
  
  // Creación del popup que pide que el usuario inicie sesión
  $ionicModal.fromTemplateUrl('templates/login-modal.html', {
    scope: $scope,
    animation: 'slide-in-up'
  }).then(function(modal) {
    $scope.modal = modal;
  });
     $scope.goProfile = function () {
	  if(!loggedIn){
		$scope.showLoginAlert();
	  }
	  else{
		  $state.go('profile');
	  }
   }
	
	$scope.showLoginAlert = function() {
     var alertPopup = $ionicPopup.show({
       title: 'Autenticación necesaria',
       template: 'No has accedido a través de tus redes sociales',
       scope: $scope,
       buttons: [
       {text: 'Cancelar' },
       {text: 'Login', type: 'button-positive', onTap: function(){$scope.fbLogin();}}
      ] 
     });
   };
   
   $scope.fbLogin = function () {
    ngFB.login({scope: 'email,publish_actions'}).then(
        function (response) {
            if (response.status === 'connected') {
				  loggedIn=true;
                console.log('Facebook login succeeded');
                $scope.closeLogin();
                 
            } else {
                alert('Facebook login failed');
                   loggedIn=false;
            }
        });
};

  $scope.addNotification = function () {

    if (loggedIn) {
      $state.go('add.map');
    }
    else {
      $scope.showLoginAlert();
    }
  };

  $scope.closeModal = function () {
    $scope.modal.hide();
  };

  $scope.$on('$destroy', function () {
    $scope.modal.remove();
  });

  $scope.cargarIncidencia = function(content) {
    datosIncidencia = content;
  }

  $scope.cargarImagenesIncidencia = function(imagenes) {
    imagenesG = imagenes;
    $state.go('incidencia');
  }
  $scope.iniciar = function() {
    $scope.images = [];
    for (i = 0; i < imagenesG.length; i++)
      $scope.images.push(imagenesG[i].url);
  }

  $scope.initIncidencia = function(content) {
    cargarIncidencia();
  }
})


.controller('ProfileController', function ($scope, ngFB) {
  // TODO: Añadir a $scope todos los datos del usuario actual (si inició sesión)
  // Dependiendo de esta variable se muestra la pantalla de inicio de sesión o el perfil
  $scope.loggedIn = true;
  ngFB.api({
        path: '/me',
        params: {fields: 'id,name'}
    }).then(
        function (user) {
            $scope.user = user;
        },
        function (error) {
            alert('Facebook error: ' + error.error_description);
        });
})

.controller('AddController', function ($scope, $state, $ionicHistory, $ionicPopup) {
  // TODO: Añadir a $scope.userImage la imagen del usuario actual (si inició sesión)
 
 
  $scope.init = function () {
     var center = [map.extent.getCenter().getLongitude(), map.extent.getCenter().getLatitude()];

     loadMapAnadir(center, map.getZoom());
    
  };

  $scope.postForm = function () {
    // TODO Enviar todos los datos del formulario y la posición seleccionada en el mapa al servidor
    // TODO Posiblemente mostrar un popup cuando el envío haya terminado para avisar al usuario
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
      if(appGlobals.hayMapPoint == false)
        $scope.showAlert();
      else {
        $state.go('add.form');
         appGlobals.hayMapPoint = false;
      }
   }

   $scope.initFormulario = function () {
      cargarFormulario();
    }

    $scope.showAlert = function() {
     var alertPopup = $ionicPopup.alert({
       title: 'Selecciona una ubicación!',
       template: 'No has seleccionado una ubicación, por favor, pincha sobre el lugar de la incidendcia'
     });
   };

   $scope.mostrarIncidenciaEnviada = function() {
     var alertPopup = $ionicPopup.alert({
       title: 'Incidendcia enviada!',
       template: 'Intentaremos solucionarla lo antes posible'
     });
   };

});


