//grab value from amouht of teams

//generate divs for the rounds (make sure correct width)

//make subdivs inside each round div for the matchups

var windowHeight = $(window).height();

$('.holder').height(windowHeight + "px");
$('.bracketContainer').height(windowHeight + "px");
$('.sidebar').height(windowHeight + "px");
$('.sidebar-inner').height(windowHeight + "px");

$('#label1').text("Tournament Name");
$('#label2').text("Tournament Description");
$('#label3').text("Tournament Size");
$('#tournamentSelect').html('<option>4</option><option>8</option><option>16</option><option>32</option><option>64</option>');

function teamWrite(arr, roundNum){
 let round1 = $('div[data-roundNum="' + roundNum + '"]').children();
 arr.map(function (n, i) {
   round1.children('div[data-teamNum="' + (i + 1) + '"]').text(n);
   // $('div[data-teamNum="' + (i + 1) + '"]').text(n);
 });
}

$('.footer').on('click',function(){
  teams = [];
  reseeded = [];
  tournamentName = $("input[name='tournamentName']").val()
  number = $("#tournamentSelect").val();

  var empty = false;
  for (var i = 1; i <= number; i++) {
    if ($("#team" + i).val().trim() === "") {
      empty = true;
    }
  }

  if ($("input[name='tournamentName']").val().trim() === "" || empty) {
    alert("Not Everything Filled");
  }
  else {
    for (var i = 1; i <= number; i++) {
      teams.push($("#team" + i).val().trim())
      $("#team" + i).val("");
    }

    $("input[name='tournamentName']").val("");
    seeding(number);

  $(".bracketContainer").empty();
  var teamAmount = $('select[name="tournamentSel"]').val();
  teamAmount = parseInt(teamAmount);
  //switch for amount of teams
  var columnCount = 0;
  switch(teamAmount){
    case 4:
      columnCount = 3;
      break;
    case 8:
      columnCount = 4;
      break;
    case 16:
      columnCount = 5;
      break;
    case 32:
      columnCount = 6;
      break;
    case 64:
      columnCount = 7;
      break;
    default:
      console.log('default');
  }

  // console.log(teamAmount);

  var divWidth = 100 / columnCount;

  if( !$.trim( $('.bracketContainer').html()).length ){
    // console.log("----------------------");
    for(var i = 0; i < columnCount; i++){
      var newDiv = $('<div>');
      newDiv.width(divWidth + "%");
      newDiv.height(windowHeight + "px");

      newDiv.attr("data-roundNum", i + 1);

      if(i % 2 == 0){
        newDiv.css("background-color","#264653");
      }else{
        newDiv.css("background-color","#2A9D8F");
      }
      newDiv.css("float","left");
      newDiv.attr("class","animated fadeInLeft");

      //make subdivs for every div created here (if i > 0, amount of subdivs = teamAmount / 2^i ) do math.ciel check because last column will be decimal
      let temp = 1;
      
      var subDivs = 0;
      if(i < columnCount - 1){
        subDivs = Math.ceil((teamAmount / Math.pow(2,i)) / 2);

        for(var n = 0; n < subDivs;n++){
          var sub = $('<div>');
          sub.height(100/subDivs + "%");
          // sub.data("matchNum", n + 1);
          sub.attr("data-matchNum", n + 1);
          // console.log("Assigned match num is: " + sub.data("matchNum"));
          sub.css("border","2px solid #62BBC1");

          

          for(var k = 0; k < 2; k++){
            var matchSplitter = $("<div>");
            sub.append(matchSplitter);
            // sub.data("teamNum", temp);
            matchSplitter.attr("data-teamNum", temp);
            // console.log("assigned team num : " + sub.data("teamNum"));
            temp ++;
            matchSplitter.height("50%");
            if(k % 2 == 0){
              matchSplitter.css("border-bottom","2px solid #62BBC1");
            }else{
              matchSplitter.css("border-top","2px solid #62BBC1");
            }
          }

          $(newDiv).append(sub);
        }

      }else if (i === columnCount - 1){
        var sub = $('<div>');
        sub.height(100/subDivs + "%");
        sub.attr("data-matchNum", 1);
        // sub.css("border","2px solid #62BBC1");

        var matchSplitter = $("<div>");
        matchSplitter.attr("data-teamNum", 1);

        sub.append(matchSplitter);
        $(newDiv).append(sub);
      }else{
        newDiv.css("border","2px solid #62BBC1");
      }

      // console.log(subDivs); //correct                 





      $('.bracketContainer').append(newDiv);
    }

  }else{
    console.log("nope");
  }
  teamWrite(reseeded, 1);
  upScInit();
}
});

//reset functionality
$('.reset').on("click",function(){
  $('.bracketContainer').empty();
  addFields();
});
//empty bracketContainer pretty much

addFields();

$("#tournamentSelect").on("change", function() {
  addFields();
})

function addFields() {
  var number = $("#tournamentSelect").val();
  
  $(".bracketContainer").empty();
  for (var i = 1; i <= number; i++) {
    var line = $("<div>");
    line.attr("class", "inputLine");
    line.append("Team " + i + " ");
    var input = $("<input>");
    input.attr("type", "text");
    input.attr("id", "team" + i);
    line.append(input);
    $(".bracketContainer").append(line);
  }
}

function seeding(numPlayers) {
  var rounds = Math.log(numPlayers)/Math.log(2)-1;
  var pls = [1,2];
  for (var i = 0; i < rounds; i++) {
    pls = nextLayer(pls);
  }
  for (var i = 0, j = 1; i < pls.length; i+=2, j++) {
    console.log("Match " + j + ": " + teams[(pls[i]-1)] + " vs " + teams[(pls[i+1]-1)]);
    reseeded.push(teams[(pls[i]-1)]);
    reseeded.push(teams[(pls[i+1]-1)]);
    var newMatch = {
      team1: teams[(pls[i]-1)],
      team2: teams[(pls[i+1]-1)],
      matchNum: j,
      roundNum: 1,
      tournament: tournamentName
    }
    $.post("/api/games", newMatch); 
  }
  for (var k = 1; pls.length/Math.pow(2,k) !== 1; k++) {
    for(var i = 1, j = 1; i < pls.length/Math.pow(2,k); i+=2, j++) {
      console.log("Round " + (k+1) + " - Match " + j + ": " + "Round " + k + " Match "+ i + " Winner" + " vs " + "Round " + k + " Match "+ (i+1) + " Winner");
      var newMatch = {
        team1: "Round " + k + " Match " + i + " Winner",
        team2: "Round " + k + " Match " + (i+1) + " Winner",
        matchNum: j,
        roundNum: (k+1),
        tournament: tournamentName
      }
      $.post("/api/games", newMatch);
    }
  }
  var newMatch = {
    team1: "Tournament Winner",
    team2: "...",
    matchNum: 1,
    roundNum: (rounds+2),
    tournament: tournamentName
  }
  $.post("/api/games", newMatch);

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