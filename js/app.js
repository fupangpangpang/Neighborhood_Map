var map;
var markersArray = [];

function googleError() {
    alert("Oops! Google just broke up with me!");
}

//Initialize the map and its contents
function initialize() {  
    var mapOptions = {
        zoom: 13,
        center: new google.maps.LatLng(39.2975031, -76.6178527),
        mapTypeControl: false,
        disableDefaultUI: true
    };
    if($(window).width() <= 1080) {
        mapOptions.zoom = 12;
    }
    if ($(window).width() < 850 || $(window).height() < 595) {
        hideNav();
    }

    map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);  

    setMarkers(markers);

    setAllMap();

    //Reset map on click handler and
    //when window resize conditionals are met
    function resetMap() {
        var windowWidth = $(window).width();
        if(windowWidth <= 1080) {
            map.setZoom(12);
            map.setCenter(mapOptions.center);
        } else if(windowWidth > 1080) {
            map.setZoom(13);
            map.setCenter(mapOptions.center);   
        }
    }
    $("#reset").click(function() {
        resetMap();
    });
   $(window).resize(function() {
        resetMap();
    }); 
}

//Determines if markers should be visible
//This function is passed in the knockout viewModel function
function setAllMap() {
  for (var i = 0; i < markers.length; i++) {
    if(markers[i].boolTest === true) {
    markers[i].holdMarker.setMap(map);
    } else {
    markers[i].holdMarker.setMap(null);
    }
  }
}

//Information about the different locations
//Provides information for the markers
var markers = [
    {   
    title: "The Wyman Park Dell",
    lat: 39.324289, 
    lng: -76.618217,
    lat_s: 39.323630,
    lng_s: -76.617544,
    streetAddress: "2900 N. Charles St.",
    cityAddress: "Baltimore, MD 21218",
    url: "http://www.wymanparkdell.org/",
    id: "nav0",
    visible: ko.observable(true),
    boolTest: true
    },
    {   
    title: "The Johns Hopkins Hospital",
    lat: 39.297668, 
    lng: -76.593267,
    lat_s: 39.297270,
    lng_s: -76.594029,
    streetAddress: "1800 Orleans St",
    cityAddress: "Baltimore, MD 21287",
    url: "http://www.hopkinsmedicine.org/",
    id: "nav1",
    visible: ko.observable(true),
    boolTest: true
    },
    {   
    title: "Downtown Sailing Center",
    lat: 39.274083, 
    lng: -76.600268,
    lat_s: 39.273420,
    lng_s: -76.601716,
    streetAddress: "1425 Key Hwy",
    cityAddress: "Baltimore, MD 21230",
    url: "http://www.downtownsailing.org/",
    id: "nav2",
    visible: ko.observable(true),
    boolTest: true
    },
    {   
    title: "Johns Hopkins Carey Business School",
    lat: 39.282481, 
    lng: -76.601591,
    lat_s: 39.2824774,
    lng_s: -76.6020452,
    streetAddress: "100 International Drive",
    cityAddress: "Baltimore, MD 21202",
    url: "http://carey.jhu.edu/",
    id: "nav3",
    visible: ko.observable(true),
    boolTest: true
    },
    {
    title: "Johns Hopkins University",
    lat: 39.329792, 
    lng: -76.618264,
    lat_s: 39.329077,
    lng_s: -76.6178572,
    streetAddress: "3400 N. Charles St.",
    cityAddress: "Baltimore, MD 21218",
    url: "https://www.jhu.edu/",
    id: "nav4",
    visible: ko.observable(true),
    boolTest: true
    },
    {   
    title: "Baltimore Penn Station",
    lat: 39.307427, 
    lng: -76.615204,
    lat_s: 39.307216,
    lng_s: -76.6163067,
    streetAddress: "1500 N Charles St",
    cityAddress: "Baltimore, MD 21201",
    url: "https://www.amtrak.com",
    id: "nav5",
    visible: ko.observable(true),
    boolTest: true
    },
    {
    title: "Washington Monument",
    lat: 39.297567, 
    lng: -76.615648,
    lat_s: 39.2977485,
    lng_s: -76.6152868,
    streetAddress: "699 Washington Pl",
    cityAddress: "Baltimore, MD 21201",
    url: "mvpconservancy.org",
    id: "nav6",
    visible: ko.observable(true),
    boolTest: true
    },
    {
    title: "Shoyou Sushi",
    lat: 39.272556, 
    lng: -76.611922,
    lat_s: 39.2725012,
    lng_s: -76.6117091,
    streetAddress: "1504 Light St",
    cityAddress: "Baltimore, MD 21230",
    url: "sushibruce.com",
    id: "nav7",
    visible: ko.observable(true),
    boolTest: true
    }
];

