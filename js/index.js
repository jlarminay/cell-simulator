var stop = false;

// debug variables
var debug = {
    grid: false,
    arrows: false,
    points: false,
    selfTakeOver: false,
    fillBoard: false,
    cellSquare: true,
    randomSpawn: true,
    voice: false,
    victoryType: "control"
};
    
/* ---------- ---------- ---------- ---------- */
/*
/* Clans Explained
/* 
/* health - how much health they have before they disapear
/* attack - how much damage they do each attack. 
/* defence - how much each attack is minified. Percentage 1-100
/* evasion - change to dodge an attack. Percentage 1-100
/* lifeloss - how much health is taken each turn.
/*
/* ---------- ---------- ---------- ---------- */

default_clan = {
    health: 1,
    attack: 1,
    defence: 0,
    evasion: 1,
    lifeloss: 0,
    speed: 1
};

var clans = [
    {
        "name": "Red Bois",
        "color": "red",
        "health": default_clan.health,
        "attack": default_clan.attack,
        "defence": default_clan.defence,
        "evasion": default_clan.evasion,
        "lifeloss": default_clan.lifeloss,
        "speed": default_clan.speed,
        "time": null
    },
    {
        "name": "Hydro Homies",
        "color": "blue",
        "health": default_clan.health,
        "attack": default_clan.attack,
        "defence": default_clan.defence,
        "evasion": default_clan.evasion,
        "lifeloss": default_clan.lifeloss,
        "speed": default_clan.speed,
        "time": null
    },
    {
        "name": "Plant Army",
        "color": "green",
        "health": default_clan.health,
        "attack": default_clan.attack,
        "defence": default_clan.defence,
        "evasion": default_clan.evasion,
        "lifeloss": default_clan.lifeloss,
        "speed": default_clan.speed,
        "time": null
    },
    {
        "name": "The Dutch",
        "color": "orange",
        "health": default_clan.health,
        "attack": default_clan.attack,
        "defence": default_clan.defence,
        "evasion": default_clan.evasion,
        "lifeloss": default_clan.lifeloss,
        "speed": default_clan.speed,
        "time": null
    }
];
var clanCount = 0;

var countdown = false;

var mutation_dif = 0;

var voiceCommands = {
    "defeated": [
        " have been defeated.",
        " have been eliminated.",
        " are no longer in the game.",
        " have been destroyed."
    ]
};

var size = 50;
var width;
var height;

var maxCells = 0;

var time_s;
var time_n;
var ms;
var time_end = null;
var time_last = null;
var turn_cur = 0;
var turn_end = 0;

var updateSpeed = 1;

var mostClan = "";
var mostVal = 0;

var limit_time = 0;
var limit_turn = 0;

var map = null;
var map_data;



function GET(name){
    if(results = new RegExp('[\?&]' + name + '=([^&#]*)').exec(window.location.href)){
        return results[1];
    }
    else{
        return false;
    }
}

function randomBetween(min, max){
    return Math.floor(Math.random() * (+max - +min)) + +min; 
}

function getTime(math = null){
    if(math==null){
        time_n = new Date().getTime();
    }
    else{
        time_n = math;
    }
    ms = time_n - time_s;
    return ms;
}

function convertTime(ms){
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
    end_time = nh+":"+nm+":"+ns+"."+nt;
    return end_time;
}

