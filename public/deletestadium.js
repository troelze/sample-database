function deleteStadium(stadiumid){
    $.ajax({
        url: '/stadiums/' + stadiumid,
        type: 'DELETE',
        success: function(result){
            window.location.reload(true);
        }
    })
};