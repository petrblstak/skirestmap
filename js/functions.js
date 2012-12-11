// main vars
// funtions

// distance and rating into list -> to the right
// fix footer and map loading bottom gap
// changing footer

//global variables
var rlist = new Object(); // actual restaurants list
var list_ref = new Array(); // reference of 'list' variable
var types = new Array(1,1,1,1); //"Korean", "Chinese", "Japanese", "Western" // 0 is unchecked, 1 is checked
var actualRest = null; // actually selected restaurant
var map; // map reference
var pos; // actual coordinates of my position
var sorting = 0; // initial sortig type
var debudMode = true;

$(function() { 
    $('#map_page').live("pageshow", function() {
        mapInit();
    });
    $('#map_page').live("pageshow", function() {
        setCanvas();
    });
    $('#detail_page').live("pagecreate", function() {
        showDetail(); 
    });
    $('#list_page').live("pagecreate", function() {
        showRestList();
    });
    $('#type_page').live("pagecreate", function() {
        setCheckboxes();
    });
    initRestList();
    initialize();
});

function mapInit() {
    var mapOptions = {
        zoom: 14,
        mapTypeId: google.maps.MapTypeId.ROADMAP
    };
    
    map = new google.maps.Map(document.getElementById('map_canvas'),
        mapOptions);        
    map.setCenter(pos);  
        
    var restaurant;
    var infowindow = new google.maps.InfoWindow({
        maxWidth: 200
    });
    
    for (var i=0, len = list_ref.length; i < len; ++i) {
        
        restaurant = rlist.restaurant[list_ref[i]];

        var type = restaurant.type[0];
        for (var j = 1; j < restaurant.type.length; j++){
            type = type + ", " + restaurant.type[j];
        }
        
        var link = '<a href="detail.html", id="'+i+'", onclick="setActualRest()">More...</a>';        
        var content = "<h2>"+restaurant.name+"</h2><p>Phone: "+restaurant.tel+"<br/>Ranking: "+restaurant.grade+"<br/>Type: "+type+"<br/><br/>"+link+"</p>";

        var marker = new google.maps.Marker({
            position: new google.maps.LatLng(restaurant.coordinate.latitude,restaurant.coordinate.longitude),
            map: map,
            html: content
        });
        
        google.maps.event.addListener(marker, 'click', function () {
            infowindow.setContent(this.html);
            infowindow.open(map, this);
        });
    }
}

function initialize() {
    if (debudMode){
        pos = new google.maps.LatLng(37.580909,128.333352);
    }
    else {
        if(navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(function(position) {
                pos = new google.maps.LatLng(position.coords.latitude,
                    position.coords.longitude);  

            }, function() {
                handleNoGeolocation(true);
            });
        } else {
            // Browser doesn't support Geolocation
            handleNoGeolocation(false);
        }
    }
}

function handleNoGeolocation(errorFlag) {
    var content;
    if (errorFlag) {
        content = 'Error: The Geolocation service failed.';
    } else {
        content = 'Error: Your browser doesn\'t support geolocation.';
    }

    var options = {
        map: map,
        position: new google.maps.LatLng(60, 105),
        content: content
    };

    var infowindow = new google.maps.InfoWindow(options);
    map.setCenter(options.position);
}

function setCanvas(){
    var elem = document.getElementById("map_canvas");
    var height = screen.height - 98;
    $("#map_canvas").css('height' , height);
    //elem.setAttribute("style", "height: " + height + "px;")
    google.maps.event.trigger(map, "resize");
}