function countAll(){
	
	var string = "";
    var arr = [];
    var alive = 0;
		
	$.each(clans, function(index, val){
		var count = 0;
		
		$('[clan="' + val.name + '"]').each(function(){
			count++;
        });

        if(count==0 && clans[index].time==null){
            //console.log('dead');
            //console.log( getTime() );
            if( isNaN(getTime()) ){
                clans[index].time = 0;
            }
            else{
                tmp = parseInt( getTime() );
                clans[index].time = tmp;
                time_last = tmp;
                readVoice(val.name+" have been defeated!");
            }
        }
        
        if(count >= (maxCells)){
            decideWinner(val);
        }

        if(count>0){
            alive++;
        }
		
		arr.push({name: val.name, color: val.color, count: count, time: clans[index].time});
		
	});
	
	arr.sort(function(a,b) {return (a.time > b.time) ? -1 : ((b.time > a.time) ? 1 : 0);} ); 
	arr.sort(function(a,b) {return (a.count > b.count) ? -1 : ((b.count > a.count) ? 1 : 0);} ); 
    
    string += "<table border style='margin:auto;width:100%;'>";
    
    /*
    if(voiceCommands.first == null){
        voiceCommands.first = arr[0].name;
    }
    else{
        if(voiceCommands.first != arr[0].name){
            voiceCommands.first = arr[0].name;
            readVoice(voiceCommands.first+" have taken first position!");
        }
    }
    */

    if(debug.victoryType=="last" && alive==1){
        decideWinner(arr[0]);
    }
	
	$.each(arr, function(index, val){
        //console.log(val);
        if(val.time==null){
            val.time = "Running";
        }
        else{
            val.time = convertTime(val.time);
        }
		string += "<tr>";
        string += "<td style='background-color:"+colourNameToHex(val.color)+"'></td>";
        string += "<td>"+(index+1)+"</td>";
		string += "<td style='text-shadow:0 0 10px white,0 0 5px white;'>"+val.name+"</td>";
		string += "<td>"+val.count+"</td>";
		string += "<td>"+val.time+"</td>";
		string += "<td>"+((val.count/(maxCells))*100).toFixed(2)+"%</td>";
		string += "<td style='background-color:"+colourNameToHex(val.color)+"'></td>";
		string += "</tr>";
	});
	
	string += "</table>";
	
    $(".show_count").html(string);
	
	var orClan = $("#favicon").attr("clan");
	if(orClan != mostClan){
		$("#favicon").attr("clan", mostClan);
		$("#favicon").attr("href", "imager.php?col="+colourNameToHex(mostClan));
	}
	
	mostClan = "";
	mostVal = 0;

    tmp_time = convertTime(getTime());
    tmp_time += (limit_time!=0)?"/"+convertTime( parseInt(limit_time+"000")):"";

    tmp_turn = turn_cur;
    tmp_turn += (limit_turn!=0)?" / "+limit_turn:"";

    $(".time").html( "<b>"+tmp_time+"</b>" );
	$(".turn").html( "<b>"+tmp_turn+"</b>" );
	
}

function decideWinner(val){
    stop = true;
    stopMachine();

    //final count
    top_count = 0;
    top_team = null;
    $.each(clans, function(index, val){
		var count = 0;
		$('[clan="' + val.name + '"]').each(function(){
			count++;
        });
        if(count > top_count){
            top_count = count;
            top_team = val;
        }
    });

    time_end = getTime(new Date().getTime());
    
    $(".score-holder").hide();
    $("#Modal_team").modal('hide');
    $("#Modal_sett").modal('hide');

    tmp_turn = turn_cur;
    tmp_turn += (limit_turn!=0)?"/"+limit_turn:"";

    tmp_time = convertTime(time_end);
    tmp_time += (limit_time!=0)?"/"+convertTime( parseInt(limit_time+"000")):"";

    readVoice(top_team.name+" are the winners!");

    $("#Modal_won #trophy").css("color", top_team.color);
    $("#Modal_won #team").text(top_team.name);
    $("#Modal_won #time").html( "<b>"+tmp_time+"</b>" );
    $("#Modal_won #turn").html( "<b>"+tmp_turn+"</b>" );
    $("#Modal_won").modal({
        backdrop: 'static',
        keyboard: false
    });
}

