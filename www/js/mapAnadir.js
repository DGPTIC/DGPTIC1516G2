var appGlobals = {
  map: null,
  collectMode: false,
  citizenRequestLayer: null,
  locator: null,
  locatorURL: "//geocode.arcgis.com/arcgis/rest/services/World/GeocodeServer",
  citizenRequestLayerURL: "https://services.arcgis.com/hkQNLKNeDVYBjvFE/ArcGIS/rest/services/Accesibilidad/FeatureServer/0",
  lastMapPoint: null,
  hayMapPoint: false,
  symbol: null,
  center: [-17.858908, 28.683404],
  geocoder: null,
  geoLocate: null
};

function loadMapAnadir (center, zoom) {
  require([
    "dojo/_base/array",
    "dojo/_base/lang",
    "dojo/dom-construct",
    "dojo/on",
    "dojo/parser",
    "dojo/query!css3",
    "dojo/ready",
    "esri/Color",
    "esri/config",
    "esri/dijit/AttributeInspector",
    "esri/dijit/Geocoder",
    "esri/dijit/HomeButton",
    "esri/dijit/LocateButton",
    "esri/dijit/PopupMobile",
    "esri/geometry/webMercatorUtils",
    "esri/graphic",
    "esri/InfoTemplate",
    "esri/layers/FeatureLayer",
    "esri/map",
    "esri/symbols/SimpleLineSymbol",
    "esri/symbols/SimpleMarkerSymbol",
    "esri/tasks/locator",
    "esri/tasks/query", "dojo/domReady!"
  ], function (
    array, lang, domConstruct, on, parser, query, ready, Color, esriConfig, AttributeInspector, Geocoder,
    HomeButton, LocateButton, PopupMobile, webMercatorUtils, Graphic, InfoTemplate, FeatureLayer, Map,
    SimpleLineSymbol, SimpleMarkerSymbol, Locator, Query
  ) {
    ready(function () {
      parser.parse();
      esriConfig.defaults.io.proxyUrl = "/sproxy/";

      var slsHighlightSymbol = new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID, new Color([38, 38, 38, 0.7]), 2);
      var sms = new SimpleMarkerSymbol();
      sms.setPath("M21.5,21.5h-18v-18h18V21.5z M12.5,3V0 M12.5,25v-3 M25,12.5h-3M3,12.5H0");
      sms.setSize(45);
      sms.setOutline(slsHighlightSymbol);

      var infoWindowPopup = new PopupMobile({
        markerSymbol: sms
      }, domConstruct.create("div"));

      on(infoWindowPopup, "show", function (event) {
        if ($("*.esriMobileNavigationItem.left > img[src]").exists())
          $("*.esriMobileNavigationItem.left > img").removeAttr("src");
        if ($("*.esriMobileNavigationItem.right > img[src]").exists)
          $("*.esriMobileNavigationItem.right > img").removeAttr("src");
      });

      // ----------------------------------------------------
      // Initialize the main User Interface components
      // ----------------------------------------------------
      appGlobals.hayMapPoint = false;
      appGlobals.map = new Map("map2", {
        basemap: "streets",
        center: center,
        zoom: zoom,
        slider: false,
        infoWindow: infoWindowPopup
      });


      iniciar(array, lang, domConstruct, on, parser, query, ready, Color, esriConfig, AttributeInspector, Geocoder,
      HomeButton, LocateButton, PopupMobile, webMercatorUtils, Graphic, InfoTemplate, FeatureLayer, Map,
      SimpleLineSymbol, SimpleMarkerSymbol, Locator, Query);
    });
  });
}

