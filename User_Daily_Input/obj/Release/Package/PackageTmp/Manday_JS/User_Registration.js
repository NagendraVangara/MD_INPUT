


var Usr_info = {};
//var apiURL = 'http://localhost:53943/api/apcnote/';
   var apiURL = 'http://10.3.0.70:9001/api/apcnote/';

 //  var apiURL = 'http://10.3.0.208:9001/api/apcnote/';

$(document).ready(function () {
    var departmentOptions = {
        'APC': ['IT-Backoffice', 'MES', 'IT_SW Probation', 'Hardware'],
        'APH': ['HR&OA部', '数据部'],
        'APE': ['BackOffice', 'IT_SW Probation', 'Hardware', 'IT-SW', 'IT-HW'],
        'GROUP': ['PMO']
    };


    //$('#region').change(function () {
    //    var selectedRegion = $(this).val();
    //    var departments = departmentOptions[selectedRegion] || [];

    //    // Clear existing options
    //    $('#department').empty();

    //    // Add default option
    //    $('#department').append($('<option>', {
    //        value: '',
    //        text: 'Select Department'
    //    }));

    //    // Add options for the selected region
    //    departments.forEach(function (department) {
    //        $('#department').append($('<option>', {
    //            value: department,
    //            text: department
    //        }));
    //    });

    //    // Show/hide department dropdown based on selected region
    //    if (selectedRegion === 'APC' || selectedRegion === 'APH' || selectedRegion === 'APE' || selectedRegion === 'GROUP') {
    //        $('#departmentContainer').show();
    //    } else {
    //        $('#departmentContainer').hide();
    //    }
    //});


    $('#region').change(function () {


        var selectedRegion = $(this).val();

        var region = {
            Region: selectedRegion
        };
        $.post(apiURL + 'GetDepartmentsByRegion', region, function (response) {


            // Clear existing options
            $('#department').empty();

            // Add default option
            $('#department').append($('<option>', {
                value: '',
                text: 'Select Department'
            }));

            $.each(response, function (index, department) {

                $('#department').append($('<option>', {
                    value: department,
                    text: department
                }));

            });


        }).fail(function (jqxhr, settings, ex) {
            $(".dimmer").hide();
            alert("error: " + ex);
        });



    });




    $("#join_date").datepicker({
        dateFormat: 'yy-mm-dd',
        autoclose: true,
        changeMonth: true,
        changeYear: true,
        todayHighlight: true,

    });
});
$('#submitbtn').click(function (event) {

    event.preventDefault(); // Prevent form submission
    // Perform form submission logic here...

    // Display toaster notification for successful submission
    // toastr.success('Successfully submitted!', 'Success', {timeOut: 1000 });
    if ($('#region').val() == '' || $('#region').val() == null) {
        alert("Please select Region");
        $('#region').focus();
    }


    else if ($('#man_ds').val() == '' || $('#man_ds').val() == null) {
        alert("Please Select Man day Input ");
        $('#man_ds').focus();
    } else if ($('#role').val() == '' || $('#role').val() == null) {
        alert("Please Select User Role");
        $('#role').focus();
    }
    else if ($('#emp_name').val() == '' || $('#emp_name').val() == null) {
        alert("Please select emp name");
        $('#emp_name').focus();
    } else if ($('#emp_no').val() == '' || $('#emp_no').val() == null) {
        alert("Please select emp no");
        $('#emp_no').focus();
    } else if ($('#email').val() == '' || $('#email').val() == null) {
        alert("Please select email");
        $('#email').focus();
    } else if ($('#join_date').val() == '' || $('#join_date').val() == null) {
        alert("Please input join date");
        $('#join_date').focus();
    } else if ($('#username').val() == '' || $('#username').val() == null) {
        alert("Please enter username");
        $('#username').focus();
    }
    else if ($('#password').val() == '' || $('#password').val() == null) {
        alert("Please enter password");
        $('#password').focus();
    }
    else {


        Usr_info.Region = $('#region').val();
        Usr_info.Department = $('#department').val();
        Usr_info.ManDS = $('#man_ds').val();
        Usr_info.Role = $('#role').val();

        Usr_info.EmployeeName = $('#emp_name').val();
        Usr_info.EmployeeNumber = $('#emp_no').val();
        Usr_info.Email = $('#email').val();
        Usr_info.JoinDate = $('#join_date').val();
        Usr_info.Account = $('#username').val();
        Usr_info.Password = $('#password').val();


        Usr_info.Remark = $('#remark').val();


        $.post(apiURL + 'Add_IT_member', Usr_info, function (response) {


            if (response == "Success") {
                toastr.success('User Added Successfully!', 'Success', { timeOut: 3000 });
                clear_input();
                //alert('User Added Successfully');
                //User_data();
            } else if (response == "registered") {
                toastr.warning('Username Already exists!', 'Warning', { timeOut: 3000 });

            }
            else {
                alert("somthing error");
            }

        }).fail(function (jqxhr, settings, ex) {
            $(".dimmer").hide();
            alert("error: " + ex);
        });
    }
});

function clear_input() {
    $('#region').val('');
    $('#department').val('');
    $('#man_ds').val('');
    $('#role').val('');
    $('#emp_name').val('');
    $('#emp_no').val('');
    $('#email').val('');
    $('#join_date').val('');
    $('#username').val('');
    $('#password').val('');
};