function sortList(type)
{
    sorting = type;
    var count = 0;
    var i,j, temp;
    var fresh_list = new Array();
    var type_key = {
        'Korean': 0,
        'Chinese': 1,
        'Japanese': 2,
        'Western': 3
    };
    for(i = 0; i < rlist.restaurant.length; i++)
    {
        var add = false;        
        for(j = 0; j < rlist.restaurant[i].type.length; j++)
        {
            if(types[type_key[rlist.restaurant[i].type[j]]])
            {
                add = true;
                break;
            }
        }        
        if(add)
        {
            fresh_list[count] = i;
            count++;
        }
    }
    list_ref = fresh_list;
    var array_length = count;
    
    if(type == 0) // Alphabetical Order
    {
        for (i = 0; i < array_length; i++)
        {
            for(j = i+1; j < array_length; j++)
            {
                if(rlist.restaurant[list_ref[i]].name > rlist.restaurant[list_ref[j]].name)
                {
                    temp = list_ref[i];
                    list_ref[i] = list_ref[j];
                    list_ref[j] = temp;
                }
            }
        }
    }
    else if(type == 1) // Ascending Distance Order
    {
        // need to get a location data(var whereIAM[2]) where the user is now. whereIAm[0] => latitude, whereIAm[1] = longitude
        var whereIAm = new Array();
        whereIAm[0] = pos.lat();
        whereIAm[1] = pos.lng();
        //whereIAm[0] = 0; // temporarily
        //whereIAm[1] = 0; // temporarily
        
        for(i = 0; i < array_length; i++)
        {
            var x0, y0; // x0, y0 is whereIAm(the locationg where the user is)    
            var x1, y1;
            x0 = whereIAm[0];
            y0 = whereIAm[1];
            x1 = rlist.restaurant[list_ref[i]].coordinate.latitude;
            y1 = rlist.restaurant[list_ref[i]].coordinate.longitude;   
            
            var distance_i; // distance from whereIAm(where the user is) to the restaurant's location on array at i
            
            // distance in meter = x degree * (3600' / 1 degree) * (30.864 meter / 1')
            distance_i = Math.sqrt((x1 - x0) * (x1 - x0) + (y1 - y0) * (y1 - y0)) * 3600 * 30.864;
            
            rlist.restaurant[i].distance = distance_i;
        }
        
        for(i = 0; i < array_length; i++)
        {
            for(j = i + 1; j < array_length; j++)
            {
                if(rlist.restaurant[i].distance > rlist.restaurant[j].distance)
                {
                    temp = list_ref[i];
                    list_ref[i] = list_ref[j];
                    list_ref[j] = temp;
                }
            }
        }
    }
    else if(type == 2) // Descending Rank Order
    { 
        for (i = 0; i < array_length; i++)
        {
            for(j = i+1; j < array_length; j++)
            {
                if(rlist.restaurant[list_ref[i]].grade < rlist.restaurant[list_ref[j]].grade)
                {
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
        sortList(sorting);
    });
}

function showRestList(){   
    var elem = document.getElementById("restaurant_list");    
        
    for (var i=0, len = list_ref.length; i < len; ++i) {
        var row = document.createElement("li");
        var link = document.createElement("a");
        var span = document.createElement("span");
        span.setAttribute("class","right-list");
        if(sorting){
            if(sorting == 1){
                span.appendChild(document.createTextNode(rlist.restaurant[list_ref[i]].distance + " m"));
            } 
            else if (sorting == 2){    
                //span.appendChild(document.createTextNode(rlist.restaurant[list_ref[i]].grade + "stars"));                
                span.setAttribute("class","right-list stars"+rlist.restaurant[list_ref[i]].grade);
            }
        }
        link.setAttribute("href","detail.html");
        link.setAttribute("id",i);
        link.setAttribute("onclick","setActualRest()");
        link.appendChild(document.createTextNode(rlist.restaurant[list_ref[i]].name));
        link.appendChild(span);
        row.appendChild(link);
        elem.appendChild(row);
    }    
}
function setActualRest(){    
    actualRest = event.target.id;
    pos = new google.maps.LatLng(rlist.restaurant[actualRest].coordinate.latitude,
        rlist.restaurant[actualRest].coordinate.longitude);
}

function showDetail(){
    var restaurant = rlist.restaurant[list_ref[actualRest]];
    document.getElementById("detail_title").appendChild(document.createTextNode(restaurant.name));
    var type = restaurant.type[0];
    for (var i = 1; i < restaurant.type.length; i++){
        type = type + ", " + restaurant.type[i];
    }
    var content = "Phone: "+restaurant.tel+"\nRanking: "+restaurant.grade+"\nType: "+type+"\nCoordinates: "+restaurant.coordinate.latitude+", "+restaurant.coordinate.longitude+"\n\nReview:\n"+restaurant.comment;
    document.getElementById("detail_content").innerText = content; 
}

function showcoord(){    
    alert(pos.lat()+" "+pos.lng()); 
}

function typeChanged(number){
    types[number] = !types[number];
}

function setCheckboxes(){
    $("#checkbox-1").attr("checked",types[0]);
    $("#checkbox-2").attr("checked",types[1]);
    $("#checkbox-3").attr("checked",types[2]);
    $("#checkbox-4").attr("checked",types[3]);
}
