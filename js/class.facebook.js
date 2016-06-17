//==============================================
// FACEBOOK API
//==============================================

var fb = {
    post: function () {
        facebookConnectPlugin.showDialog(
                {
                    method: "feed",
                    picture: 'https://www.google.co.jp/logos/doodles/2014/doodle-4-google-2014-japan-winner-5109465267306496.2-hp.png',
                    name: 'Test Post',
                    message: 'First photo post',
                    caption: 'Testing using phonegap plugin',
                    description: 'Posting photo using phonegap facebook plugin'
                },
        function (response) {
            alert(JSON.stringify(response));
        },
                function (response) {
                    alert(JSON.stringify(response));
                });
    },
    login: function () {
        facebookConnectPlugin.login(["email", "public_profile"], function (result) {
            //alert(":) fb.login() = " + JSON.stringify(result));
            //---
            // nesta altura guardar id em session...
            // profilefpupdate() guardará em local
            //---
            sessionStorage.fb_id = result.authResponse.userID;
            localStorage.fb_token = result.authResponse.accessToken;
            localStorage.fb_status = 'connected';
            // updates
            profileFb(); // frontend
            profileFbUpdate(sessionStorage.fb_id, "in"); // database
            // get rest of data
            this.getUserInfo();
        }, function (err) {
            alert('an error occured while trying to login. please try again. Err:' + enc(err));
        });
    },
    getUserInfo: function () {
        facebookConnectPlugin.api(localStorage.fb_id + "/?fields=id,email,first_name,last_name,gender,picture,birthday", ["public_profile", "user_birthday"],
                function (result) {
                    alert(":) fb.getUserInfo() = " + JSON.stringify(result));
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
    getLoginStatus: function () {

        facebookConnectPlugin.getLoginStatus(function (response) {
            alert(":) fb.getLoginStatus() = " + JSON.stringify(response));
            localStorage.fb_status = response.status;

            if (response.status === 'connected') {
                var uid = response.authResponse.userID;
                var accessToken = response.authResponse.accessToken;
                localStorage.fb_id = result.authResponse.userID;
                localStorage.fb_token = result.authResponse.accessToken;
                //alert("AUTH OK");
                //return "OK MESMO";
            } else if (response.status === 'not_authorized') {
                //alert("NOT AUTH");
            } else {
                //alert("NOG LOGGED");
            }
        });
    },
    logout: function () {
        facebookConnectPlugin.logout(
                function () {
                    localStorage.removeItem("fb_id");
                    sessionStorage.removeItem("fb_id");
                    profileFb();
                    profileFbUpdate(sessionStorage.fb_id, "out");
                    //alert(":) logout ok");
                },
                function () {
                    alert(":( logout error");
                });
    }
};
