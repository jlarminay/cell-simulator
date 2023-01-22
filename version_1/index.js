console.log('countAll()');

var stop = false;
	
var clans = [{
				name: 'Read Dead Redemption',
				color: 'red',
				health: 5,
				attack: 100,
				defence: 0,
				lifeloss: 0,
				speed: 1
			},
			{
				name: 'Ocean Warriors',
				color: 'blue',
				health: 5,
				attack: 100,
				defence: 0,
				lifeloss: 0,
				speed: 1
			},
			{
				name: 'Plant Army',
				color: 'green',
				health: 5,
				attack: 100,
				defence: 0,
				lifeloss: 0,
				speed: 1
			},
			{
				name: 'The Dutch',
				color: 'orange',
				health: 5,
				attack: 100,
				defence: 0,
				lifeloss: 0,
				speed: 1
			},
			{
				name: 'Purple Rain',
				color: 'purple',
				health: 5,
				attack: 100,
				defence: 0,
				lifeloss: 0,
				speed: 1
			},
			{
				name: 'Death Walkers',
				color: 'black',
				health: 10,
				attack: 100,
				defence: 0,
				lifeloss: 0,
				speed: 1
			}];
var clanCount = 0;

var self_takeOver = false;

var mutation_dif = 10;

var width = 50;
var height = 50;

var time_s = new Date().getTime();
var time_n;
var ms;

var updateSpeed = 1;

var mostClan = "";
var mostVal = 0;

function countAll(){
	
	var string = "";
	var arr = [];
		
	$.each(clans, function(index, val){
		var count = 0;
		
		$('[clan="' + val.name + '"]').each(function(){
			count++;
		});
		
		arr.push({name: val.name, color: val.color, count: count});
		
	});
	
	arr.sort(function(a,b) {return (a.count > b.count) ? -1 : ((b.count > a.count) ? 1 : 0);} ); 

	
	string += "<table border style='margin:auto;'>";
	
	$.each(arr, function(index, val){
		string += "<tr>";
		string += "<td style='background-color:"+colourNameToHex(val.color)+"'></td>";
		string += "<td style='text-shadow:0 0 10px white,0 0 5px white;'>"+val.name+"</td>";
		string += "<td>"+val.count+"</td>";
		string += "<td>"+((val.count/((width*height)+1))*100).toFixed(2)+"%</td>";
		string += "<td style='background-color:"+colourNameToHex(val.color)+"'></td>";
		string += "</tr>";
	});
	
	string += "</table>";
	
	$("#show_count").html(string);
	
	var orClan = $("#favicon").attr("clan");
	if(orClan != mostClan){
		$("#favicon").attr("clan", mostClan);
		$("#favicon").attr("href", "imager?col="+colourNameToHex(mostClan));
	}
	
	mostClan = "";
	mostVal = 0;
	
	time_n = new Date().getTime();
	ms = time_n - time_s;
	var d, h, m, s;
	s = Math.floor(ms / 1000);
	m = Math.floor(s / 60);
	s = s % 60;
	h = Math.floor(m / 60);
	m = m % 60;
	d = Math.floor(h / 24);
	h = h % 24;
	nh = String("00" + h).slice(-2);
	nm = String("00" + m).slice(-2);
	ns = String("00" + s).slice(-2);
	nt = String("000" + ms).slice(-3);
	$(".time").html(nh+":"+nm+":"+ns+"."+nt);
	
}

function pickPos(){
	
	var x = Math.floor((Math.random() * width));
	var y = Math.floor((Math.random() * height));
	var pos = x + "-" + y;
	
	return pos;
}

