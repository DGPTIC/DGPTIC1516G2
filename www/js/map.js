var map;
 var responsePoints;
 
function loadMap () {
require([
  "esri/map",
  "esri/tasks/GeometryService",
  "esri/dijit/LocateButton",
  "esri/dijit/Search",
  "esri/layers/ArcGISTiledMapServiceLayer",
  "esri/layers/FeatureLayer",

  "esri/Color",
  "esri/symbols/SimpleMarkerSymbol",
  "esri/symbols/SimpleLineSymbol",

  "esri/dijit/editing/Editor",
  "esri/dijit/editing/TemplatePicker",

  "esri/config", "esri/arcgis/utils",
  "dojo/i18n!esri/nls/jsapi",

  "dojo/_base/array", "dojo/parser", "dojo/keys",
  "dojo/ready",

  "dijit/layout/BorderContainer", "dijit/layout/ContentPane",
  "dojo/domReady!"
], function (
  Map, GeometryService, LocateButton, Search,
  ArcGISTiledMapServiceLayer, FeatureLayer,
  Color, SimpleMarkerSymbol, SimpleLineSymbol,
  Editor, TemplatePicker,
  esriConfig, arcgisUtils, jsapiBundle,
  arrayUtils, parser, keys, ready,
  BorderContainer, ContentPane
) {
  ready(function () {
    parser.parse();

    // snapping is enabled for this sample - change the tooltip to reflect this
    jsapiBundle.toolbars.draw.start = jsapiBundle.toolbars.draw.start +  "<br>Press <b>ALT</b> to enable snapping";

    // refer to "Using the Proxy Page" for more information:  https://developers.arcgis.com/javascript/jshelp/ags_proxy.html
    esriConfig.defaults.io.proxyUrl = "/proxy/";

    //This service is for development and testing purposes only. We recommend that you create your own geometry service for use within your applications.
    esriConfig.defaults.geometryService = new GeometryService("http://tasks.arcgisonline.com/ArcGIS/rest/services/Geometry/GeometryServer");

    map = new Map("map", {
      basemap: "streets",
      center: [-17.858908, 28.683404],
      zoom: 11,
      slider: false
    });

    map.on("load", function (evt) {
      initMap(Map, GeometryService, LocateButton, Search,
              ArcGISTiledMapServiceLayer, FeatureLayer,
              Color, SimpleMarkerSymbol, SimpleLineSymbol,
              Editor, TemplatePicker,
              esriConfig, arcgisUtils, jsapiBundle,
              arrayUtils, parser, keys, ready,
              BorderContainer, ContentPane, evt);
    });
  });
});
}

function initMap (
  Map, GeometryService, LocateButton, Search,
  ArcGISTiledMapServiceLayer, FeatureLayer,
  Color, SimpleMarkerSymbol, SimpleLineSymbol,
  Editor, TemplatePicker,
  esriConfig, arcgisUtils, jsapiBundle,
  arrayUtils, parser, keys, ready,
  BorderContainer, ContentPane, evt
) {
  // add search box and locate button
  var s = new Search({
    map: map
  }, "Search");
  s.startup();

  var geoLocate = new LocateButton({
    map: map
  }, "LocateButton");
  geoLocate.startup();

  //add boundaries and place names
  var labels = new ArcGISTiledMapServiceLayer("http://server.arcgisonline.com/ArcGIS/rest/services/Reference/World_Boundaries_and_Places/MapServer");
  map.addLayer(labels);

  responsePoints = new FeatureLayer("https://services.arcgis.com/hkQNLKNeDVYBjvFE/ArcGIS/rest/services/Accesibilidad/FeatureServer/0", {
    mode: FeatureLayer.MODE_ONDEMAND,

    outFields: ['*']
  });

  map.addLayers([responsePoints]);
  map.on("layers-add-result", function (evt) {
    initEditor(Map, GeometryService, LocateButton, Search,
               ArcGISTiledMapServiceLayer, FeatureLayer,
               Color, SimpleMarkerSymbol, SimpleLineSymbol,
               Editor, TemplatePicker,
               esriConfig, arcgisUtils, jsapiBundle,
               arrayUtils, parser, keys, ready,
               BorderContainer, ContentPane, evt);
  });
}