function pickPos(){
    
    var tmp = false;
    var trys = 0;

    while(!tmp){
        var x = Math.floor((Math.random() * width));
        var y = Math.floor((Math.random() * height));
        var pos = x + "-" + y;

        if( $("#"+pos).attr("state")==undefined){
            if( $("#"+pos).attr("clan")==undefined ){
                tmp = true;
            }
            else{
                trys++;
            }
        }

        if(trys >= 10){
            tmp = true;
        }
    }
	
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
	
	if(mutation_dif != 0){

        mut_half = mutation_dif/2;

		var col = colourNameToHex(clan.color);
		var r = parseInt(col.slice(0,2), 16);
		var g = parseInt(col.slice(2,4), 16);
		var b = parseInt(col.slice(4,6), 16);
			
		r = r + Math.floor(Math.random() * (mut_half - (-mut_half)) + (-mut_half));
        g = g + Math.floor(Math.random() * (mut_half - (-mut_half)) + (-mut_half));
        b = b + Math.floor(Math.random() * (mut_half - (-mut_half)) + (-mut_half));
		
		if(r <= 10){r = 10;}
		if(g <= 10){g = 10;}
		if(b <= 10){b = 10;}
		if(r >= 245){r = 245;}
		if(g >= 245){g = 245;}
		if(b >= 245){b = 245;}
        
        /*
		r = ("00" + r.toString(16)).slice(-2);
		g = ("00" + g.toString(16)).slice(-2);
		b = ("00" + b.toString(16)).slice(-2);
        hex = r + g + b;
        */

        //console.log(newPos+" -> rgb("+r+","+g+","+b+")");
        
        tar = $("#" + newPos);
		
		tar.css("background-color", "rgb("+r+","+g+","+b+")");
		tar.attr("clan", clan.name);
		tar.attr("health", clan.health);
		tar.attr("attack", clan.attack);
		tar.attr("evasion", clan.evasion);
		tar.attr("defence", clan.defence);
		tar.attr("lifeloss", clan.lifeloss);
		tar.attr("speed", clan.speed);
	}
	else {
        tar = $("#" + newPos);

		tar.css("background-color", clan.color);
		tar.attr("clan", clan.name);
		tar.attr("health", clan.health);
		tar.attr("attack", clan.attack);
		tar.attr("evasion", clan.evasion);
		tar.attr("defence", clan.defence);
		tar.attr("lifeloss", clan.lifeloss);
		tar.attr("speed", clan.speed);
	}
	
}

function moveDirection(org_x, org_y, new_x, new_y){
    dir = "";

    if(new_y > org_y){
        dir += "bottom ";
    }
    if(new_y < org_y){
        dir += "top ";
    }
    if(new_x > org_x){
        dir += "right ";
    }
    if(new_x < org_x){
        dir += "left ";
    }
    dir = dir.trim();
    dir = dir.replace(" ", "-");

    if(dir==""){
        dir = "none";
    }

    return dir;
}

