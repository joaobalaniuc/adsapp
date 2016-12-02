function getImage() {
  //alert("call camera");
      navigator.camera.getPicture(uploadPhoto, function(message) {
      //alert('get picture failed');
      }, {
      destinationType: navigator.camera.DestinationType.FILE_URI,
      //sourceType: navigator.camera.PictureSourceType.PHOTOLIBRARY
      quality : 50,
      allowEdit : true,
      targetWidth: 600,
      targetHeight: 600,
      saveToPhotoAlbum: true,
      popoverOptions: true
      });
}

function uploadPhoto(imageURI) {
      myApp.showPreloader();
      var options = new FileUploadOptions();
      options.fileKey = "file";
      options.fileName = imageURI.substr(imageURI.lastIndexOf('/') + 1);
      options.mimeType = "image/jpeg";
      alert(JSON.stringify(options.fileName));
      var params = new Object();
      params.value1 = "test";
      params.value2 = "param";
      options.params = params;
      options.chunkedMode = false;

      var ft = new FileTransfer();
      ft.upload(imageURI, "http://dev.house/adsapp/upload.php", function(result){
          myApp.hidePreloader();
          alert(JSON.stringify(result));
      }, function(error){
          myApp.hidePreloader();
          alert(JSON.stringify(error));
      }, options);
}
