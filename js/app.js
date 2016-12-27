//--------------------------------------------
// INICIAR DISPOSITIVO
//--------------------------------------------
function start() {

    // App config
    localStorage.appname = "AdsApp";
    localStorage.version = "1.0.0";

    // Server
    localStorage.server = "http://dev.house/adsapp/";
    localStorage.server_img = "/app/upload/";

    // Dev
    sessionStorage.debug = 1;
    sessionStorage.activePage = "";

    // Ajax timeout
    localStorage.timeout = 5000; // ajax
}

var app = {
// Application Constructor
    initialize: function () {
        this.bindEvents();
    },
    // Bind Event Listeners
    //
    // Bind any events that are required on startup. Common events are:
    // 'load', 'deviceready', 'offline', and 'online'.
    bindEvents: function () {
        document.addEventListener('deviceready', this.onDeviceReady, false);
        document.addEventListener("online", onOnline, false);
        function onOnline() {
            sessionStorage.online = true;
        }
        document.addEventListener("offline", onOffline, false);
        function onOffline() {
            sessionStorage.online = false;
        }


    },
    // deviceready Event Handler
    //
    // The scope of 'this' is the event. In order to call the 'receivedEvent'
    // function, we must explicitly call 'app.receivedEvent(...);'
    onDeviceReady: function () {

        app.receivedEvent('deviceready');

        // BACK BUTTON INDEX
        document.addEventListener("backbutton", function (e) {
            if (sessionStorage.activePage == "index") {
                e.preventDefault();
            }
        }, false);



        // SPLASHSCREEN (CONFIG.XML BUGFIX)
        setTimeout(function () {
            navigator.splashscreen.hide();
            //StatusBar.hide();
        }, 1000);
        start();
    }
    ,
    // Update DOM on a Received Event
    receivedEvent: function (id) {
        /*var parentElement = document.getElementById(id);
         var listeningElement = parentElement.querySelector('.listening');
         var receivedElement = parentElement.querySelector('.received');
         listeningElement.setAttribute('style', 'display:none;');
         receivedElement.setAttribute('style', 'display:block;');*/
        console.log('Received Event: ' + id);
    }
};
