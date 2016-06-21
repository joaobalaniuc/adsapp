
$$(document).on('change', "#userName", function (e) {
    sessionStorage.userName = $("#userName").val();

    $.ajax({
        url: localStorage.server + "/updateProfile.json.php",
        data: {
            'num': localStorage.userNum,
            'value': sessionStorage.userName,
            'table': "nick"
        },
        type: 'GET',
        dataType: 'jsonp',
        jsonp: 'callback',
        timeout: 7000
    })
            .always(function () {
                //myApp.hideIndicator();
            })

            .fail(function () {
                //myApp.alert('Desculpe, nosso servidor está em manutenção.', 'Ops!');
            })

            .done(function (res) {
                console.log(res);
                if (res !== null) {
                    if (res.error) {
                        myApp.alert('Desculpe, ocorreu um erro interno = ' + localStorage.server + "," + localStorage.userNum + "," + sessionStorage.userName + "," + res.error, 'Erro');
                        return;
                    }
                    if (res.success) {
                        localStorage.userName = sessionStorage.userName;
                    }
                }
            });
});
$$(document).on('change', "#userStatus", function (e) {
    sessionStorage.userStatus = $("#userStatus").val();

    console.log(sessionStorage.userStatus);

    $.ajax({
        url: localStorage.server + "/updateProfile.json.php",
        data: {
            'num': localStorage.userNum,
            'value': sessionStorage.userStatus,
            'table': "bio"
        },
        type: 'GET',
        dataType: 'jsonp',
        jsonp: 'callback',
        timeout: 7000
    })
            .always(function () {
                //myApp.hideIndicator();
            })

            .fail(function () {
                //myApp.alert('Desculpe, nosso servidor está em manutenção.', 'Ops!');
            })

            .done(function (res) {
                console.log(res);
                if (res !== null) {
                    if (res.error) {
                        myApp.alert('Desculpe, ocorreu um erro interno.' + res.error, 'Erro');
                        return;
                    }
                    if (res.success) {
                        localStorage.userStatus = sessionStorage.userStatus;
                    }
                }
            });
});

function profileConstruct(res) {
    if (res.nick) {
        localStorage.userName = res.nick;
    }
    if (res.id) {
        localStorage.userId = res.id;
    }
    if (res.bio) {
        localStorage.userStatus = res.bio;
    }
    if (res.id_fb) {
        localStorage.fb_id = res.id_fb;
    }
}
function profileFbUpdate(fb_id, action) {
    $.ajax({
        url: localStorage.server + "/updateFb.json.php",
        data: {
            'num': localStorage.userNum,
            'fb_id': fb_id,
            'action': action
        },
        type: 'GET',
        dataType: 'jsonp',
        jsonp: 'callback',
        timeout: 7000
    })
            .always(function () {
                //myApp.hideIndicator();
            })

            .fail(function () {
                //myApp.alert('Desculpe, nosso servidor está em manutenção.', 'Ops!');
            })

            .done(function (res) {
                console.log(res);
                if (res !== null) {
                    if (res.error) {
                        myApp.alert('Desculpe, ocorreu um erro ao sincronizar seu ID do facebook com nossos servidores. #' + res.error, 'Erro');
                        return;
                    }
                    if (res.success) {
                        if (action === "out") {
                            localStorage.removeItem("fb_id");
                        }
                        else {
                            localStorage.fb_id = sessionStorage.fb_id;
                        }
                    }
                }
            });
}
function profileLoad() {
    $('#userName').val(localStorage.userName);
    if (typeof localStorage.userStatus !== "undefined") {
        $('#userStatus').val(localStorage.userStatus);
    }
    profileFb();
}
function profileFb() {

    var fb_id;

    if (typeof localStorage.fb_id === "undefined") {
        if (typeof sessionStorage.fb_id !== "undefined") {
            fb_id = sessionStorage.fb_id;
        }
    }
    else {
        fb_id = localStorage.fb_id;
        sessionStorage.fb_id = fb_id;
    }
    if (typeof fb_id !== "undefined") {
        $('#FbOut').show();
        $('#FbIn').hide();
        $('#profileImg').show();
        $('#profileImgBg').css("background-image", "url(https://graph.facebook.com/" + localStorage.fb_id + "/picture?type=large)");
        $('#profileImgFront').attr("src", "https://graph.facebook.com/" + localStorage.fb_id + "/picture?type=large");
    }
    else {
        $('#FbOut').hide();
        $('#FbIn').show();
        $('#profileImg').hide();
    }
}