//Get Google Street View Image for each inidividual marker
    //Passed lat and lng to get each image location
    //Had to pass title for whitehouse & different lat and lng to get images
    //for White House and Capitol
var headingImageView = [325, 90, 0, 120, 300, 60, 240, 280];     
var streetViewImage;
var streetViewUrl = 'https://maps.googleapis.com/maps/api/streetview?size=180x90&location=';

function determineImage() {
       streetViewImage = streetViewUrl +
                        markers[i].lat_s + ',' + markers[i].lng_s +
                        '&fov=75&heading=' + headingImageView[i] + '&pitch=5'; 
                    }                   

//Sets the markers on the map within the initialize function
    //Sets the infoWindows to each individual marker
    //The markers are inidividually set using a for loop
function setMarkers(location) {
    
    for(i=0; i<location.length; i++) {
        location[i].holdMarker = new google.maps.Marker({
          position: new google.maps.LatLng(location[i].lat, location[i].lng),
          map: map,
          title: location[i].title,
           animation: google.maps.Animation.DROP,
          icon: {
            url: 'img/marker.png',
            size: new google.maps.Size(25, 40),
            origin: new google.maps.Point(0, 0),
            anchor: new google.maps.Point(12.5, 40)
            },
          shape: {
            coords: [1,25,-40,-25,1],
            type: 'poly'
          }  
        });

        //function to place google street view images within info windows
        determineImage();

        //Binds infoWindow content to each marker
        location[i].contentString = '<img src="' + streetViewImage + 
                                    '" alt="Street View Image of ' + location[i].title + '"><br><hr style="margin-bottom: 5px"><strong>' + 
                                    location[i].title + '</strong><br><p>' + 
                                    location[i].streetAddress + '<br>' + 
                                    location[i].cityAddress + '<br></p><a class="web-links" href="http://' + location[i].url + 
                                    '" target="_blank">' + location[i].url + '</a>';

        var infowindow = new google.maps.InfoWindow({
            content: markers[i].contentString
        });

        //Click marker to view infoWindow
            //zoom in and center location on click
        new google.maps.event.addListener(location[i].holdMarker, 'click', (function(marker, i) {
          return function() {
            infowindow.setContent(location[i].contentString);
            infowindow.open(map,this);
            var windowWidth = $(window).width();
            if(windowWidth <= 1080) {
                map.setZoom(14);
            } else if(windowWidth > 1080) {
                map.setZoom(16);  
            }
            if (marker.getAnimation() !== null) {
              marker.setAnimation(null);
            } else {
              marker.setAnimation(google.maps.Animation.BOUNCE);
                setTimeout(function ()
                    {
                        marker.setAnimation(null);
                        $(marker).dequeue();
                    }, 1400)
            }
            map.setCenter(marker.getPosition());
            location[i].picBoolTest = true;
          }; 
        })(location[i].holdMarker, i));
        
        //Click nav element to view infoWindow
            //zoom in and center location on click
        var searchNav = $('#nav' + i);
        searchNav.click((function(marker, i) {
          return function() {
            infowindow.setContent(location[i].contentString);
            infowindow.open(map,marker);
            map.setZoom(16);
            map.setCenter(marker.getPosition());
            location[i].picBoolTest = true;
            if (marker.getAnimation() !== null) {
              marker.setAnimation(null);
            } else {
              marker.setAnimation(google.maps.Animation.BOUNCE);
                setTimeout(function ()
                    {
                        marker.setAnimation(null);
                        $(marker).dequeue();
                    }, 1400)
            }
          }; 
        })(location[i].holdMarker, i));
    }
}

//Query through the different locations from nav bar with knockout.js
    //only display markers and nav elements that match query result
var viewModel = {
    query: ko.observable(''),
};

