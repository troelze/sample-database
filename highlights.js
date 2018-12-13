module.exports = function(){
    var express = require('express');
    var router = express.Router();

    function getHighlights(res, mysql, context, complete){
        mysql.pool.query("SELECT highlightid, title FROM nfl_highlights", function(error, results, fields){
            if(error){
                res.write(JSON.stringify(error));
                res.end();
            }
            context.highlights  = results;
            complete();
        });
    }

    function getPlayerHighlights(res, mysql, context, complete){
        mysql.pool.query("SELECT ph.phid, p.fname, p.lname, h.title, ph.year FROM nfl_players p INNER JOIN nfl_playerHighlights ph ON ph.playerid = p.playerid INNER JOIN nfl_highlights h ON h.highlightid = ph.highlightid", function(error, results, fields){
            if(error){
                res.write(JSON.stringify(error));
                res.end();
            }
            context.playerHighlights  = results;
            complete();
        });
    }

    function getPlayers(res, mysql, context, complete){
        mysql.pool.query("SELECT playerid, fname, lname FROM nfl_players", function(error, results, fields){
            if(error){
                res.write(JSON.stringify(error));
                res.end();
            }
            context.players = results;
            complete();
        });
    }


    /*Display all positions*/

    router.get('/', function(req, res){
        var callbackCount = 0;
        var context = {};
        context.jsscripts = ["deletehighlight.js", "deleteplayerhighlight.js"];
        
        var mysql = req.app.get('mysql');
        getHighlights(res, mysql, context, complete);
        getPlayers(res, mysql, context, complete);
        getPlayerHighlights(res, mysql, context, complete);
        function complete(){
            callbackCount++;
            if(callbackCount >= 3){
                res.render('highlights', context);
            }

        }
    });
    
    /* Adds a stadium, redirects to the players page after adding */

    router.post('/', function(req, res){
        var mysql = req.app.get('mysql');
        var sql = "INSERT INTO nfl_highlights (title) VALUES (?)";
        var inserts = [req.body.title];
        sql = mysql.pool.query(sql,inserts,function(error, results, fields){
            if(error){
                res.write(JSON.stringify(error));
                res.end();
            }else{
                res.redirect('/highlights');
            }
        });
    });


    router.post('/update', function(req, res){
        var mysql = req.app.get('mysql');
        var sql = "INSERT INTO nfl_playerHighlights (playerid, highlightid, year) VALUES (?, ?, ?)";
        var inserts = [req.body.playerid, req.body.highlightid, req.body.year];
        sql = mysql.pool.query(sql,inserts,function(error, results, fields){
            if(error){
                res.write(JSON.stringify(error));
                res.end();
            }else{
                res.redirect('/highlights');
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

    router.delete('/:highlightid', function(req, res){
        var mysql = req.app.get('mysql');
        var sql = "DELETE FROM nfl_highlights WHERE highlightid = ?";
        var inserts = [req.params.highlightid];
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
    
    router.delete('/remove/:phid', function(req, res){
        var mysql = req.app.get('mysql');
        var sql = "DELETE FROM nfl_playerHighlights WHERE phid = ?";
        var inserts = [req.params.phid];
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