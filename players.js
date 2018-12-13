module.exports = function(){
    var express = require('express');
    var router = express.Router();

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

    function getPositions(res, mysql, context, complete){
        mysql.pool.query("SELECT positionid, name FROM nfl_positions", function(error, results, fields){
            if(error){
                res.write(JSON.stringify(error));
                res.end();
            }
            context.positions  = results;
            complete();
        });
    }

   



    function getPlayers(res, mysql, context, complete){
        mysql.pool.query("SELECT p.playerid, p.fname, p.lname, t.mascot, p.jersey, pos.name FROM nfl_players p INNER JOIN nfl_teams t ON p.teamid = t.teamid INNER JOIN nfl_positions pos ON pos.positionid = p.positionid", function(error, results, fields){
            if(error){
                res.write(JSON.stringify(error));
                res.end();
            }
            context.players = results;
            
            complete();
        });
    }

    function getPlayer(res, mysql, context, playerid, complete){
        var sql = "SELECT p.playerid, p.fname, p.lname, t.mascot, p.jersey, pos.name, p.teamid, p.positionid FROM nfl_players p INNER JOIN nfl_teams t ON p.teamid = t.teamid INNER JOIN nfl_positions pos ON pos.positionid = p.positionid WHERE p.playerid = ?";
        var inserts = [playerid];
        mysql.pool.query(sql, inserts, function(error, results, fields){
            if(error){
                res.write(JSON.stringify(error));
                res.end();
            }
            context.player = results[0];
            
            complete();
        });
    }

    function getPlayersByName(res, mysql, context, fname, lname, complete){
        var sql = "SELECT p.playerid, p.fname, p.lname, t.mascot, p.jersey, pos.name FROM nfl_players p INNER JOIN nfl_teams t ON p.teamid = t.teamid INNER JOIN nfl_positions pos ON pos.positionid = p.positionid WHERE p.fname = ? AND p.lname=?";
        var inserts = [fname, lname];
        mysql.pool.query(sql, inserts, function(error, results, fields){
            if(error){
                res.write(JSON.stringify(error));
                res.end();
            }
            context.players = results;
            
            complete();
        });
    }

    function getPlayersByOther(res, mysql, context, teamid, positionid, jersey, complete){
        var sql = "SELECT p.playerid, p.fname, p.lname, t.mascot, p.jersey, pos.name FROM nfl_players p INNER JOIN nfl_teams t ON p.teamid = t.teamid INNER JOIN nfl_positions pos ON pos.positionid = p.positionid WHERE p.teamid = ? OR p.positionid=? OR p.jersey=?";
        var inserts = [teamid, positionid, jersey];
        mysql.pool.query(sql, inserts, function(error, results, fields){
            if(error){
                res.write(JSON.stringify(error));
                res.end();
            }
            context.players = results;
            
            complete();
        });
    }

    /*Display all players*/

    router.get('/', function(req, res){
        var callbackCount = 0;
        var context = {};
        //context.css = ["styles.css"];
        context.jsscripts = ["deleteplayer.js"];
        var mysql = req.app.get('mysql');
        getPlayers(res, mysql, context, complete);
        getTeams(res, mysql, context, complete);
        getPositions(res, mysql, context, complete);
        function complete(){
            callbackCount++;
            if(callbackCount >= 3){
                res.render('players', context);
            }

        }
    });
   

    /* Display one player for the specific purpose of updating players */

    router.get('/update-player/:playerid', function(req, res){
        callbackCount = 0;
        var context = {};
        context.jsscripts = ["updateplayer.js"];
        var mysql = req.app.get('mysql');
        getPlayer(res, mysql, context, req.params.playerid, complete);
        getTeams(res, mysql, context, complete);
        getPositions(res, mysql, context, complete);
        function complete(){
            callbackCount++;
            if(callbackCount >= 3){
                res.render('update-player', context);
            }

        }
    });

    router.get('/search-name/', function(req, res){
        callbackCount = 0;
        var context = {};
        var mysql = req.app.get('mysql');
        getPlayersByName(res, mysql, context, req.query.fname, req.query.lname, complete);
        getTeams(res, mysql, context, complete);
        getPositions(res, mysql, context, complete);
        function complete(){
            callbackCount++;
            if(callbackCount >= 3){
                res.render('players', context);
            }

        }
    });

    router.get('/search/', function(req, res){
        callbackCount = 0;
        var context = {};
        var mysql = req.app.get('mysql');
        getPlayersByOther(res, mysql, context, req.query.teamid, req.query.positionid, req.query.jersey, complete);
        getTeams(res, mysql, context, complete);
        getPositions(res, mysql, context, complete);
        function complete(){
            callbackCount++;
            if(callbackCount >= 3){
                res.render('players', context);
            }

        }
    });


    

    /* Adds a player, redirects to the players page after adding */

    router.post('/', function(req, res){
        var mysql = req.app.get('mysql');
        var sql = "INSERT INTO nfl_players (fname, lname, teamid, jersey, positionid) VALUES (?,?,?,?,?)";
        var inserts = [req.body.fname, req.body.lname, req.body.teamid, req.body.jersey, req.body.positionid];
        sql = mysql.pool.query(sql,inserts,function(error, results, fields){
            if(error){
                res.write(JSON.stringify(error));
                res.end();
            }else{
                res.redirect('/players');
            }
        });
    });

    /*Add to player highlights table */
    router.post('/update', function(req, res){
        var mysql = req.app.get('mysql');
        var sql = "INSERT INTO nfl_playerHighlights (playerid, highlightid) VALUES (?, ?)";
        var inserts = [req.body.playerid, req.body.highlightid];
        sql = mysql.pool.query(sql,inserts,function(error, results, fields){
            if(error){
                res.write(JSON.stringify(error));
                res.end();
            }else{
                res.redirect('/players');
            }
        });
    });

    

    /* The URI that update data is sent to in order to update a person */

    router.put('/:playerid', function(req, res){
        var mysql = req.app.get('mysql');
        var sql = "UPDATE nfl_players SET fname=?, lname=?, teamid=?, positionid=?, jersey=? WHERE playerid=?";
        var inserts = [req.body.fname, req.body.lname, req.body.teamid, req.body.positionid, req.body.jersey, req.params.playerid];
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

    router.delete('/:playerid', function(req, res){
        var mysql = req.app.get('mysql');
        var sql = "DELETE FROM nfl_players WHERE playerid = ?";
        var inserts = [req.params.playerid];
        sql = mysql.pool.query(sql, inserts, function(error, results, fields){
            if(error){
                res.write(JSON.stringify(error));
                res.status(400);
                res.end();
            }else{
                res.status(202).end();
            }
        })
    });

    return router;
}();