function moveClan(count){

	clan = clans[count];
	
	var tmpVal = 0;
	
    //find each member of clan
    if(clan[time]==undefined){
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

                me = $("#" + x + "-" + y);
                me.attr("class", "box");
                
                //check current health.
                var cur_heal = me.attr("health");
                cur_heal = cur_heal - me.attr("lifeloss");
                if(cur_heal <= 0 ){
                    //dead
                    me.css("background-color", "white");
                    me.attr("clan", "");
                }
                else{
                    //still alive
                    me.attr("health", cur_heal);
                    
                    var sped = me.attr("speed");
                    
                    //generate movement
                    var new_sped = 2 + parseInt(sped);
                    var xDif = sped - (Math.floor((Math.random() * (new_sped))));
                    var yDif = sped - (Math.floor((Math.random() * (new_sped))));
                    
                    nx = x - xDif;
                    ny = y - yDif;
                    
                    if(ny >= height){ ny = height-1; }
                    if(nx >= width){ nx = width-1; }
                    if(nx <= 0){ nx = 0; }
                    if(ny <= 0){ ny = 0; }
                    
                    var newPos = nx + "-" + ny;	

                    //figure out which direction
                    if(debug.arrows){
                        arrow = moveDirection(x,y,nx,ny);
                        me.addClass(arrow);
                    }

                    tar = $("#" + newPos);

                    if(tar.attr("state") != undefined){
                        //untouchable object
                        state = tar.attr("state");
                        if( state == "wall-down" && moveDirection(x,y,nx,ny).indexOf("bottom") >= 0 ){
                            takeOver(newPos, clan, me.css("background-color"));                         
                        }
                        else if( state == "wall-up" && moveDirection(x,y,nx,ny).indexOf("top") >= 0 ){
                            takeOver(newPos, clan, me.css("background-color"));                         
                        }
                        else if( state == "wall-right" && moveDirection(x,y,nx,ny).indexOf("right") >= 0 ){
                            takeOver(newPos, clan, me.css("background-color"));                         
                        }
                        else if( state == "wall-left" && moveDirection(x,y,nx,ny).indexOf("left") >= 0 ){
                            takeOver(newPos, clan, me.css("background-color"));                         
                        }
                    }
                    else if(tar.attr("clan") == ""){
                        //not owned
                        takeOver(newPos, clan, me.css("background-color"));
                    }
                    else if(tar.attr("clan") == me.attr("clan")){
                        //owned by clan
                        
                        if(debug.selfTakeOver){
                            takeOver(newPos, clan, me.css("background-color"));
                        }
                        
                    }
                    else {
                        //ok to attack
                        var ene_heal = tar.attr("health");
                        var ene_def = tar.attr("defence");
                        var my_atck = me.attr("attack");

                        tmp_atck = randomBetween(1,my_atck);
                        tmp_def = randomBetween(1,ene_def);
                        tmp_heal = ene_heal - Math.max(0, tmp_atck - tmp_def );
                        tmp_heal = ene_heal - tmp_atck;

                        //Battle stats
                        /*
                        console.log("");
                        console.log("---------- ---------- ----------");
                        console.log(" Battle ");
                        console.log(x+"-"+y+"  ->  "+newPos);
                        console.log("my_atck: "+my_atck+"  ->  "+tmp_atck);
                        console.log("ene_def: "+ene_def+"  ->  "+tmp_def);
                        console.log("ene_heal: "+ene_heal+"  ->  "+tmp_heal);
                        */


                        if(tmp_heal <= 0){
                            //enemy dies
                            takeOver(newPos, clan, me.css("background-color"));
                        }
                        else{
                            //enemy survives
                            tar.attr("health", tmp_heal);
                        }
                    }
                    
                }			
            }
            
                    
        });
    }
	
	if(tmpVal > mostVal){
		mostVal = tmpVal;
		mostClan = clan.color;
	}
	
}

function randomHexColor(){
    return ('000000' + Math.floor(Math.random()*16777215).toString(16)).slice(-6);
}

