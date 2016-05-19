$$(document).on('click', '.post', function (e) {
    //alert(1);
    view3.router.loadPage('post.html', {ignoreCache: true});
});

$$(document).on('click', '#sendpic', function (e) {
    getImage();
});

$$(document).on('click', '#fb', function (e) {
    alert(1);
    fb.post();
});