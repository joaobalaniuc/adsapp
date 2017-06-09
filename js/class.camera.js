function photoGet(gallery) {
    var type, cb;
    if (typeof gallery === "undefined") {
        type = navigator.camera.PictureSourceType.PHOTOLIBRARY
    } else {
        type = navigator.camera.PictureSourceType.CAMERA
    }
    navigator.camera.getPicture(photoAdd, function (message) {
        //alert('get picture failed');
    }, {
        destinationType: navigator.camera.DestinationType.FILE_URI,
        sourceType: type,
        quality: 50,
        allowEdit: true,
        targetWidth: 600,
        targetHeight: 600,
        saveToPhotoAlbum: true,
        popoverOptions: true
    });
}
function photoUpload(imageURI) {
    myApp.showPreloader();
    var options = new FileUploadOptions();
    options.fileKey = "file";
    options.fileName = imageURI.substr(imageURI.lastIndexOf('/') + 1);
    options.mimeType = "image/jpeg";
    //alert(JSON.stringify(options.fileName));
    var params = new Object();

    // user data
    params.user_id = localStorage.user_id;
    params.user_email = localStorage.user_email;
    params.user_pass = localStorage.user_pass;
    options.params = params;
    options.chunkedMode = false;

    var ft = new FileTransfer();
    ft.upload(imageURI, localStorage.server + "/upload.php", function (result) {
        //myApp.hidePreloader();
        //alert(result);
        alert(JSON.stringify(result));
        postStart();
    }, function (error) {
        myApp.hidePreloader();
        alert(JSON.stringify(error));
    }, options);
}
function photoAdd(imageURI) {
    // active page
    if (sessionStorage.activePage !== "post_form") {
        sessionStorage.imageURI = imageURI;
        go("post_form.html");
    }
    // add photo
    else {
        var x;
        for (x = 0; x <= 6; x++) {
            var $el = $('#camera_sort li').eq(x);
            if ($el.css("background-image") === "none") {
                $el.css({"background-image": "url(" + imageURI + ")"});
                $el.removeClass("ui-state-disabled");
                $el.find("i").removeClass("fa-plus-circle").addClass("fa-times-circle");
                return;
            }
        }
    }
}
function photoDel(x) {

    $('#camera_sort li').eq(x).fadeOut("fast", function () {
        $('#camera_sort').append('<li class="ui-state-disabled ui-state-default"><div><i class="fa fa-plus-circle"></i></div></li>');
    });

}
function photoOptions() {
    myApp.actions([
        [
            {
                text: 'Escolha uma opção',
                label: true
            },
            {
                text: 'CÂMERA',
                bold: true,
                color: "pink",
                onClick: function () {
                    photoGet(true);
                }
            },
            {
                text: 'GALERIA DE FOTOS',
                bold: true,
                color: "pink",
                onClick: function () {
                    photoGet();
                }
            }
        ],
        [
            {
                text: 'Cancelar',
                bold: false
            }
        ]
    ]);
}

$$('.photoGet').on('click', function () {
    photoOptions();
});
$$(document).on('click', '.ui-state-disabled', function (e) {
    photoOptions();
});