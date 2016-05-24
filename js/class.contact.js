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

    var letter = "";
    for (var i = 65; i <= 90; i++) {
        letter = String.fromCharCode(i);
        if (!myArray[letter])
            myArray[letter] = [];

        $("#contacts").append('<li class="list-group-title">' + letter + '</li>');
        $.each(myArray[letter], function (k, v) {
            console.log(k + "=" + v);
            $("#contacts").append('<li><div class="item-content"><div class="item-inner"><div class="item-title">' + v + '</div></div></div></li>');
        });
    }
}

function onContactError(error) {
    alert(error);
}


