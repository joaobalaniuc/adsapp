$$(document).on('click', '.post', function (e) {
    //alert(1);
    view3.router.loadPage('post.html', {ignoreCache: true});
});

$$(document).on('click', '#postImg', function (e) {
    getImage();
});

$$(document).on('click', '#postSend', function (e) {
    
});
