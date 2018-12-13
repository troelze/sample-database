function deletePlayer(playerid){
    $.ajax({
        url: '/players/' + playerid,
        type: 'DELETE',
        statusCode : {
            200: function(result){
                alert("Canot");
                window.location.reload(true);
            },
            202: function(result){
                window.location.reload(true);
            }
           
        }
    })
};