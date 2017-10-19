var windowHeight = $(window).height();

console.log(windowHeight);

$('.holder').height(windowHeight + "px");
$('.bracketContainer').height(windowHeight + "px");
$('.sidebar').height(windowHeight + "px");
$('.sidebar-inner').height(windowHeight + "px");

$(".footer").on("click", function (){
	$(".bracketContainer").empty();
  console.log($('input[name="tournamentName"]').val());
  $.get("/api/tournaments/" + $('input[name="tournamentName"]').val(), function(result) {
    var teamAmount = result.length;
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

        console.log(i+1);
        // newDiv.data("roundNum", i + 1);
        newDiv.attr("data-roundNum", i + 1);
        // console.log("assigned roundnum is : " + newDiv.data("roundnum"));

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

    for (var i = 0; i < result.length; i++) {
      $('div[data-roundNum="' + result[i].roundNum + '"]').children('div[data-matchNum="' + result[i].matchNum + '"]').children().eq(0).text(result[i].team1);
      $('div[data-roundNum="' + result[i].roundNum + '"]').children('div[data-matchNum="' + result[i].matchNum + '"]').children().eq(1).text(result[i].team2);
    }

  });
});