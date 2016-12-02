function getImage() {
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
      //alert(JSON.stringify(options.fileName));
      var params = new Object();

      // user data
      params.user_id = localStorage.user_id;
      params.user_email = localStorage.user_email;
      params.user_pass = localStorage.user_pass;
      options.params = params;
      options.chunkedMode = false;

      var ft = new FileTransfer();
      ft.upload(imageURI, "http://dev.house/adsapp/upload.php", function(result){
          myApp.hidePreloader();
          alert(result);
          alert(JSON.stringify(result));
          postStart(result);
      }, function(error){
          myApp.hidePreloader();
          alert(JSON.stringify(error));
      }, options);
}