function colourNameToHex(colour){
    var colours = {
        "aliceblue":"f0f8ff","antiquewhite":"faebd7","aqua":"00ffff","aquamarine":"7fffd4","azure":"f0ffff",
        "beige":"f5f5dc","bisque":"ffe4c4","black":"000000","blanchedalmond":"ffebcd","blue":"0000ff","blueviolet":"8a2be2","brown":"a52a2a","burlywood":"deb887",
        "cadetblue":"5f9ea0","chartreuse":"7fff00","chocolate":"d2691e","coral":"ff7f50","cornflowerblue":"6495ed","cornsilk":"fff8dc","crimson":"dc143c","cyan":"00ffff",
        "darkblue":"00008b","darkcyan":"008b8b","darkgoldenrod":"b8860b","darkgray":"a9a9a9","darkgreen":"006400","darkkhaki":"bdb76b","darkmagenta":"8b008b","darkolivegreen":"556b2f",
        "darkorange":"ff8c00","darkorchid":"9932cc","darkred":"8b0000","darksalmon":"e9967a","darkseagreen":"8fbc8f","darkslateblue":"483d8b","darkslategray":"2f4f4f","darkturquoise":"00ced1",
        "darkviolet":"9400d3","deeppink":"ff1493","deepskyblue":"00bfff","dimgray":"696969","dodgerblue":"1e90ff",
        "firebrick":"b22222","floralwhite":"fffaf0","forestgreen":"228b22","fuchsia":"ff00ff",
        "gainsboro":"dcdcdc","ghostwhite":"f8f8ff","gold":"ffd700","goldenrod":"daa520","gray":"808080","grey":"808080","green":"008000","greenyellow":"adff2f",
        "honeydew":"f0fff0","hotpink":"ff69b4",
        "indianred ":"cd5c5c","indigo":"4b0082","ivory":"fffff0","khaki":"f0e68c",
        "lavender":"e6e6fa","lavenderblush":"fff0f5","lawngreen":"7cfc00","lemonchiffon":"fffacd","lightblue":"add8e6","lightcoral":"f08080","lightcyan":"e0ffff","lightgoldenrodyellow":"fafad2",
        "lightgrey":"d3d3d3","lightgreen":"90ee90","lightpink":"ffb6c1","lightsalmon":"ffa07a","lightseagreen":"20b2aa","lightskyblue":"87cefa","lightslategray":"778899","lightsteelblue":"b0c4de",
        "lightyellow":"ffffe0","lime":"00ff00","limegreen":"32cd32","linen":"faf0e6",
        "magenta":"ff00ff","maroon":"800000","mediumaquamarine":"66cdaa","mediumblue":"0000cd","mediumorchid":"ba55d3","mediumpurple":"9370d8","mediumseagreen":"3cb371","mediumslateblue":"7b68ee",
        "mediumspringgreen":"00fa9a","mediumturquoise":"48d1cc","mediumvioletred":"c71585","midnightblue":"191970","mintcream":"f5fffa","mistyrose":"ffe4e1","moccasin":"ffe4b5",
        "navajowhite":"ffdead","navy":"000080",
        "oldlace":"fdf5e6","olive":"808000","olivedrab":"6b8e23","orange":"ffa500","orangered":"ff4500","orchid":"da70d6",
        "palegoldenrod":"eee8aa","palegreen":"98fb98","paleturquoise":"afeeee","palevioletred":"d87093","papayawhip":"ffefd5","peachpuff":"ffdab9","peru":"cd853f","pink":"ffc0cb","plum":"dda0dd","powderblue":"b0e0e6","purple":"800080",
        "rebeccapurple":"663399","red":"ff0000","rosybrown":"bc8f8f","royalblue":"4169e1",
        "saddlebrown":"8b4513","salmon":"fa8072","sandybrown":"f4a460","seagreen":"2e8b57","seashell":"fff5ee","sienna":"a0522d","silver":"c0c0c0","skyblue":"87ceeb","slateblue":"6a5acd","slategray":"708090","snow":"fffafa","springgreen":"00ff7f","steelblue":"4682b4",
        "tan":"d2b48c","teal":"008080","thistle":"d8bfd8","tomato":"ff6347","turquoise":"40e0d0",
        "violet":"ee82ee",
        "wheat":"f5deb3","white":"ffffff","whitesmoke":"f5f5f5",
        "yellow":"ffff00","yellowgreen":"9acd32"
    };
	
	colour = String(colour);
	
	var re = /[0-9A-Fa-f]{6}/g;
	if(re.test(colour)) {
		var tmp = colour.toLowerCase();
		return tmp;
	}
	if(typeof colours[colour.toLowerCase()] != 'undefined'){
        var tmp = colours[colour.toLowerCase()];
		return tmp;
	}

    return colour;
}

function countDown(){
    if(!countdown){
        countdown = true;
        tim = 1.5;
        //3
        setTimeout(function(){
            readVoice("3",tim);
            $("#text-holder").html("3");
        },1000);
        //2
        setTimeout(function(){
            readVoice("2",tim);
            $("#text-holder").html("2");
        },2000);
        //1
        setTimeout(function(){
            readVoice("1",tim);
            $("#text-holder").html("1");
        },3000);
        //GO
        setTimeout(function(){
            readVoice("Start",tim);
            $("#text-holder").html("START");
        },4000);
    }
}

function stopMachine(){
    clearInterval(timer);
    clearInterval(updater);
}

function runMachine(){
	if(stop){
		stopMachine();
	}
	else {
        countDown();
        setTimeout(function(){
            time_s = new Date().getTime();
            $(".center").hide();
            timer = setInterval(function(){
                moveClan(clanCount);
                
                if(debug.victoryType=="time" && parseInt(limit_time+"000")<=getTime()){
                    time_end = parseInt(limit_time+"000");
                    decideWinner(clans[clanCount]);
                }
                if(debug.victoryType=="turn" && limit_turn<=turn_cur){
                    decideWinner(clans[clanCount]);
                }

                
                clanCount++;
                if(clanCount >= clans.length){
                    clanCount = 0;	
                    turn_cur++;			
                }
                
            }, updateSpeed);
            
            updater = setInterval(function(){
                countAll();
            }, 1);
        }, 4500);
	}
}