function checkMove(x, y, clan){
	var f = Math.floor;
	var move = false;
	var Tx = 0;
	var Ty = 0;
	var cur = 0;
	
	//top left
	Tx = f(x) - 1;
	Ty = f(y) - 1;
	if($("#" + Tx +"-"+ Ty).attr("clan") != clan){ move = true;}
	
	//top
	Tx = f(x) - 1;
	Ty = f(y);
	if($("#" + Tx +"-"+ Ty).attr("clan") != clan){ move = true;}

	//top right
	Tx = f(x) - 1;
	Ty = f(y) + 1;
	if($("#" + Tx +"-"+ Ty).attr("clan") != clan){ move = true;}
	
	//left
	Tx = f(x); 
	Ty = f(y) - 1;
	if($("#" + Tx +"-"+ Ty).attr("clan") != clan){ move = true;}

	//right
	Tx = f(x); 
	Ty = f(y) + 1;
	if($("#" + Tx +"-"+ Ty).attr("clan") != clan){ move = true;}

	//bottom left
	Tx = f(x) + 1; 
	Ty = f(y) - 1;
	if($("#" + Tx +"-"+ Ty).attr("clan") != clan){ move = true;}

	//bottom
	Tx = f(x) + 1; 
	Ty = f(y);
	if($("#" + Tx +"-"+ Ty).attr("clan") != clan){ move = true;}

	//bottom right
	Tx = f(x) + 1; 
	Ty = f(y) + 1;
	if($("#" + Tx +"-"+ Ty).attr("clan") != clan){ move = true;}
	
	return move;
}

function takeOver(newPos, clan, org_col){
	
	console.log(mutation_dif);
	
	if(mutation_dif != 0){
		
		var col = colourNameToHex(clan.color);
		var r = parseInt(col.slice(0,2), 16);
		var g = parseInt(col.slice(2,4), 16);
		var b = parseInt(col.slice(4,6), 16);
			
		r = r + ((1+mutation_dif) - Math.floor(Math.random() * (3+mutation_dif)));
		g = g + ((1+mutation_dif) - Math.floor(Math.random() * (3+mutation_dif)));
		b = b + ((1+mutation_dif) - Math.floor(Math.random() * (3+mutation_dif)));
		
		if(r < 0){r = 0;}
		if(g < 0){g = 0;}
		if(b < 0){b = 0;}
		if(r > 255){r = 255;}
		if(g > 255){g = 255;}
		if(b > 255){b = 255;}
		
		r = ("00" + r.toString(16)).slice(-2);
		g = ("00" + g.toString(16)).slice(-2);
		b = ("00" + b.toString(16)).slice(-2);
		hex = r + g + b;
		
		$("#" + newPos).css("background-color", hex);
		$("#" + newPos).attr("clan", clan.name);
		$("#" + newPos).attr("health", clan.health);
		$("#" + newPos).attr("attack", clan.attack);
		$("#" + newPos).attr("defence", clan.defence);
		$("#" + newPos).attr("lifeloss", clan.lifeloss);
		$("#" + newPos).attr("speed", clan.speed);
	}
	else {
		$("#" + newPos).css("background-color", clan.color);
		$("#" + newPos).attr("clan", clan.name);
		$("#" + newPos).attr("health", clan.health);
		$("#" + newPos).attr("attack", clan.attack);
		$("#" + newPos).attr("defence", clan.defence);
		$("#" + newPos).attr("lifeloss", clan.lifeloss);
		$("#" + newPos).attr("speed", clan.speed);
	}
	
}

