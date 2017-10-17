$("#teams").on("change", function() {
  addFields();
})

$("#submit").on("click", function() {
  teams = [];
  tournamentName = $("#name").val()
  number = $("#teams").val();

  var empty = false;
  for (var i = 1; i <= number; i++) {
    if ($("#team" + i).val().trim() === "") {
      empty = true;
    }
  }

  if ($("#name").val().trim() === "" || empty) {
    alert("Not Everything Filled")
  }
  else {
    console.log("Tournament Name: " + tournamentName);
    for (var i = 1; i <= number; i++) {
      teams.push($("#team" + i).val().trim())
      $("#team" + i).val("");
    }

    if($("#random").is(":checked")) {
      randomize(teams);
    }

    $("#name").val("");
    seeding(number);
  }
});

function addFields() {
  var number = $("#teams").val();
  
  $(".teamsInput").empty();
  for (var i = 1; i <= number; i++) {
    var line = $("<div>");
    line.attr("class", "inputLine");
    line.append("Team " + i + " ");
    var input = $("<input>");
    input.attr("type", "text");
    input.attr("id", "team" + i);
    line.append(input);
    $(".teamsInput").append(line);
  }
}

function seeding(numPlayers){
  var rounds = Math.log(numPlayers)/Math.log(2)-1;
  var pls = [1,2];
  for(var i=0; i<rounds; i++) {
    pls = nextLayer(pls);
  }
  for(var i = 0, j = 1; i < pls.length; i+=2, j++) {
    console.log("Match " + j + ": " + teams[(pls[i]-1)] + " vs " + teams[(pls[i+1]-1)]);
    var newMatch = {
      team1: teams[(pls[i]-1)],
      team2: teams[(pls[i+1]-1)],
      matchNum: j,
      roundNum: 1,
      tournament: tournamentName
    }
    $.post("/api/games", newMatch); 
  }
  return pls;
  function nextLayer(pls) {
    var out=[];
    var length = pls.length*2+1;
    pls.forEach(function(d) {
      out.push(d);
      out.push(length-d);
    });
    return out;
  }
}

function randomize(array) {
  var i = 0;

  while (i < array.length) {
    num1 = Math.floor(Math.random() * array.length);
    num2 = Math.floor(Math.random() * array.length);

    tmp = array[num1];
    array[num1] = array[num2];
    array[num2] = tmp;

    i++;
  }

  return array;
}

addFields();