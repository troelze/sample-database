function deletePlayerHighlight(phid){
    $.ajax({
        url: '/highlights/remove/' + phid,
        type: 'DELETE',
        success: function(result){
            window.location.reload(true);
        }
    })
};