function readMap(){
    if(map != null){

        $(".con_team").hide();
        $(".con_sett").hide();

        map = decodeURI(map);
        map = JSON.parse(map);

        clans = map.clans;
        size = map.size;
        updateSpeed = map.speed;
        map_data = map.map;
        limit_time = map.limit_time;
        limit_turn = map.limit_turn;
        debug.cellSquare = map.cellSquare;
        debug.randomSpawn = map.randomSpawn;
        debug.victoryType = map.victoryType;

        //console.log(map_data);

        initMap();
    }
    else{
        initMap();
    }
}

function makeMap(){
    if(map != null){
        i = 0;
        $.each(map_data, function(row_i, row){
            $.each(row, function(cell_i, cell){
                pp = cell_i+"-"+row_i;
                if(cell=="w"){
                    $("#"+pp).css("background-color", "black").attr("state", "wall");
                    maxCells--;
                }
                else if(cell=="^"){
                    $("#"+pp).attr("state", "wall-up");
                }
                else if(cell==">"){
                    $("#"+pp).attr("state", "wall-right");
                }
                else if(cell=="v"){
                    $("#"+pp).attr("state", "wall-down");
                }
                else if(cell=="<"){
                    $("#"+pp).attr("state", "wall-left");
                }
                else if( Number(cell) || cell=='0' ){
                    i++;
                    //console.log(i+" cell -> "+cell)
                    takeOver(pp, clans[cell], clans[cell].color);
                }
            });
        });
        //console.log(i);
        if(i==0){
            debug.randomSpawn = true;
        }
    }
}

function initMap(){

    //define size of map
    if(debug.cellSquare){
        width = Math.floor( $(window).width() / size );
        height = Math.floor( $(window).height() / size );
    }
    else{
        if( size.indexOf("x") >= 0 ){
            size = size.split("x");
        }
        else{
            size = [size, size];
        }
        width = parseInt(size[0]);
        height = parseInt(size[1]);
    }

    maxCells = width * height;
    
    //create field
    var i = 0;
    var x = 0;
    var y = 0;

    if(debug.fillBoard){
        init = setInterval(function(){

            if(i < (maxCells)){

                arrow = "<img src='media/arrow.png'>";
                point = "<span>"+x+"-"+y+"</span>";

                $(".main-container").append("<div clan='' class='box none' id='"+x+"-"+y+"' style='background-color:white;width:"+(100/width)+"%;height:"+(100/height)+"%'>"+point+arrow+"</div>");
                
                x++;
                if(x >= width){
                    y++;
                    x = 0;
                }
                i++;
            }
            else{

                makeMap();

                //place clans
                if(debug.randomSpawn){
                    $.each(clans, function(index, val){
                        var pos = pickPos();
                        takeOver(pos, val, val.color);
                    }); 
                }

                countAll();
                clearInterval(init);
                runMachine();

            }
        }, 1);
    }
    else{

        while(i < (width * height)){
            
            arrow = "<img src='media/arrow.png'>";
            point = "<span>"+x+"-"+y+"</span>";

            $(".main-container").append("<div clan='' class='box none' id='"+x+"-"+y+"' style='background-color:white;width:"+(100/width)+"%;height:"+(100/height)+"%'>"+point+arrow+"</div>");
            
            x++;
            if(x >= width){
                y++;
                x = 0;
            }
            i++;
        }

        makeMap();

        //place clans
        if(debug.randomSpawn){
            $.each(clans, function(index, val){
                var pos = pickPos();
                takeOver(pos, val, val.color);
            }); 
        }

        countAll();
        runMachine();
    }

}

