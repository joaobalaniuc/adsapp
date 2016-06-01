function getContact() {
    var fields = ['displayName', 'name', 'phoneNumbers'];
    navigator.contacts.find(fields, onContactSuccess, onContactError, {filter: "", multiple: true});
}
function onContactSuccess(contacts) {

    var myArray = [];
    var contact_name;
    var contact_phone;
    var letter;
    for (i = 0; i < contacts.length; i++) {
        if (contacts[i].name.formatted != null && contacts[i].name.formatted != undefined) {
            contact_name = contacts[i].name.formatted;
            contact_name = contact_name.replace(/'/g, "''");

            if (contacts[i].phoneNumbers != null && contacts[i].phoneNumbers.length > 0 && contacts[i].phoneNumbers[0].value != null && contacts[i].phoneNumbers[0].value != undefined) {
                contact_phone = contacts[i].phoneNumbers[0].value;
                //console.log(contacts[i]);
                //console.log(contact_name + "=" + contact_phone + " / " + formatNum(contact_phone));

                myContacts.appendItem('<li data-id="' + contacts[i].id + '" data-num="' + contact_phone + '"><a href="#" class="item-link item-content"><div class="item-inner"><div class="item-title-row"><div class="item-title">' + contact_name + ' #' + contacts[i].id + '</div></div><div class="item-subtitle">' + contact_phone + '</div></div></a></li>');

                //var subtitle = "";
                dbx('SELECT * FROM contact WHERE num = "' + contact_phone + '"', function (transaction, result) {
                    //console.log(contact_phone + " = " + result.rows.length + " results ");

                    if (result.rows.length === 0) {
                        //subtitle = "(NOT USER)";
                    }
                    else {
                        //subtitle = " (ADSAPP USER)";
                    }
                });
            } else {
                //console.log("--No Number-");
                contact_phone = "";
            }
        }
    }

    checkContact(0);
    checkContactDb(0);

}
function onContactError(error) {
    alert(error);
}

//==============================================
// VERIFICAR SE CONTATO POSSUI ADSAPP
// DE ACORDO COM BD INTERNO
//==============================================
function checkContactDb(start) {
    var end = parseInt(start + 50);
    //console.log(start);
    $.each(myContacts.items, function (i, value) {
        //console.log(start);
        if (i >= start && i < end) {
            console.log("checkContactDb(): " + i);
            var num = $(value).attr("data-num");
            //console.log("checkContactDb(): " + num);
            dbx('SELECT * FROM contact WHERE num_local = "' + num + '"', function (transaction, result) {
                if (result.rows.length === 0) {
                    $('li[data-num="' + num + '"] .item-subtitle').html("- ADSAPP USER(DB)");
                    console.log("not found=" + num);
                }
                else {
                    $('li[data-num="' + num + '"] .item-subtitle').html('<a style="width:50%;ffloat:right;" href="#" class="button button-raised button-fill color-green">Convidar</a>');
                    console.log("found! " + enc(result));
                }
                //myContacts.update();
            });
        }
    });
    if (parseInt(end + 1) >= myContacts.items.length) {
        //console.log("end");
        end = 0; // start for timeout
    }
    setTimeout(function () {
        checkContactDb(end);
    }, 500);

}

//==============================================
// VERIFICAR SE CONTATO POSSUI ADSAPP
// DE ACORDO COM SERVIDOR
//==============================================
function checkContact(num) {

    var numx = parseInt(num + 50);
    var x = "";
    $.each(myContacts.items, function (i) {
        if (i >= num && i < numx) {
            var item = myContacts.items[i];
            var n = $(item).attr("data-num");
            //n = formatNum(formatNum(n));
            x += n + ",";
            if (parseInt(i + 1) >= myContacts.items.length) {
                numx = 0;
            }
        }
    });
    //console.log("checkContact(): " + numx + "/" + myContacts.items.length + "=" + x);
    $.ajax({
        url: localStorage.server + "/contact-check.json.php",
        data: {
            'num': x
        },
        type: 'GET',
        dataType: 'jsonp',
        jsonp: 'callback',
        timeout: 7000
    })
            .always(function () {

                setTimeout(function () {
                    checkContact(numx);
                }, 1000);

            })

            .fail(function () {
                console.log("sem conex");
                //myApp.alert('Desculpe, verifique sua conexão e tente novamente.', 'Erro');
            })

            .done(function (res) {
                if (res !== null) {
                    if (res.error) {
                        myApp.alert('Desculpe, ocorreu um erro interno.' + res.error, 'Erro');
                        return;
                    }

                    if (typeof res.length !== "undefined") {
                        //console.log(res.length + " results");
                    }

                    $.each(res, function (i, item) {
                        if (res[i].num) {
                            // ESTÁ NA MINHA LISTA DE CONTATOS QUE POSSUEM ADSAPP?
                            // ADICIONAR ESTA VERIFICAÇÃO ANTES DO AJAX
                            dbx('SELECT * FROM contact WHERE num = "' + res[i].num + '"', function (transaction, result) {
                                if (result.rows.length === 0) {
                                    var key = "", val = "";
                                    key += "id_server,num,num_local,nick";
                                    val += '"' + res[i].id + '",';
                                    val += '"' + res[i].num + '",';
                                    val += '"' + res[i].num_local + '",';
                                    val += '"' + res[i].nick + '"';
                                    dbQuery('INSERT INTO contact (' + key + ') VALUES (' + val + ')');
                                    //console.log("add adsapp contact: " + enc(res[i]));
                                    //$('[data-num="' + res[i].num_local + '"] .item-subtitle').html(" - ADSAPP USER");
                                }
                            });
                        }
                    });


                } // res not null
            }); // after ajax

}

function simulateContact() {

    myContacts.appendItem('<li data-num="+5528999726858"><a href="#" class="item-link item-content"><div class="item-inner"><div class="item-title-row"><div class="item-title">Amanda</div></div><div class="item-subtitle"></div></div></a></li>');
    myContacts.appendItem('<li data-num="+5528999999991"><a href="#" class="item-link item-content"><div class="item-inner"><div class="item-title-row"><div class="item-title">Rebeca</div></div><div class="item-subtitle">{{subtitle}}</div></div></a></li>');
    myContacts.appendItem('<li data-num="+5528999999993"><a href="#" class="item-link item-content"><div class="item-inner"><div class="item-title-row"><div class="item-title">Paula</div></div><div class="item-subtitle">{{subtitle}}</div></div></a></li>');
    myContacts.appendItem('<li data-num="+5528999999994"><a href="#" class="item-link item-content"><div class="item-inner"><div class="item-title-row"><div class="item-title">Fernanda</div></div><div class="item-subtitle">{{subtitle}}</div></div></a></li>');
    myContacts.appendItem('<li data-num="+5528999999995"><a href="#" class="item-link item-content"><div class="item-inner"><div class="item-title-row"><div class="item-title">Ana</div></div><div class="item-subtitle">{{subtitle}}</div></div></a></li>');
    myContacts.appendItem('<li data-num="+5528999999996"><a href="#" class="item-link item-content"><div class="item-inner"><div class="item-title-row"><div class="item-title">Cláudia</div></div><div class="item-subtitle">{{subtitle}}</div></div></a></li>');
    myContacts.appendItem('<li data-num="+5528999999997"><a href="#" class="item-link item-content"><div class="item-inner"><div class="item-title-row"><div class="item-title">Dalma</div></div><div class="item-subtitle">{{subtitle}}</div></div></a></li>');
    myContacts.appendItem('<li data-num="+5528999999998"><a href="#" class="item-link item-content"><div class="item-inner"><div class="item-title-row"><div class="item-title">Márcia</div></div><div class="item-subtitle">{{subtitle}}</div></div></a></li>');
    myContacts.appendItem('<li data-num="+5528999999999"><a href="#" class="item-link item-content"><div class="item-inner"><div class="item-title-row"><div class="item-title">Hylessandro</div></div><div class="item-subtitle">{{subtitle}}</div></div></a></li>');
    myContacts.appendItem('<li data-num="+5528999999910"><a href="#" class="item-link item-content"><div class="item-inner"><div class="item-title-row"><div class="item-title">Marcão</div></div><div class="item-subtitle">{{subtitle}}</div></div></a></li>');


    myContacts.update();
    checkContact(0);
    checkContactDb(0);
}

