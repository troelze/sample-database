module.exports = function(){
    var express = require('express');
    var router = express.Router();

    function getDivisions(res, mysql, context, complete){
        mysql.pool.query("SELECT name, conference FROM nfl_divisions", function(error, results, fields){
            if(error){
                res.write(JSON.stringify(error));
                res.end();
            }
            context.divisions  = results;
            complete();
        });
    }

    function getAFCEast(res, mysql, context, complete){
        mysql.pool.query("SELECT t.mascot FROM nfl_divisions d INNER JOIN nfl_teams t ON t.divisionid = d.divisionid WHERE d.divisionid = 1", function(error, results, fields){
            if(error){
                res.write(JSON.stringify(error));
                res.end();
            }
            context.afce = results;
            complete();
        });
    }

    function getAFCNorth(res, mysql, context, complete){
        mysql.pool.query("SELECT t.mascot FROM nfl_divisions d INNER JOIN nfl_teams t ON t.divisionid = d.divisionid WHERE d.divisionid = 2", function(error, results, fields){
            if(error){
                res.write(JSON.stringify(error));
                res.end();
            }
            context.afcn = results;
            complete();
        });
    }

    function getAFCSouth(res, mysql, context, complete){
        mysql.pool.query("SELECT t.mascot FROM nfl_divisions d INNER JOIN nfl_teams t ON t.divisionid = d.divisionid WHERE d.divisionid = 3", function(error, results, fields){
            if(error){
                res.write(JSON.stringify(error));
                res.end();
            }
            context.afcs = results;
            complete();
        });
    }

    function getAFCWest(res, mysql, context, complete){
        mysql.pool.query("SELECT t.mascot FROM nfl_divisions d INNER JOIN nfl_teams t ON t.divisionid = d.divisionid WHERE d.divisionid = 4", function(error, results, fields){
            if(error){
                res.write(JSON.stringify(error));
                res.end();
            }
            context.afcw = results;
            complete();
        });
    }
    
    function getNFCEast(res, mysql, context, complete){
        mysql.pool.query("SELECT t.mascot FROM nfl_divisions d INNER JOIN nfl_teams t ON t.divisionid = d.divisionid WHERE d.divisionid = 5", function(error, results, fields){
            if(error){
                res.write(JSON.stringify(error));
                res.end();
            }
            context.nfce = results;
            complete();
        });
    }

    function getNFCNorth(res, mysql, context, complete){
        mysql.pool.query("SELECT t.mascot FROM nfl_divisions d INNER JOIN nfl_teams t ON t.divisionid = d.divisionid WHERE d.divisionid = 6", function(error, results, fields){
            if(error){
                res.write(JSON.stringify(error));
                res.end();
            }
            context.nfcn = results;
            complete();
        });
    }

    function getNFCSouth(res, mysql, context, complete){
        mysql.pool.query("SELECT t.mascot FROM nfl_divisions d INNER JOIN nfl_teams t ON t.divisionid = d.divisionid WHERE d.divisionid = 7", function(error, results, fields){
            if(error){
                res.write(JSON.stringify(error));
                res.end();
            }
            context.nfcs = results;
            complete();
        });
    }

    function getNFCWest(res, mysql, context, complete){
        mysql.pool.query("SELECT t.mascot FROM nfl_divisions d INNER JOIN nfl_teams t ON t.divisionid = d.divisionid WHERE d.divisionid = 8", function(error, results, fields){
            if(error){
                res.write(JSON.stringify(error));
                res.end();
            }
            context.nfcw = results;
            complete();
        });
    }
    
/*
    function getDivision(res, mysql, context, id, complete){
        var sql = "SELECT playerid, fname, lname, teamid, jersey, positionid FROM nfl_players WHERE id = ?";
        var inserts = [id];
        mysql.pool.query(sql, inserts, function(error, results, fields){
            if(error){
                res.write(JSON.stringify(error));
                res.end();
            }
            context.player = results[0];
            complete();
        });
    }
    */

    /*Display all teams*/

    router.get('/', function(req, res){
        var callbackCount = 0;
        var context = {};
        context.jsscripts = ["deletedivision.js"];
        var mysql = req.app.get('mysql');
        getDivisions(res, mysql, context, complete);
        getAFCEast(res, mysql, context, complete);
        getAFCNorth(res, mysql, context, complete);
        getAFCSouth(res, mysql, context, complete);
        getAFCWest(res, mysql, context, complete);
        getNFCEast(res, mysql, context, complete);
        getNFCNorth(res, mysql, context, complete);
        getNFCSouth(res, mysql, context, complete);
        getNFCWest(res, mysql, context, complete);
        function complete(){
            callbackCount++;
            if(callbackCount >= 9){
                res.render('divisions', context);
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
/*
    router.post('/', function(req, res){
        var mysql = req.app.get('mysql');
        var sql = "INSERT INTO nfl_stadiums (name, city, stateUS, teamid) VALUES (?,?,?,?)";
        var inserts = [req.body.name, req.body.city, req.body.stateUS, req.body.teamid];
        sql = mysql.pool.query(sql,inserts,function(error, results, fields){
            if(error){
                res.write(JSON.stringify(error));
                res.end();
            }else{
                res.redirect('/stadiums');
            }
        });
    });

    */


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
/*
    router.delete('/:id', function(req, res){
        var mysql = req.app.get('mysql');
        var sql = "DELETE FROM nfl_players WHERE id = ?";
        var inserts = [req.params.id];
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
*/
    return router;
}();