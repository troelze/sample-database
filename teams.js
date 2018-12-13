module.exports = function(){
    var express = require('express');
    var router = express.Router();

    function getStadiums(res, mysql, context, complete){
        mysql.pool.query("SELECT stadiumid, name FROM nfl_stadiums", function(error, results, fields){
            if(error){
                res.write(JSON.stringify(error));
                res.end();
            }
            context.stadiums  = results;
            complete();
        });
    }

    function getDivisions(res, mysql, context, complete){
        mysql.pool.query("SELECT divisionid, name FROM nfl_divisions", function(error, results, fields){
            if(error){
                res.write(JSON.stringify(error));
                res.end();
            }
            context.divisions  = results;
            complete();
        });
    }

    function getTeams(res, mysql, context, complete){
        mysql.pool.query("SELECT t.teamid, t.mascot, s.name AS stadium, d.name AS division, t.headCoach FROM nfl_teams t INNER JOIN nfl_stadiums s ON s.stadiumid = t.stadiumid INNER JOIN nfl_divisions d ON d.divisionid = t.divisionid", function(error, results, fields){
            if(error){
                res.write(JSON.stringify(error));
                res.end();
            }
            context.teams = results;
            complete();
        });
    }

    function getTeam(res, mysql, context, teamid, complete){
        var sql = "SELECT t.teamid, t.mascot, s.name AS stadium, d.name AS division, t.headCoach, t.stadiumid, t.divisionid FROM nfl_teams t INNER JOIN nfl_stadiums s ON s.stadiumid = t.stadiumid INNER JOIN nfl_divisions d ON d.divisionid = t.divisionid WHERE t.teamid = ?";
        var inserts = [teamid];
        mysql.pool.query(sql, inserts, function(error, results, fields){
            if(error){
                res.write(JSON.stringify(error));
                res.end();
            }
            context.team = results[0];
            
            complete();
        });
    }

    /*Display all teams*/

    router.get('/', function(req, res){
        var callbackCount = 0;
        var context = {};
        context.jsscripts = ["deleteteam.js"];
        var mysql = req.app.get('mysql');
        getStadiums(res, mysql, context, complete);
        getDivisions(res, mysql, context, complete);
        getTeams(res, mysql, context, complete);
        function complete(){
            callbackCount++;
            if(callbackCount >= 3){
                res.render('teams', context);
            }

        }
    });

    /* Display one team for the specific purpose of updating the team */

    router.get('/update-team/:teamid', function(req, res){
        callbackCount = 0;
        var context = {};
        context.jsscripts = ["updateteam.js"];
        var mysql = req.app.get('mysql');
        getTeam(res, mysql, context, req.params.teamid, complete);
        getStadiums(res, mysql, context, complete);
        getDivisions(res, mysql, context, complete);
        function complete(){
            callbackCount++;
            if(callbackCount >= 3){
                res.render('update-team', context);
            }

        }
    });

    /* Adds a team, redirects to the players page after adding */

    router.post('/', function(req, res){
        var mysql = req.app.get('mysql');
        var sql = "INSERT INTO nfl_teams (mascot, stadiumid, divisionid, headCoach) VALUES (?,?,?,?)";
        var inserts = [req.body.mascot, req.body.stadiumid, req.body.divisionid, req.body.headCoach];
        sql = mysql.pool.query(sql,inserts,function(error, results, fields){
            if(error){
                res.write(JSON.stringify(error));
                res.end();
            }else{
                res.redirect('/teams');
            }
        });
    });

    /* The URI that update data is sent to in order to update a person */

    router.put('/:teamid', function(req, res){
        var mysql = req.app.get('mysql');
        var sql = "UPDATE nfl_teams SET mascot=?, stadiumid=?, divisionid=?, headCoach=? WHERE teamid=?";
        var inserts = [req.body.mascot, req.body.stadiumid, req.body.divisionid, req.body.headCoach, req.params.teamid];
        sql = mysql.pool.query(sql,inserts,function(error, results, fields){
            if(error){
                res.write(JSON.stringify(error));
                res.end();
            }else{
                res.status(200);
                res.end();
            }
        });
    });

    /* Route to delete a person, simply returns a 202 upon success. Ajax will handle this. */

    router.delete('/:teamid', function(req, res){
        var mysql = req.app.get('mysql');
        var sql = "DELETE FROM nfl_teams WHERE teamid = ?";
        var inserts = [req.params.teamid];
        sql = mysql.pool.query(sql, inserts, function(error, results, fields){
            if(error){
                res.write(JSON.stringify(error));
                res.status(400);
                res.end();
            }else{
                res.status(202).end();
            }
        })
    })

    return router;
}();