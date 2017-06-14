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
function photoUpload(array, n) {

    if (typeof n === "undefined") {
        var n = 0;
    }
    // end of upload
    if (n > 5 || typeof array[n] === "undefined") {
        window.location.href = "index.html";
        return;
    }

    var imageURI = array[n];
    // se =0, imagem não alterada
    if (imageURI === 0) {
        n = parseInt(n + 1);
        photoUpload(array, n);
        return;
    }

    myApp.showIndicator();
    // file data
    var options = new FileUploadOptions();
    options.fileKey = "file";
    options.fileName = imageURI.substr(imageURI.lastIndexOf('/') + 1);
    options.mimeType = "image/jpeg";
    // user data
    var params = new Object();
    params.user_id = localStorage.user_id;
    params.user_email = localStorage.user_email;
    params.user_pass = localStorage.user_pass;
    params.post_id = sessionStorage.post_id; // postSend()...
    params.img_pos = n;
    options.params = params;
    options.chunkedMode = false;
    // transfer
    var ft = new FileTransfer();
    ft.upload(imageURI, localStorage.server + "/upload.php", function (result) {
        myApp.hideIndicator();
        //alert("ok=" + JSON.stringify(result));
        n = parseInt(n + 1);
        photoUpload(array, n);
    }, function (error) {
        myApp.hideIndicator();
        //alert("err=" + JSON.stringify(error));
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
        for (x = 0; x <= 5; x++) {
            var $el = $('#camera_sort li').eq(x);
            if ($el.css("background-image") === "none") {
                $el.css({"background-image": "url(" + imageURI + ")"});
                $el.attr("data-upload", imageURI);
                $el.removeClass("ui-state-disabled");
                $el.find("i").removeClass("fa-plus-circle").addClass("fa-times-circle");
                return;
            }
        }
    }
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

//============================
// POST_FORM
//============================
function postUpload() {
    var x;
    var arr = [];
    for (x = 0; x <= 5; x++) {
        var $el = $('#camera_sort li').eq(x);
        var fn = $el.attr("data-upload");
        if (typeof fn !== "undefined") {
            arr.push(fn);
        } else {
            arr.push(0);
        }
    }
    alert(JSON.stringify(arr));
    photoUpload(arr);
}
$$(document).on('click', '.ui-state-disabled', function (e) {
    photoOptions();
});
$$(document).on('click', '#camera_sort .fa-times-circle', function (e) {
    var $el = $(this).closest("li");
    $el.fadeOut("fast", function () {
        $('#camera_sort').append('<li class="ui-state-disabled ui-state-default"><div><i class="fa fa-plus-circle"></i></div></li>');
        $el.remove();
    });
});