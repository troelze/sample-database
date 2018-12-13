function deleteHighlight(highlightid){
    $.ajax({
        url: '/highlights/' + highlightid,
        type: 'DELETE',
        success: function(result){
            window.location.reload(true);
        }
    })
};

