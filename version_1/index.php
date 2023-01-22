<html>

<head>
	<title>Cell Simulator</title>
	
	<link id="favicon" rel="shortcut icon" type="image/png" href="" />
	
	<link rel="stylesheet" type="text/css" href="index.css">
	<link rel="stylesheet" type="text/css" href="https://maxcdn.bootstrapcdn.com/font-awesome/4.5.0/css/font-awesome.min.css">
	
</head>

<body>
	
	<div class="control">
		<span class="con_play fa-stack fa-lg" id="conPLAY" style="display:none;">
			<i class="fa fa-circle fa-stack-2x"></i>
			<i class="fa fa-play fa-stack-1x" style="padding-left: 2px;"></i>
		</span>
		<span class="con_play fa-stack fa-lg" id="conPAUSE">
			<i class="fa fa-circle fa-stack-2x"></i>
			<i class="fa fa-pause fa-stack-1x" style="padding-left: 2px;"></i>
		</span>
		<span class="con_rest fa-stack fa-lg">
			<i class="fa fa-circle fa-stack-2x"></i>
			<i class="fa fa-refresh fa-stack-1x"></i>
		</span>
		<span class="con_sett fa-stack fa-lg">
			<i class="fa fa-circle fa-stack-2x"></i>
			<i class="fa fa-cog fa-stack-1x"></i>
		</span>
		<span class="con_list fa-stack fa-lg">
			<i class="fa fa-circle fa-stack-2x"></i>
			<i class="fa fa-bars fa-stack-1x"></i>
		</span>
	</div>
	
	<div class="container">
	</div>
	
	<div id="Modal_sett" class="modal">
		<!-- Modal content -->
		<div class="modal-content">
			<div class="modal-header">
				<span class="closeModal">
					<i class="fa fa-times" aria-hidden="true"></i>
				</span>
				<h2>Settings</h2>
			</div>
			<div class="modal-body">
				<p>
				
				<b>Map Size</b></br>
				<sub>(Max size is 100x100)</sub></br>
				<input type="number" class="map_height" value="0" min="0" max="100">
				x
				<input type="number" class="map_width" value="0" min="0" max="100">
				
				</br></br>
				
				<b>Clans</b></br>
				<sub></sub>
				<div id="clan_holder">
				
				</div>
				
				</br></br>
				
				<b>Game Speed</b></br>
				<sub>(Lower the number, faster it plays)</sub></br>
				<input type="number" class="game_speed" value="0" min="0">
				
				</br></br>
				
				<b>Color Mutation</b></br>
				<sub>(Higher the number, the greater difference in color mutation)</sub></br>
				<input type="number" class="col_mutation" value="0" min="0" max="255">
				
				</br>
				
				</p>
				
				<button class="saving">Save & Restart</button>
				
				</br>
				
				<button class="debug debug_on">Show Locations</button>
				<button class="debug debug_off">Show Locations</button>
				
			</div>
		</div>
	</div>

	<div id="Modal_list" class="modal">
		<!-- Modal content -->
		<div class="modal-content">
			<div class="modal-header">
				<span class="closeModal">
					<i class="fa fa-times" aria-hidden="true"></i>
				</span>
				<h2>Lists</h2>
			</div>
			<div class="modal-body">
				<p>
					<u><h3>Time Since Start</h3></u>
					<h4 class="time">0:0:0</h4>
					
					<div id="show_count">
					
					</div>
				</p>
			</div>
		</div>
	</div>

	
	<!-- ---------- JavaScripts Start -->
	<!-- Default JavaScript -->
    <script src="https://code.jquery.com/jquery-1.10.2.min.js"></script>
	<script src="https://code.jquery.com/ui/1.11.4/jquery-ui.min.js"></script>
	
	<script src="index.js"></script>
	
</body>

</html>