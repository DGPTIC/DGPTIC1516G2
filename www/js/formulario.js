// ----------------------------------------------------
// Returns the Feature Template given the Coded Value
// ----------------------------------------------------
function getFeatureTemplateFromCodedValueByName() {
  var returnType = null;
  $.each(appGlobals.citizenRequestLayer.types, function(index, type) {
    returnType = type.templates[0];
  });
  return returnType;
}

function post(scope) {
  require([
    "esri/graphic",
    "dojo/_base/lang"
  ], function(Graphic) {
    console.log(scope.atributosDiscretos);
    var currentDate = new Date();
    var incidentAttributes = {
      Fecha_creación: (currentDate.getMonth() + 1) + "/" + currentDate.getDate() + "/" + currentDate.getFullYear(),
      Fecha_actualización: (currentDate.getMonth() + 1) + "/" + currentDate.getDate() + "/" + currentDate.getFullYear(),
      Organismo: scope.atributosDiscretos.Organismo.selected,
      Valoración: valoresValoracion[scope.atributosDiscretos.Valoración.selected],
      Descripción: scope.atributosContinuos.Descripción.value,
      Temática: scope.atributosDiscretos.Temática.selected,
      Creator: userId,
      Nombre_Organismo: scope.atributosContinuos.Nombre_Organismo.value
    };
    scope.atributosContinuos.Descripción.value = '';
    scope.atributosContinuos.Nombre_Organismo.value = '';
    var incidentGraphic = new Graphic(appGlobals.lastMapPoint, null, incidentAttributes);
    console.log(incidentAttributes);
    try {
      if (navigator.onLine)
        appGlobals.citizenRequestLayer.applyEdits([incidentGraphic], null, null);
      else
        angular.element(document.getElementById('ui-content-formulario2')).scope().mostrarNoHayConexion();
    } catch (eve) {
      angular.element(document.getElementById('ui-content-formulario2')).scope().mostrarIncidenciaEnviada(false);
    }
    appGlobals.lastMapPoint = null;
  });
}