function initEditor (
  Map, GeometryService, LocateButton, Search,
  ArcGISTiledMapServiceLayer, FeatureLayer,
  Color, SimpleMarkerSymbol, SimpleLineSymbol,
  Editor, TemplatePicker,
  esriConfig, arcgisUtils, jsapiBundle,
  arrayUtils, parser, keys, ready,
  BorderContainer, ContentPane, evt
) {
  var templateLayers = arrayUtils.map(evt.layers, function(result){
    return result.layer;
  });

  var templatePicker = new TemplatePicker({
    featureLayers: templateLayers,
    grouping: true,
    rows: "auto",
    columns: 3
  }, "templateDiv");
  templatePicker.startup();

  var layers = arrayUtils.map(evt.layers, function(result) {
    return { featureLayer: result.layer, isEditable: false};
  });

  var settings = {
    map: map,
    templatePicker: templatePicker,
    layerInfos: layers,
    toolbarVisible: true,
    createOptions: {
      polylineDrawTools:[ Editor.CREATE_TOOL_FREEHAND_POLYLINE ],
      polygonDrawTools: [ Editor.CREATE_TOOL_FREEHAND_POLYGON,
        Editor.CREATE_TOOL_CIRCLE,
        Editor.CREATE_TOOL_TRIANGLE,
        Editor.CREATE_TOOL_RECTANGLE
      ]
    },
    toolbarOptions: {
      reshapeVisible: true
    }
  };

  var params = { settings: settings };
  var myEditor = new Editor(params, 'editorDiv');
  //define snapping options
  var symbol = new SimpleMarkerSymbol(
    SimpleMarkerSymbol.STYLE_CROSS,
    15,
    new SimpleLineSymbol(
      SimpleLineSymbol.STYLE_SOLID,
      new Color([255, 0, 0, 0.5]),
      5
    ),
    null
  );

  map.enableSnapping({
    snapPointSymbol: symbol,
    tolerance: 20,
    snapKey: keys.ALT
  });

  myEditor.startup();
}
function filter() {
   var selected = "";
   var excel = document.getElementById('excelcheck').checked;
    if (excel == true){
	 selected += "Valoración = '3' ";
	}
    var mb = document.getElementById('mbcheck').checked;
    if (mb == true){
	 if (selected != "")
		selected += "OR Valoración = '2' ";
	 else
		selected += "Valoración = '2' ";
	}
	var b = document.getElementById('bcheck').checked;
    if (b == true){
	 if (selected != "")
		selected += "OR Valoración = '1' ";
	 else
		selected += "Valoración = '1' ";
	}
	
	var r = document.getElementById('rcheck').checked;
    if (r == true){
	 if (selected != "")
		selected += "OR Valoración = '0' ";
	 else
		selected += "Valoración = '0' ";
	}
	
	var m = document.getElementById('mcheck').checked;
    if (m == true){
	 if (selected != "")
		selected += "OR Valoración = '-1' ";
	 else
		selected += "Valoración = '-1' ";
	}
	
	var mm = document.getElementById('mmcheck').checked;
    if (mm == true){
	 if (selected != "")
		selected += "OR Valoración = '-2' ";
	 else
		selected += "Valoración = '-2' ";
	}

	var p = document.getElementById('pcheck').checked;
    if (p == true){
	 if (selected != "")
		selected += "OR Valoración = '-3' ";
	 else
		selected += "Valoración = '-3' ";
	}

	responsePoints.setDefinitionExpression(selected);
	map.addLayers([responsePoints]);
    map.setExtent(map.extent);
	}
