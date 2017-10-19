function updateMatch(){
	let r = $('#roundSelect').val();
	let m = $('#matchSelect').val();

	var winner = {
		tournament: tournamentName,
		round: r,
		match: m,
		team: $("#teamSelect").val()
	}

	$.ajax({
		method: "PUT",
		url: "/api/games",
		data: winner
	})
	.done(function(err, data) {
		console.log("sfasdf");
		if(m % 2 === 1){
			$('div[data-roundNum="' + (r) + '"]').children('div[data-matchNum="' + Math.ceil(m/2) + '"]').children().eq(0).text(winner.team);
		} else {
			$('div[data-roundNum="' + (r) + '"]').children('div[data-matchNum="' + Math.ceil(m/2) + '"]').children().eq(1).text(winner.team);
		}
	});
}

function upScInit(){
	$('.header').html("<p>Update Panel</p>");
	$(".createCredentials").empty();
	$(".createCredentials").append('<div class="form-group first animated fadeInUp"><label id="label1" for="roundSelect">Round #</label><select name="tournamentSel" class="form-control" id="roundSelect"></div>');
	$(".createCredentials").append('<div class="form-group second animated fadeInUp"><label id="label2" for="matchSelect">Match #</label><select name="tournamentSel" class="form-control" id="matchSelect"></div>');
	$(".createCredentials").append('<div class="form-group third animated fadeInUp"><label id="label3" for="teamSelect">Winning Team</label><select name="tournamentSel" class="form-control" id="teamSelect"></div>');
	$(".footer").off();
	$(".footer").on("click", updateMatch);
	$.get("/api/tournaments/" + tournamentName, function(data) {
		numberTeams = data.length;

		console.log(numberTeams);
			if (numberTeams === 4) {
				$('#roundSelect').html('<option>2</option><option>3</option>');
			} 
			if (numberTeams === 8) {
				$('#roundSelect').html('<option>2</option><option>3</option><option>4</option>');
			} 
			if (numberTeams === 16) {
				$('#roundSelect').html('<option>2</option><option>3</option><option>4</option><option>5</option>');
			}
			if (numberTeams === 32) {
				$('#roundSelect').html('<option>2</option><option>3</option><option>4</option><option>5</option><option>6</option>');
			}
			if (numberTeams === 64) {
				$('#roundSelect').html('<option>2</option><option>3</option><option>4</option><option>5</option><option>6</option><option>7</option>');
			}
			numMatches(numberTeams, $("#roundSelect option:selected").text());
			getTeams(2, 1);
	});


	$(".footer").off();
	$(".footer").on("click", updateMatch);
}

$(document).on('change', '#roundSelect', function() {
	numMatches(numberTeams, $("#roundSelect option:selected").text());
	getTeams($("#roundSelect option:selected").text(), $("#matchSelect option:selected").text());
});

$(document).on('change', '#matchSelect', function() {
	getTeams($("#roundSelect option:selected").text(), $("#matchSelect option:selected").text());
});

function numMatches(numTeams, round) {
	var matches = numTeams / Math.pow(2, round-1);
	console.log(matches);

	var str = "";
	for (var i = 1; i <= matches; i++) {
		str += "<option>" + i + "</option>";
	}

	console.log(str);
	$("#matchSelect").html(str);
}

function getTeams(r, m) {
	$.get("/api/tournaments/" + tournamentName, function(data) {
		for (var i = 0; i < data.length; i++) {
			console.log("looping");
			if (data[i].roundNum === (parseInt(r)-1) && data[i].matchNum === parseInt(m)) {
				$("#teamSelect").html("<option>" + data[i].team1 + "</option><option>" + data[i].team2 + "</option>");
			}
		}
	});
}