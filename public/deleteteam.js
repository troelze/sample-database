function deleteTeam(teamid){
    $.ajax({
        url: '/teams/' + teamid,
        type: 'DELETE',
        success: function(result){
            window.location.reload(true);
        }
    })
};