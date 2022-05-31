
$('#slQuantity').hide();
$('#d-show-info').hide();
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
            if (data[0] == undefined) {
                document.getElementById("12345").innerHTML = data.status
                document.getElementById("12345").style.color = data.color
                document.getElementById("u-deposit-total").innerHTML = "0 đ"
            }
            else
                document.getElementById("12345").innerHTML = data[0].status

            document.querySelector('#deposit_card_id').value = null;
            document.querySelector('#deposit_card_date').value = null;
            document.querySelector('#deposit_card_cvv').value = null;
            document.querySelector('#deposit_money').value = 1;
        }
    )
}

function submit_withdraw() {
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
            if (data[0] == undefined) {
                document.getElementById("w_message2").innerHTML = data.status
                document.getElementById("w_message2").style.color = data.color
                document.getElementById("u-menu-fee-withdraw").innerHTML = "0 đ"
                document.getElementById("u-menu-total2").innerHTML = "0 đ"
            }
            else {
                document.getElementById("12345").innerHTML = data[0].status
            }


            document.querySelector('#card_id2').value = null;
            document.querySelector('#card_date2').value = null;
            document.querySelector('#card_cvv2').value = null;
            document.querySelector('#desc2').value = null;
            document.querySelector('#money2').value = 1;
            document.querySelector('#u-menu-total2').innerHTML = '0 đ'
            document.querySelector('#u-menu-fee-withdraw').innerHTML = '0 đ'
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
            if (data.err != null) {
                alert(data.message);
            } else {
                document.getElementById("showCard").style.display = "none";
                alert("Giao dịch thành công. Vui lòng vào lịch sử để xem chi tiết");
                cleanBuyCard();
            }
        })
};


function cleanBuyCard() {
    document.getElementById("selectedCard").innerHTML = "";
    document.getElementById("card-quantity").value = 0;
    document.getElementById("slcard").value = 0;
    document.getElementById("totalPriceCard").innerHTML = "0";
}

// AJAX CHANGE PASSWORD

$("#formChangePass").submit(function (e) {
    e.preventDefault();
    var form = $(this);
    var actionUrl = form.attr('action');
    $.ajax({
        type: "POST",
        url: actionUrl,
        data: form.serialize(),
        success: function (data) {
            alert(data.message);
        }
    });
    cleanChangePassword();
});

function cleanChangePassword() {
    document.getElementById("old-password").value = null;
    document.getElementById("new-password").value = null;
    document.getElementById("re-new-password").value = null;
}

var tblhistory = document.getElementById('tbl-history');
var dataHistory;

var dictTypeTran= {
                    "Withdraw": {"icon":"https://cdn-icons.flaticon.com/png/128/2769/premium/2769253.png?token=exp=1653990557~hmac=0c0cf38d3d8687bed08c8a3b46c2803d", "type": "Rút tiền"},
                    "Deposit": {"icon":"https://cdn-icons-png.flaticon.com/128/2721/2721121.png", "type": "Nạp tiền"},
                    "Transfer": {"icon":"https://cdn-icons-png.flaticon.com/128/3029/3029373.png", "type": "Chuyển tiền"},
                    "CardPay": {"icon":"https://cdn-icons.flaticon.com/png/128/3080/premium/3080541.png?token=exp=1653991171~hmac=d22503edae50a8d17b18cedd795fda17", "type": "Mua thẻ cào"},
                }
var dictStatus={
                    "Approve":"Chấp nhận",
                    "Waiting":"Đang chờ",
                    "Successed":"Thành công",
                    "Failed":"Thất bại"
}
// AJAX TRADE HISTORY
function tradeHistory() {

    tblhistory.innerHTML = ` <table class="table table-hover border" id="tbl-history">
                                <thead>
                                    <tr class="table-success">
                                        <th>--</th>
                                        <th>Loại giao dich</th>
                                        <th>Số tiền</th>
                                        <th>Thời gian thực hiện</th>
                                        <th>Trạng thái</th>
                                        <th>Chi tiết</th>
                                    </tr>
                                </thead>
                            </table>`;
    $.ajax({
        type: "POST",
        url: "/trades/history",
        success: function (data) {
            dataHistory = data;
            var i=0;
            data.forEach(element => {
                if (element.sender_id != null) {
                    let date = new Date(element.createdAt);
                    let year = date.getFullYear();
                    let month = date.getMonth() + 1;
                    let dt = date.getDate();
                    let content = tblhistory.innerHTML;
                    let typeT = dictTypeTran[element.type]
                    content += '<tr>'
                    content += `<td> <img width="30" src="${typeT['icon']}" alt="Avatar"  + </td>`;
                    content += '<td>' + typeT['type'] + '</td>';
                    content += '<td>' + (element.amount * 1).toLocaleString() + "Đ" + '</td>';
                    content += `<td>${dt}-${month}-${year} </td>`;
                    content += '<td>' + dictStatus[element.status] + '</td>';
                    content += `<td><button class='btn btn-primary ms-3' onclick="viewHistory(${i++})"></td>`;
                    content += '</tr>'
                    tblhistory.innerHTML = content;
                }
            });
        }
    });
    $('#d-show-info').hide();
    $('#tbl-history').show();
}

function viewHistory(id){
    $('#d-show-info').show();
    $('#tbl-history').hide();

    var data=dataHistory[id];
    var mathe=''
    if(data.type==="CardPay"){
        for (let index = 0; index < data.mobile_card.length; index++) {
            var element = data.mobile_card[index];
            mathe+= element;
        } 
    }
    document.getElementById("d-show-info").innerHTML=` <div class="row">
                                                            <div class="col-4">
                                                                <p>Người gửi:</p>
                                                            </div>
                                                            <div class="col">
                                                            ${data.sender_id}
                                                            </div>
                                                        </div>
                                                        <div class="row">
                                                            <div class="col-4">
                                                                <p>Người nhận: </p>
                                                            </div>
                                                            <div class="col">
                                                            ${data.receiver_id}
                                                            </div>
                                                        </div>
                                                        <div class="row">
                                                            <div class="col-4">
                                                                <p>Mã thẻ: </p>
                                                            </div>
                                                            <div class="col">
                                                            ${data.sender_id}
                                                            </div>
                                                        </div>
                                                        <div class="row">
                                                            <div class="col-4">
                                                                <p>Ngày giao dịch:</p>
                                                            </div>
                                                            <div class="col">
                                                            ${data.createdAt}
                                                            </div>
                                                        </div>
                                                        <div class="row">
                                                            <div class="col-4">
                                                                <p>Trạng thái:</p>
                                                            </div>
                                                            <div class="col">
                                                            ${dictStatus[data.status]}
                                                            </div>
                                                        </div>
                                                        <div class="row">
                                                            <div class="col-4">
                                                                <p>Số tiền giao dịch:</p>
                                                            </div>
                                                            <div class="col">
                                                            ${data.amount}
                                                            </div>
                                                        </div>
                                                        <div class="row">
                                                            <div class="col-4">
                                                                <p>Mô tả: </p>
                                                            </div>
                                                            <div class="col">
                                                            ${data.description}
                                                            </div>
                                                        </div>`

    
}

