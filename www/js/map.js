var map;
var responsePoints;

function loadMap () {
  require([
    "esri/map",
    "esri/tasks/GeometryService",
    "esri/dijit/LocateButton",
    "esri/dijit/Search",
    "esri/dijit/Geocoder",
    "esri/layers/ArcGISTiledMapServiceLayer",
    "esri/layers/FeatureLayer",

    "esri/Color",
    "esri/symbols/SimpleMarkerSymbol",
    "esri/symbols/SimpleLineSymbol",
    "esri/dijit/PopupMobile",
    "esri/dijit/editing/Editor",
    "esri/dijit/editing/TemplatePicker",
    "esri/dijit/Popup",
    "esri/dijit/PopupTemplate",
    "esri/InfoTemplate",
    "esri/symbols/SimpleFillSymbol", "esri/Color",
    "esri/config", "esri/arcgis/utils",
    "dojo/i18n!esri/nls/jsapi",

    "dojo/_base/array", "dojo/parser", "dojo/keys",
    "dojo/ready",

    "dijit/layout/BorderContainer", "dijit/layout/ContentPane",
    "dojo/dom-class",
    "dojo/dom-construct",
    "dojo/_base/connect",
    "dojo/domReady!"

  ], function (
    Map, GeometryService, LocateButton, Search, Geocoder,
    ArcGISTiledMapServiceLayer, FeatureLayer,
    Color, SimpleMarkerSymbol, SimpleLineSymbol, PopupMobile,
    Editor, TemplatePicker, Popup, PopupTemplate, InfoTemplate,
    SimpleFillSymbol, Color,
    esriConfig, arcgisUtils, jsapiBundle,
    arrayUtils, parser, keys, ready,
    BorderContainer, ContentPane, domClass, domConstruct, connect
  ) {
    ready(function () {
      parser.parse();

      // snapping is enabled for this sample - change the tooltip to reflect this
      jsapiBundle.toolbars.draw.start = jsapiBundle.toolbars.draw.start + "<br>Press <b>ALT</b> to enable snapping";

      // refer to "Using the Proxy Page" for more information:  https://developers.arcgis.com/javascript/jshelp/ags_proxy.html
      esriConfig.defaults.io.proxyUrl = "/proxy/";

      //This service is for development and testing purposes only. We recommend that you create your own geometry service for use within your applications.
      esriConfig.defaults.geometryService = new GeometryService("http://tasks.arcgisonline.com/ArcGIS/rest/services/Geometry/GeometryServer");
      var fill = new SimpleFillSymbol("solid", null, new Color("#A4CE67"));


      map = new Map("map", {
        basemap: "streets",
        center: [-17.858908, 28.683404],
        zoom: 11,
        slider: false
      });
      map.setInfoWindowOnClick(false);
      map.showInfoWindowOnClick = false;
      map.usePopupManager = true;

      map.on("load", function (evt) {
        initMap(Map, GeometryService, LocateButton, Search, Geocoder,
          ArcGISTiledMapServiceLayer, FeatureLayer,
          Color, SimpleMarkerSymbol, SimpleLineSymbol,
          Editor, TemplatePicker, InfoTemplate,
          esriConfig, arcgisUtils, jsapiBundle,
          arrayUtils, parser, keys, ready,
          BorderContainer, ContentPane, connect, evt);
      });
    });
  });
}

function initMap (
  Map, GeometryService, LocateButton, Search, Geocoder,
  ArcGISTiledMapServiceLayer, FeatureLayer,
  Color, SimpleMarkerSymbol, SimpleLineSymbol,
  Editor, TemplatePicker, InfoTemplate,
  esriConfig, arcgisUtils, jsapiBundle,
  arrayUtils, parser, keys, ready,
  BorderContainer, ContentPane, connect, evt
) {

  var geocoder = new Geocoder({
    arcgisGeocoder: {
      placeholder: "Buscar "
    },
    map: map
  }, "Search");

  geocoder.startup();

  var geoLocate = new LocateButton({
    map: map
  }, "LocateButton");

  geoLocate.startup();

  responsePoints = new FeatureLayer("https://services.arcgis.com/hkQNLKNeDVYBjvFE/ArcGIS/rest/services/Accesibilidad/FeatureServer/0", {
    mode: FeatureLayer.MODE_ONDEMAND,
    outFields: ['*']
  });

  dojo.connect(responsePoints, "onClick", function (evt) {

    graphicAttributes = evt.graphic.attributes;

    var objectId = graphicAttributes.OBJECTID;
    responsePoints.queryAttachmentInfos(objectId, function (infos) {
      angular.element(document.getElementById('map')).scope().cargarImagenesIncidencia(infos);
    });
    angular.element(document.getElementById('map')).scope().cargarIncidencia(graphicAttributes);

  });

  map.addLayers([responsePoints]);
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
  var templateLayers = arrayUtils.map(evt.layers, function(result) {
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
    return {
      featureLayer: result.layer,
      isEditable: false
    };
  });

  var settings = {
    map: map,
    templatePicker: templatePicker,
    layerInfos: layers,
    toolbarVisible: true,
    createOptions: {
      polylineDrawTools: [Editor.CREATE_TOOL_FREEHAND_POLYLINE],
      polygonDrawTools: [Editor.CREATE_TOOL_FREEHAND_POLYGON,
        Editor.CREATE_TOOL_CIRCLE,
        Editor.CREATE_TOOL_TRIANGLE,
        Editor.CREATE_TOOL_RECTANGLE
      ]
    },
    toolbarOptions: {
      reshapeVisible: true
    }
  };

  var params = {
    settings: settings
  };
  var myEditor = new Editor(params, 'editorDiv');

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