function fillData(){
	$(".cell_size").val(size);
	$(".game_speed").val(updateSpeed);
    $(".col_mutation").val(mutation_dif);
    $(".limit_time").val(limit_time);
    $(".limit_turn").val(limit_turn);
        
    string = "<table style='width:100%;'>";
    string += "<tr>";
    string += "<th style='border:0;'></th>";
    string += "<th>Team Name</th>";
    string += "<th>Color <abbr title='This can be a color or hex code (no #). For random color put {random}.'>?</abbr></th>";
    string += "<th>Health <abbr title='Higher the number, the more damage they can take. Min 0.'>?</abbr></th>";
    string += "<th>Attack <abbr title='Higher the number, the more damage they deal. Min 1.'>?</abbr></th>";
    string += "<th>Defence <abbr title='Higher the number, the less damage they take. Min 1 Max 90.'>?</abbr></th>";
    string += "<th>Evasion <abbr title='Higher the number, the higher change to dodge and attack. Min 0 Max 90.'>?</abbr></th>";
    string += "<th>Lifeloss <abbr title='How much damage they take each turn. Can be a decimal. If negative, they gain health each turn.'>?</abbr></th>";
    string += "<th class='h'>Speed</th>";
    string += "</tr>";
    $.each(clans, function(index, val){
        string += "<tr class='team-controls'>";
        string += "<td><div class='btn btn-danger rem-team' title='Remove Team'><i class='fas fa-minus'></i></div></td>";
        string += "<td data-title='name' contenteditable>"+val.name+"</td>";
        string += "<td data-title='color' contenteditable>"+val.color+"</td>";
        string += "<td data-title='health' contenteditable>"+val.health+"</td>";
        string += "<td data-title='attack' contenteditable>"+val.attack+"</td>";
        string += "<td data-title='defence' contenteditable>"+val.defence+"</td>";
        string += "<td data-title='evasion' contenteditable>"+val.evasion+"</td>";
        string += "<td data-title='lifeloss' contenteditable>"+val.lifeloss+"</td>";
        string += "<td class='h' data-title='speed' contenteditable>"+val.speed+"</td>";
        string += "</tr>";
    });
    string += "</table>";

    $(".cell-control").html(string);

}

function updateDebug(){
    //update grid
    if(debug.grid){
        $(".box").css("-webkit-box-sizing", "border-box");
        $(".box").css("-moz-box-sizing", "border-box");
        $(".box").css("box-sizing", "border-box");
        $(".box").css("border", "1px solid white");
    }
    else{
        $(".box").css("border", "0px");
    }

    //update arrows
    if(debug.arrows){
        $(".box img").show();
    }
    else{
        $(".box img").hide();
    }

    //update points
    if(debug.points){
        $(".box span").show();
    }
    else{
        $(".box span").hide();
    }

}

function readVoice(string, rate=1){
    if(debug.voice){
        //console.log("Voice -> "+string);
        // get all voices that browser offers
        var available_voices = window.speechSynthesis.getVoices();

        // this will hold an english voice
        var english_voice = '';
        english_voice =available_voices[0];

        // find voice by language locale "en-US"
        // if not then select the first voice
        if(english_voice === ''){
            for(var i=0; i<available_voices.length; i++) {
                if(available_voices[i].lang === 'en-US') {
                    english_voice = available_voices[i];
                    break;
                }
            }
            if(english_voice === ''){
                english_voice = available_voices[0];
            }
        }

        // new SpeechSynthesisUtterance object
        utter = new SpeechSynthesisUtterance();
        utter.rate = rate;
        utter.pitch = 0.5;
        utter.text = string;
        utter.voice = english_voice;

        // event after text has been spoken
        utter.onend = function() {
            //alert('Speech has finished');
        }

        // speak
        window.speechSynthesis.speak(utter);
        voiceCommands.num = voiceCommands.num + 1;
    }
}

