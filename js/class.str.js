
// Idade por data de nascimento
function getAge(dateString) {
    /*
     this.scope = [dateString];
     debug(this);
     */
    var today = new Date();
    var birthDate = new Date(dateString);
    var age = today.getFullYear() - birthDate.getFullYear();
    var m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
        age--;
    }
    return age;
}


function formatNum(num) {
    var str = num.replace(/[()-]/g, '').split(' ').join('');

    if (str.charAt(0) == "0") {
        str = str.substring(1);
    }

    var myNum = localStorage.user_num;
    myN = myNum.split(" ");
    var myCc = myNum.substr(0, 3);
    var myDdd = myNum.substr(3, 5);

    if (str.charAt(0) != "+") {
        str = myCc + str;
    }
    return str;
}