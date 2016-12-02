//========================================
// SEND PIC IFRAME
//========================================
$(function () {

    if (typeof localStorage.user_id === "undefined") {
        return;
    }

    var usr = "?user_id=" + localStorage.user_id + "&user_email=" + localStorage.user_email + "&user_pass=" + localStorage.user_pass;

    /*$("iframe").attr("src", localStorage.server + "/app/" + usr);

    $("iframe").load(function (e) {

        $("#camera-loading").fadeOut("fast", function () {
            $("#camera").fadeIn("fast");
        });*/

        //myApp.showIndicator();
        $.ajax({
            url: localStorage.server + "/img_last.php",
            data: {
                'user_id': localStorage.user_id,
                'user_email': localStorage.user_email,
                'user_pass': localStorage.user_pass
            },
            type: 'GET',
            dataType: 'jsonp',
            jsonp: 'callback',
            timeout: 10000
        })
                .always(function () {
                    myApp.hideIndicator();
                    userAds(localStorage.user_id, userAdsCb_Me);
                })

                .fail(function () {
                    myApp.alert("Falha na conexão.", "Ops!")
                })

                .done(function (res) {

                    console.log("iframe.loaded. result:");
                    console.log(res);

                    if (res !== null) {

                        if (res.error) {
                            myApp.alert('Desculpe, ocorreu um erro interno. ' + res.error, 'Erro');
                            return;
                        }

                        if (res !== false) {
                            sessionStorage.img_last = res[0]["img_fn"];
                            go("post_form.html");
                        }
                    } // res not null
                }); // after ajax

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
