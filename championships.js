module.exports = function(){
    var express = require('express');
    var router = express.Router();

    function getChampionships(res, mysql, context, complete){
        mysql.pool.query("SELECT championshipid, name FROM nfl_championships", function(error, results, fields){
            if(error){
                res.write(JSON.stringify(error));
                res.end();
            }
            context.championships  = results;
            complete();
        });
    }


    function getTeams(res, mysql, context, complete){
        mysql.pool.query("SELECT teamid, mascot FROM nfl_teams", function(error, results, fields){
            if(error){
                res.write(JSON.stringify(error));
                res.end();
            }
            context.teams  = results;
            complete();
        });
    }

    function getTeamChampionships(res, mysql, context, complete){
        mysql.pool.query("SELECT tc.tcid, t.mascot, c.name, tc.year FROM nfl_teams t INNER JOIN nfl_teamChampionships tc ON tc.teamid = t.teamid INNER JOIN nfl_championships c ON c.championshipid = tc.championshipid", function(error, results, fields){
            if(error){
                res.write(JSON.stringify(error));
                res.end();
            }
            context.teamChampionships  = results;
            complete();
        });
    }
    /*Display all positions*/

    router.get('/', function(req, res){
        var callbackCount = 0;
        var context = {};
        context.jsscripts = ["deletechampionship.js", "deleteteamchampionship.js"];
        var mysql = req.app.get('mysql');
        getChampionships(res, mysql, context, complete);
        getTeams(res, mysql, context, complete);
        getTeamChampionships(res, mysql, context, complete);
        function complete(){
            callbackCount++;
            if(callbackCount >= 3){
                res.render('championships', context);
            }

        }
    });

    /* Display one stadium for the specific purpose of updating players */
/*
    router.get('/:id', function(req, res){
        callbackCount = 0;
        var context = {};
        context.jsscripts = ["selectedteam.js", "updateplayer.js"];
        var mysql = req.app.get('mysql');
        getPlayer(res, mysql, context, req.params.id, complete);
        getTeams(res, mysql, context, complete);
        function complete(){
            callbackCount++;
            if(callbackCount >= 2){
                res.render('update-player', context);
            }

        }
    });
*/

    /* Adds a stadium, redirects to the players page after adding */

    router.post('/', function(req, res){
        var mysql = req.app.get('mysql');
        var sql = "INSERT INTO nfl_championships (name) VALUES (?)";
        var inserts = [req.body.name];
        sql = mysql.pool.query(sql,inserts,function(error, results, fields){
            if(error){
                res.write(JSON.stringify(error));
                res.end();
            }else{
                res.redirect('/championships');
            }
        });
    });


    router.post('/update', function(req, res){
        var mysql = req.app.get('mysql');
        var sql = "INSERT INTO nfl_teamChampionships (teamid, championshipid, year) VALUES (?, ?, ?)";
        var inserts = [req.body.teamid, req.body.championshipid, req.body.year];
        sql = mysql.pool.query(sql,inserts,function(error, results, fields){
            if(error){
                alert("This association already exists. Please try again.");
                res.end();
            }else{
                res.redirect('/championships');
            }
        });
    });

    /* The URI that update data is sent to in order to update a person */
/*
    router.put('/:id', function(req, res){
        var mysql = req.app.get('mysql');
        var sql = "UPDATE nfl_players SET fname=?, lname=?, team=?, jersey=? WHERE id=?";
        var inserts = [req.body.fname, req.body.lname, req.body.teamid, req.body.jersey, req.params.id];
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
*/
    /* Route to delete a person, simply returns a 202 upon success. Ajax will handle this. */

    router.delete('/:championshipid', function(req, res){
        var mysql = req.app.get('mysql');
        var sql = "DELETE FROM nfl_championships WHERE championshipid = ?";
        var inserts = [req.params.championshipid];
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

    router.delete('/remove/:tcid', function(req, res){
        var mysql = req.app.get('mysql');
        var sql = "DELETE FROM nfl_teamChampionships WHERE tcid = ?";
        var inserts = [req.params.tcid];
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