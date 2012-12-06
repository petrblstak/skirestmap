// main vars
// funtions

//global variables
var rlist = new Object(); // actual restaurants list
var list_ref = new Array(); // reference of 'list' variable
var types = new Array(1,1,1,1); //korean, chinesse, japanese, ewstern
var actualRest = null;

$(function() { 
    $('#map_page').live("pageshow", function() {
        initialize();
    });
    $('#detail_page').live("pagecreate", function() {
        showDetail();
    });
    $('#list_page').live("pagecreate", function() {
        showRestList();
    });
    initRestList();
});

function initialize() 
{
    var locations = [
    ['Athens Test point 1', 37.9586674,23.7195099, 1],
    ['Athens Test Point 2', 38.0457918, 23.7676337, 2]
    ];

    var map = new google.maps.Map(document.getElementById('map_canvas'), {
        zoom: 12,
        center: new google.maps.LatLng(37.9586674, 23.7195099),
        mapTypeId: google.maps.MapTypeId.ROADMAP
    });

    var infowindow = new google.maps.InfoWindow();

    var marker, i;

    for (i = 0; i < locations.length; i++) 
    {  
        marker = new google.maps.Marker({
            position: new google.maps.LatLng(locations[i][1], locations[i][2]),
            map: map
        });

        google.maps.event.addListener(marker, 'click', (function(marker, i) {
            return function() {
                infowindow.setContent('<div class="iwContainer">' + locations[i][0] + '</div>');
                infowindow.open(map, marker);
            }
        })(marker, i));
    }
}

function sortList(type)
{
    for(var i = 0; i < rlist.restaurant.length; i++)
        list_ref[i] = i;
    
    var array_length = rlist.restaurant.length;
    
    if(type == 0) // Alphabetical Order
    {
        for (var i = 0; i < array_length; i++)
        {
            for(var j = i+1; j < array_length; j++)
            {
                if(rlist.restaurant[list_ref[i]].name > rlist.restaurant[list_ref[j]].name)
                {
                    var temp;
                    temp = list_ref[i];
                    list_ref[i] = list_ref[j];
                    list_ref[j] = temp;
                }
            }
        }
    }
    else if(type == 1) // Ascending Distance Order
    {
        alert("1");
        // need to get a location data(var whereIAM[2]) where the user is now. whereIAm[0] => latitude, whereIAm[1] = longitude
        var whereIAm = new Array();
        whereIAm[0] = 0; // temporarily
        whereIAm[1] = 0; // temporarily
        
        for(var i = 0; i < array_length; i++)
        {
            var x0, y0; // x0, y0 is whereIAm(the locationg where the user is)    
            var x1, y1;
            x0 = whereIAm[0];
            y0 = whereIAm[1];
            y0 = 0;
            x1 = rlist.restaurant[list_ref[i]].coordinate.latitude;
            y1 = rlist.restaurant[list_ref[i]].coordinate.longitude;               
            var distance_i; // distance from whereIAm(where the user is) to the restaurant's location on array at i
            distance_i = Math.sqrt((x1 - x0) * (x1 - x0) + (y1 - y0) * (y1 - y0));
                
            for(var j = i + 1; j < array_length; j++)
            {
                var distance_j;
                x1 = rlist.restaurant[list_ref[j]].coordinate.latitude;
                y1 = rlist.restaurant[list_ref[j]].coordinate.latitude;
                distance_j = Math.sqrt((x1 - x0)*(x1 - x0) + (y1 - y0)*(y1 - y0));
                        
                if(distance_i > distance_j)
                {
                    var temp;
                    list_ref[i] = temp;
                    list_ref[i] = list_ref[j];
                    list_ref[j] = temp;
                }
            }
        }
    }
    else if(type == 2) // Dedscending Rank Order
    { 
        alert("descending rank order");
        for (var i = 0; i < array_length; i++)
        {
            for(var j = i+1; j < array_length; j++)
            {
                if(rlist.restaurant[list_ref[i]].rank < rlist.restaurant[list_ref[j]].rank)
                {
                    var temp;
                    temp = list_ref[i];
                    list_ref[i] = list_ref[j];
                    list_ref[j] = temp;
                }
            }
        }
    }
} // sortListAlphabetically
    
// wait for the page to load
function initRestList(){    
    $.getJSON('doc/list.json', function(data)
    { 
        rlist = jQuery.extend(true, {}, data);
    });
}

function showRestList(){   
    var elem = document.getElementById("restaurant_list");    
        
    for (var i=0, len = list_ref.length; i < len; ++i) {
        var row = document.createElement("li");
        var link = document.createElement("a");
        link.setAttribute("href","detail.html");
        link.setAttribute("id",i);
        link.setAttribute("onclick","setActualRest()");
        link.appendChild(document.createTextNode(rlist.restaurant[list_ref[i]].name));
        row.appendChild(link);
        elem.appendChild(row);
    }    
}
function setActualRest(){    
    actualRest = event.target.id;
}

function showDetail(){
    var restaurant = rlist.restaurant[list_ref[actualRest]];
    document.getElementById("detail_title").appendChild(document.createTextNode(restaurant.name));
    var content = "Phone: "+restaurant.tel+"\nRanking: "+restaurant.grade+"\nType: "+restaurant.type[0]+"\nCoordinates: "+restaurant.coordinate.latitude+", "+restaurant.coordinate.longitude+"\n\nReview:\n"+restaurant.comment;
    document.getElementById("detail_content").innerText = content; 
}