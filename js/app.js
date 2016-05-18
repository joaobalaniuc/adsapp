//--------------------------------------------
// INICIAR DISPOSITIVO
//--------------------------------------------
function start() {
    // App config
    localStorage.server = "http://nickford.com.br/quickie/";
    //localStorage.server = "http://www.nickford.com.br/quickie/";
    //localStorage.server = "http://localhost/quickie/server/";
    localStorage.user_id = 1;
    localStorage.session_id = 1;
    localStorage.session_startdate = "2016-04-11 12:00";
    //
    sessionStorage.debug = 1;
    sessionStorage.activePage = "";
    sessionStorage.lastchat = 0; // last msg id (#index-3)
    sessionStorage.lastchat_inner = 0; // (#messages)
    //
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
        
        // SPLASHSCREEN (CONFIG.XML BUGFIX)
        setTimeout(function () {
            navigator.splashscreen.hide();
        }, 1000);

        start();
        
        fb.getLoginStatus();

        var fn = location.pathname.substring(location.pathname.lastIndexOf("/") + 1);
        app.ready(fn);
    },
    // Update DOM on a Received Event
    ready: function (fn) {
        switch (fn) {
            //===============================
            // INDEX.HTML
            //===============================
            case "index.html":
                //
                break;
        }
    },
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
