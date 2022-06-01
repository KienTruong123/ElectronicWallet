
$('#slQuantity').hide();
$('#d-show-info').hide();
//----- USER WITHDRAW / DEPOSIT
window.addEventListener("load", () => {
    let u_withdraw = document.querySelector("#money2")
    let u_menu_fee_withdraw = document.querySelector("#u-menu-fee-withdraw")
    let u_menu_total = document.querySelector("#u-menu-total2")

    if(u_withdraw)
    u_withdraw.addEventListener("change", () => {
        u_menu_fee_withdraw.innerHTML = parseFloat((u_withdraw.value * 0.05).toFixed(0)).toLocaleString() + "đ";
        u_menu_total.innerHTML = parseFloat((u_withdraw.value * 1.05).toFixed(0)).toLocaleString() + "đ";
    });

    //--- DEPOSIT PAGE
    let u_deposit_money = document.querySelector("#deposit_money")
    let u_deposit_total = document.querySelector("#u-deposit-total")

    if(u_deposit_money)
    u_deposit_money.addEventListener("change", () => {
        u_deposit_total.innerHTML = (u_deposit_money.value * 1).toLocaleString() + "đ";
    })

    //--- TRANSFER PAGE
    let t_reveiver_money = document.querySelector("#t_reveiver_money")
    let t_reveiver_fee_withdraw = document.querySelector("#t_reveiver_fee_withdraw")
    let t_reveiver_total = document.querySelector("#t_reveiver_total")
    //let u_deposit_money = document.querySelector("#deposit_money")

    if(t_reveiver_money)
    t_reveiver_money.addEventListener("change", () => {
        t_reveiver_fee_withdraw.innerHTML = parseFloat((t_reveiver_money.value * 0.05).toFixed(0)).toLocaleString() + "đ";
        t_reveiver_total.innerHTML = parseFloat((t_reveiver_money.value * 1.05).toFixed(0)).toLocaleString() + "đ";
    });

    let button_send_otp_transfer = document.querySelector("#button_send_otp_transfer")

    if(button_send_otp_transfer)
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

    // transfer_fee_type = document.getElementsByName("transfer_fee_person").values
    // console.log(transfer_fee_type)
    //console.log(transfer_fee_type)
    // transfer_fee_type.addEventListener("change",(e)=>{
    //     console.log(transfer_fee_type.value)
    // })

    // $(".t_fee_user").change(function () {

    //     var val = $('.t_fee_user:checked').val();
    // });

})

