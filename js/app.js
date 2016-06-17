//--------------------------------------------
// INICIAR DISPOSITIVO
//--------------------------------------------
function start() {

    // App config
    var version = '1.0.0';

    // Server
    localStorage.server = "http://sempreon.mobi/adsapp/";

    // Dev
    sessionStorage.debug = 1;
    sessionStorage.activePage = "";

    // Defaults
    localStorage.LAST_CHAT_ID = 0; // id(server) of last general msg
    localStorage.LAST_CHAT_ID_ACTIVE = 0; // id(local) of last msg from active chat only
    

    // Database
    if (localStorage.version !== version) {
        localStorage.version = version;
        // db
        localStorage.dbShort = 'Jowi';
        localStorage.dbVersion = '1.0';
        localStorage.dbName = 'Jowi';
        localStorage.dbMaxSize = 65536;
        //alert("new version, create db");

    }
    dbOpen();
    dbCreate();
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
        console.log("ready0");
        app.receivedEvent('deviceready');
        // SPLASHSCREEN (CONFIG.XML BUGFIX)
        setTimeout(function () {
            navigator.splashscreen.hide();
        }, 1000);
        start();
        setTimeout(function () {
            //simulateContact();
        }, 1000);
        //getContact();

        console.log("ready1");
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
