var jsonObject = {};

/**
 * update the json data stored on myjson.com https://api.myjson.com/bins/11c9ud
 */
function updateMyjson(){
    var jsonString = JSON.stringify(jsonObject)
    $.ajax({
        url:"https://api.myjson.com/bins/11c9ud",
        type:"PUT",
        data: jsonString,
        contentType:"application/json; charset=utf-8",
        dataType:"json",
        success: function(data, textStatus, jqXHR){
            jsonObject = data;
            updateTable();
        }
    });
}

/**
 * take json feed and output status table
 */
function updateTable(){
    var items = [];
    $.each( jsonObject, function( key, val ) {
          if(val == "out"){
              items.push('<tr class="out"><td>' + key + '</td><td>I\'m currently OUT</td><td><a href="#" class="in button" data-value="in" data-name="' + key + '">in</a> <span href="#" class="out button disabled">out</span></td></tr>');
          }
          if(val == "in"){
              items.push('<tr class="in"><td>' + key + '</td><td>I\'m currently IN</td><td><span href="#" class="in button disabled">in</span> <a href="#" class="out button" data-value="out" data-name="' + key + '">out</a></td></tr>');
          }
          if(val == "undecided"){
              items.push('<tr><td>' + key + '</td><td>Yet to inform</td><td><a href="#" class="in button" data-value="in" data-name="' + key + '">in</a> <a href="#" class="out button" data-value="out" data-name="' + key + '">out</a></td></tr>');
          }
    });
    $('table.json').html(items.join( "" ));
}

/**
 * display date
 */
var date = new Date();
var day = date.getDay();
if(day < 4){
    date.setDate(date.getDate() + (4 - day)); 
} else if(day > 4) {
    date.setDate(date.getDate() - (day - 4) + 7);
}
var datestring = date.toDateString();
$('h2').append(datestring);

/**
 * get json feed of current player status
 */
$.getJSON( "https://api.myjson.com/bins/11c9ud", function( data ) {
    jsonObject = data;
    updateTable();
});

/**
 * event handler for staus change - attach to table which is not injected else handlers only work once
 */
$('table').on('click', 'a.button', function(event ) {
    //alert( "Handler for .click() called." );
    event.preventDefault();
    var key = $(this).attr('data-name');
    var value = $(this).attr('data-value');
    jsonObject[key] = value;   
    updateMyjson();
});

/**
 * event handler for form
 */
$('form').submit(function(event) {
    //alert( "Handler for .submit() called." );
    event.preventDefault();
    var newName = $('#name').val();
    jsonObject[newName] = "undecided";
    updateMyjson();
    $('#name').val('');
});

/**
 * Event handler for toggle
 */
$('legend span').click(function() {
    $('.closed').slideToggle();
});

/**
 * event handler for reset button
 */
$('#reset').click(function(event) {
    //alert( "Handler for .submit() called." );
    event.preventDefault();
    $.each( jsonObject, function( key, val ) {
        jsonObject[key] = "undecided";
    });
    updateMyjson();
});