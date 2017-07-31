var Locations =  [
  { name: "Qasr El Eyni Hospital", lat: 27.185145, lng: 31.166807, isVisible: ko.observable(true), id: 'loc2' },
  { name: "Assiut University", lat: 27.188906, lng: 31.168442, isVisible: ko.observable(true), id: 'loc3' },
  { name: "Asyut Governorate", lat: 27.191845, lng: 31.190434, isVisible: ko.observable(true), id: 'loc4' },
  { name: "McDonald's", lat: 27.191444, lng: 31.185982, isVisible: ko.observable(true), id: 'loc5' },
  { name: "KFC Restaurant", lat: 27.188926, lng: 31.191729, isVisible: ko.observable(true), id: 'loc6' }
];
var viewModel = {
  myInput: ko.observable('')
};
var map;
var myInfowindow;
var mapMarkers = [];
var content;


function initMap() {
  map = new google.maps.Map(document.getElementById('map'), {
    center: {lat: 27.190271, lng: 31.182164},
    zoom: 15
    // mapTypeId: 'terrain'
  });

  myInfowindow = new google.maps.InfoWindow();
  for (var i = 0; i < Locations.length; i++) {
    var Location = Locations[i];
    if (Location.isVisible()){
      var marker = new google.maps.Marker({
        position: {lat: Location.lat, lng: Location.lng},
        map: map,
        title: Location.name,
        id: Location.id
        // data: getData(Location.name)
      });

      mapMarkers[i] = marker;
      marker.addListener('click', clickMe);
      Location.marker = marker;

    }
  }
}

viewModel.activateMarker = function(loc) {
  stopMarkerAnimation();
  animateMarker(loc.marker);
  showInfo(loc.marker, myInfowindow);
};

function clickMe() {
  stopMarkerAnimation();
  animateMarker(this);
  showInfo(this, myInfowindow);
}

function showInfo(marker, infowindow) {
  if (infowindow.marker != marker) {
    infowindow.marker = marker;
    getData(marker.title);
    // infowindow.setContent( '<h2>' + marker.title + '</h2> <h4>Relevant Wikipedia Links:</h4>'+ content );
    infowindow.open(map, marker);
    infowindow.addListener('closeclick', function(){
      infowindow.marker = null;
    });
  }
}

function updateMarkers() {
  for (var i = 0; i < mapMarkers.length; i++) {
    var Location = Locations[i];
    if (Location.isVisible()){
      mapMarkers[i].setMap(map);
    } else {
      mapMarkers[i].setMap(null);
    }
  }
}




function getData(loc) {
  content = '<ul>';
  var wiki = 'http://en.wikipedia.org/w/api.php?action=opensearch&search=' + loc + '&format=json';
  $.ajax(wiki, {
    dataType: 'jsonp',
    success: function (response) {
      var aticleList = response[1];
      var responseLength = aticleList.length;

      if (responseLength > 0) {
        for(var i =0; i < responseLength; i++) {
          articlestr = aticleList[i];
          var urll = 'https://en.wikipedia.org/wiki/' + articlestr;
          content += '<li><a href="' + urll + '">' + articlestr +'</a></li>';
        }
        content += '</ul>';
      } else {
       content ='No links found';
      }
      myInfowindow.setContent( '<h2>' + loc + '</h2> <h4>Relevant Wikipedia Links:</h4>'+ content );
    }
  }).fail(function() {
    alert('wikipedia request fails');
  });
}



function animateMarker(marker) {
	marker.setAnimation(google.maps.Animation.BOUNCE);
}

function stopMarkerAnimation() {
  var marker;
  for (var i = 0; i < mapMarkers.length; i++) {
    marker = mapMarkers[i];
	marker.setAnimation(null);
  }
}

viewModel.Locations = ko.dependentObservable(function() {
    var filter = viewModel.myInput().toLowerCase();
    return ko.utils.arrayFilter(Locations, function(marker) {
    if (marker.name.toLowerCase().indexOf(filter) > -1) {
          return marker.isVisible(true);
      } else {
          return marker.isVisible(false);
      }
    });
}, viewModel);

ko.applyBindings( viewModel);

// open the side menu
function openNav() {
  document.getElementById("mySidenav").style.width = "300px";
  document.getElementById("map").style.marginLeft = "300px";
}
// close the side menu
function closeNav() {
  document.getElementById("mySidenav").style.width = "0";
  document.getElementById("map").style.marginLeft = "0";
}

function googleError() {
  alert("Google Maps did not load");
}