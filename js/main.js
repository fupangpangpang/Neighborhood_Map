var map;
var markers = [];
var TheInfoWindow;


var MarkerInfoList = [
    {   
        title: "The Wyman Park Dell",
        lat: 39.324289, 
        lng: -76.618217,
        streetAddress: "2900 N. Charles St.",
        cityAddress: "Baltimore, MD 21218",
        url: "http://www.wymanparkdell.org/",
        venueID: '4aeed30bf964a52051d421e3'
    },
    {   
        title: "The Johns Hopkins Hospital",
        lat: 39.297668, 
        lng: -76.593267,
        streetAddress: "1800 Orleans St",
        cityAddress: "Baltimore, MD 21287",
        url: "http://www.hopkinsmedicine.org/",
        venueID: '4b3a380ff964a520726225e3'

    },
    {   
        title: "Downtown Sailing Center",
        lat: 39.274083, 
        lng: -76.600268,
        streetAddress: "1425 Key Hwy",
        cityAddress: "Baltimore, MD 21230",
        url: "http://www.downtownsailing.org/",
        venueID: '4ad4c019f964a5202ef120e3'
        },
    {   
        title: "Johns Hopkins Carey Business School",
        lat: 39.282481, 
        lng: -76.601591,
        streetAddress: "100 International Drive",
        cityAddress: "Baltimore, MD 21202",
        url: "http://carey.jhu.edu/",
        venueID: '4c38b49cdfb0e21e7310afa8'
    },
    {
        title: "Johns Hopkins University",
        lat: 39.329792, 
        lng: -76.618264,
        streetAddress: "3400 N. Charles St.",
        cityAddress: "Baltimore, MD 21218",
        url: "https://www.jhu.edu/",
        venueID:'49cf23c6f964a520a25a1fe3'
    },
    {   
        title: "Baltimore Penn Station",
        lat: 39.307427, 
        lng: -76.615204,
        streetAddress: "1500 N Charles St",
        cityAddress: "Baltimore, MD 21201",
        url: "https://www.amtrak.com",
        venueID: '4a6cfbd4f964a52042d21fe3'
    },
    {
        title: "Washington Monument",
        lat: 39.297567, 
        lng: -76.615648,
        streetAddress: "699 Washington Pl",
        cityAddress: "Baltimore, MD 21201",
        url: "mvpconservancy.org",
        venueID: '4ad4c016f964a520f4ef20e3'
    },
    {
        title: "Shoyou Sushi",
        lat: 39.272556, 
        lng: -76.611922,
        streetAddress: "1504 Light St",
        cityAddress: "Baltimore, MD 21230",
        url: "sushibruce.com",
        venueID: '50a6e236e4b0540fe0736134'
    }
];

function googleError() {
    alert("Oops! Google just broke up with me!");
}

function initMap() {  
    var mapOptions = {
        zoom: 13,
        center: {lat: 39.272556, lng: -76.611922}
    };
    
    map = new google.maps.Map(document.getElementById('map'), mapOptions);  

    google.maps.event.addDomListener(window, "resize", function() {
       var center = map.getCenter();
       google.maps.event.trigger(map, "resize");
       map.setCenter(center); 
    }); 
    initMarkers(MarkerInfoList);
    setbound(map, MarkerInfoList);

}


function initMarkers(MarkerInfoList){
    TheInfoWindow = new google.maps.InfoWindow({
        maxWidth: 300
    });
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

        MarkerInfoList[i].marker.addListener('click', markerclicklistener);
    }
}

function markerclicklistener(){
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
}

function setbound (map, MarkerInfoList){
    bounds = new google.maps.LatLngBounds();
    anygood = false;
    for (var i in MarkerInfoList) {
        if (MarkerInfoList[i].marker.visible === true) {
            bounds.extend(MarkerInfoList[i].marker.position);
            anygood = true;
        }

    }
    if (!anygood){
        for (var x in MarkerInfoList) {
            bounds.extend(MarkerInfoList[x].marker.position);
        }
        anygood = true;
   
    }



    map.fitBounds(bounds);


}

function populateInfoWindow(marker, infowindow, MarkerInfo) {
    var self = this;
    var BasicInfo = '<div id="basicinfo"><strong><font size = "+2">' + MarkerInfo.title + '</font></strong><hr>'+ 
                '<p>' +'<img src="img/location.png" alt="Location" style="align: left;width:20px;height:20px;">'+
                 MarkerInfo.streetAddress + ',' + MarkerInfo.cityAddress + '<br></p>'+ 
                '<p>' +'<img src="img/website.png" alt="website" style="align: left;width:20px;height:20px;">'+
                '<a class="web-links" href="' + MarkerInfo.url + '" target="_blank">' + MarkerInfo.url + '</a>' + '</p>'+'</div>';
    var fstips ;
    var fstiplist = [];
    var venueUrl = 'https://api.foursquare.com/v2/venues/' + MarkerInfo.venueID + '/tips?sort=recent&limit=3&v=20161025&client_id=40KVQOGDWER5FRTLBWQH1YUP5GKCXBWZZIWLSVU44ULUPWFH&client_secret=KJMJAORCXSH3PLAEAPFUNGGFIKSL3NUSTVQ40JYCEHNR0HZO';
    var contentString;

    $.getJSON(venueUrl,
        function(data) {
            $.each(data.response.tips.items, function(i, tips){
                fstiplist.push('<li><em>" ' + tips.text + ' "</em></li>');
            });
        }).done(function(){
            fstips = '<p>' +'<img src="img/foursquare.png" alt="foursquare" style="align: left;width:20px;height:20px;">'+
                'Most Recent Tips in Foursquare:</p>' + '<ul class="tips">' + fstiplist.join('') + '</ul>';
            contentString = '<div id="infoWindow">' + BasicInfo +fstips +'</div>';
            infowindow.setContent(contentString);
            infowindow.open(map, marker);

        }).fail(function() {
            alert("Oops! Foursquare just broke up with me!");
        });


}

var viewModel = {
    markers: ko.observableArray(MarkerInfoList),
    query: ko.observable(''),

};
viewModel.filteredMarkers = ko.computed(function() {
    var self = this;
    var filter = self.query().toLowerCase();
    return ko.utils.arrayFilter(self.markers(), function(marker) {
        if (!filter){
            if (marker.marker !== undefined) {
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
            currentmarker = MarkerInfoList[i].marker;
            currentmarker.setVisible(true);
            currentmarker.setAnimation(google.maps.Animation.BOUNCE);
            setTimeout(function(){ currentmarker.setAnimation(null); }, 1400);
            setbound(map, MarkerInfoList);
            populateInfoWindow(currentmarker, TheInfoWindow, MarkerInfoList[i]);
        } else {
            MarkerInfoList[i].marker.setVisible(false);
            setbound(map, MarkerInfoList);
        }
    }
};

ko.applyBindings(viewModel);


$("#listbutton").click(function(){
    $("#searchlist").toggle();
});



$(window).resize(function() {
    if ($(window).width() < 700 || $(window).height() < 450) {
        $("#searchlist").hide();
    } else {
        $("#searchlist").show();
    }
    }); 

