function getContact() {
    var fields = ['displayName', 'name', 'phoneNumbers'];
    navigator.contacts.find(fields, onContactSuccess, onContactError, {filter: "", multiple: true});
}
function onContactSuccess(contacts) {
    var myArray = [];
    var contact_name;
    var contact_phone;
    var letter;

    //===================================
    // ORGANIZAR CONTATOS EM $MYARRAY
    //===================================
    for (i = 0; i < contacts.length; i++) {

        // DADOS NÃO NULOS
        if (contacts[i].name.formatted != null && contacts[i].name.formatted != undefined) {

            contact_name = contacts[i].name.formatted;
            contact_name = contact_name.replace(/'/g, "''");

            // CONTATO TEM NUMERO
            if (contacts[i].phoneNumbers != null && contacts[i].phoneNumbers.length > 0 && contacts[i].phoneNumbers[0].value != null && contacts[i].phoneNumbers[0].value != undefined) {
                contact_phone = contacts[i].phoneNumbers[0].value;
                var firstLetter = contact_name.charAt(0);
                if (!myArray[firstLetter]) {
                    myArray[firstLetter] = [];
                }
                myArray[firstLetter].push(contact_name);
                console.log(contact_name + "=" + contact_phone);
            }
            // CONTATO NÃO TEM NUMERO
            else {
                contact_phone = "";
                console.log("--No Number-");
            }
        }
    }
    //===================================
    // CRIAR <LI> ITEMS PARA <UL>
    //===================================
    var items = [];
    var letter = "";
    for (var i = 65; i <= 90; i++) {
        letter = String.fromCharCode(i);
        if (!myArray[letter])
            myArray[letter] = [];

        //items.push('<li class="list-group-title">' + letter + '</li>');
        var i = 0;
        $.each(myArray[letter], function (k, v) {

            dbx('SELECT * FROM contact WHERE num = "' + contact_phone + '"', function (transaction, result) {
                if (result.rows.length > 0) {
                    items.push('<li><a href="#" class="item-link item-content"><div class="item-inner"><div class="item-title-row"><div class="item-title">' + v + '</div></div><div class="item-subtitle">ADSAPP USER</div></div></a></li>');
                }
                else {
                    items.push('<li><a href="#" class="item-link item-content"><div class="item-inner"><div class="item-title-row"><div class="item-title">' + v + '</div></div><div class="item-subtitle">---</div></div></a></li>');
                }
            });


        });
    }
    var contacts = myApp.virtualList($$("#contacts"), {
        // Pass array with items
        //items: items,
        items: items,
        // Custom search function for searchbar
        searchAll: function (query, items) {
            var found = [];
            for (var i = 0; i < items.length; i++) {
                /*if (items[i].title.indexOf(query) >= 0 || query.trim() === '') {
                 found.push(i);
                 }*/
                var item = items[i];
                if ($(item).text().indexOf(query) >= 0 || query.trim() === '') {
                    found.push(i);
                }
            }
            return found; //return array with mathced indexes
        },
        // Item height
        height: 73
    });
    checkContact(0);
}

function onContactError(error) {
    alert(error);
}
//==============================================
// VERIFICAR SE CONTATO POSSUI ADSAPP
//==============================================
function checkContact(start, items) {
    
    var end = parseInt(start + 5);
    var x = "";

    //================================================
    // ADICIONAR NUMEROS SOB DEMANDA EM VARIAVEL "X"
    //================================================
    $.each(items, function (i) {
        if (i >= start && i < end) {
            var item = items[i];
            var num = $(item).attr("data-num");
            // ESTE NUMERO JÁ É ADSAPP CONTACT?
            x += num + ",";
            if (parseInt(i + 1) >= items.length) {
                end = 0;
            }
        }
    });
    console.log(end + "/" + items.length + "=" + x);

    //======================================
    // ENVIAR NUMEROS(X) PARA SERVIDOR (GET)
    //======================================
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
                    checkContact(numx, items);
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

                    // construct
                    $.each(res, function (i, item) {

                        // ESTÁ NA MINHA LISTA DE CONTATOS QUE POSSUEM ADSAPP?
                        // ADICIONAR ESTA VERIFICAÇÃO ANTES DO AJAX

                        dbx('SELECT * FROM contact WHERE num = "' + res[i].num + '"', function (transaction, result) {
                            if (result.rows.length == 0) {
                                var key = "", val = "";
                                key = "num,nick";
                                val = '"' + res[i].num + '",';
                                val += '"' + res[i].nick + '"';
                                dbQuery('INSERT INTO contact (' + key + ') VALUES (' + val + ')');
                                console.log("add adsapp contact: " + res[i].num);
                            }
                        });

                    });


                } // res not null
            }); // after ajax

}

