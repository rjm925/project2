var db = require("../models");

module.exports = function(app) {
  app.get("/api/tournaments/:name", function(req, res) {
  	db.Game.findAll({
  		where: {
  			tournament: req.params.name
  		}
  	}).then(function(result) {
  		return res.json(result);
  	})
  })

   app.get("/api/teams/:name", function(req, res) {
  	db.Game.findAll({
  		where: {
  			$or: {
  				team1: req.params.name,
  				team2: req.params.name
  			}
  		}
  	}).then(function(result) {
  		return res.json(result);
  	})
  })

  app.put("/api/games", function(req, res) {
    if (req.body.match % 2 === 1) {
      console.log("team1update");
      db.Game.update({
        team1: req.body.team
      },
      {
        where: {
          tournament: req.body.tournament,
          roundNum: parseInt(req.body.round),
          matchNum: Math.ceil(req.body.match / 2)
        }
      })
    } else {
      console.log("team2update");
      db.Game.update({
        team2: req.body.team
      },
      {
        where: {
          tournament: req.body.tournament,
          roundNum: parseInt(req.body.round),
          matchNum: Math.ceil(req.body.match / 2)
        }
      })
    }
    return res.json("updated");
  });
};