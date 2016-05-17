$(window).on("load", function () {
    //loadingHide();
});
$(document).ready(function () {

    // Android layout fix
    if (localStorage.os === "Android") {
        $('.navbar').attr('style', 'top: -10px !important');
        $('.banner').css("margin-top", "-11px");
        $('#toplogo').css("margin-top", "10px");
    }

    /*
     var onSuccess = function (position) {
     alert('Latitude: ' + position.coords.latitude + '\n' +
     'Longitude: ' + position.coords.longitude + '\n' +
     'Altitude: ' + position.coords.altitude + '\n' +
     'Accuracy: ' + position.coords.accuracy + '\n' +
     'Altitude Accuracy: ' + position.coords.altitudeAccuracy + '\n' +
     'Heading: ' + position.coords.heading + '\n' +
     'Speed: ' + position.coords.speed + '\n' +
     'Timestamp: ' + position.timestamp + '\n');
     };
     function onError(error) {
     alert('code: ' + error.code + '\n' +
     'message: ' + error.message + '\n');
     }
     navigator.geolocation.getCurrentPosition(onSuccess, onError);
     */
    /*
     function onSuccess(position) {
     $('#coord').html(position.coords.latitude + " x " + position.coords.longitude);
     }
     function onError(error) {
     alert('code: ' + error.code + '\n' +
     'message: ' + error.message + '\n');
     }
     var watchID = navigator.geolocation.watchPosition(onSuccess, onError, {timeout: 30000});
     */


    // Get data and fill
    getSession();

    // Global timer
    setInterval(function () {
        pageCheck();
    }, 300);

});

function pageRefresh() {
    var page = myApp.getCurrentView().activePage.name;
    var view = myApp.getCurrentView().container.id;
    var t = 0;
    // mulheres
    if (page === "index") {
        getPeople("f");
        t = 10000;
    }
    // homens
    if (page === "index-2") {
        getPeople("m");
        t = 10000;
    }
    // chat list
    if (page === "index-3") {
        getChatList();
        t = 7000;
    }
    // chat inner
    if (page === "messages") {
        getChat();
        t = 5000;
    }
    // run again
    if (t > 0) {
        pageRefreshRun(t);
    }

}
function pageRefreshRun(t) {
    pageRefreshTimer = setTimeout(function () {
        pageRefresh();
    }, t);
}
function pageCheck() {
    var page = myApp.getCurrentView().activePage.name;
    if (page !== sessionStorage.activePage) {
        sessionStorage.activePage = page;
        if (typeof pageRefreshTimer !== "undefined") {
            clearInterval(pageRefreshTimer);
        }
        pageRefresh();
        console.log("change page to " + page);
    }
}
function getSession() {
    //
    debug();
    //
    $("[data-session-key]").each(function (index) {
        var key = $(this).attr("data-session-key");
        var type = $(this).attr("data-session-type");
        var attr = $(this).attr("data-session-attr");

        if (type === "html") {
            $(this).html(sessionStorage[key]);
        }
        if (type === "css") {
            $(this).css(attr, sessionStorage[key]);
        }
        if (type === "attr") {
            $(this).attr(attr, sessionStorage[key]);
        }
        if (type === "value") {
            $(this).attr(attr, sessionStorage[key]);
        }
    });

}

$$(document).on('click', 'a.tab-link', function (e) {
    var href = $(this).attr("href");
    $('.toolbar-inner a[href="' + href + '"]').addClass("active");
});

$$(document).on('pageBeforeInit', '*', function (e) {
    $('#toolbar').show();
    getSession();
});

$$(document).on('pageBack', '*', function (e) {
    $('#toolbar').show(); // back from messages
});

myApp.onPageInit('*', function (page) {
    //
});