// main vars
// funtions

//global variables
var rlist = new Object(); // actual restaurants list
var list_ref = new Array(); // reference of 'list' variable

$(function() { 
    $('#map_page').live("pageshow", function() {
        initialize();
    
    });
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


function storeTypes()
{
    
}

function loadDetail(number){
    
}

function clone (obj, deep) { 
    var objectClone = new obj.constructor(); 
    for (var property in obj) 
        if (!deep) 
            objectClone[property] = obj[property]; 
        else if (typeof obj[property] == 'object') 
            objectClone[property] = obj[property].clone(deep); 
        else 
            objectClone[property] = obj[property]; 
    return objectClone; 
} // clone

function loadListJSON()
{
    $.getJSON('doc/list.json', function(data)
    {
        rlist = clone(data, false);     
    });
   
    //var arrayLength = list.restaurant.length;
    
    //for(var i = 0; i < list.restaurant.length; i++)
        //list_ref[i] = i+1;
    
} // loadListJson

function sortList(type)
{
    var array_length = list.restaurant.length;
    
    if(type == 0) // Alphabetical Order
        {
            for (var i = 0; i < array_length; i++)
            {
                 for(var j = i+1; j < array_length; j++)
                 {
                     if(list.restaurant[list_ref[i]].name > list.restaurant[list_ref[j]].name)
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
        // need to get a location data(var whereIAM[2]) where the user is now. whereIAm[0] => latitude, whereIAm[1] = longitude
        var whereIAm = new Array();
        
        for(var i = 0; i < array_length; i++)
            {
                var x0, y0; // x0, y0 is whereIAm(the locationg where the user is)    
                var x1, y1;
                x1 = list.restaurant[list_ref[i]].coordinate.latitude;
                y1 = list.restaurant[list_ref[i]].coordinate.longitude;               
                var distance_i; // distance from whereIAm(where the user is) to the restaurant's location on array at i
                distance_i = Math.sqrt((x1 - x0) * (x1 - x0) + (y1 - y0) * (y1 - y0));
                
                for(var j = i + 1; j < array_length; j++)
                    {
                        var distance_i;
                        x1 = whereIAm[0];
                        y1 = whereIAm[1];
                        x1 = list.restaurant[list_ref[j]].coordinate.latitude;
                        y1 = list.restaurant[list_ref[j]].coordinate.latitude;
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
        for (var i = 0; i < array_length; i++)
        {
            for(var j = i+1; j < array_length; j++)
            {
                if(list.restaurant[list_ref[i]].rank < list.restaurant[list_ref[j]].rank)
                {
                    var temp;
                    temp = list_ref[i];
                    list_ref[i] = list_ref[j];
                    list_ref[j] = temp;
                }
            }
        }
    }
} // sortList

function List()
{
    return rlist;
}

function List_ref()
{
    return list_ref;
}