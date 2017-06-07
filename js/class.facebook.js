//==============================================
// FACEBOOK API
//==============================================
$(function () {
    $.ajaxSetup({
        error: function (jqXHR, exception) {
            if (jqXHR.status === 0) {
                alert('Not connect.\n Verify Network.');
            } else if (jqXHR.status == 404) {
                alert('Requested page not found. [404]');
            } else if (jqXHR.status == 500) {
                alert('Internal Server Error [500].');
            } else if (exception === 'parsererror') {
                alert('Requested JSON parse failed.');
            } else if (exception === 'timeout') {
                alert('Time out error.');
            } else if (exception === 'abort') {
                alert('Ajax request aborted.');
            } else {
                alert('Uncaught Error.\n' + jqXHR.responseText);
            }
        }
    });
});
function getPathFromUrl(url) {
    return url.split(/[?#]/)[0];
}
serialize = function (obj, prefix) {
    var str = [], p;
    for (p in obj) {
        if (obj.hasOwnProperty(p)) {
            var k = prefix ? prefix + "[" + p + "]" : p, v = obj[p];
            str.push((v !== null && typeof v === "object") ?
                    serialize(v, k) :
                    encodeURIComponent(k) + "=" + encodeURIComponent(v));
        }
    }
    return str.join("&");
};
function userFbSend(userdata) {

    //myApp.showIndicator();

    var teste = userdata.user_fb_pic;
    userdata = {};
    //userdata.user_email = "teste@teste.com";
    userdata.teste = teste;
    var data = serialize(userdata);
    alert(data);

    // RUN AJAX
    $.ajax({
        url: localStorage.server + "/user_facebook.php?" + data,
        //data: userdata,
        type: 'GET',
        async: false,
        dataType: 'jsonp',
        jsonp: 'callback',
        timeout: localStorage.timeout
    })
            .always(function () {
                myApp.hideIndicator();
            })

            .fail(function () {
                myApp.alert("Ocorreu um erro ao cadastrar sua conta com o facebook.");
                return;
            })

            .done(function (res) {

                if (res !== null) {

                    if (res.error) {
                        errorCheck(res.error);
                        return;
                    }
                    if (res.id > 0) {
                        localStorage.fb_id = userdata.user_fb;
                        localStorage.user_id = res.id;
                        localStorage.user_email = userdata.user_email;
                        localStorage.user_pass = userdata.user_fb_token;

                        if (res.user_name) {
                            // ja possui user_name
                            window.location.href = "index.html";
                        } else {
                            // nao possui
                            go("user_name.html");
                        }
                    }

                } // res not null
            }); // after ajax
    return false;
}

var fb = {
    login: function () {

        myApp.showIndicator();

        // get status 1st
        //facebookConnectPlugin.getLoginStatus(function (response) {

        facebookConnectPlugin.login(['email', 'public_profile', 'user_birthday'], function (result) {

            //alert("fb.login() = " + JSON.stringify(result));
            /*localStorage.fb_id = result.authResponse.userID;
             localStorage.fb_status = 'connected';*/

            localStorage.fb_token = result.authResponse.accessToken;

            //facebookConnectPlugin.api("/me?fields=id,birthday,gender,first_name,middle_name,age_range,last_name,name,picture.width(400),email", [],
            facebookConnectPlugin.api("/me?fields=id,email,first_name,middle_name,last_name,picture.width(400)", [],
                    function (result) {

                        var email, gender, pic;

                        if (typeof result.email !== "undefined") {
                            email = result.email;
                        } else {
                            email = result.id;
                        }

                        if (result.gender) {
                            gender = result.gender;
                        } else {
                            gender = "";
                        }

                        if (result.picture.data.url) {
                            pic = result.picture.data.url;
                        } else {
                            pic = "";
                        }

                        var userdata = {
                            user_fb: result.id,
                            user_pass: localStorage.fb_token,
                            user_email: email,
                            user_gender: gender,
                            user_fullname: result.first_name + " " + result.last_name,
                            user_fb_pic: pic,
                            user_fb_token: localStorage.fb_token
                        };

                        myApp.hideIndicator();

                        setTimeout(function () {
                            userFbSend(userdata);
                        }, 500);



                    },
                    function (error) {
                        alert("/me failed = " + JSON.stringify(error));
                        //myApp.hideIndicator();
                    });
            //
        }, function (err) {
            alert('an error occured while trying to login. please try again. Err: ' + JSON.stringify(err));
            //myApp.hideIndicator();
            if (typeof localStorage.fb_id !== "undefined") {
                alert("fb id ok: " + localStorage.fb_id);
            }
        });
    },
    /*,
     getUserInfo: function () {
     //facebookConnectPlugin.api(localStorage.fb_id + "/?fields=id,email,first_name,last_name,gender,picture,birthday", ["public_profile", "user_birthday"],
     facebookConnectPlugin.api("/me", ["public_profile"],
     function (result) {
     alert("fb.getUserInfo() = " + JSON.stringify(result));
     localStorage.fb_id = result.id;
     localStorage.fb_first_name = result.first_name;
     localStorage.fb_last_name = result.last_name;
     localStorage.fb_gender = result.gender;
     localStorage.fb_email = result.email;
     localStorage.fb_birthday = result.birthday;
     //alert(localStorage.fb_email);
     },
     function (error) {
     alert("Failed: " + error);
     });
     },
     
     getLoginStatusX: function () {
     
     facebookConnectPlugin.getLoginStatus(
     function (response) {
     
     alert("fb.getLoginStatusX() = " + JSON.stringify(response));
     localStorage.fb_status = response.status;
     if (response.status === 'connected') {
     var uid = response.authResponse.userID;
     var accessToken = response.authResponse.accessToken;
     localStorage.fb_id = result.authResponse.userID;
     localStorage.fb_token = result.authResponse.accessToken;
     alert("AUTH OK");
     //return "OK MESMO";
     } else if (response.status === 'not_authorized') {
     alert("NOT AUTH");
     } else {
     alert("NOG LOGGED");
     }
     },
     function (error) {
     alert("Failed: " + error);
     });
     
     },
     getLoginStatus: function () {
     
     facebookConnectPlugin.getLoginStatus(function (response) {
     
     //alert("fb.getLoginStatus() = ");
     localStorage.fb_status = response.status;
     
     if (response.status === 'connected') {
     var uid = response.authResponse.userID;
     var accessToken = response.authResponse.accessToken;
     localStorage.fb_id = result.authResponse.userID;
     localStorage.fb_token = result.authResponse.accessToken;
     alert("AUTH OK");
     //return "OK MESMO";
     } else if (response.status === 'not_authorized') {
     alert("NOT AUTH");
     } else {
     alert("NOG LOGGED");
     }
     });
     }*/
    logout: function () {
        facebookConnectPlugin.logout(
                function () {
                    localStorage.removeItem("user_id");
                    window.location.href = "index.html";
                },
                function () {
                    //alert("logout error");
                });
    }

};