function moveClan(count){

	clan = clans[count];
	
	var tmpVal = 0;
	
	//find each member of clan
	$('[clan="' + clan.name + '"]').each(function(){
		
		tmpVal++;		
		
		var curPos = $(this).attr("id");
		var pos = curPos.split("-");
		var x = pos[0];
		var y = pos[1];
		
		//check if possible move
		//var move = checkMove(x, y, clan);
		var move = true;
		if(move == true){
			
			//check current health.
			var cur_heal = $("#" + x + "-" + y).attr("health");
			cur_heal = cur_heal - $("#" + x + "-" + y).attr("lifeloss");
			if(cur_heal <= 0 ){
				//dead
				$("#" + x + "-" + y).css("background-color", "white");
				$("#" + x + "-" + y).attr("clan", "");
			}
			else{
				//still alive
				$("#" + x + "-" + y).attr("health", cur_heal);
				
				var sped = $("#" + x + "-" + y).attr("speed");
				
				//generate movement
				var new_sped = 2 + parseInt(sped);
				var xDif = sped - (Math.floor((Math.random() * (new_sped))));
				var yDif = sped - (Math.floor((Math.random() * (new_sped))));
				
				nx = x - xDif;
				ny = y - yDif;
				
				if(nx >= height){ nx = height-1; }
				if(ny >= width){ ny = width-1; }
				if(nx <= 0){ nx = 0; }
				if(ny <= 0){ ny = 0; }
				
				var newPos = nx + "-" + ny;	
				if($("#" + newPos).attr("clan") == ""){
					//not owned
					takeOver(newPos, clan, $("#" + x + "-" + y).css("background-color"));
				}
				else if($("#" + newPos).attr("clan") == $("#" + x + "-" + y).attr("clan")){
					//owned by clan
					
					if(self_takeOver){
						takeOver(newPos, clan, $("#" + x + "-" + y).css("background-color"));
					}
					
				}
				else {
					//ok to attack
					var ene_heal = $("#" + newPos).attr("health");
					my_atck = $("#" + x + "-" + y).attr("attack")
					ene_def = $("#" + newPos).attr("defence")
					ene_heal = ene_heal - (my_atck * ((100-ene_def)/100));
					if(ene_heal <= 0){
						//enemy dies
						takeOver(newPos, clan, $("#" + x + "-" + y).css("background-color"));
					}
					else{
						//enemy survives
						$("#" + newPos).attr("health", ene_heal);
					}
				}
				
			}			
		}
		
				
	});
	
	if(tmpVal > mostVal){
		mostVal = tmpVal;
		mostClan = clan.color;
	}
	
}

