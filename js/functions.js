// main vars
// funtions

//global variables
var list = new Object(); // actual restaurants list
var list_ref = new Array(); // reference of 'list' variable

function storeTypes()
{
    
}

function loadDetail(number){
    
}

function temp()
{
    alert(window.list.restaurant[0].name);
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
        window.list = clone(data, false);
        
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