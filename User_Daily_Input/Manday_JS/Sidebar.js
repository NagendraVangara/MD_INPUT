
//var apiURL = 'http://localhost:53943/api/apcnote/';
  var apiURL = 'http://10.3.0.70:9001/api/apcnote/';

//  var apiURL = 'http://10.3.0.208:9001/api/apcnote/';
var role = '';
//var userId = '';
var qsParm = new Array();
document.addEventListener("deviceready", onDeviceReady, false);

function onDeviceReady() {
    document.addEventListener("backbutton", function (e) {
        e.preventDefault();
    }, false);
}

function isPhoneGap() {
    return (window.cordova || window.PhoneGap || window.phonegap) &&
        /^file:\/{3}[^\/]/i.test(window.location.href) &&
        /ios|iphone|ipod|ipad|android/i.test(navigator.userAgent);
}

function qs() {

    var query = window.location.search.substring(1);
    var parms = query.split('&');
    for (var i = 0; i < parms.length; i++) {
        var pos = parms[i].indexOf('=');
        if (pos > 0) {
            var key = parms[i].substring(0, pos);
            var val = parms[i].substring(pos + 1);
            qsParm[key] = val;
        }
    }
    if (parms.length > 0) {
        $("#userid").val(atob(qsParm["userid"]));
        return true;
    } else {
        window.location.href = 'index.html';
        return false;
    }
}

function getQueryParameterValue(name) {
    const urlParams = new URLSearchParams(window.location.search);
    /* const otherParam = urlParams.get('otherparam');*/
    return urlParams.get(name);
}


var idleMax = 10 * 60 * 1000;  // 10 minutes in milliseconds
var lastMove = new Date().getTime();
var idleInterval = setInterval(timerIncrement, 1000);

function handleMouseMove(event) {
    lastMove = new Date().getTime();
    idleMax = (new Date().getTime() - lastMove) < idleMax ? 10 * 60 * 1000 : idleMax;
    clearInterval(idleInterval);
    idleInterval = setInterval(timerIncrement, 1000);
    window.idleInterval = idleInterval;
    idleMax = 10 * 60 * 1000;  // Reset back to 10 minutes
}


function startTimer() {
    clearInterval(idleInterval);
    idleInterval = setInterval(timerIncrement, 1000);
}
function timerIncrement() {
    var currentTime = new Date().getTime();
    var idleTime = currentTime - lastMove;
    if (idleTime > idleMax) {
        clearInterval(idleInterval);

        // Ask for confirmation before redirecting
        var confirmed = confirm("Are you sure you want to leave this page?");
        if (confirmed) {
            // Clear cookies and session storage
            document.cookie = 'Visit=; expires=' + new Date(0).toUTCString() + '; path=/FinalVertozz/';
            document.cookie = 'Visit=; expires=' + new Date(0).toUTCString();
            sessionStorage.clear();
            // Redirect to index.html
            window.location.href = 'index.html';
        } else {
            // If user cancels, resume timer or perform any other action
            startTimer();
        }
    }
}


