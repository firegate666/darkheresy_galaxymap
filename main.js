var first_click = true;
var debugmode = false;
var editmode = false;

$(function(){
	setEditmode();
    $('#map').click(function(ev){
        getData(ev.pageX, ev.pageY);
    });
    $('#marker').click(function(ev){
        markerPlacement(ev.pageX, ev.pageY);
        setMarker();
    });
});

function resetInput() {
    $('#editlayer input[type=text]').val('');
    $('#marker').hide('slow');
}

function markerPlacement(x, y) {
    var x1 = parseInt($('#pos_x').val());
    var x2 = parseInt($('#pos_x2').val());
    var y1 = parseInt($('#pos_y').val());
    var y2 = parseInt($('#pos_y2').val());

    var center_x = x1 + ((x2-x1) / 2); 
    var center_y = y1 + ((y2-y1) / 2); 

    if (x < x1 || y < y1) {
        $('#pos_x').val(x);
    //} else if (y < y1) {
        $('#pos_y').val(y);
    } else if (x < center_x && y < center_y) {
        $('#pos_x').val(x);
        $('#pos_y').val(y);
    } else {
        $('#pos_x2').val(x);
        $('#pos_y2').val(y);
    }

}

function setMarker() {
    var x1 = parseInt($('#pos_x').val());
    var x2 = parseInt($('#pos_x2').val());
    var y1 = parseInt($('#pos_y').val());
    var y2 = parseInt($('#pos_y2').val());
    
    if (x1 && x2 && y1 && y2) {
        $('#marker').animate({
            top: y1+'px',
            left: x1+'px',
            width: (x2-x1)+'px',
            height: (y2-y1)+'px'
        }, 250);
    }
}

function setEditmode() {
	$.getJSON("ajax.php", { admin: 1 }, function(json){
		if (json.admin == '1') {
			alert('Admin logged in. Switch on editing');
			editmode = true;
		}
	});
}

function getData(x, y) {
    $.getJSON("ajax.php", { x: x, y: y }, function(json){
        debug(json);
        if (json.error) {
        	alert(json.error);
        	return;
        }
        
        if (json.name) {
        	var now = (new Date()).getTime();
        	var layer = $('#infolayer').clone().attr('id', now);
        	$('#infolayer').after(layer);
            
            $('#'+now).aqLayer({clone:true,closeBtn:true,attach:'nw',offsetY:y,offsetX:x});
            $('#'+now).aqLayer('show');
            
            var image = 'snap.php?x='+json.x+'&y='+json.y+'&x2='+json.x2+'&y2='+json.y2;
            
            $('#'+now).aqLayer('Name: <b>'+json.name+'</b> ('+json.position_x+', '+json.position_y+')<br/>'+json.type+'<br/><img src="'+image+'"/>');
        } else if(editmode) {
            var edit_layer_closed = ($('#editlayer div').css('display') == 'none');
            if (edit_layer_closed || first_click) {
                $('#marker').hide('slow');				
                $('#editlayer').aqLayer({clone:true,closeBtn:true,attach:'nw',offsetY:y+50,offsetX:x+50});
                $('#editlayer').aqLayer('show');
                $('#pos_y').val(y);
                $('#pos_x').val(x);
                first_click = false;
                //setMarker();
            } else {
                if ($('#pos_y2').val() == '') { // first clicked
                    $('#pos_y2').val(y);
                    $('#pos_x2').val(x);
                } else {
                    markerPlacement(x, y);
                }
                //first_click = true;
                setMarker(x, y);
            }
        }
    });
}

function saveData() {
    var data = {
    	save: 1,
    	x: $('#pos_x').val(), y: $('#pos_y').val(),
    	x2: $('#pos_x2').val(), y2: $('#pos_y2').val(),
    	name: $('#name').val(), type: $('#type').val()
    };

    $.getJSON("ajax.php", data, function(json){
        debug(json);
        if (json.ok) {
            resetInput();
            alert("Erfolgreich gespeichert");
            $('#editlayer').aqLayer('hide');
        } else if (json.error)
            alert(json.error);
        else
            alert("Fehler bei der �bertragung\nServer antwortet nicht.");
    });
}

function debug(value) {
    if (debugmode && console)
        console.log(value);
}