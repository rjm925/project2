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
};