function getCookie(name) {
    var cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        var cookies = document.cookie.split(';');
        for (var i = 0; i < cookies.length; i++) {
            var cookie = cookies[i].trim();
            if (cookie.substring(0, name.length + 1) === (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}

$(document).ready(function () {
    // qs();

    var userID = sessionStorage.getItem('userID');
    $("#userid").val(userID);
    var token = getCookie("token");
    if (!token || !userID) {
        window.location.href = 'index.html';
    }

    //userId = getQueryParameterValue('userid');
    //localStorage.setItem('userId', userId);
    //  $('#ifrm').attr('src', 'Dashboard.html?userid=' + btoa($("#userid").val()));
    handleSidebarItemClick('dashboard', 'Dashboard.html?userid=' + btoa($("#userid").val()));
    User_check();
    //  User_role();
    // Input_Check();
    var currentHour = new Date().getHours();

    // Get the greeting based on the current hour
    var greeting = getGreeting(currentHour);

    // Display the greeting in the HTML element
    document.getElementById('greeting').innerText = greeting;

    // Function to get the appropriate greeting based on the hour
    function getGreeting(hour) {
        if (hour >= 5 && hour < 12) {
            return 'Good Morning';
        } else if (hour >= 12 && hour < 16) {
            return 'Good Afternnon';
        } else {
            return 'Good Evening';
        }
    }
    $(document).mousemove(function (event) {
        lastMove = new Date().getTime();
    });


    startTimer();




    /* document.addEventListener("mousemove", handleMouseMove, false);*/
    $('#toggleNewPassword').click(function () {
        var passwordField = $('#newPassword');
        var passwordFieldType = passwordField.attr('type');

        // Toggle password field visibility
        if (passwordFieldType === 'password') {
            passwordField.attr('type', 'text');
        } else {
            passwordField.attr('type', 'password');
        }
    });


});


$('.nav-link').click(function () {
    // Remove 'active' class from all menu items
    $('.nav-link').removeClass('active');
    // Add 'active' class to the clicked menu item
    $(this).addClass('active');
});
$('#Logout').click(function () {
    var expirationTime = new Date();
    expirationTime.setTime(expirationTime.getTime() - 1);
    document.cookie = "token=;expires=" + expirationTime.toUTCString() + ";path=/";
    localStorage.clear();
    window.location.href = 'index.html';
});
function getCookie(name) {
    var cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        var cookies = document.cookie.split(';');
        for (var i = 0; i < cookies.length; i++) {
            var cookie = cookies[i].trim();
            if (cookie.substring(0, name.length + 1) === (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}

$('#sign_out').click(function () {
    $('#logoutModal').modal('show');
});

$('#Logout').click(function () {
    var expirationTime = new Date();
    expirationTime.setTime(expirationTime.getTime() - 1);
    document.cookie = "token=;expires=" + expirationTime.toUTCString() + ";path=/";
    localStorage.clear();
    window.location.href = 'index.html';
});

function loadPage(pageUrl) {

    // Update the src attribute of the iframe to load the specified page
    $('#ifrm').attr('src', pageUrl);
}

function handleSidebarItemClick(menuItemId, pageUrl) {


    $('.nav-item').removeClass('active');
    // Add active class to the clicked menu item
    $('#' + menuItemId).addClass('active');

    $('#ifrm').attr('src', pageUrl);
}



$('#s_bar').click(function () {
    //$('#ifrm').attr('src', 'Dashboard.html?userid=' + btoa($("#userid").val()));
    handleSidebarItemClick('dashboard', 'Dashboard.html?userid=' + btoa($("#userid").val()));
    //dashboard
});
$('#profile').click(function () {

    // console.log($("#userid").val());
    //menuActive('profile');
    $('#ifrm').attr('src', 'Daily_input.html?userid=' + btoa($("#userid").val()));
    // Store the current src of the #ifrm element in localStorage
    //localStorage.setItem('currentSrc', $('#ifrm').attr('src'));

    handleSidebarItemClick('dailyInput', 'Daily_input.html?userid=' + btoa($("#userid").val()));
});
$('#exm').click(function () {
    //   $('#ifrm').attr('src', 'SemanticUI_form.html');
    //   $('#ifrm').attr('src', 'User_reg.html?userid=' + btoa($("#userid").val()));
    handleSidebarItemClick('user_reg', 'User_Registration.html');
});

$('#project').click(function () {
    // $('#ifrm').attr('src', 'Projects_List.html?userid=' + btoa($("#userid").val()));
    //$('#ifrm').attr('src', 'Projects_List.html');
    handleSidebarItemClick('project_lst', 'Projects_List.html?userid=' + btoa($("#userid").val()));

});

$('#right_lst').click(function () {
    //  $('#ifrm').attr('src', 'Rights_List.html?userid=' + btoa($("#userid").val()));
    //  $('#ifrm').attr('src', 'Rights_List.html');
    handleSidebarItemClick('rights_page', 'Rights_List.html');
});
$('#users_lst').click(function () {
    // $('#ifrm').attr('src', 'Users_List.html?userid=' + btoa($("#userid").val()));
    // $('#ifrm').attr('src', 'Users_List.html');
    handleSidebarItemClick('userList', 'Users_List.html');
});
$('#reports').click(function () {
    // $('#ifrm').attr('src', 'Users_List.html?userid=' + btoa($("#userid").val()));
    // $('#ifrm').attr('src', 'Reports.html');
    //  $('#ifrm').attr('src', 'Reports.html?userid=' + btoa($("#userid").val()));
    handleSidebarItemClick('reports_page', 'Reports.html?userid=' + btoa($("#userid").val()));


});
$('#access').click(function () {
    // $('#ifrm').attr('src', 'Users_List.html?userid=' + btoa($("#userid").val()));
    // $('#ifrm').attr('src', 'AccessPage.html');
    handleSidebarItemClick('access_page', 'AccessPage.html');
});

$('#holidayList').click(function () {
    // $('#ifrm').attr('src', 'Holiday_List.html?userid=' + btoa($("#userid").val()));
    handleSidebarItemClick('holidayList', 'Holiday_List.html?userid=' + btoa($("#userid").val()));

});



$('#Dashboard2').click(function () {
    // $('#ifrm').attr('src', 'Users_List.html?userid=' + btoa($("#userid").val()));
    // $('#ifrm').attr('src', 'AccessPage.html');
    handleSidebarItemClick('Dashboard2', 'Dash2.html?userid=' + btoa($("#userid").val()));
});


$('#my_profile').click(function () {
    $('#myProfileModal').modal('show');
});


function User_check() {

    var userData = {};
    userData.ACCOUNT = $("#userid").val();
    // userData.ACCOUNT = userId;

    $.post(apiURL + 'Get_User_Details', userData, function (response) {

        // console.log(response);
        var username = response[0].EmployeeName;
        var email = response[0].Email;

        document.getElementById('username').textContent = `${username}`;

        document.getElementById('email').textContent = `${email}`;
        document.getElementById('empname').innerText = username;
        role = response[0].Role;
        if (role == "ADMIN") {
            $('#dashboard').show();
            $('#dailyInput').show();
            $('#user_reg').show();
            $('#reports_page').show();


            $('#project_lst').show();
            $('#rights_page').show();
            $('#userList').show();

            $('#access_page').show();
            $('#holidayList').show();
        }
        else if (role == "USER_ADMIN") {

            $('#dashboard').show();

            $('#user_reg').hide();
            $('#reports_page').show();
            $('#dailyInput').show();

            $('#project_lst').hide();
            $('#rights_page').hide();
            $('#userList').hide();
            $('#access_page').hide();
            $('#holidayList').hide();

        }

        else {

            $('#dashboard').show();
            $('#user_reg').hide();
            $('#reports_page').show();
            $('#dailyInput').show();

            $('#project_lst').hide();
            $('#rights_page').hide();
            $('#userList').hide();
            $('#access_page').hide();
            $('#holidayList').hide();
        }


    }).fail(function (jqxhr, settings, ex) {
        $(".dimmer").hide();
        alert("error: " + ex);
    });
    //}
};






function Input_Check() {

    // userData.ACCOUNT = userId;

    $.post(apiURL + 'CheckForMissingInput1', function (response) {

        console.log(response);


    }).fail(function (jqxhr, settings, ex) {
        $(".dimmer").hide();
        alert("error: " + ex);
    });
    //}
};




$('#pswd_update').click(function () {

    if ($('#newPassword').val() == '') {
        alert('Enter new Password');
        $('#newPassword').focus();
    } else if ($('#confirmPassword').val() == '') {
        alert('Enter Confirm Password');
        $('#confirmPassword').focus();
    } else if ($('#newPassword').val() != $('#confirmPassword').val()) {

        alert('Password and Confirm Password Not Matched');
    } else {
        var updteData = {};
        updteData.ACCOUNT = $("#userid").val();
        updteData.PASSWORD = $('#confirmPassword').val();

        $.post(apiURL + 'UpdatePasword', updteData, function (response) {

            $('.dimmer').hide();
            if (response == 'Success') {

                alert('Successfully Password Updated ');

                $('#myProfileModal').modal('hide');
                $('#newPassword').val('');
                $('#confirmPassword').val('');
            }
            else {
                alert('Error');

            }


        });
    }
});

