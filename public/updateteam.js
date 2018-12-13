function updateTeam(teamid){
    $.ajax({
        url: '/teams/' + teamid,
        type: 'PUT',
        data: $('#update-team').serialize(),
        success: function(result){
            window.location.replace("http://flip3.engr.oregonstate.edu:6530/teams");
        }
    })
};