function colourNameToHex(colour){
    var colours = {"aliceblue":"#f0f8ff","antiquewhite":"#faebd7","aqua":"#00ffff","aquamarine":"#7fffd4","azure":"#f0ffff",
    "beige":"#f5f5dc","bisque":"#ffe4c4","black":"#000000","blanchedalmond":"#ffebcd","blue":"#0000ff","blueviolet":"#8a2be2","brown":"#a52a2a","burlywood":"#deb887",
    "cadetblue":"#5f9ea0","chartreuse":"#7fff00","chocolate":"#d2691e","coral":"#ff7f50","cornflowerblue":"#6495ed","cornsilk":"#fff8dc","crimson":"#dc143c","cyan":"#00ffff",
    "darkblue":"#00008b","darkcyan":"#008b8b","darkgoldenrod":"#b8860b","darkgray":"#a9a9a9","darkgreen":"#006400","darkkhaki":"#bdb76b","darkmagenta":"#8b008b","darkolivegreen":"#556b2f",
    "darkorange":"#ff8c00","darkorchid":"#9932cc","darkred":"#8b0000","darksalmon":"#e9967a","darkseagreen":"#8fbc8f","darkslateblue":"#483d8b","darkslategray":"#2f4f4f","darkturquoise":"#00ced1",
    "darkviolet":"#9400d3","deeppink":"#ff1493","deepskyblue":"#00bfff","dimgray":"#696969","dodgerblue":"#1e90ff",
    "firebrick":"#b22222","floralwhite":"#fffaf0","forestgreen":"#228b22","fuchsia":"#ff00ff",
    "gainsboro":"#dcdcdc","ghostwhite":"#f8f8ff","gold":"#ffd700","goldenrod":"#daa520","gray":"#808080","green":"#008000","greenyellow":"#adff2f",
    "honeydew":"#f0fff0","hotpink":"#ff69b4",
    "indianred ":"#cd5c5c","indigo":"#4b0082","ivory":"#fffff0","khaki":"#f0e68c",
    "lavender":"#e6e6fa","lavenderblush":"#fff0f5","lawngreen":"#7cfc00","lemonchiffon":"#fffacd","lightblue":"#add8e6","lightcoral":"#f08080","lightcyan":"#e0ffff","lightgoldenrodyellow":"#fafad2",
    "lightgrey":"#d3d3d3","lightgreen":"#90ee90","lightpink":"#ffb6c1","lightsalmon":"#ffa07a","lightseagreen":"#20b2aa","lightskyblue":"#87cefa","lightslategray":"#778899","lightsteelblue":"#b0c4de",
    "lightyellow":"#ffffe0","lime":"#00ff00","limegreen":"#32cd32","linen":"#faf0e6",
    "magenta":"#ff00ff","maroon":"#800000","mediumaquamarine":"#66cdaa","mediumblue":"#0000cd","mediumorchid":"#ba55d3","mediumpurple":"#9370d8","mediumseagreen":"#3cb371","mediumslateblue":"#7b68ee",
    "mediumspringgreen":"#00fa9a","mediumturquoise":"#48d1cc","mediumvioletred":"#c71585","midnightblue":"#191970","mintcream":"#f5fffa","mistyrose":"#ffe4e1","moccasin":"#ffe4b5",
    "navajowhite":"#ffdead","navy":"#000080",
    "oldlace":"#fdf5e6","olive":"#808000","olivedrab":"#6b8e23","orange":"#ffa500","orangered":"#ff4500","orchid":"#da70d6",
    "palegoldenrod":"#eee8aa","palegreen":"#98fb98","paleturquoise":"#afeeee","palevioletred":"#d87093","papayawhip":"#ffefd5","peachpuff":"#ffdab9","peru":"#cd853f","pink":"#ffc0cb","plum":"#dda0dd","powderblue":"#b0e0e6","purple":"#800080",
    "rebeccapurple":"#663399","red":"#ff0000","rosybrown":"#bc8f8f","royalblue":"#4169e1",
    "saddlebrown":"#8b4513","salmon":"#fa8072","sandybrown":"#f4a460","seagreen":"#2e8b57","seashell":"#fff5ee","sienna":"#a0522d","silver":"#c0c0c0","skyblue":"#87ceeb","slateblue":"#6a5acd","slategray":"#708090","snow":"#fffafa","springgreen":"#00ff7f","steelblue":"#4682b4",
    "tan":"#d2b48c","teal":"#008080","thistle":"#d8bfd8","tomato":"#ff6347","turquoise":"#40e0d0",
    "violet":"#ee82ee",
    "wheat":"#f5deb3","white":"#ffffff","whitesmoke":"#f5f5f5",
    "yellow":"#ffff00","yellowgreen":"#9acd32"};
	
	colour = String(colour);
	
	var re = /[0-9A-Fa-f]{6}/g;
	if(re.test(colour)) {
		var tmp = colour.toLowerCase();
		return tmp.substring(1, tmp.length);
	}
	if(typeof colours[colour.toLowerCase()] != 'undefined'){
        var tmp = colours[colour.toLowerCase()];
		return tmp.substring(1, tmp.length);
	}

    return colour;
}

function runMachine(){
	if(stop){
		clearInterval(timer);
	}
	else {
		timer = setInterval(function(){
			moveClan(clanCount);
			
			clanCount++;
			if(clanCount >= clans.length){
				clanCount = 0;
				
				countAll();
				
			}
			
		}, updateSpeed);
	}
}

function restart(){
	console.log('Restarting');
	
	$('.box').each(function(){
		$(this).remove();
	});
	
	time_s = new Date().getTime();
	
	clanCount = 0;
	initMap();
	runMachine();
	$("#conPLAY").trigger("click");
	$("#conPLAY").hide();
	$("#conPAUSE").show();
}

