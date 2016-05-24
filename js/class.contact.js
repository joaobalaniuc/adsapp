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
                //console.log(contact_name + "=" + contact_phone);
                var firstLetter = contact_name.charAt(0);
                if (!myArray[firstLetter]) {
                    myArray[firstLetter] = [];
                }
                myArray[firstLetter].push(contact_name);
            } else {
                console.log("--No Number-");
                contact_phone = "";
            }
        }
    }

    var items = [];
    var letter = "";
    for (var i = 65; i <= 90; i++) {
        letter = String.fromCharCode(i);
        if (!myArray[letter])
            myArray[letter] = [];

        //items.push('<li class="list-group-title">' + letter + '</li>');

        $.each(myArray[letter], function (k, v) {
            console.log(k + "=" + v);
            items.push('<li><a href="#" class="item-link item-content"><div class="item-inner"><div class="item-title-row"><div class="item-title">' + v + '</div></div><div class="item-subtitle">{{subtitle}}</div></div></a></li>');
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
    checkContact();
}

function onContactError(error) {
    alert(error);
}
//==============================================
// VERIFICAR SE CONTATO POSSUI ADSAPP
//==============================================
function checkContact() {
    
}

