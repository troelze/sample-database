function deleteUniform(uniformid){
    $.ajax({
        url: '/uniforms/remove/' + uniformid,
        type: 'DELETE',
        success: function(result){
            window.location.reload(true);
        }
    })
};
