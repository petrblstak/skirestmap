// main vars
// funtions

//global variables
var rlist = new Object(); // actual restaurants list
var list_ref = new Array(); // reference of 'list' variable

$(function() { 
    $('#map_page').live("pageshow", function() {
        initialize();
        alert("rlist.restaurant[0].name");
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

function temp()
{
    alert(rlist.restaurant[0].name);
} // temp

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
    
    for(var i = 0; i < list.restaurant.length; i++)
        list_ref[i] = i+1;
    
} // loadListJson

function sortListAlphabetically()
{
    for (var i = 0; i < list.restaurant.length; i++)
    {
        for(var j = i+1; j < list.restaurant.length; j++)
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
} // sortListAlphabetically