function simulateContact() {
    var items = [];
    for (var i = 0; i < 10; i++) {
        //items.push('<li><a href="#" class="item-link item-content"><div class="item-inner"><div class="item-title-row"><div class="item-title">AAA' + i + '</div></div><div class="item-subtitle">{{subtitle}}</div></div></a></li>');
    }
    items.push('<li data-num="+5528999726858"><a href="#" class="item-link item-content"><div class="item-inner"><div class="item-title-row"><div class="item-title">Amanda</div></div><div class="item-subtitle"></div></div></a></li>');
    items.push('<li data-num="+5528999999991"><a href="#" class="item-link item-content"><div class="item-inner"><div class="item-title-row"><div class="item-title">Rebeca</div></div><div class="item-subtitle">{{subtitle}}</div></div></a></li>');
    items.push('<li data-num="+5528999999993"><a href="#" class="item-link item-content"><div class="item-inner"><div class="item-title-row"><div class="item-title">Paula</div></div><div class="item-subtitle">{{subtitle}}</div></div></a></li>');
    items.push('<li data-num="+5528999999994"><a href="#" class="item-link item-content"><div class="item-inner"><div class="item-title-row"><div class="item-title">Fernanda</div></div><div class="item-subtitle">{{subtitle}}</div></div></a></li>');
    items.push('<li data-num="+5528999999995"><a href="#" class="item-link item-content"><div class="item-inner"><div class="item-title-row"><div class="item-title">Ana</div></div><div class="item-subtitle">{{subtitle}}</div></div></a></li>');
    items.push('<li data-num="+5528999999996"><a href="#" class="item-link item-content"><div class="item-inner"><div class="item-title-row"><div class="item-title">Cláudia</div></div><div class="item-subtitle">{{subtitle}}</div></div></a></li>');
    items.push('<li data-num="+5528999999997"><a href="#" class="item-link item-content"><div class="item-inner"><div class="item-title-row"><div class="item-title">Dalma</div></div><div class="item-subtitle">{{subtitle}}</div></div></a></li>');
    items.push('<li data-num="+5528999999998"><a href="#" class="item-link item-content"><div class="item-inner"><div class="item-title-row"><div class="item-title">Márcia</div></div><div class="item-subtitle">{{subtitle}}</div></div></a></li>');
    items.push('<li data-num="+5528999999999"><a href="#" class="item-link item-content"><div class="item-inner"><div class="item-title-row"><div class="item-title">Hylessandro</div></div><div class="item-subtitle">{{subtitle}}</div></div></a></li>');
    items.push('<li data-num="+5528999999910"><a href="#" class="item-link item-content"><div class="item-inner"><div class="item-title-row"><div class="item-title">Marcão</div></div><div class="item-subtitle">{{subtitle}}</div></div></a></li>');
    // Create virtual list
    var contacts = myApp.virtualList($$('#contacts'), {
        // Pass array with items
        //items: items,
        items: items,
        // Custom search function for searchbar
        searchAll: function (query, items) {
            var found = [];
            for (var i = 0; i < items.length; i++) {
                var item = items[i];
                if ($(item).text().indexOf(query) >= 0 || query.trim() === '') {
                    found.push(i);
                }
            }
            return found; //return array with mathced indexes
        },
        // Item height
        height: 73
    });

    setTimeout(function () {
        checkContact(0, items);
    }, 1000);
}