function transfer_submit(){
    $.post(
        "/users/transfer",
        {
            t_reveiver_phone: document.querySelector('#t_reveiver_phone').value,
            t_reveiver_desc: document.querySelector('#t_reveiver_desc').value,
            t_reveiver_money: document.querySelector('#t_reveiver_money').value,
            t_reveiver_otp: document.querySelector('#t_reveiver_otp').value,
            t_fee_user: $('.t_fee_user:checked').val()
        },
        (data, state) => {
            if(data[0]== undefined){
                document.getElementById("transfer_alert").innerHTML= data.status
                document.getElementById("transfer_alert").style.color = data.color
                document.getElementById("t_reveiver_fee_withdraw").innerHTML = "0 đ"
                document.getElementById("t_reveiver_total").innerHTML = "0 đ"
            }
            else{
                document.getElementById("12345").innerHTML=data[0].status
            }
            document.querySelector('#t_reveiver_phone').value=null;
            document.querySelector('#t_reveiver_desc').value=null;
            document.querySelector('#t_reveiver_money').value=1;
            document.querySelector('#t_reveiver_otp').value=null ;
            document.querySelector('#t_reveiver_fee_withdraw').innerHTML ='0 đ'
            document.querySelector('#t_reveiver_total').innerHTML ='0 đ'
        }
    )
}

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
function sendOTP() {
    $.ajax({
        url: 'users/sendOTP',
        cache: false,
        contentType: false,
        processData: false,
        method: 'POST',
        type: 'POST', // For jQuery < 1.9
        success: function(data){
           if(data.valid){
                $('#register_error').removeClass('alert-danger').addClass('alert-success').html(data.message)
           }
           else{
            $('#register_error').removeClass('alert-success').addClass('alert-danger').html(data.message)
           }
        },
        error:function(error){
            $('#register_error').removeClass('alert-success').addClass('alert-danger').html(data.message)
            alert('Error: ',"Something went wrong :(")
            console.log(error)
        }
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
    console.log(document.getElementById("slcard").value)
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
                    "CardPay": {"icon":"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTAHX1HEiFdZ6QJQn3IPsox9WH8xT20xiaAvQiNyUZTmcN8MCI6oSWhGIsrzIs0XosR5MU&usqp=CAU", "type": "Mua thẻ cào"},
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
        console.log("sks")
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
                                                        ${mathe}
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
                                                            ${(data.amount * 1).toLocaleString() + " Đ"}
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
//-----------------------------------------------------------------------------------------------------------
// trọng JS


function trade_deleteModal(e){

    $('#confirm-delete').modal('toggle')
}

function trade_acceptModal(e){

    $('#confirm-accept').modal('toggle')
}

function deleteModal(e){
    let name = document.getElementById('name').innerHTML
    let del_modal = document.getElementById('confirm-delete')
    let modal_name = del_modal.getElementsByClassName('name')[0]
    modal_name.innerHTML = name
    $('#confirm-delete').modal('toggle')
}

function acceptModal(e){
    let name = document.getElementById('name').innerHTML
    let acc_modal = document.getElementById('confirm-accept')
    let modal_name = acc_modal.getElementsByClassName('name')[0]
    modal_name.innerHTML = name
    $('#confirm-accept').modal('toggle')
}

function requestModal(e){
    let name = document.getElementById('name').innerHTML
    let acc_modal = document.getElementById('confirm-request')
    let modal_name = acc_modal.getElementsByClassName('name')[0]
    modal_name.innerHTML = name
    $('#confirm-request').modal('toggle')
}

function unlockModal(e){
    let name = document.getElementById('name').innerHTML
    let acc_modal = document.getElementById('confirm-unlock')
    let modal_name = acc_modal.getElementsByClassName('name')[0]
    modal_name.innerHTML = name
    $('#confirm-unlock').modal('toggle')
}

function recoverModal(e){
    let name = document.getElementById('name').innerHTML
    let acc_modal = document.getElementById('confirm-recover')
    let modal_name = acc_modal.getElementsByClassName('name')[0]
    modal_name.innerHTML = name
    $('#confirm-recover').modal('toggle')
}

function saveModal(e){
    let name = document.getElementById('name').innerHTML
    let acc_modal = document.getElementById('confirm-save')
    let modal_name = acc_modal.getElementsByClassName('name')[0]
    modal_name.innerHTML = name
    $('#confirm-save').modal('toggle')
}

function adminUpdateUser(id,type){
    console.log("ADMIN UDDATE")
    console.log(id)
    console.log(type)
    $.ajax({
        url: '/admin/updateUser',
        method:'post',
        data: {type: type,id: id},
        success:function(data){
            if(data.valid){
                toast('success','Update successfully',data.message)
            }
            else{
                toast('danger','Update fail',data.message)
            }
        },
        error:function(error){
            alert('Error: ',"Something went wrong :(")
            toast('danger','Update Fail','Something went wrong.')
        }
    }) 
}

function adminUpdateTrade(id,type){
    console.log("ADMIN UPDATE TRANSACTION")
    console.log(id)
    console.log(type)
    $.ajax({
        url: '/admin/updateTrade',
        method:'post',
        data: {type: type,id: id},
        success:function(data){
            if(data.valid){
                toast('success',type+' successfully',data.message)
            }
            else{
                toast('danger',type+' fail',data.message)
            }
        },
        error:function(error){
            alert('Error: ',"Something went wrong :(")
            toast('danger',type+' fail','Something went wrong.')
        }
    }) 
}

function toast(type,title,body){
    if(type=='success'){
        color = "#238b23"
        background = "#bdf3bd"
    }
    else
        {
            color = "rgb(209, 77, 74)"
            background = "rgb(249, 179, 178)"
        }
    let toast = document.getElementById('toastDialog')
    let toastColor = toast.getElementsByClassName('toast-header')[0]
    toastColor.style.color = color
    toastColor.style.backgroundColor = background
    let toast_title = toast.getElementsByClassName("mr-auto")[0]
    let toast_body = toast.getElementsByClassName("toast-body")[0]

    console.log(toast_body)
    toast_title.innerHTML = title
    toast_body.innerHTML = body

    $('#toastDialog').toast('show')
}




// function handle images



async function convert2Buffer(blob){
    return new Promise((resolve) => {
        const reader = new FileReader()
        reader.onload = () => {
            console.log(reader.result)
            resolve(reader.result)
        }
        reader.readAsArrayBuffer(blob)
    })
}

function toBase64(buffer) {
    console.log("buffer data")
    console.log(buffer.data)
    var binary = '';
    var bytes = new Uint8Array(buffer.data);
    var len = bytes.byteLength;
    for (var i = 0; i < len; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    console.log("window btoa")
    console.log(window.btoa(binary))
    return window.btoa(binary);
  }

async function sendInformationRegister(e){
    var data = new FormData();
    let phone = $('#user_phone').val()
    let email = $('#user_email').val()
    let name = $('#user_name').val()
    let bdate = $('#user_bdate').val()
    let address = $('#user_bdate').val()
    console.log($('#user_cmnd1'))
    console.log($('#user_cmnd2'))
    let image1 = $('#user_cmnd1').prop('files')[0]
    let image2 = $('#user_cmnd2').prop('files')[0]
    console.log(image1)
    console.log(image2)
    data.set('image1',image1)
    data.set('image2',image2)
    data.set('phone',phone)
    data.set('email',email)
    data.set('name',name)
    data.set('bdate',bdate)
    data.set('address',address)

    console.log(phone)
    console.log(data)

    $.ajax({
        url: 'users/uploadInformationRegister',
        data: data,
        cache: false,
        contentType: false,
        processData: false,
        method: 'POST',
        type: 'POST', // For jQuery < 1.9
        success: function(data){
           if(data.valid){
                $('#register_error').removeClass('alert-danger').addClass('alert-success').html(data.message)
           }
           else{
            $('#register_error').removeClass('alert-success').addClass('alert-danger').html(data.message)
           }
        },
        error:function(error){
            alert('Error: ',"Something went wrong :(")
            console.log(error)
        }
    });
 }

async function sendCMND(e){
    var data = new FormData();
    let image1 = $('#id-card-front').prop('files')[0]
    let image2 = $('#id-card-back').prop('files')[0]
    data.set('image1',image1)
    data.set('image2',image2)
    
    $.ajax({
        url: 'users/uploadCMND',
        data: data,
        cache: false,
        contentType: false,
        processData: false,
        method: 'POST',
        type: 'POST', // For jQuery < 1.9
        success: function(data){
            let error = $('#cmnd-error')
           if(data.valid){
                $('#cmnd-error').removeClass('text-danger').addClass('text-success').html(data.message)
           }
           else{
            $('#cmnd-error').removeClass('text-success').addClass('text-danger').html(data.message)
           }
        },
        error:function(error){
            alert('Error: ',"Something went wrong :(")
            toast('danger','Update Fail','Something went wrong.')
        }
    });
}
async function sendInformationRegister(e){
    var data = new FormData();
    let phone = $('#user_phone').val()
    let email = $('#user_email').val()
    let name = $('#user_name').val()
    let bdate = $('#user_bdate').val()
    let address = $('#user_bdate').val()
    console.log($('#user_cmnd1'))
    console.log($('#user_cmnd2'))
    let image1 = $('#user_cmnd1').prop('files')[0]
    let image2 = $('#user_cmnd2').prop('files')[0]
    console.log(image1)
    console.log(image2)
    data.set('image1',image1)
    data.set('image2',image2)
    data.set('phone',phone)
    data.set('email',email)
    data.set('name',name)
    data.set('bdate',bdate)
    data.set('address',address)

    console.log(phone)
    console.log(data)

    $.ajax({
        url: 'users/uploadInformationRegister',
        data: data,
        cache: false,
        contentType: false,
        processData: false,
        method: 'POST',
        type: 'POST', // For jQuery < 1.9
        success: function(data){
           if(data.valid){
                $('#register_error').removeClass('alert-danger').addClass('alert-success').html(data.message)
           }
           else{
            $('#register_error').removeClass('alert-success').addClass('alert-danger').html(data.message)
           }
        },
        error:function(error){
            alert('Error: ',"Something went wrong :(")
            console.log(error)
        }
    });
 }

//-----------------------------------------------------------------------------------------------------------