viewModel.markers = ko.dependentObservable(function() {
    var self = this;
    var search = self.query().toLowerCase();
    return ko.utils.arrayFilter(markers, function(marker) {
    if (marker.title.toLowerCase().indexOf(search) >= 0) {
            marker.boolTest = true;
            return marker.visible(true);
        } else {
            marker.boolTest = false;
            setAllMap();
            return marker.visible(false);
        }
    });       
}, viewModel);

ko.applyBindings(viewModel);

//show $ hide markers in sync with nav
$("#input").keyup(function() {
setAllMap();
});

//Hide and Show entire Nav/Search Bar on click
    // Hide/Show Bound to the arrow button
    //Nav is repsonsive to smaller screen sizes
var isNavVisible = true;
function noNav() {
    $("#search-nav").animate({
                height: 0, 
            }, 500);
            setTimeout(function() {
                $("#search-nav").hide();
            }, 500);    
            $("#arrow").attr("src", "img/question-icon.png");
            isNavVisible = false;
}
function yesNav() {
    $("#search-nav").show();
            var scrollerHeight = $("#scroller").height() + 55;
            if($(window).height() < 600) {
                $("#search-nav").animate({
                    height: scrollerHeight - 100,
                }, 500, function() {
                    $(this).css('height','auto').css("max-height", 439);
                });  
            } else {
            $("#search-nav").animate({
                height: scrollerHeight,
            }, 500, function() {
                $(this).css('height','auto').css("max-height", 549);
            });
            }
            $("#arrow").attr("src", "img/question-icon.png");
            isNavVisible = true;
}

function hideNav() {
    if(isNavVisible === true) {
            noNav();
            
    } else {
            yesNav();  
    }
}
$("#arrow").click(hideNav);

//Hide Nav if screen width is resized to < 850 or height < 595
//Show Nav if screen is resized to >= 850 or height is >= 595
    //Function is run when window is resized
$(window).resize(function() {
    var windowWidth = $(window).width();
    if ($(window).width() < 850 && isNavVisible === true) {
            noNav();
        } else if($(window).height() < 595 && isNavVisible === true) {
            noNav();
        }
    if ($(window).width() >= 850 && isNavVisible === false) {
            if($(window).height() > 595) {
                yesNav();
            }
        } else if($(window).height() >= 595 && isNavVisible === false) {
            if($(window).width() > 850) {
                yesNav();
            }     
        }    
});

//Expand .forecast div on click to see Weather Underground forecast
//and shrink back when additionally clicked
    //size is repsonsive to smaller screens
var weatherContainer = $("#weather-image-container");
var isWeatherVisible = false;
weatherContainer.click(function() {
    if(isWeatherVisible === false) {
        if($(window).width() < 670) {
            $(".forecast li").css("display", "block");
            weatherContainer.animate({
                width: "245"
            }, 500);
        } else {
            $(".forecast li").css("display", "inline-block");
            weatherContainer.animate({
                width: "380"
            }, 500);
        }
        isWeatherVisible = true;
    } else {
        weatherContainer.animate({
        width: "80"
    }, 500);
        isWeatherVisible = false;
    }
});

//GET Weather Underground JSON
    //Append Weather forecast for Washington DC to .forecast
    //If error on GET JSON, display message
var weatherUgUrl = "http://api.wunderground.com/api/9ae2f400343d21e9/conditions/q/DC/Washington.json";

$.ajax({weatherUgUrl, success: function(data) {
    var list = $(".forecast ul");
    detail = data.current_observation;
    list.append('<li>Temp: ' + detail.temp_f + '° F</li>');
    list.append('<li><img style="width: 25px" src="' + detail.icon_url + '">  ' + detail.icon + '</li>');
    }, error: function(e){
        $(".forecast").append('<p style="text-align: center;">Sorry! Weather Underground</p><p style="text-align: center;">Could Not Be Loaded</p>');
    }})

//Hide and show Weather forecast div from screen on click
var isWeatherImageVisible = true;
function hideWeather() {
    if(isWeatherImageVisible === true) {
            $("#weather-image-container").animate({
                height: 0,
                paddingTop: 0
            }, 300);
        isWeatherImageVisible = false;
    } else {
            $("#weather-image-container").animate({
                height: 60,
                paddingTop: 5
            }, 300);
        isWeatherImageVisible = true;
    }
}

$("#weather-image-container").click(hideWeather);

