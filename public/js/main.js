$('#slQuantity').hide();
$('#slcard').change(function () {
    opt = $(this).val();
    if (!(opt == "0")) {
        $('#slQuantity').show();
    } else {
        $('#slQuantity').hide();
    }
});

//----- USER WITHDRAW
window.addEventListener("load", () => {
    let u_withdraw = document.querySelector("#money")
    let u_menu_fee_withdraw = document.querySelector("#u-menu-fee-withdraw")
    let u_menu_total = document.querySelector("#u-menu-total")

    u_withdraw.addEventListener("change",() => {
        u_menu_fee_withdraw.innerHTML = (u_withdraw.value * 0.05).toLocaleString() +"đ";
        u_menu_total.innerHTML = (u_withdraw.value * 1.05).toLocaleString() +"đ";
    });


    let u_deposit_money = document.querySelector("#deposit_money")
    let u_deposit_total = document.querySelector("#u-deposit-total")

    u_deposit_money.addEventListener("change",()=>{
        u_deposit_total.innerHTML = (u_deposit_money.value * 1).toLocaleString() +"đ";
    })

})
