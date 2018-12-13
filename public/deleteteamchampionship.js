function deleteTeamChampionship(tcid){
    $.ajax({
        url: '/championships/remove/' + tcid,
        type: 'DELETE',
        success: function(result){
            window.location.reload(true);
        }
    })
};