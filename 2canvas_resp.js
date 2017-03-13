function createMarker(width, height, radius) {

          var canvas, context;

          canvas = document.createElement("canvas");
          canvas.width = width;
          canvas.height = height;

          context = canvas.getContext("2d");

          context.clearRect(0,0,width,height);

          // background is yellow
          context.fillStyle = "rgba(255,255,0,1)";

          // border is black
          context.strokeStyle = "rgba(0,0,0,1)";

          context.beginPath();
          context.moveTo(radius, 0);
          context.lineTo(width - radius, 0);
          context.quadraticCurveTo(width, 0, width, radius);
          context.lineTo(width, height - radius);
          context.quadraticCurveTo(width, height, width - radius, height);
          context.lineTo(radius, height);
          context.quadraticCurveTo(0, height, 0, height - radius);
          context.lineTo(0, radius);
          context.quadraticCurveTo(0, 0, radius, 0);
          context.closePath();

          context.fill();
          context.stroke();

          return canvas.toDataURL();

        }
function createBaloon(width, height, radius) {

          var canvas, context;
//         var endAngle = Math.PI + (Math.PI * 2) / 2;
          canvas = document.createElement("canvas");
          canvas.width = width;
          canvas.height = height;

          context = canvas.getContext("2d");

          //context.clearRect(0,0,width,height);

          // background is red
          context.fillStyle = "rgb(255, 0, 49)";

          // border is black
          context.strokeStyle = "rgba(0,0,0,1)";

          context.beginPath();
          context.arc(10,10,10,0,2*Math.PI);
//          context.arc(width,height,radius,0,endAngle);
          context.closePath();

          context.fill();
          context.stroke();

          return canvas.toDataURL();

        }

            


           

/*Prova per resize responsive*/
var map; //<-- This is now available to both event listeners and the initialize() function
function initialize() {
  var mapOptions = {
   center: new google.maps.LatLng(35.090349,-35.367574),
   zoom: 4,
   mapTypeId: google.maps.MapTypeId.HYBRID
  };
    
/*
roadmap displays the default road map view. This is the default map type.
satellite displays Google Earth satellite images
hybrid displays a mixture of normal and satellite views
terrain displays a physical map based on terrain information.
*/    
    
  map = new google.maps.Map(document.getElementById("map_canvas"),
            mapOptions);
    // creating a marker
          var marker = new google.maps.Marker({
              position: new google.maps.LatLng(35.090349,-35.367574),
              map: map,
              title:"LA NOSTRA BARCA!",
              icon: createMarker(25, 25, 4)
          });
              // creating a SECOND marker
          var marker2 = new google.maps.Marker({
              position: new google.maps.LatLng(37.090349,-36.367574),
              map: map,
              title:"PALLONCINO!",
              icon: createBaloon(20, 20, 4)
          });
    
}
google.maps.event.addDomListener(window, 'load', initialize);
google.maps.event.addDomListener(window, "resize", function() {
 var center = map.getCenter();
 google.maps.event.trigger(map, "resize");
 map.setCenter(center); 
});

      var map = new google.maps.Map(document.getElementById('map_canvas'), {
          zoom: 3,
          center: {lat: 0, lng: -180},
          mapTypeId: 'terrain'
        });
//trieste 45.6522988,13.7136222
    //miami 25.7824618,-80.3010437
        var flightPlanCoordinates = [
         {lat: 25.7824618, lng: -80.3010437},
          {lat: 45.6522988, lng: 13.7136222}
          
          //{lat: -18.142, lng: 178.431},
         // {lat: -27.467, lng: 153.027}
        ];
        var flightPath = new google.maps.Polyline({
          path: flightPlanCoordinates,
          geodesic: true,
          strokeColor: '#FF0000',
          strokeOpacity: 1.0,
          strokeWeight: 2
        });


   
//
//function drawCircle() {
//    mainContext.clearRect(0, 0, canvasWidth, canvasHeight);
//     
//    // color in the background
//    mainContext.fillStyle = "#EEEEEE";
//    mainContext.fillRect(0, 0, canvasWidth, canvasHeight); mainContext.clearRect(0, 0, canvasWidth, canvasHeight);
//     
//    // color in the background
//    mainContext.fillStyle = "#EEEEEE";
//    mainContext.fillRect(0, 0, canvasWidth, canvasHeight);
//     
//    // draw the circle
//    mainContext.beginPath();
//     
//    var radius = 175;
//    mainContext.arc(225, 225, radius, 0, Math.PI * 2, false);
//    mainContext.closePath();
//     
//    // color in the circle
//    mainContext.fillStyle = "#ef103b";
//    mainContext.fill();
//}



