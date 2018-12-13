function deleteChampionship(championshipid){
    $.ajax({
        url: '/championships/' + championshipid,
        type: 'DELETE',
        success: function(result){
            window.location.reload(true);
        }
    })
};