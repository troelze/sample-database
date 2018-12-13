module.exports = function(){
    var express = require('express');
    var router = express.Router();

    function getColors(res, mysql, context, complete){
        mysql.pool.query("SELECT colorid, name FROM nfl_colors", function(error, results, fields){
            if(error){
                res.write(JSON.stringify(error));
                res.end();
            }
            context.colors  = results;
            complete();
        });
    }

    function getUniforms(res, mysql, context, complete){
        mysql.pool.query("SELECT u.uniformid, t.mascot, c.name FROM nfl_teams t INNER JOIN nfl_uniforms u ON u.teamid = t.teamid INNER JOIN nfl_colors c ON c.colorid = u.colorid ", function(error, results, fields){
            if(error){
                res.write(JSON.stringify(error));
                res.end();
            }
            context.uniforms  = results;
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


    /*Display all positions*/

    router.get('/', function(req, res){
        var callbackCount = 0;
        var context = {};
        context.jsscripts = ["deletecolor.js", "deleteuniform.js"];
        var mysql = req.app.get('mysql');
        getColors(res, mysql, context, complete);
        getUniforms(res, mysql, context, complete);
        getTeams(res, mysql, context, complete);
        function complete(){
            callbackCount++;
            if(callbackCount >= 3){
                res.render('uniforms', context);
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
        var sql = "INSERT INTO nfl_colors (name) VALUES (?)";
        var inserts = [req.body.name];
        sql = mysql.pool.query(sql,inserts,function(error, results, fields){
            if(error){
                res.write(JSON.stringify(error));
                res.end();
            }else{
                res.redirect('/uniforms');
            }
        });
    });

    router.post('/update', function(req, res){
        var mysql = req.app.get('mysql');
        var sql = "INSERT INTO nfl_uniforms (teamid, colorid) VALUES (?, ?)";
        var inserts = [req.body.teamid, req.body.colorid];
        sql = mysql.pool.query(sql,inserts,function(error, results, fields){
            if(error){
                res.write("This association already exists. Please try again.");
                res.end();
            }else{
                res.redirect('/uniforms');
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

    router.delete('/:colorid', function(req, res){
        var mysql = req.app.get('mysql');
        var sql = "DELETE FROM nfl_colors WHERE colorid = ?";
        var inserts = [req.params.colorid];
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

    
    router.delete('/remove/:uniformid', function(req, res){
        var mysql = req.app.get('mysql');
        var sql = "DELETE FROM nfl_uniforms WHERE uniformid = ?";
        var inserts = [req.params.uniformid];
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