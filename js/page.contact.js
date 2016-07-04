function contactList(first) {
    //
    debug();
    /*
     if (halt(true))
     return;
     var fN = fName();
     
     if ($('.showChat').length === 0) {
     // ainda nao existem itens carregados
     }
     else {
     }
     */
    myContacts.deleteAllItems();
    myApp.showIndicator();

    $.ajax({
        url: localStorage.server + "/contactList.json.php",
        type: 'GET',
        dataType: 'jsonp',
        jsonp: 'callback',
        timeout: 7000
    })
            .always(function () {
                //s.removeItem(fN); // halt
                myApp.hideIndicator();
            })

            .fail(function () {
                myApp.alert('Desculpe, verifique sua conexão e tente novamente.', 'Erro');
            })

            .done(function (res) {
                if (res !== null) {

                    var contacts = res;
                    var img = '';
                    var status = '';

                    $.each(contacts, function (i, item) {
                        console.log(contacts[i].num + " " + contacts[i].id_fb);
                        if (contacts[i].id_fb !== null) {
                            img = '<img src="http://graph.facebook.com/' + contacts[i].id_fb + '/picture?type=square" width="44">';
                        }
                        else {
                            img = '<img src="img/profile.png" width="44">';
                        }
                        if (contacts[i].bio === null) {
                            status = '<span style="font-weight:100;color:#ccc;text-transform:oblique">' + contacts[i].num + '</span>';
                        }
                        else {
                            status = contacts[i].bio;
                        }
                        myContacts.appendItem('<li class="showChat" data-id="' + contacts[i].id + '" data-num="' + contacts[i].num + '" data-name="' + contacts[i].nick + '" data-fb="' + contacts[i].id_fb + '"><a href="#view-3" class="tab-link item-link item-content"><div class="item-media">' + img + '</div><div class="item-inner"><div class="item-title-row"><div class="item-title">' + contacts[i].nick + '</div></div><div class="item-subtitle">' + status + '</div></div></a></li>');
                        /*var key = "", val = "";
                         key += "num,num_local,name,nick,id_fb";
                         val += '"' + contacts[i].num + '",';
                         val += '"' + contacts[i].num + '",';
                         val += '"' + contacts[i].name + '",';
                         val += '"' + contacts[i].name + '",';
                         val += '"' + contacts[i].fb + '"';
                         dbQuery('INSERT INTO contact (' + key + ') VALUES (' + val + ')');
                         */
                    });


                } // res not null
            }); // after ajax

}
function contactSave(user_id, user_nick, user_num, user_fb) {
    dbx('SELECT * FROM user WHERE user_id="' + user_id + '"', function (transaction, result) {
        // contact dont exists
        if (result.rows.length === 0) {
            console.log("add new contact = " + user_nick + " , " + user_num);
            //==========================
            // INSERT CONTACT ON DB
            //==========================
            var key = "", val = "";
            key += "user_id,user_nick,user_num,user_fb";
            val += '"' + user_id + '",';
            val += '"' + user_nick + '",';
            val += '"' + user_num + '",';
            val += '"' + user_fb + '"';
            dbQuery('INSERT INTO user (' + key + ') VALUES (' + val + ')');
        }
    });
}