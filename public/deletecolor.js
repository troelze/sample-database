function deleteColor(colorid){
    $.ajax({
        url: '/uniforms/' + colorid,
        type: 'DELETE',
        success: function(result){
            window.location.reload(true);
        }
    })
};
