$("#submit").on("click", function() {
	if($("#tournyName").val().trim() !== "") {
		name = $("#tournyName").val().trim();
		$.get("/api/tournaments/" + name, function(data) {
			console.log(data);
		});
	}
	if($("#teamName").val().trim() !== "") {
		name = $("#teamName").val().trim();
		$.get("/api/teams/" + name, function(data) {
			console.log(data);
		});
	}
});