function iniciar (
  array, lang, domConstruct, on, parser, query, ready, Color, esriConfig, AttributeInspector, Geocoder,
  HomeButton, LocateButton, PopupMobile, webMercatorUtils, Graphic, InfoTemplate, FeatureLayer, Map,
  SimpleLineSymbol, SimpleMarkerSymbol, Locator, Query
) {
  appGlobals.citizenRequestLayer = new FeatureLayer(appGlobals.citizenRequestLayerURL, {
    mode: FeatureLayer.MODE_ONEDEMAND,
    outFields: ["*"]
  });

  appGlobals.map.on("click", function(event) {
    addMarker(event.mapPoint);

    appGlobals.lastMapPoint = event.mapPoint;
    appGlobals.hayMapPoint = true;
    getValoresField(array);
  });

  appGlobals.locator = new Locator(appGlobals.locatorURL);

  if (appGlobals.geocoder != null) {
    appGlobals.geocoder.destroy();
    appGlobals.geoLocate.destroy();
  }

  appGlobals.geocoder = new Geocoder({
    arcgisGeocoder: {
      placeholder: "Buscar "
    },
    map: appGlobals.map
  }, "ui-dijit-geocoder2");

  appGlobals.geocoder.startup();

  appGlobals.geoLocate = new LocateButton({
    map: appGlobals.map
  }, "LocateButton2");

  appGlobals.geoLocate.startup();

  appGlobals.citizenRequestLayer.on("edits-complete", function (eve) {
    var file = document.getElementById("fileinput");

    var editComplete = eve.adds.length != 0;
    if (eve.adds.length != 0) {
      for (var i = 0; i < file.files.length; i++) {
        var formData = new FormData();
        formData.append("attachment", file.files[i], file.files[i].name);
        appGlobals.citizenRequestLayer.addAttachment(eve.adds[0].objectId, formData);
      }
    }

    file.value = '';
    angular.element(document.getElementById('ui-content-formulario2')).scope().mostrarIncidenciaEnviada(editComplete);
    appGlobals.lastMapPoint = null;
  });

  function initializeEventHandlers () {
    on(appGlobals.map, "load", function (event) {
      appGlobals.map.infoWindow.resize(185, 100);
    });

    on(appGlobals.citizenRequestLayer, "error", function (event) {
      console.error("citizenRequestLayer failed to load.", JSON.stringify(event.error));
      $(".ui-loader").hide();
    });


    on(appGlobals.citizenRequestLayer, "click", function (event) {
      appGlobals.map.infoWindow.setFeatures([event.graphic]);
    });

    $(".basemapOption").click(swapBasemap);

    $("#ui-features-panel").on("popupafteropen", function (event, ui) {
      $("#ui-features-panel").on("popupafterclose", function (event, ui) {
        if (appGlobals.collectMode)
          $("#ui-collection-prompt").show();
        else
          $("#ui-collection-prompt").hide();

        setTimeout(function () {
          $("#ui-collection-prompt").popup("open");
        }, 15);
      });
    });

    $("#ui-collection-prompt").on("popupafteropen", function (event, ui) {
      setTimeout(function () {
        $("#ui-collection-prompt").popup("close");
      }, 1200);
    });
  };

  // ----------------------------------------------------
  // Initialize Event Handlers and add the citizen request
  // layer to the map
  // ----------------------------------------------------
  initializeEventHandlers();
  appGlobals.map.addLayers([appGlobals.citizenRequestLayer]);

  function addMarker (mapPoint) {
    var newSymbol = new Graphic(mapPoint, new SimpleMarkerSymbol({
      "color": [255, 255, 255, 64],
      "size": 12,
      "angle": -30,
      "xoffset": 0,
      "yoffset": 0,
      "type": "esriSMS",
      "style": "esriSMSCircle",
      "outline": {
        "color": [0, 0, 0, 255],
        "width": 1,
        "type": "esriSLS",
        "style": "esriSLSSolid"
      }
    }));

    appGlobals.map.graphics.remove(appGlobals.symbol);
    appGlobals.map.graphics.add(newSymbol);
    appGlobals.symbol = newSymbol;
  }
}

function swapBasemap (event) {
  var _basemapName = event.target.dataset.basemapname;
  appGlobals.map.setBasemap(_basemapName);
  $("#ui-settings-panel").panel("close");
}


function getValoresField (array) {
  if (document.getElementById('selectvaloracion') != null)
    return;

  var divFormulario = document.createElement("div");
  divFormulario.id = "ui-content-formulario";
  var html = " <div class=\"list\">";

  document.getElementById('hide').appendChild(divFormulario);

  if (appGlobals.citizenRequestLayer.hasOwnProperty("fields")) {
    var fieldsArray = appGlobals.citizenRequestLayer.fields;
    array.forEach(fieldsArray, function (field, i) {
      if (field.name != "Valoración" && field.name != "Descripción" && field.name != "Temática" && field.name != "Organismo" && field.name != "Nombre_Organismo")
        return;
      var name = field.name.toLowerCase().replace("á", "a").replace("é", "e").replace("í", "i").replace("ó", "o").replace("ú", "u");
      if (field.hasOwnProperty("domain")) {
        html += "<label class=\"item item-input item-select\">";
        html += "<div class=\"input-label\">" + field.name + "</div>"
        html += "<select id=\"select" + name + "\" ng-model=\"select" + name + "\" ng-change=\"valueChange" + name + "(select" + name + ")\">";
        if (field.domain.hasOwnProperty("codedValues")) {

          var codedValuesArray0 = field.domain.codedValues;
          array.forEach(codedValuesArray0, function(codedValue) {
            html += "<option>" + codedValue.name + "</option>";
          });
        }
        html += "</select>";
        html += "</label>";
      } else {
        html += "<div class=\"item item-input-inset\">";
        html += "<div class=\"input-label\">" + field.name + "</div>";
        html += "<label class=\"item-input-wrapper\">";
        html += "<input id=\"" + name + "\"type=\"text\" placeholder=\"\">";
        html += "</label>";
        html += "</div>"
      }

    });
  }

  html += "</div>"
  divFormulario.innerHTML = html;
}
