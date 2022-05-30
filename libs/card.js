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