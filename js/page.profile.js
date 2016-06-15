
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
                        myApp.alert('Desculpe, ocorreu um erro interno.' + res.error, 'Erro');
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

function loadProfile() {
    $('#userName').val(localStorage.userName);
    if (typeof localStorage.userStatus !== "undefined") {
        $('#userStatus').val(localStorage.userStatus);
    }
}