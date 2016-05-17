
// ================================
// LOADING
// ================================
function loading(dataId, opacity, fadeIn) {

    if (typeof fadeIn === "undefined")
        fadeIn = true;
    if (typeof opacity === "undefined")
        opacity = 0.9;

    var $elem = $("#loading-img [data-id='" + dataId + "']");

    $("#loading-img div").hide();
    $('#loading-bkg').css("opacity", opacity);

    if (fadeIn) {
        $('#loading-bkg').fadeIn("fast", function () {
            $('#loading-img').show();
            center($elem);
            $elem.fadeIn("slow");
        });
    }
    else {
        $('#loading-bkg').show();
        $('#loading-img').show();
        center($elem);
        $elem.show();
        console.log($elem);
    }
}
function loadingHide() {
    setTimeout(function () {
        $('#loading-img').fadeOut("fast");
        $('#loading-bkg').fadeOut("fast");
    }, 500);

}