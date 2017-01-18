function share(message, subject, img, url, title) {
    alert(1);
    // this is the complete list of currently supported params you can pass to the plugin (all optional) 
    var options = {
        message: 'share this', // not supported on some apps (Facebook, Instagram) 
        subject: 'the subject', // fi. for email 
        //files: ['', ''], // an array of filenames either locally or remotely 
        files: ['http://www.sempreon.mobi/images/mayconn.png'], // an array of filenames either locally or remotely 
        url: 'https://www.website.com/foo/#bar?a=b',
        chooserTitle: 'Pick an app' // Android only, you can override the default share sheet title 
    };

    var onSuccess = function (result) {
        alert("Share completed? " + result.completed); // On Android apps mostly return false even while it's true 
        alert("Shared to app: " + result.app); // On Android result.app is currently empty. On iOS it's empty when sharing is cancelled (result.completed=false) 
    };

    var onError = function (msg) {
        alert("Sharing failed with message: " + msg);
    };

    window.plugins.socialsharing.shareWithOptions(options, onSuccess, onError);
}