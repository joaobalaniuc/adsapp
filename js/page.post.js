//=============================
// PAGE: *
//=============================
$$(document).on('click', '.post_read', function (e) {
//myApp.showTab('#view-1');
    var post_id = $(this).attr("data-id");
    sessionStorage.post_id = post_id;
    go("post_read.html");
});
//=============================
// PAGE: POST_FORM
//=============================
myApp.onPageInit('post_form', function (page) {

    sessionStorage.serialize = $("#post_form form").serialize();

    $("#camera_sort").sortable({
        items: "li:not(.ui-state-disabled)"
    });

    if (typeof sessionStorage.imageURI !== "undefined") {
        setTimeout(function () {
            photoAdd(sessionStorage.imageURI);
            sessionStorage.removeItem("imageURI");
        }, 1000);
    }


    // EDITAR POST
    if (sessionStorage.edit_id > 0) {
        var post_id = sessionStorage.edit_id;
        sessionStorage.edit_id = 0;
        postRead(post_id, postEditCb);
    }
    // NOVO POST
    else {
        // img
        var url = localStorage.server + localStorage.server_img + "/" + sessionStorage.img_last;
        console.log(url);
        $("#img_last").attr("src", url);
        $("[name=img_fn]").val(sessionStorage.img_last);
    }
    // VALIDATE
    $("#postForm").validate({
        rules: {
            post_name: {
                required: true,
                minlength: 3
            },
            post_phone: {
                required: true
            },
            categ_id: {
                required: true
            }
        },
        errorElement: 'div',
        errorPlacement: function (error, element) {
            var placement = $(element).data('error');
            if (placement) {
                $(placement).append(error)
            } else {
                error.insertAfter(element);
            }
        }
    });

});
$$(document).on('click', '.postSend', function (e) {
    if ($("#postForm").valid()) {
        alert("but");
        postSend();
    } else {
        myApp.alert('Preencha corretamente os campos do formulário.', 'Ops!');
    }
});
$$(document).on('click', '#postCategEdit', function (e) {
    $(".catTxt").hide();
    $(".cat1").show();
});
//=============================
// PAGE: POST_READ
//=============================
myApp.onPageBeforeInit('post_read', function (page) {
    postRead(sessionStorage.post_id, postReadCb);
});
$$(document).on('click', '.post_edit', function (e) {
    sessionStorage.edit_id = sessionStorage.post_id;
    go("post_form.html");
    //view4.router.loadPage("post_read.html", {ignoreCache: true});
});
$$(document).on('click', '.post_del', function (e) {
    myApp.confirm('Tem certeza disto?', 'Excluir anúncio', function () {
        postDel(sessionStorage.post_id);
    });
});
//=============================
// GET POST DATA
//=============================
function postRead(post_id, cb) {

    //myApp.showPreloader();
    loadingShow();

    $.ajax({
        url: localStorage.server + "/post_read.php",
        data: {
            user_id: localStorage.user_id,
            user_email: localStorage.user_email,
            user_pass: localStorage.user_pass,
            //
            post_id: post_id
        },
        type: 'GET',
        dataType: 'jsonp',
        jsonp: 'callback',
        timeout: localStorage.timeout
    })
            .always(function () {
                loadingHide();
                myApp.hidePreloader();
            })

            .fail(function () {
                var r = {"fail": true};
                cb(r);
            })

            .done(function (res) {
                cb(res);
            }); // after ajax
}
function postReadCb(res) {

    var post = res["post"];
    console.log(post);
    if (res === null || res.fail || res.error) {
        myApp.alert("Verifique sua conexão e tente novamente.");
        window.location.href = "index.html";
        return;
    }

    // COUNTS...
    var view = post[0]["post_count_view"];
    if (view == null)
        view = 0;
    var com = post[0]["post_count_com"];
    if (com == null)
        com = 0;
    var like = post[0]["post_count_like"];
    if (like == null)
        like = 0;
    // IMG CAROUSEL
    if (typeof post[0][0] !== "undefined") {
        var x;
        var id = makeid();
        for (x = 0; x < post[0][0].length; x++) {
            $("#post_read .slick").append("<div id='slick_" + id + "'></div>");
            var url = localStorage.server + localStorage.server_img + post[0][0][x]["img_fn"];
            var content = '<img style="width:100vw;height:100vw" class="post_read post_img" src="' + url + '" />';
            console.log(content);
            $("#slick_" + id).append("<div>" + content + "</div>");
        }
        $("#slick_" + id).slick({
            //arrows: false,
            dots: true
        });
    }
    if (post[0]["user_fb_pic"] != null) {
        $("#post_read .user_fb_pic").attr("src", post[0]["user_fb_pic"]);
    }

    // CHAT FILL
    $("#post_read .chat").attr("data-id", post[0]["user_id"]);
    $("#post_read .chat").attr("data-name", post[0]["user_name"]);
    $("#post_read .chat").attr("data-pic", post[0]["user_fb_pic"]);
    // FILL
    $("#post_read .user_read").attr("data-id", post[0]["user_id"]);
    $("#post_read .post_view").html(view);
    $("#post_read .post_com").html(com);
    $("#post_read .post_like").html(like);
    $("#post_read .post_name").html(post[0]["post_name"]);
    $("#post_read .user_name").html(post[0]["user_name"]);
    $("#post_read .post_date").html(post[0]["post_date"]);
    $("#post_read .user_phone").attr("href", "tel:0" + post[0]["user_phone"]);
    $("#post_read .post_price").html(post[0]["post_price"]);
    pretty();
    var txt = post[0]["post_txt"];
    if (txt !== null) {
        $("#post_read .post_txt").html(txt);
    }
    // "buy" button
    if (post[0]["post_url"] !== null && post[0]["post_url"] != "") {
        $("#post_read .post_url").show().attr("data-open", post[0]["post_url"]);
    } else {
        $("#post_read .post_url").hide();
    }
    if (post[0]["like_id"] > 0) {
        $("#post_read .post_like").css("color", "blue");
        $("#post_read .post_like_txt").css("color", "blue").html("Curtiu");
    }
// MOSTRAR OPÇÕES DE EDITAR
    if (post[0]["user_id"] == localStorage.user_id) {
        $("#post_read .edit").show();
    }
}
function postEditCb(res) {
    res.post[0]["post_txt"] = res.post[0]["post_txt_rn"];
    FF(res.post, "#post_form");
    //
    var url = localStorage.server + localStorage.server_img + res["post"][0]["img_fn"];
    $("#img_last").attr("src", url);
    $("#postTitle").html("Editar Anúncio");
    $("#postSend").html("Salvar Alterações");
    // categoria em texto vs categoria select
    $(".catTxt").show();
    $(".cat1").hide();
    var cat1, cat2, cat3;
    cat1 = cat2 = cat3 = "";
    cat1 = res["post"][0]["cat1"];
    if (res["post"][0]["cat2"]) {
        cat2 = ", " + res["post"][0]["cat2"];
    }
    if (res["post"][0]["cat3"]) {
        cat3 = ", " + res["post"][0]["cat3"];
    }
    $("#postCateg").html(cat1 + "" + cat2 + "" + cat3);
}
//=============================
// POST LIST
//=============================
function postList(where) {

    console.log("postList(): where=" + where);

    // AJAX
    $.ajax({
        url: localStorage.server + "/post_list.php",
        data: {
            user_id: localStorage.user_id,
            user_email: localStorage.user_email,
            user_pass: localStorage.user_pass,
            //
            where: where
        },
        type: 'GET',
        dataType: 'jsonp',
        jsonp: 'callback',
        timeout: localStorage.timeout
    })
            .always(function () {
                myApp.pullToRefreshDone();
                myApp.hideIndicator();
            })

            .fail(function () {
                //myApp.alert('Desculpe, verifique sua conexão e tente novamente.', 'Erro');
            })

            .done(function (res) {
                if (where.indexOf(">") > 0) {
                    postListCb(res, "prepend");
                } else {
                    postListCb(res, "append");
                }
            });
}
function postListCb(res, position) {
    if (res !== null) {

        if (res === false) {
            if ($('#post_list').children().length == 0) {
                $("#post_none").fadeIn("slow");
            }
            return;
        }
        if (res.error) {
            errorCheck(res.error);
            return;
        }
        var i = 0;
        $.each(res, function (key, val) {
            i++;
            var $el = $("#post_template")
                    .clone()
                    .prop({
                        id: "post_" + val["post_id"]
                    })
                    .attr("data-id", val["post_id"])
                    .attr("post-id", val["post_id"]);

            if (position === "prepend") {
                $el.prependTo("#post_list");
            } else {
                $el.appendTo("#post_list");
            }

            $("#post_" + val["post_id"]).each(function (index) {

                // EACH IMG GALLERY
                if (typeof val[0] !== "undefined") {
                    var x;
                    var id = makeid();
                    for (x = 0; x < val[0].length; x++) {
                        $(this).find(".slick").append("<div id='slick_" + id + "'></div>");
                        var url = localStorage.server + localStorage.server_img + val[0][x]["img_fn"];
                        var content = '<img style="width:100vw;height:100vw" class="post_read post_img" src="' + url + '" />';
                        //console.log(content);
                        $("#slick_" + id).append("<div>" + content + "</div>");
                    }
                    $("#slick_" + id).slick({
                        //arrows: false,
                        dots: true
                    });
                }
                if (val["user_fb_pic"] != null) {
                    $(this).find(".user_fb_pic").attr("src", val["user_fb_pic"]);
                }
                $(this).find(".post_name").html(val["post_name"]);
                if (val["post_price"] !== null) {

                    // Preço em botão? (post_url)
                    if (val["post_url"] !== null && val["post_url"] != "") {
                        $(this).find(".priceTxt").hide();
                        $(this).find(".priceBut").show().attr("data-open", val["post_url"]);
                    } else {
                        $(this).find(".priceTxt").show();
                        $(this).find(".priceBut").hide();
                    }
                    $(this).find(".post_price").html("R$ " + val["post_price"]);
                }
                if (val["user_bio"] !== null) {
                    $(this).find(".user_bio").html(val["user_bio"]);
                }

                // share
                $(this).find(".share").attr("data-message", val["post_name"] + " por R$ " + val["post_price"]);
                $(this).find(".share").attr("data-img", localStorage.server + localStorage.server_img + val["img_fn"]);

                // content
                $(this).find(".user_read").attr("data-id", val["user_id"]);
                $(this).find(".post_read").attr("data-id", val["post_id"]);
                $(this).find(".user_name").html(val["user_name"]);
                $(this).find(".post_date").html(val["post_date"]);
                $(this).find(".post_txt").html(val["post_txt"]);
                $(this).find(".post_txt").text(function (index, currentText) {
                    if (currentText.length > 64) {
                        return currentText.substr(0, 128) + " ...";
                    }
                });
                // chat
                $(this).find(".chat").attr("data-id", val["user_id"]);
                $(this).find(".chat").attr("data-name", val["user_name"]);
                // tel
                $(".user_phone").attr("href", "tel:0" + val["user_phone"]);

            }).show();

            pretty();
            setTimeout(function () {
                if ($('#post_list').children().length > 0) {
                    $("#post_none").hide();
                }
            }, 500);
        });
    }
}
function postListGrid(where) {

    console.log("postListGrid(): where = " + where);

    $.ajax({
        url: localStorage.server + "/post_list.php",
        data: {
            user_id: localStorage.user_id,
            user_email: localStorage.user_email,
            user_pass: localStorage.user_pass,
            //
            where: where
        },
        type: 'GET',
        dataType: 'jsonp',
        jsonp: 'callback',
        timeout: localStorage.timeout
    })
            .always(function () {
                $("#post2_infinite").fadeOut("fast");
                myApp.hideIndicator();
                //console.log("postListGrid() end.");
            })

            .fail(function () {
                //myApp.alert('Desculpe, verifique sua conexão e tente novamente.', 'Erro');
            })

            .done(function (res) {

                console.log(res);
                if (res !== null) {

                    if (res === false) {
                        return;
                    }
                    if (res.error) {
                        errorCheck(res.error);
                        return;
                    }
                    var i = 0;
                    //var $grid = $("#" + prefix + "_list");
                    $.each(res, function (key, val) {
                        i++;
                        // create new item elements
                        var thumb = localStorage.server + localStorage.server_img + "thumb_" + val[0][0]["img_fn"];
                        var item = '';
                        item += '<div class="square">';
                        item += '<div class="content">';
                        item += '<div class="table">';
                        item += '<div class="post_read table-cell" data-id="' + val["post_id"] + '" style="background-image:url(' + thumb + ')">';
                        //item += '<img class="rs" src="'+localStorage.server+localStorage.server_img+val["img_fn"]+'" />';
                        //item += 'Responsive image.';
                        item += '</div>';
                        item += '</div>';
                        item += '</div>';
                        item += '</div>';

                        console.log(thumb);

                        $("#post2_list").append(item);

                        //sessionStorage.post_id_list

                    });
                    //console.log("(NEW/GRID) post_id = " + sessionStorage.post_id_list_new + " (OLD) post_id = " + sessionStorage.post_id_list);
                } // res not null
                else {
                    //alert("Erro interno.");
                }
                if (sessionStorage.post2_id_list == 0) {
                    $("#post_none").fadeIn("slow");
                }

            }); // after ajax
}
//=============================
// INSERT / DELETE POST
//=============================
function postSend() {
    alert("funx");
    return;
    // HTTP
    var url = $("#post_form [name='post_url']").val();
    if (url != "") {
        var www = url;
        www = replaceAll(www, "http://", "");
        www = replaceAll(www, "https://", "");
        www = www.toLowerCase();
        $("#post_form [name='post_url']").val(www);
    }
    //
    var data_form = $("#post_form form").serialize();
    var data_user = {
        user_id: localStorage.user_id,
        user_email: localStorage.user_email,
        user_pass: localStorage.user_pass
    };
    var data_user = $.param(data_user); // serialize
    var data = data_form + "&" + data_user;
    console.log(data);
    alert(JSON.stringify(data));
    // RUN AJAX
    myApp.showPreloader();
    $.ajax({
        url: localStorage.server + "/post_insert.php",
        data: data,
        type: 'GET',
        dataType: 'jsonp',
        jsonp: 'callback',
        timeout: localStorage.timeout
    })
            .always(function () {
                myApp.hidePreloader();
            })

            .fail(function () {
                //myApp.alert('Desculpe, verifique sua conexão e tente novamente.', 'Erro');
            })

            .done(function (res) {
                if (res !== null) {
                    console.log(res);
                    alert(JSON.stringify(res));
                    if (typeof res.error !== "undefined") {
                        errorCheck(res.error);
                        return;
                    }
                    if (res.success) {
                        alert("success..upload now...");
                        sessionStorage.post_id = res.success;
                        postUpload();
                    }
                } // res not null
            }); // after ajax
}
function postDel(post_id) {

    myApp.showPreloader();
    $.ajax({
        url: localStorage.server + "/post_del.php",
        data: {
            user_id: localStorage.user_id,
            user_email: localStorage.user_email,
            user_pass: localStorage.user_pass,
            //
            post_id: post_id
        },
        type: 'GET',
        dataType: 'jsonp',
        jsonp: 'callback',
        timeout: localStorage.timeout
    })
            .always(function () {
                myApp.hidePreloader();
            })
            .fail(function () {
                //myApp.alert('Desculpe, verifique sua conexão e tente novamente.', 'Erro');
            })
            .done(function (res) {
                window.location.href = "index.html";
            });
}
//=============================
// GET CATEG LIST
//=============================
$$(document).on('change', '.cat', function (e) {
    var id = $(this).val();
    catChange(id);
});
function postCat(cb) {
    $.ajax({
        url: localStorage.server + "/categ_list.php",
        data: {
        },
        type: 'GET',
        dataType: 'jsonp',
        jsonp: 'callback',
        timeout: localStorage.timeout
    })
            .always(function () {
                //preloader(false);
            })

            .fail(function () {
                //preloader(false);
                //myApp.alert('Desculpe, verifique sua conexão e tente novamente.', 'Erro');
            })

            .done(function (res) {
                if (res !== null) {
                    if (typeof res.error !== "undefined") {
                        errorCheck(res.error);
                        return;
                    }
                    $.each(res, function (key, val) {
                        sessionStorage.setItem("cName_" + val["categ_id"], val["categ_name"]);
                        sessionStorage.setItem("cLevel_" + val["categ_id"], val["categ_level"]);
                        sessionStorage.setItem("cParent_" + val["categ_id"], val["categ_parent"]);
                    });
                    cb();
                }
                console.log("cat");
                console.log(sessionStorage);
            }); // after ajax
}
//======================================
// LOAD CATEG LEVEL 1
//======================================
function postCatCb() {
    var html = "";
    html += "<option value=''>Selecione...</option>\r\n";
    $.each(sessionStorage, function (key, val) {
        if (key.startsWith("cName_")) {
            var id = key.split("_");
            if (sessionStorage.getItem("cParent_" + id[1]) == "") {
                html += "<option value='" + id[1] + "'>" + val + "</option>\r\n";
            }
        }
    });
    $("#cat1").html(html);
    $(".cats").hide();
}
//======================================
// LOAD CATEG LEVEL 2/3
//======================================
function catChange(id) {
    var level = sessionStorage.getItem("cLevel_" + id);
    var next_level = parseInt(level) + 1;
    var find = 0;
    var html = "";
    html += "<option value=''>Selecione...</option>\r\n";
    // TEM FILHO?
    $.each(sessionStorage, function (key, val) {
        if (key.startsWith("cParent_")) {
            if (val == id) {
                find++;
                var child = key.split("_");
                var name = sessionStorage.getItem("cName_" + child[1]);
                html += "<option value='" + child[1] + "'>" + name + "</option>\r\n";
            }
        }
    });
    $("#cat" + next_level).html(html);
    if (find > 0) {
        $(".cat" + next_level).fadeIn("fast");
    } else {
        $(".cat" + next_level).hide();
    }
}
//======================================
// PULL TO REFRESH (TOP)
//======================================
$$('.pull-to-refresh-content').on('refresh', function (e) {
    var id = lastId("post_list", "post-id");
    postList("post_id > " + id);
});
//======================================
// INFINITE SCROLL (DOWN)
//======================================
$$('.infinite-scroll').on('infinite', function () {

    // INDEX
    if (sessionStorage.activePage === "index") {
        if ($("#post_infinite").css("display") === "none") {
            $("#post_infinite").fadeIn("slow", function () {
                var id = firstId("post_list", "post-id");
                postList("post_id < " + id);
            });
        }
    }
    // GRID
    else {
        if ($("#post2_infinite").css("display") === "none") {
            $("#post2_infinite").fadeIn("slow", function () {
                var id = firstId("post2_list", "data-id");
                postListGrid("post_id < " + id);
            });
        }
    }
    $('.infinite-scroll-preloader').fadeOut("fast");
});
//======================================
// GET LAST ID
//======================================
function lastId(parent_id, attr) {
    var id = $("#" + parent_id + " [" + attr + "]").first().attr(attr);
    return id;
}
function firstId(parent_id, attr) {
    var id = $("#" + parent_id + " [" + attr + "]").last().attr(attr);
    return id;
}