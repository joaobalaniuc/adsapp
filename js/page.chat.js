function chatList() {
    //
    debug();
    //
    dbx('SELECT * FROM chat INNER JOIN user ON chat.chat_with=user.user_id GROUP BY chat_with ORDER BY id DESC', function (transaction, result) {

        if (result.rows.length > 0) {
            $('#chatNone').hide();
        }

        // FIX FIELDS FOR IPHONE
        var res = [];
        for (var i = 0; i < result.rows.length; i++) {
            var row = result.rows.item(i);
            res[i] = {
                user_id: row['user_id'],
                user_nick: row['user_nick'],
                user_num: row['user_num'],
                user_fb: row['user_fb'],
                //
                chat_id: row['chat_id'],
                chat_from: row['chat_from'],
                chat_to: row['chat_to'],
                chat_msg: row['chat_msg']
            };
        }
        // construct
        var x = 0;
        var html = '';
        var fb, url, vc, nome;
        $.each(res, function (i, item) {
            var rs = res[i];
            console.log(rs);
            if (rs.chat_from !== localStorage.userId) {
                //fb = rs.srcFb;
                vc = "";
                //nome = rs.srcNome;
            }
            else {
                //fb = rs.dstFb;
                vc = "<em>Você:</em> ";
                //nome = rs.dstNome;
            }
            if (rs.user_fb != "null") {
                url = "https://graph.facebook.com/" + rs.user_fb + "/picture?type=large";
            }
            else {
                url = "img/profile.png";
            }
            //
            html += '<li class="showChat swipeout" data-id="' + rs.user_id + '" data-fb="' + rs.user_fb + '" data-num="' + rs.user_num + '" data-name="' + rs.user_nick + '">'; // row
            html += '<div class="swipeout-content">';
            html += '<a href="#" class="item-link item-content">';
            html += '<div class="item-media">';
            html += '<img src="' + url + '" style="width:42px !important;height:42px !important"/>';
            html += '</div>';
            html += '<div class="item-inner">';
            html += '<div class="item-title-row">';
            html += '<div class="item-title">' + rs.user_nick + '</div>';
            html += '<div class="item-after">';
            //html += '<div class="chip" style="margin-top:-5px;background:#0288d1;color:#fff;font-size:12px;font-weight:100">';
            //html += '<div class="chip-label">5</div>';
            //html += '</div>';
            html += '</div>';
            html += '</div>';
            html += '<div class="item-text" style="font-weight:100">' + vc + rs.chat_msg + '</div>';
            html += '</div>';
            html += '</a>';
            html += '</div>';
            html += '<div class="swipeout-actions-left"><a href="#" class="bg-green swipeout-overswipe demo-reply">Responder</a><a href="#" class="demo-forward bg-blue">Repray</a></div>';
            html += '<div class="swipeout-actions-right"><a href="#" class="demo-actions">Mais</a><a href="#" class="demo-mark bg-orange">Fav</a><a href="#" data-confirm="Are you sure you want to delete this item?" class="swipeout-delete swipeout-overswipe">Denunciar</a></div>';
            html += '</li>'; // row
            //sessionStorage.lastchat = rs.id; // last chat id
        });
        $('#getChatList').html(html);
    });
}
function chatGetAjax() {
    //
    debug();
    //
    if (typeof localStorage.userId === "undefined") {
        return false;
    }
    // PRIMEIRA EXECUÇÃO, ENTÃO..
    // VARIAVEL AINDA NAO FOI SETADA EM CLASS.DB()
    if (localStorage.LAST_CHAT_ID < 0) {
        setTimeout(function () {
            chatGetAjax();
        }, 3000);
        return false;
    }
    //console.log("searching chat id > " + localStorage.LAST_CHAT_ID);

    $.ajax({
        url: localStorage.server + "/chatGet.json.php",
        data: {
            'id_user': localStorage.userId,
            'id_chat': localStorage.LAST_CHAT_ID
        },
        type: 'GET',
        dataType: 'jsonp',
        jsonp: 'callback',
        timeout: 5000
    })
            .always(function () {
                //s.removeItem(fN); // halt
                //myApp.hideIndicator();
                setTimeout(function () {
                    chatGetAjax();
                }, 3000);
            })

            .fail(function () {
                myApp.alert('Desculpe, verifique sua conexão e tente novamente.', 'Erro');
            })

            .done(function (res) {
                if (res !== null) {

                    if (typeof res.length !== "undefined") {
                        console.log(res.length + " new msg received now");
                        //console.log("saving last chat id = " + res[parseInt(res.length - 1)].id);
                        localStorage.LAST_CHAT_ID = res[parseInt(res.length - 1)].id;
                    }
                    // construct
                    $.each(res, function (i, item) {
                        chatInsert(res[i].id_user_src, res[i].id_user_dst, res[i].msg, res[i].id);
                    });

                } // res not null
            }); // after ajax

}
function chatGet() {
    //
    debug();
    //
    if ($('.message').length === 0) {
        //myApp.showIndicator();
    }

    /*
     var t = "";
     t += "<div style='font-size:12px;position:relative'><div style='position:absolute;top:100px;background:#000;color:#fff;opacity:0.8;font-size:24px'>R$ 350,00</div>"; // post
     t += "<img src='http://nickford.com.br/adsapp/img/724432198.jpg' mmax-width='90%' />";
     t += "<div style='margin-top:5px;font-weight:bold'>Saiba como ficar rico em 5 minutos</div>";
     t += "<div style='margin-top:5px;'>Uma nova técnica foi disponibilizada para pessoas comuns ganharem dinheiro dentro de casa</div>";
     t += '<p class="buttons-row">';
     t += '<a href="#" class="button button-raised button-fill color-indigo"><i class="fa fa-facebook-official" aria-hidden="true"></i> 1/32</a>';
     t += '<a href="#" class="button button-raised button-fill color-pink"><i class="fa fa-instagram" aria-hidden="true"></i> 8/12</a>';
     t += '<a href="#" class="button button-raised button-fill color-green"><i class="fa fa-comments-o" aria-hidden="true"></i> 12</a>';
     t += '</p>';
     t += "</div>"; // post
     
     myMessages.addMessage({
     text: t,
     avatar: 'http://blogs.timesofindia.indiatimes.com/wp-content/uploads/2015/12/mark-zuckerberg.jpg',
     type: 'sent',
     date: 'Agora'
     });
     */
    //console.log("getting id > " + localStorage.LAST_CHAT_ID_ACTIVE);
    dbx('SELECT * FROM chat WHERE (chat_from = "' + sessionStorage.chatId + '" OR chat_to = "' + sessionStorage.chatId + '") AND id > ' + localStorage.LAST_CHAT_ID_ACTIVE + ' AND chat_id IS NOT NULL AND chat_id <> "undefined" ORDER BY id ASC', function (transaction, result) {
        // Init App
        var myApp = new Framework7();
        var myMessages = myApp.messages('.messages');
        var myMessagebar = myApp.messagebar('.messagebar');

        // FIX FIELDS FOR IPHONE
        var res = [];
        for (var i = 0; i < result.rows.length; i++) {
            var row = result.rows.item(i);
            res[i] = {
                id: row['id'],
                chat_id: row['chat_id'],
                chat_from: row['chat_from'],
                chat_to: row['chat_to'],
                chat_msg: row['chat_msg'],
                chat_date: row['chat_date']
            };
            localStorage.LAST_CHAT_ID_ACTIVE = res[i]['id'];
        }
        //console.log(localStorage);
        console.log("get: news:" + result.rows.length + " last:" + localStorage.LAST_CHAT_ID_ACTIVE + "(id_local)");
        // construct
        $.each(res, function (i, item) {
            var rs = res[i];
            // from me (sent)
            if (rs.chat_from == localStorage.userId) {
                var myPic;
                if (typeof localStorage.fb_id === "undefined")
                    myPic = "";
                else
                    myPic = 'http://graph.facebook.com/' + localStorage.fb_id + '/picture?type=square';
                //console.log("MSG1X=" + rs.chat_msg + " " + myPic + "AAA");
                myMessages.addMessage({
                    text: rs.chat_msg,
                    avatar: myPic,
                    type: 'sent'
                            //date: dateFormat(new Date(rs.chat_date), "dd/mm hh:MM")
                });
                //console.log("aaa");
            }
            else {
                //console.log("MSG2=" + rs.chat_msg);
                var dstPic;
                if (sessionStorage.chatFb === "null")
                    dstPic = "";
                else
                    dstPic = sessionStorage.chatFbLink;
                myMessages.addMessage({
                    text: rs.chat_msg,
                    avatar: dstPic,
                    type: 'received'
                            //date: dateFormat(new Date(rs.chat_date), "dd/mm hh:MM")
                });
            }
        });
    });

}
function chatInsert(src, dst, messageText, idReceivedFromServer) {
    //
    this.scope = [src, dst, messageText, idReceivedFromServer];
    debug(this);
    // other person? to easiest chat list
    if (src == localStorage.userId)
        var other = dst;
    else
        var other = src;
    //==========================
    // INSERT MSG ON LOCAL DB
    //==========================
    var now = dateFormat(new Date(), "yyyy-mm-dd hh:MM:ss");
    var key = "", val = "";
    key += "chat_with,chat_from,chat_to,chat_msg,chat_date,chat_id";
    val += '"' + other + '",';
    val += '"' + src + '",';
    val += '"' + dst + '",';
    val += '"' + messageText + '",';
    val += '"' + now + '",';
    val += '"' + idReceivedFromServer + '"';
    db.transaction(
            function (transaction) {
                transaction.executeSql(
                        'INSERT INTO chat (' + key + ') VALUES (' + val + ')',
                        null,
                        function (transaction, result) {
                            var id_local = result.insertId;
                            // SEND DATA TO SERVER
                            if (typeof idReceivedFromServer === "undefined") {
                                chatSend(src, dst, messageText, id_local);
                            }
                            else {
                                // já insere isso em getajax()
                                //localStorage.LAST_CHAT_ID = idReceivedFromServer;
                            }

                        });
            }
    );
}
function chatSend(src, dst, messageText, id_local) {
    //==========================
    // SEND MSG TO SERVER DB
    //==========================
    $.ajax({
        url: localStorage.server + "/chatSend.json.php",
        data: {
            'id_user_src': src,
            'id_user_dst': dst,
            'msg': messageText
        },
        type: 'GET',
        dataType: 'jsonp',
        jsonp: 'callback',
        timeout: 5000
    })
            .always(function () {
                //myApp.hideIndicator();
            })

            .fail(function () {
                myApp.alert('Desculpe, verifique sua conexão e tente novamente.', 'Erro');
            })

            .done(function (res) {
                if (res !== null) {
                    if (res.error) {
                        myApp.alert('Desculpe, ocorreu um erro interno.', 'Erro');
                        return;
                    }
                    localStorage.LAST_CHAT_ID_ACTIVE = id_local;
                    localStorage.LAST_CHAT_ID = res.success;
                    //console.log("msg server id:" + res.success);
                    dbQuery('UPDATE chat SET chat_id="' + res.success + '" WHERE id="' + id_local + '"');

                } // res not null
            }); // after ajax

}

$$(document).on('pageBeforeInit', '[data-page="messages"]', function (e) {
    $('#toolbar').hide();
});

$$(document).on('pageInit', '[data-page="messages"]', function (e) {
    chatGet();
    $('#chatName').html(sessionStorage.chatName);
    $('#chatFbLink').attr("src", sessionStorage.chatFbLink);
});

$$(document).on('click', '.showChat', function (e) {
    //return false;
    localStorage.LAST_CHAT_ID_ACTIVE = 0;
    sessionStorage.chatId = $(this).attr("data-id");
    sessionStorage.chatNum = $(this).attr("data-num");
    sessionStorage.chatName = $(this).attr("data-name");
    sessionStorage.chatFb = $(this).attr("data-fb");
    sessionStorage.chatFbLink = "http://graph.facebook.com/" + sessionStorage.chatFb + "/picture?type=square";
    if (sessionStorage.chatFb === "null") {
        sessionStorage.chatFbLink = "img/profile.png";
    }
    contactSave(sessionStorage.chatId, sessionStorage.chatName, sessionStorage.chatNum, sessionStorage.chatFb);
    view3.router.loadPage('chat.html', {ignoreCache: true});
});

$$(document).on('pageBeforeInit', '[data-page="post"]', function (e) {

});
