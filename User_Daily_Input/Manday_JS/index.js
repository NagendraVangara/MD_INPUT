
document.addEventListener("deviceready", onDeviceReady, false);
addEventListener("load", function () {
    setTimeout(hideURLbar, 0);
}, false);

function hideURLbar() {
    window.scrollTo(0, 1);
}

//after login disable back
function disableBack() { window.history.forward(); }
setTimeout("disableBack()", 0);
window.onunload = function () { null };



function onDeviceReady() {
    document.addEventListener("backbutton", onBackKeyDown, false);
}
 //var apiURL = 'http://localhost:53943/api/apcnote/';
   var apiURL = 'http://10.3.0.70:9001/api/apcnote/';
//   var ip_address = '';
//   var apiURL = 'http://10.3.0.208:9001/api/apcnote/';
function onBackKeyDown() {
    var state = confirm('Are You Sure you want to Exit.');
    if (state)
        navigator.app.exitApp(); // exit the app
}
function isPhoneGap() {
    return (window.cordova || window.PhoneGap || window.phonegap) &&
        /^file:\/{3}[^\/]/i.test(window.location.href) &&
        /ios|iphone|ipod|ipad|android/i.test(navigator.userAgent);
}

function generateJWT() {
    var header = {
        alg: 'HS256',
        typ: 'JWT'
    };
    var payload = {
        userId: $("#userid").val()
    };
    var secret = 'mySecretKey';
    var encodedHeader = btoa(JSON.stringify(header));
    var encodedPayload = btoa(JSON.stringify(payload));
    var signature = btoa(encodedHeader + '.' + encodedPayload + secret);
    var expirationTime = new Date();
    expirationTime.setMinutes(expirationTime.getMinutes() + 60);
    document.cookie = "token=" + encodedHeader + '.' + encodedPayload + '.' + signature + ";expires=" + expirationTime.toUTCString() + ";path=/";

}




$(document).ready(function () {
    $(".dimmer").hide();
    $("#userid").focus();
    $("#userid").keypress(function (e) {
        ////debugger;
        var current_val = $(this).val();
        var typing_char = String.fromCharCode(e.which);
        if (parseFloat(current_val + "" + typing_char) > 99999) {
            return false;
        }
    });
    $("#userpin").keypress(function (e) {
        var current_val = $(this).val();
        var typing_char = String.fromCharCode(e.which);
        if (parseFloat(current_val + "" + typing_char) > 99999999) {
            return false;
        }
    });
    $('.info').on('submit', () => {
        return false;
    });

    //$.ajax({
    //    type: "GET",
    //    url: "Check_net.aspx",
    //    dataType: "text",
    //    success: function (ipAddress) {
    //        debugger
    //        ip_address = ipAddress;
    //        console.log("IP Address:", ipAddress);
    //    },
    //    error: function (xhr, status, error) {
    //        console.error("Error:", error);
    //    }
    //});
  

});
$('.info').keypress((e) => {
    if (e.which === 13) {
        $('.info').submit();
        Login_check();
    }
})

function Login_check() {

    //if (ip_address.startsWith('10.4') || ip_address.startsWith('10.3') || ip_address.startsWith('10.80')) {

    //    alert('No internet Available !!');
    //} else {

    //    alert('Internet Available !!');

    //} 


    var userData = {};
    userData.ACCOUNT = $("#userid").val();
    userData.PASSWORD = $("#userpin").val();

    if ($("#userid").val() == "") {
        alert('Please Enter Employee Barcode.');
        $("#userid").focus();
        return false;
    }
    else if ($("#userpin").val() == "") {
        alert('Please Enter Password.');
        $("#userpin").focus();
        return false;
    } else {
        $(".dimmer").show();
        localStorage.clear();
        generateJWT();
        $.post(apiURL + 'Checkuser', userData, function (response) {
            
            if (response != 'failed') {
               
                sessionStorage.clear();
                var expirationTime = new Date();
                expirationTime.setTime(expirationTime.getTime() - 1);

                if (response == 'Success') {
                    // Store user ID in session storage
                    sessionStorage.setItem('userID', $("#userid").val());

                    setTimeout(function () {
                        // Redirect to the sidebar page
                        window.location.href = 'Sidebar.html';
                    }, 3000);
                }

                else {
                    $(".dimmer").hide();
                    alert('Invalid User')
                    $("#userid").val("");
                    $("#userpin").val("");
                    $("#userid").focus();

                }
            } else {
                $(".dimmer").hide();
                alert('Invalid User .');
                $("#userid").val("");
                $("#userpin").val("");
                $("#userid").focus();
            }
        }).fail(function (jqxhr, settings, ex) {
            $(".dimmer").hide();
            alert("error: " + ex);
        });
    }
}
$('#login').click(function () {

    Login_check();

});
