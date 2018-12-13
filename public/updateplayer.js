function updatePlayer(playerid){
    $.ajax({
        url: '/players/' + playerid,
        type: 'PUT',
        data: $('#update-player').serialize(),
        success: function(result){
            window.location.replace("http://flip3.engr.oregonstate.edu:6530/players");
        }
    })
};