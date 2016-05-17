
function getPeople(gender) {
    //
    debug();
    //
    //if (halt(true))
    //    return;
    var fN = fName();
    //
    if ($('.' + gender).length === 0) { // primeira vez
        $('#loadingPeople_' + gender).show();
    }
    $.ajax({
        url: localStorage.server + "/getpeople.json.php",
        data: {
            'user_id': localStorage.user_id,
            'loc_id': sessionStorage.loc_id,
            'gender': gender
        },
        type: 'GET',
        dataType: 'jsonp',
        jsonp: 'callback',
        timeout: 10000
    })
            .always(function () {
                s.removeItem(fN); // halt
                $('#loadingPeople_' + gender).hide();
            })

            .fail(function () {
                myApp.alert('Desculpe, verifique sua conexão e tente novamente.', 'Erro');
            })

            .done(function (res) {

                if (res !== null) {

                    if (res.error) {
                        myApp.alert('Desculpe, ocorreu um erro interno.' + res.error, 'Erro');
                        return;
                    }

                    if (typeof res.length !== "undefined") {
                        console.log(res.length + " results");
                    }

                    // construct
                    var x = 0;
                    var html = '<div class="row">';
                    $.each(res, function (i, item) {
                        //console.log(res[i].nome);
                        x++;
                        if (x === 3) {
                            html += '</div><div class="row">'; // row
                            x = 0;
                        }
                        var age = getAge(res[i].birthday);
                        html += '<div class="' + gender + ' showProfile online-block col-50" data-nome="' + res[i].first_name + '" data-email="' + res[i].email + '" data-age="' + age + '" data-work="' + res[i].work + '" data-sobre="' + res[i].about + '" data-fb="' + res[i].id_fb + '">';
                        html += '<a href="#"><div class="online-border round">';
                        html += '<div class="online-img round" style="background-image:url(https://graph.facebook.com/' + res[i].id_fb + '/picture?type=large);">';
                        html += '</div>';
                        html += '</div>';
                        html += '<div>' + res[i].first_name + '</div>';
                        html += '</a></div>';
                        if (res.length === parseInt(i + 1)) {
                            //console.log("aaa");
                            html += '</div>'; // row
                        }
                    });
                    $('#getPeople_' + gender).html(html);

                } // res not null
            }); // after ajax
}

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

