function cargarIncidencia() {
  document.getElementById("valoracion-incidencia").value = getKeyForValue(valoresValoracion, datosIncidencia.Valoración);
  document.getElementById("descripcion-incidencia").value = datosIncidencia.Descripción;
  document.getElementById("tematica-incidencia").value = datosIncidencia.Temática;
  document.getElementById("organismo-incidencia").value = datosIncidencia.Organismo;
  document.getElementById("nombreOrganismo-incidencia").value = datosIncidencia.Nombre_Organismo;
}

function cargarFormulario() {
  document.getElementById("ui-content-formulario2").innerHTML = document.getElementById("ui-content-formulario").innerHTML;
  document.getElementById("ui-content-formulario").remove();
}

// ----------------------------------------------------
// Returns the Feature Template given the Coded Value
// ----------------------------------------------------
function getFeatureTemplateFromCodedValueByName () {
  var returnType = null;
  $.each(appGlobals.citizenRequestLayer.types, function(index, type) {
    returnType = type.templates[0];
  });

  return returnType;
}

function getAtributos () {
  require([
    "dojo/_base/lang"
  ], function(lang) {
    var citizenRequestFeatureTemplate = getFeatureTemplateFromCodedValueByName();
    appGlobals.collectMode = false;
    
    newAttributesG = lang.mixin({}, citizenRequestFeatureTemplate.prototype.attributes);
    newAttributesG.Valoración = valoresValoracion[document.getElementById("selectvaloracion").value];
    newAttributesG.Temática = document.getElementById("selecttematica").value;
    newAttributesG.Organismo = document.getElementById("selectorganismo").value;
    newAttributesG.Descripción = document.getElementById("descripcion").value;
    newAttributesG.Nombre_Organismo = document.getElementById("nombre_organismo").value;
    document.getElementById("descripcion").value = '';
    document.getElementById("nombre_organismo").value = '';
  });
}

function post () {
  require([
    "esri/graphic"
  ], function(Graphic) {
    var currentDate = new Date();
    var incidentAttributes = {
      OBJECTID: 18,
      Fecha_creación: (currentDate.getMonth() + 1) + "/" + currentDate.getDate() + "/" + currentDate.getFullYear(),
      Fecha_actualización: (currentDate.getMonth() + 1) + "/" + currentDate.getDate() + "/" + currentDate.getFullYear(),
      Organismo: newAttributesG.Organismo,
      Valoración: newAttributesG.Valoración,
      Descripción: newAttributesG.Descripción,
      Temática: newAttributesG.Temática,
      Creator: userId,
      Nombre_Organismo: newAttributesG.Nombre_Organismo
    };
    
    var incidentGraphic = new Graphic(appGlobals.lastMapPoint, null, incidentAttributes);
    try {
      if (navigator.onLine)
        appGlobals.citizenRequestLayer.applyEdits([incidentGraphic], null, null);
      else
        angular.element(document.getElementById('ui-content-formulario2')).scope().mostrarIncidenciaEnviada(false);
    }
    catch (eve) {
      angular.element(document.getElementById('ui-content-formulario2')).scope().mostrarIncidenciaEnviada(false);
    }

    appGlobals.lastMapPoint = null;
  });
}
