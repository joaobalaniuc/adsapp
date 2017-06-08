function getImage(gallery) {
    var type, cb;
    if (typeof gallery === "undefined") {
        type = navigator.camera.PictureSourceType.PHOTOLIBRARY
    } else {
        type = navigator.camera.PictureSourceType.CAMERA
    }
    navigator.camera.getPicture(showImage, function (message) {
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
function uploadImage(imageURI) {
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
function showImage(imageURI) {
    if (sessionStorage.activePage !== "post_form") {
        go("post_form.html");
    } else {
        //$("#postCamera").css("background-image", "url(" + imageURI + ")");
        //$("#index-3 [name='fn']").val(imageURI);
    }
}
$$('#camera').on('click', function () {
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
                    getImage(true);
                }
            },
            {
                text: 'GALERIA DE FOTOS',
                bold: true,
                color: "pink",
                onClick: function () {
                    getImage();
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
});
