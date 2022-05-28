$('#slQuantity').hide();
$('#slcard').change(function() {
    opt = $(this).val();
    if (!(opt=="0")) {
        $('#slQuantity').show();
    }else{
        $('#slQuantity').hide();
    }
});
