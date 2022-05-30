module.exports.buyCard = function (net,length,characters) {
    if(characters==null)
        characters = '0123456789';
    var result = '';
    var charactersLength = characters.length;
    for (var i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return net+result;
}

module.exports.cardType= {"11111": "Viettel", "22222": "Mobifone", "33333": "Vinaphone",
                        "Viettel":"11111","Mobifone":"22222","Vinaphone":"33333"
}