$(function() {

    // ---------- ---------- ----------
    //check what settings exists
    if( GET('map') != false ){
        map = GET('map');
    }
    else{
        if( GET('c') != false )
            size = GET('c');
            //console.log(size);
            if( toString(size).indexOf("x") >= 0 ){
                debug.cellSquare = false;
            }
        if( GET('s') != false )
            updateSpeed = GET('s');
        if( GET('m') != false )
            mutation_dif = GET('m');
        if( GET('ltime') != false )
            limit_time = GET('ltime');
        if( GET('lturn') != false )
            limit_turn = GET('lturn');
        if( GET('t') != false)
            clans = JSON.parse(decodeURI(GET('t')));
            clans = clans.filter(function(item){return /\S/.test(item.name)});
            $.each(clans, function(index, val){
                if(val.color=="{random}"){
                    clans[index].color = randomHexColor();
                }
            });
    }
    // end
    // ---------- ---------- ----------

	readMap();
	
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
		location.reload(); 
	});
	// game settings
	$(".con_sett").click(function(){
		$("#Modal_sett").modal("show");
	});
	// debug Menu
	$(".con_debug").click(function(){
		$("#Modal_debug").modal("show");
	});
	// team settings
	$(".con_team").click(function(){
		$("#Modal_team").modal("show");
	});
	//list
	$(".con_list, .score-holder .close").click(function(){
		$(".score-holder").slideToggle();
    });
    //remove team
    $(document).on("click", ".rem-team", function(){
        $(this).parents(".team-controls").remove();
    });
    //add new team
    $(".add-team").click(function(){
        string = "";
        string += "<tr class='team-controls'>";
        string += "<td><div class='btn btn-danger rem-team' title='Remove Team'><i class='fas fa-minus'></i></div></td>";
        string += "<td data-title='name' contenteditable></td>";
        string += "<td data-title='color' contenteditable></td>";
        string += "<td data-title='health' contenteditable>"+default_clan.health+"</td>";
        string += "<td data-title='attack' contenteditable>"+default_clan.attack+"</td>";
        string += "<td data-title='defence' contenteditable>"+default_clan.defence+"</td>";
        string += "<td data-title='evasion' contenteditable>"+default_clan.evasion+"</td>";
        string += "<td data-title='lifeloss' contenteditable>"+default_clan.lifeloss+"</td>";
        string += "<td class='h' data-title='speed' contenteditable>"+default_clan.speed+"</td>";
        string += "</tr>";
        $('.team-controls:last').after(string);
    });
    //reset everything
    $(".con_reset").click(function(){
        window.location.href = "?";
    });
    //goto map maker
    $(".con_maker").click(function(){
        window.location.href = "maker.html";
    });
	//save settings
	$(".save").click(function(){
        c = $(".cell_size").val();
        s = $(".game_speed").val();
        m = $(".col_mutation").val();
        ltime = $(".limit_time").val();
        lturn = $(".limit_turn").val();
        tmp_clans = [];
        i = 0;
        $(".team-controls").each(function(){
            tmp_clans[i] = {
                name: $(this).find("[data-title=name]").text(),
                color: $(this).find("[data-title=color]").text(),
                health: $(this).find("[data-title=health]").text(),
                attack: $(this).find("[data-title=attack]").text(),
                defence: $(this).find("[data-title=defence]").text(),
                evasion: $(this).find("[data-title=evasion]").text(),
                lifeloss: $(this).find("[data-title=lifeloss]").text(),
                speed: $(this).find("[data-title=speed]").text(),
                time: null
            };
            i++;
        });
        t = encodeURI(JSON.stringify(tmp_clans));
        window.location.href = "?c="+c+"&s="+s+"&m="+m+"&ltime="+ltime+"&lturn="+lturn+"&t="+t;
    });
    
    $(".score-holder").draggable();


    // ------------------------------------
    // Debug Buttons
	$(".debug-grid").click(function(){
        debug.grid = !debug.grid;
        updateDebug();
    });
	$(".debug-arrows").click(function(){
        debug.arrows = !debug.arrows;
        updateDebug();
    });
	$(".debug-points").click(function(){
        debug.points = !debug.points;
        updateDebug();
    });
	$(".debug-voice").click(function(){
        debug.voice = !debug.voice;
        updateDebug();
    });
	$(".test-voice").click(function(){
        debug.voice = true;
        readVoice('This is a voice test');
        debug.voice = false;
    });
    
    

});