function initMap(){
	
	//create field
	var i = 0;
	var x = 0;
	var y = 0;
	while(i < (width * height)){

		$(".container").append("<div clan='' class='box' id='"+x+"-"+y+"' style='width:"+(100/width)+"%;height:"+(100/height)+"%'><span>"+x+"-"+y+"</span></div>");
		
		x++;
		if(x >= width){
			y++;
			x = 0;
		}
		i++;
	}
	
	//place clans
	$.each(clans, function(index, val){
		var pos = pickPos();
		takeOver(pos, val, val.color);
	});
}

function fillData(){
	$(".map_height").val(height);
	$(".map_width").val(width);
	$(".game_speed").val(updateSpeed);
	$(".col_mutation").val(mutation_dif);
	
	var string = "";
	string += "<table id='clan_hold' style='margin:auto;'>";
	
	string += "<tr>";
	string += "<th>Clan</br><sub>(word color or hex)</sub></th>";
	string += "<th>Health</br><sub>(0+ min)</sub></th>";
	string += "<th>Attack</br><sub>(0+ min)</sub></th>";
	string += "<th>Defence</br><sub>(0-100%)</sub></th>";
	string += "<th>Speed</br><sub>(0+ min)</sub></th>";
	string += "<th>LifeLoss</br><sub>(0+ min)</sub></th>";
	string += "</tr>";
	
	$.each(clans, function(index, val){
		
		string += "<tr nam='"+val.name+"'>";
		
		string += "<td><input type='text' nam='"+val.name+"' value='"+val.name+"'></td>";
		string += "<td><input type='number' min='0' nam='"+val.health+"' value='"+val.health+"'></td>";
		string += "<td><input type='number' min='0' nam='"+val.attack+"' value='"+val.attack+"'></td>";
		string += "<td><input type='number' min='1' max='100' nam='"+val.defence+"' value='"+val.defence+"'></td>";
		string += "<td><input type='number' min='0' nam='"+val.speed+"' value='"+val.speed+"'></td>";
		string += "<td><input type='number' min='0' nam='"+val.lifeloss+"' value='"+val.lifeloss+"'></td>";
		
		string += "</tr>";
		
	});
	
	string += "</table>";
	
	$("#clan_holder").html(string);

}

$(function() {

	initMap();
	runMachine();
	
	//fill setting info
	fillData();

	//pause / play
	$(".con_play").click(function(){
		$(".con_play").toggle();
		stop = !stop;
		runMachine();
	});
	//restart
	$(".con_rest").click(function(){
		stop = true;
		restart();
	});
	//settings
	$(".con_sett").click(function(){
		$("#Modal_sett").css("display", "block");
	});
	//list
	$(".con_list").click(function(){
		$("#Modal_list").css("display", "block");
	});
	//close modal
	$(".closeModal").click(function(){
		$("#Modal_sett").css("display", "none");
		$("#Modal_list").css("display", "none");
	});
	//save settings
	$(".saving").click(function(){
		//change settings
		stop = true;
		width = $(".map_width").val();
		height = $(".map_height").val();
		//mutation_dif = $(".col_mutation").val();
		//update clans
		
		
		updateSpeed = $(".game_speed").val();
	
		//restart
		$("#Modal_sett").css("display", "none");
		restart();
	});
	$(".debug_on").click(function(){
		//$(".box span").css("display", "block");
		$(".box").css("-webkit-box-sizing", "border-box");
		$(".box").css("-moz-box-sizing", "border-box");
		$(".box").css("box-sizing", "border-box");
		$(".box").css("border", "1px solid black");
		$(".debug_on").hide();
		$(".debug_off").show();
	});
	$(".debug_off").click(function(){
		//$(".box span").css("display", "none");
		$(".box").css("border", "0px");
		$(".debug_off").hide();
		$(".debug_on").show();
	});
	
});