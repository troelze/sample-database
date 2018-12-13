module.exports = function(){
    var express = require('express');
    var router = express.Router();

    function getPositions(res, mysql, context, complete){
        mysql.pool.query("SELECT pos.positionid, pos.name, pos.side FROM nfl_positions pos", function(error, results, fields){
            if(error){
                res.write(JSON.stringify(error));
                res.end();
            }
            context.positions  = results;
            complete();
        });
    }

    /*Display all positions*/

    router.get('/', function(req, res){
        var callbackCount = 0;
        var context = {};
        context.jsscripts = ["deleteposition.js"];
        var mysql = req.app.get('mysql');
        getPositions(res, mysql, context, complete);
        function complete(){
            callbackCount++;
            if(callbackCount >= 1){
                res.render('positions', context);
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
        var sql = "INSERT INTO nfl_positions (name, side) VALUES (?, ?)";
        var inserts = [req.body.name, req.body.side];
        sql = mysql.pool.query(sql,inserts,function(error, results, fields){
            if(error){
                res.write(JSON.stringify(error));
                res.end();
            }else{
                res.redirect('/positions');
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

    router.delete('/:positionid', function(req, res){
        var mysql = req.app.get('mysql');
        var sql = "DELETE FROM nfl_positions WHERE positionid = ?";
        var inserts = [req.params.positionid];
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