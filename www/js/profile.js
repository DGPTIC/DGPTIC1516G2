function getIncidenciasUsuario(scope) {
	require([
	  "esri/map",
	  "esri/layers/ArcGISDynamicMapServiceLayer",
	  "esri/tasks/QueryTask",
	  "esri/tasks/query",
	  "esri/symbols/SimpleMarkerSymbol",
	  "esri/InfoTemplate",
	  "dojo/_base/Color",
	  "dojo/domReady!"
	], function(Map, ArcGISDynamicMapServiceLayer, QueryTask, Query, SimpleMarkerSymbol, InfoTemplate, Color) {
		queryTask = new QueryTask(appGlobals.citizenRequestLayerURL);
		query = new Query();
		query.returnGeometry = false;
	  	query.outFields = ["Nombre_Organismo", "Valoración", "Fecha_actualización", "Fecha_creación"];
	  	query.where = "Valoración > 2";
	  	queryTask.execute(query,showResults);
  	});

	function showResults(featureSet) {
		featureSet.features.forEach(function(entry) {
			var object = {};
			for(bar in entry.attributes) {
				object[bar.replace("á", "a").replace("é", "e").replace("í", "i").replace("ó", "o").replace("ú", "u")] =  entry.attributes[bar];
			}
			console.log(valoresValoracion);
			console.log( entry.attributes[bar]);
			object.Valoracion = getKeyForValue(valoresValoracion, entry.attributes["Valoración"]);
			console.log(new Date(entry.attributes["Fecha_actualización"]).toISOString());
			object.Fecha_actualizacion = new Date(entry.attributes["Fecha_actualización"]).toISOString().substr(0,10);;
			scope.incidenciasUsuario.push(object);
		});
		scope.incidenciasUsuario.forEach(function(entry) {
			console.log(entry);
			console.log(entry.Valoracion);
		})
	}

}

