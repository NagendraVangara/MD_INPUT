
$(document).ready(function () {

    $('.dimmer').hide();
    $('.otp-verification').hide();
    $('.reset-password').hide();
});


$('.verification-code').keyup(function () {
    if (this.value.length === this.maxLength) {
        $(this).next('.verification-code').focus();
    }
});

//var apiURL = 'http://localhost:53943/api/apcnote/';
   var apiURL = 'http://10.3.0.70:9001/api/apcnote/';
//  var apiURL = 'http://10.3.0.208:9001/api/apcnote/';

$('#back').click(function () {
    window.location.href = 'index.html';
});


var User = {};

var retval = "";
$('#resetBtn').click(function () {

    if ($('#username').val() == '') {
        alert('please Enter your Username');
        $('#username').focus();
    }

    else {
        $('.dimmer').show();
        User.Account = $('#username').val();

        $.post(apiURL + 'CheckEmail', User, function (response) {

            $('.dimmer').hide();

            if (response[1] == 'Success') {

                retval = response[2];
                $('.otp-verification').show();
                alert('Successfully OTP sent to your maild id ');
            } else if (response[0] == 'No_Mail') {
                alert('No maild id for the given Username');
            } else if (response[0] == 'Invalid_Mail') {
                alert('Invalid Mail Id');
            }
            else {
                alert('Error');

            }


        });
    }
});


$('#verify_otp').click(function () {

    var enteredOTP = '';
    $('.verification-code').each(function () {
        enteredOTP += $(this).val();
    });
    if (enteredOTP == retval) {
        $('#forget').hide();
        $('.otp-verification').hide();
        $('.reset-password').show();
    }
    else {
        alert("please enter correct OTP");

        $('#forget').show();

    }
});

$('#updt_pswd').click(function () {

    var new_pswd = $('#n_paswd').val();
    var cnf_pswd = $('#cnf_pswd').val();
    if ($('#n_paswd').val() == '') {
        alert("enter new password");
    }
    else if ($('#cnf_pswd').val() == '') {
        alert("enter confirm password");
    }
    else if (new_pswd != cnf_pswd) {
        alert("New Password and Confirm password Not Matched");
    }
    else {
        User.Account = $('#username').val();
        User.Password = $('#n_paswd').val();

        $.post(apiURL + 'UpdatePasword', User, function (response) {

            $('.dimmer').hide();
            if (response == 'Success') {

                alert('Successfully Password Updated ');
                window.location.href = 'index.html';
            }
            else {
                alert('Error');

            }


        });
    }
});
