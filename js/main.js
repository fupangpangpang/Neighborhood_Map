var map;
var markers = [];



var MarkerInfoList = [
    {   
        title: "The Wyman Park Dell",
        lat: 39.324289, 
        lng: -76.618217,
        streetAddress: "2900 N. Charles St.",
        cityAddress: "Baltimore, MD 21218",
        url: "http://www.wymanparkdell.org/",
    },
    {   
        title: "The Johns Hopkins Hospital",
        lat: 39.297668, 
        lng: -76.593267,
        streetAddress: "1800 Orleans St",
        cityAddress: "Baltimore, MD 21287",
        url: "http://www.hopkinsmedicine.org/",
    },
    {   
        title: "Downtown Sailing Center",
        lat: 39.274083, 
        lng: -76.600268,
        streetAddress: "1425 Key Hwy",
        cityAddress: "Baltimore, MD 21230",
        url: "http://www.downtownsailing.org/",
        },
    {   
        title: "Johns Hopkins Carey Business School",
        lat: 39.282481, 
        lng: -76.601591,
        streetAddress: "100 International Drive",
        cityAddress: "Baltimore, MD 21202",
        url: "http://carey.jhu.edu/",
    },
    {
        title: "Johns Hopkins University",
        lat: 39.329792, 
        lng: -76.618264,
        streetAddress: "3400 N. Charles St.",
        cityAddress: "Baltimore, MD 21218",
        url: "https://www.jhu.edu/",
    },
    {   
        title: "Baltimore Penn Station",
        lat: 39.307427, 
        lng: -76.615204,
        streetAddress: "1500 N Charles St",
        cityAddress: "Baltimore, MD 21201",
        url: "https://www.amtrak.com",
    },
    {
        title: "Washington Monument",
        lat: 39.297567, 
        lng: -76.615648,
        streetAddress: "699 Washington Pl",
        cityAddress: "Baltimore, MD 21201",
        url: "mvpconservancy.org",
    },
    {
        title: "Shoyou Sushi",
        lat: 39.272556, 
        lng: -76.611922,
        streetAddress: "1504 Light St",
        cityAddress: "Baltimore, MD 21230",
        url: "sushibruce.com",
    }
]

function googleError() {
    alert("Oops! Google just broke up with me!");
}

function initMap() {  
	var mapOptions = {
        zoom: 13,
        center: {lat: 39.272556, lng: -76.611922}
    };
    
	map = new google.maps.Map(document.getElementById('map'), mapOptions);  

	
	initMarkers(MarkerInfoList);
    setbound(map, MarkerInfoList);

}


function initMarkers(MarkerInfoList){
	var TheInfoWindow = new google.maps.InfoWindow();
	var bounds = new google.maps.LatLngBounds();
	for (var i = 0; i < MarkerInfoList.length; i++) {
		var position = new google.maps.LatLng(MarkerInfoList[i].lat, MarkerInfoList[i].lng);
        var visible = MarkerInfoList[i].visible;
		MarkerInfoList[i].marker = new google.maps.Marker({
			map: map,
			position: position,
			title: MarkerInfoList[i].title,
			animation: google.maps.Animation.DROP,
			id: i,
		});

		MarkerInfoList[i].marker.addListener('click', function() {
            currentmarker = this;
            MarkerInfo = MarkerInfoList[currentmarker.id];
            if (currentmarker.getAnimation() !== null) {
                currentmarker.setAnimation(null);
            } else {
                currentmarker.setAnimation(google.maps.Animation.BOUNCE);
                setTimeout(function (){
                        currentmarker.setAnimation(null);
                        $(currentmarker).dequeue();
                        }, 1400);
            }
            map.setCenter(currentmarker.getPosition());

			populateInfoWindow(currentmarker, TheInfoWindow, MarkerInfo);
		});
	}
}

function setbound (map, MarkerInfoList){
    bounds = new google.maps.LatLngBounds();

    for (var i in MarkerInfoList) {
        if (MarkerInfoList[i].marker.visible == true) {
            bounds.extend(MarkerInfoList[i].marker.position);
        }

    };

    map.fitBounds(bounds);


}

function populateInfoWindow(marker, infowindow, contentString) {
    var TweetText = '<div id="tweet-div">   <blockquote class="twitter-tweet" lang="en"><p>twitter will be embeded here </p>&mdash; Nichim Izazvan (@NichimIzazvan) <a href="https://twitter.com/NichimIzazvan/statuses/419180893035827200">January 3, 2014</a></blockquote></div>';
    var BasicInfo = '<div id="basicinfo">' + MarkerInfo.title + '</strong><br><p>' + 
                MarkerInfo.streetAddress + '<br>' + 
                MarkerInfo.cityAddress + '<br></p><a class="web-links" href="http://' + 
                MarkerInfo.url + 
                '" target="_blank">' + MarkerInfo.url + '</a>' + '<p id="Twitterbutton">Nearby Twitter</p>'+'</div>'
    var contentString = '<div id="infoWindow">' + BasicInfo +
                TweetText +'</div>';



	infowindow.setContent(contentString);
	infowindow.open(map, marker);
    google.maps.event.addListener(infowindow, 'domready', function () {
        ! function (d, s, id) {
            var js, fjs = d.getElementsByTagName(s)[0];
            if (!d.getElementById(id)) {
                js = d.createElement(s);
                js.id = id;
                js.src = "https://platform.twitter.com/widgets.js";
                fjs.parentNode.insertBefore(js, fjs);
                }
        }(document, "script", "twitter-wjs");
    });
    twttr.ready(function (twttr) { twttr.widgets.load();});
}

var viewModel = {
    markers: ko.observableArray(MarkerInfoList),
    query: ko.observable(''),

}
viewModel.filteredMarkers = ko.computed(function() {
    var self = this;
    var filter = self.query().toLowerCase();

    return ko.utils.arrayFilter(self.markers(), function(marker) {
        if (!filter){
            if (marker.marker != undefined) {
                marker.marker.setVisible(true);
                setbound(map, self.markers());

            }
            return true;
        } else if (marker.title.toLowerCase().indexOf(filter) >= 0) {
            marker.marker.setVisible(true);
            setbound(map, self.markers());

            return true;
        } else {
            marker.marker.setVisible(false);
            setbound(map, self.markers());

            return false;
        }
    });
}, viewModel);


viewModel.clickmarker = function(marker) {
    for (var i in MarkerInfoList){
        if (MarkerInfoList[i].title == marker.title){
            MarkerInfoList[i].marker.setVisible(true);
            setbound(map, MarkerInfoList);
        } else {
            MarkerInfoList[i].marker.setVisible(false);
            setbound(map, MarkerInfoList);
        }
    };
}

ko.applyBindings(viewModel);


 



