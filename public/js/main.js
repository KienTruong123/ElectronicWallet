

$('#slQuantity').hide();
//----- USER WITHDRAW / DEPOSIT
window.addEventListener("load", () => {
    let u_withdraw = document.querySelector("#money2")
    let u_menu_fee_withdraw = document.querySelector("#u-menu-fee-withdraw")
    let u_menu_total = document.querySelector("#u-menu-total2")

    u_withdraw.addEventListener("change", () => {
        u_menu_fee_withdraw.innerHTML = parseFloat((u_withdraw.value * 0.05).toFixed(0)).toLocaleString() + "đ";
        u_menu_total.innerHTML = parseFloat((u_withdraw.value * 1.05).toFixed(0)).toLocaleString() + "đ";
    });


    //--- DEPOSIT PAGE
    let u_deposit_money = document.querySelector("#deposit_money")
    let u_deposit_total = document.querySelector("#u-deposit-total")

    u_deposit_money.addEventListener("change", () => {
        u_deposit_total.innerHTML = (u_deposit_money.value * 1).toLocaleString() + "đ";
    })

    //--- TRANSFER PAGE
    let t_reveiver_money = document.querySelector("#t_reveiver_money")
    let t_reveiver_fee_withdraw = document.querySelector("#t_reveiver_fee_withdraw")
    let t_reveiver_total = document.querySelector("#t_reveiver_total")
    //let u_deposit_money = document.querySelector("#deposit_money")

    t_reveiver_money.addEventListener("change", () => {
        t_reveiver_fee_withdraw.innerHTML = parseFloat((t_reveiver_money.value * 0.05).toFixed(0)).toLocaleString() + "đ";
        t_reveiver_total.innerHTML = parseFloat((t_reveiver_money.value * 1.05).toFixed(0)).toLocaleString() + "đ";
    });

    let button_send_otp_transfer = document.querySelector("#button_send_otp_transfer")

    button_send_otp_transfer.addEventListener("click", e => {
        e.preventDefault()
        button_send_otp_transfer.disabled = true
        let t_count = 60

        let timer = setInterval(() => {
            if (t_count == 0) {
                clearInterval(timer)
                button_send_otp_transfer.innerHTML = 'Gửi mã OTP'
            }
            else {
                t_count--;
                button_send_otp_transfer.innerHTML = 'Gửi lại sau ' + t_count + ' s'
            }

        }, 1000)
        setTimeout(() => {
            button_send_otp_transfer.disabled = false
        }, 60000)
    })


    //DEPOSIT

    // let u_deposit_btn = document.querySelector("#u-deposit-btn")
    // u_deposit_btn.addEventListener("submit",(e)=>



})

function submit_deposit() {

    $.post(
        "/users/deposit",
        {
            deposit_card_id: document.querySelector('#deposit_card_id').value,
            deposit_card_date: document.querySelector('#deposit_card_date').value,
            deposit_card_cvv: document.querySelector('#deposit_card_cvv').value,
            deposit_money: document.querySelector('#deposit_money').value

        },
        (data, status) => {
            if(data[0]==undefined){
                document.getElementById("12345").innerHTML= data.status
                document.getElementById("12345").style.color = data.color
                document.getElementById("u-deposit-total").innerHTML = "0 đ"
            }
            else
                document.getElementById("12345").innerHTML=data[0].status

                document.querySelector('#deposit_card_id').value=null;
                document.querySelector('#deposit_card_date').value=null;
                document.querySelector('#deposit_card_cvv').value=null;
                document.querySelector('#deposit_money').value=1 ;
        }
    )
}

function submit_withdraw(){
    $.post(
        "/users/withdraw",
        {
            card_id2: document.querySelector('#card_id2').value,
            card_date2: document.querySelector('#card_date2').value,
            card_cvv2: document.querySelector('#card_cvv2').value,
            desc2: document.querySelector('#desc2').value,
            money2: document.querySelector('#money2').value,
        },
        (data, status) => {
            //console.log(data)
            //console.log(data.status)
            if(data[0]==undefined){
                document.getElementById("w_message2").innerHTML= data.status
                document.getElementById("w_message2").style.color = data.color
                document.getElementById("u-menu-fee-withdraw").innerHTML = "0 đ"
                document.getElementById("u-menu-total2").innerHTML = "0 đ"
            }
            else{
                document.getElementById("12345").innerHTML=data[0].status
            }


                document.querySelector('#card_id2').value=null;
                document.querySelector('#card_date2').value=null;
                document.querySelector('#card_cvv2').value=null;
                document.querySelector('#desc2').value=null ;
                document.querySelector('#money2').value=1;
                document.querySelector('#u-menu-total2').innerHTML ='0 đ'
                document.querySelector('#u-menu-fee-withdraw').innerHTML ='0 đ'
        }
    )
}

//TODO: Change URL 
function sendOTP(sessionID) {
    $.ajax({
        type: "POST",
        url: "url",
    });
}

// BUY CARD
function buyCard(type) {
    document.getElementById("selectedCard").innerHTML = type;
    document.getElementById("showCard").style.display = "block";
}

function calculateCardPrice() {
    var slcard = document.getElementById("slcard").value;
    var numberCard = document.getElementById("card-quantity").value;
    if (slcard === "1") {
        document.getElementById("totalPriceCard").innerHTML = 10000 * parseInt(numberCard);
    } else if (slcard === "2") {
        document.getElementById("totalPriceCard").innerHTML = 20000 * parseInt(numberCard);
    } else if (slcard === "3") {
        document.getElementById("totalPriceCard").innerHTML = 50000 * parseInt(numberCard);
    }
    else if (slcard === "4") {
        document.getElementById("totalPriceCard").innerHTML = 100000 * parseInt(numberCard);
    }
}

// AJAX buy card

function btnBuyCard() {
    $.post("/trades/card",
        {
            type: document.getElementById("selectedCard").innerHTML,
            quantity: document.getElementById("card-quantity").value,
            value: document.getElementById("slcard").value
        },
        function (data, status) {
            document.getElementById("showCard").style.display = "none";
            alert("Giao dịch thành công. Vui lòng vào lịch sử để xem chi tiết");
        });

};




