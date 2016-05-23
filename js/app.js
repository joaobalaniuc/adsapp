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
        console.log("ready0");

        app.receivedEvent('deviceready');

        // SPLASHSCREEN (CONFIG.XML BUGFIX)
        setTimeout(function () {
            navigator.splashscreen.hide();
        }, 1000);
        start();

        fb.getLoginStatus();

        var fields = ['displayName', 'name', 'phoneNumbers'];
        navigator.contacts.find(fields, contactSuccess, contactError, {filter: "", multiple: true});

        var cSort = function (a, b) {
            aName = a.lastName + ' ' + a.firstName;
            bName = b.lastName + ' ' + b.firstName;
            return aName < bName ? -1 : (aName == bName ? 0 : 1);
        };
        function contactSuccess(contacts) {
            contacts = contacts.sort(cSort);
            var contact_name;
            var contact_phone;
            for (i = 0; i < contacts.length; i++) {
                if (contacts[i].name.formatted != null && contacts[i].name.formatted != undefined) {
                    contact_name = contacts[i].name.formatted;
                    contact_name = contact_name.replace(/'/g, "''");
                    if (contacts[i].phoneNumbers != null && contacts[i].phoneNumbers.length > 0 && contacts[i].phoneNumbers[0].value != null && contacts[i].phoneNumbers[0].value != undefined) {
                        contact_phone = contacts[i].phoneNumbers[0].value;
                        console.log(contact_name + "=" + contact_phone);
                    } else {
                        console.log("--No Number-");
                        contact_phone = "";
                    }
                }
            }
        }
        ;
        function contactError(error) {
            alert(error);
        }
        ;

        console.log("ready1");
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
