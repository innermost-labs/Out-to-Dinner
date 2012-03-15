var map;
var marker;
var ajax;
var publicmarkers = [];

function initialize() {
  ajax = new XMLHttpRequest();
  ajax.onreadystatechange = function()
  {
    if(ajax.readyState == 4)
    {
      try{
        var jason = eval("(" + ajax.responseText + ")");
      }catch(e){
        alert("responseText " + ajax.responseText);
      }
      makeMap(jason.lat, jason.long);
      addMarkers();
    }
  }
  ajax.open("POST", "gethome.php",true);
  ajax.setRequestHeader("Content-type","application/x-www-form-urlencoded");
  ajax.send("guid=" +1);}

function addMarkers(){
    ajax = getXmlHttp();
    ajax.onreadystatechange =function(){
    if(ajax.readyState ==4){
      try{
      var jason = eval("(" + ajax.responseText + ")");
      }catch(e){
        alert(ajax.responseText);
      }
      for(var i = 0; i < jason.markers.length; i++){
        makeMarker(jason.markers[i].lat, jason.markers[i].long);
      }
    }
  };
  ajax.open("POST", "getmarkers.php",true);
  ajax.setRequestHeader("Content-type","application/x-www-form-urlencoded");
  ajax.send("guid=" + 1);
}

function uploadTempMarker(){
  if(marker){
    ajax = getXmlHttp()
    ajax.onreadystatechange = function(){
      if(ajax.readyState==4)
        alert(ajax.responseText);
        addMarkers();
    };
    var markerpos = marker.getPosition();

    ajax.open("POST", "addmarker.php", true);
    ajax.setRequestHeader("Content-type","application/x-www-form-urlencoded");
    ajax.send("guid="+1+"&lat="+markerpos.lat()  + "&long=" + markerpos.long());
  }
}


function makeMarker(lat, long){
  newmarker = new google.maps.Marker({
      position : new google.maps.LatLng(lat,long),
      map : map,
  });
  publicmarkers.push(newmarker);}

function addTempMarker(location) {
  if(marker){
      marker.setMap(null);
  }
  marker = new google.maps.Marker({
    position:location,
    map: map,
  });
  marker.set
}

function makeMap(lat, long){
  var coord = new google.maps.LatLng(lat, long);
  var mapOptions = {
    center: coord,
    zoom: 20,
    mapTypeId: google.maps.MapTypeId.ROADMAP
  };
  map =  new google.maps.Map(document.getElementById("map_canvas"), mapOptions);
    google.maps.event.addListener(map, 'click', function(event) {
    addTempMarker(event.latLng);
  });}
function getXmlHttp(){  var xmlhttprequest;
  try{
    xmlhttprequest = new XMLHttpRequest(); 
  }catch(e){
    alert("ERROR GETTING XMLHTTPREQUEST!");
  }
  return xmlhttprequest;}
