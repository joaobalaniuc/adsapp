//========================================
// SEND PIC IFRAME
//========================================
$(function () {

    if (typeof localStorage.user_id === "undefined") {
        return;
    }

    var usr = "?user_id=" + localStorage.user_id + "&user_email=" + localStorage.user_email + "&user_pass=" + localStorage.user_pass;

    //postStart();

    /*$("iframe").attr("src", localStorage.server + "/app/" + usr);

    $("iframe").load(function (e) {

        $("#camera-loading").fadeOut("fast", function () {
            $("#camera").fadeIn("fast");
        });*/

        //myApp.showIndicator();


    /*});*/

});

// TRASH....
$$(document).on('click', '.postShow', function (e) {
    view2.router.loadPage('post.html', {ignoreCache: true});
});

$$(document).on('click', '.showProfile', function (e) {
    sessionStorage.profileEmail = $(this).attr("data-email");
    sessionStorage.profileNome = $(this).attr("data-nome");
    sessionStorage.profileIdade = $(this).attr("data-age");
    sessionStorage.profileProfissao = $(this).attr("data-profissao");
    sessionStorage.profileSobre = $(this).attr("data-sobre");
    sessionStorage.profileImg = "https://graph.facebook.com/" + $(this).attr("data-fb") + "/picture?type=large";

    //console.log(sessionStorage);
    var v = myApp.getCurrentView().selector.replace("#", "");

    if (v === "view-1") {
        view1.router.loadPage('quickie_profile.html', {ignoreCache: true});
    }
    if (v === "view-2") {
        view2.router.loadPage('quickie_profile.html', {ignoreCache: true});
    }

});

$$(document).on('pageBeforeInit', '[data-page="welcome"]', function (e) {
    $('#toolbar').hide();
});
