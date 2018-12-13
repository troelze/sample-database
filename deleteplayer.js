function deletePlayer(playerid){
    $.ajax({
        url: '/players/' + playerid,
        type: 'DELETE',
        success: function(result){
            window.location.reload(true);
        }
    })
};