items = [
    { 
        "char":".", 
        "col":"white",
        "title":"Empty Space"
    },
    { 
        "char":"w", 
        "col":"black",
        "title":"Wall"
    },
    { 
        "char":"^", 
        "col":"lightgrey",
        "title":"One Way Wall - Up"
    },
    { 
        "char":">", 
        "col":"lightgrey",
        "title":"One Way Wall - Right"
    },
    { 
        "char":"v", 
        "col":"lightgrey",
        "title":"One Way Wall - Down"
    },
    { 
        "char":"<", 
        "col":"lightgrey",
        "title":"One Way Wall - Right"
    }
];


default_clan = {
    health: 1,
    attack: 1,
    defence: 0,
    evasion: 1,
    lifeloss: 0,
    speed: 1
};

json = {
    "clans": [
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
    ],
    "speed": 0,
    "limit_time": 0,
    "limit_turn": 0,
    "randomSpawn": false,
    "cellSquare": false,
    "victoryType": "control"
};

function makeMap(size){

    $(".map-table tr").remove();

    if( size.indexOf("x") >= 0 ){
        t = size.split('x');
        width = t[0];
        height = t[1];
    }
    else{
        width = size;
        height = size;
    }

    json.size = size;

    j = 0;
    while(j<height){
        i = 0;
        row = "<tr>";
        while(i<width){
            row += "<td>.</td>";
            i++;
        }
        row += "</tr>";

        $(".map-table tbody").append(row);

        j++;
    }
}

function makeClans(){
    $.each( json.clans, function(index, val){
        string = "";
        string += "<tr class='clan-controls'>";
        string += "<td><div class='btn btn-danger rem-clan' title='Remove Team'><i class='fas fa-minus'></i></div></td>";
        string += "<td data-title='name' contenteditable>"+val.name+"</td>";
        string += "<td data-title='color' contenteditable>"+val.color+"</td>";
        string += "<td data-title='health' contenteditable>"+val.health+"</td>";
        string += "<td data-title='attack' contenteditable>"+val.attack+"</td>";
        string += "<td data-title='defence' contenteditable>"+val.defence+"</td>";
        string += "<td data-title='evasion' contenteditable>"+val.evasion+"</td>";
        string += "<td data-title='lifeloss' contenteditable>"+val.lifeloss+"</td>";
        string += "<td class='h' data-title='speed' contenteditable>"+val.speed+"</td>";
        string += "</tr>";
        $('.clans-table tr:last').after(string);
    });
}

function addClan(){
    string = "";
    string += "<tr class='clan-controls'>";
    string += "<td><div class='btn btn-danger rem-clan' title='Remove Team'><i class='fas fa-minus'></i></div></td>";
    string += "<td data-title='name' contenteditable>-</td>";
    string += "<td data-title='color' contenteditable>-</td>";
    string += "<td data-title='health' contenteditable>1</td>";
    string += "<td data-title='attack' contenteditable>1</td>";
    string += "<td data-title='defence' contenteditable>1</td>";
    string += "<td data-title='evasion' contenteditable>1</td>";
    string += "<td data-title='lifeloss' contenteditable>0</td>";
    string += "<td class='h' data-title='speed' contenteditable>1</td>";
    string += "</tr>";
    $('.clans-table tr:last').after(string);
}

function updateMapControls(){
    $("#tab-map .paint").remove();
    $.each(items, function(index, val){
        $("#tab-map .controls").append( '<div class="paint" data-char="'+val.char+'" data-col="'+val.col+'" title="Tile: '+val.title+'" style="background-color:'+val.col+'">'+val.char+'</div>' );
    });
    $("#tab-map .controls").append( "<div></div>" );
    $.each(json.clans, function(index, val){
        $("#tab-map .controls").append( '<div class="paint" data-char="'+index+'" data-col="'+val.color+'" title="Team: '+val.name+'" style="background-color:'+val.color+'">'+index+'</div>' );
    });
}

function updateClans(){
    tmp_clans = [];
    $(".clan-controls").each(function(i,val){
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
    json.clans = tmp_clans;
    updateMapWithColors();
}

function updateSettings(){
    if( !isNaN(parseInt($(".game-table #speed").val())) ){
        json.speed = parseInt($(".game-table #speed").val());
    }
    else{
        json.speed = 0;
    }

    
    $(".game-table #limit").hide();
    json.victoryType = $(".game-table #victory").val();
    if(json.victoryType=="time"){
        $(".game-table #limit").show();
        json.limit_time = parseInt($(".game-table #limit").val());
    }
    else if(json.victoryType=="turn"){
        $(".game-table #limit").show();
        json.limit_turn = parseInt($(".game-table #limit").val());
    }

    json.randomSpawn = ( $(".game-table #spawn").val() == 'true' );

}

function updateMapWithColors(){
    $(".map-table td").each(function(){
        val = $(this).text();
        if( Number(val) || val=="0" ){
            $(this).css("background", json.clans[val].color );
        }
    });
}

$(function() { 

    makeMap("40x20");
    makeClans();
    updateMapControls();
    updateSettings();


    $(".make-map").click(function(){
        size = prompt("How big is the map?", "40x20");
        if(size!=null){
            makeMap(size);
        }
    });

    $(".add-clan").click(function(){
        addClan();
    });
    
    //remove team
    $(document).on("click", ".rem-clan", function(){
        $(this).parents(".clan-controls").remove();
    });
    //on clan update
    $(document).on("keyup", ".clans-table [contenteditable]", function(){
        updateClans();
        updateMapControls();
    });
    //game settings
    $(".game-table .form-control").change(function(){
        updateSettings();
    });

    isDown = false;
    $(document).mousedown(function() {
        isDown = true;
    })
    .mouseup(function() {
        isDown = false;
    });
    $(document).on("mouseover", ".map-table td", function(){
        if(isDown){
            $(this).text( $(".paint.active").attr("data-char") );
            $(this).css("background", $(".paint.active").attr("data-col") );
        }
    });
    $(document).on("mousedown", ".map-table td", function(){
        $(this).text( $(".paint.active").attr("data-char") );
        $(this).css("background", $(".paint.active").attr("data-col") );
    });

    $(document).on("click", ".paint", function(){
        $(".paint").removeClass("active");
        $(this).addClass("active");
    });

    $(".save").click(function(){

        var final_grid = [];
        var final_grid_row = [];
        var count = 0;
        var i = 0;

        $(".map-table td").each(function(index, ele){

            val = $(ele).text();

            final_grid_row[count] = val;
            count++;

            if(count>=width){
                final_grid.push(final_grid_row);
                count = 0;
                final_grid_row = [];
            }
        });

        json.map = final_grid;

        url = "index.html?map="+encodeURI(JSON.stringify(json));

        console.log( JSON.stringify(json) );
        console.log( url.length );

        if( $(this).attr("data") == "url"){
            alert( url );
        }
        else{
            //window.location.href = url;
            window.open(url, '_blank');  
        }
    

    });


});