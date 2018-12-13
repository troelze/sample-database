function deletePosition(positionid){
    $.ajax({
        url: '/positions/' + positionid,
        type: 'DELETE',
        success: function(result){
            window.location.reload(true);
        }
    })
};