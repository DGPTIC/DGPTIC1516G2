    require([
      "esri/map", 
      "esri/dijit/LocateButton",
      "dojo/domReady!"
    ], function(
      Map, LocateButton
    )  {

     var delay=2000; //1 seconds
     
	setTimeout(function(){
	  //your code to be executed after 1 seconds
	}, delay); 
            
      geoLocate = new LocateButton({
        map: map
      }, "LocateButton");
    
      geoLocate.startup();

    });
