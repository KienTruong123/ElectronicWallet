//
// $('#multiCollapseCards').collapse({
//     toggle: false
//   })

$('#slQuantity').hide();
$('#slcard').change(function () {
    opt = $(this).val();
    if (!(opt == "0")) {
        $('#slQuantity').show();
    } else {
        $('#slQuantity').hide();
    }
});

//----- USER WITHDRAW / DEPOSIT
window.addEventListener("load", () => {
    let u_withdraw = document.querySelector("#money")
    let u_menu_fee_withdraw = document.querySelector("#u-menu-fee-withdraw")
    let u_menu_total = document.querySelector("#u-menu-total")

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
            if(t_count ==0){
                clearInterval(timer)
                button_send_otp_transfer.innerHTML = 'Gửi mã OTP'
            }
            else{
                t_count--;
                button_send_otp_transfer.innerHTML = 'Gửi lại sau '+t_count+' s'
            }

        },1000)
        setTimeout(() => {
            button_send_otp_transfer.disabled = false
        }, 60000)
    })
})


//TODO: Change URL 
function sendOTP(sessionID) {
    $.ajax({
        type: "POST",
        url: "url",
    });
}




// TRONG. JS

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

// END OF TRONG/ JS
