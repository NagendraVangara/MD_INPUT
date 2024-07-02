



//var apiURL = 'http://localhost:53943/api/apcnote/';

 var apiURL = 'http://10.3.0.70:9001/api/apcnote/';
 // var apiURL = 'http://10.3.0.208:9001/api/apcnote/';

var qsParm = new Array();
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
$(document).ready(function () {

    qs();

    Holiday_list();
    document.getElementById('h_type').addEventListener('change', function () {
        var holidayType = this.value;
        var holidayLengthField = document.getElementById('holidayLengthField');

        // If APH SPECIAL HOLIDAY is selected, show the Holiday Length field; otherwise, hide it
        if (holidayType === '3') {
            holidayLengthField.style.display = 'block';
        } else {
            holidayLengthField.style.display = 'none';
        }
    });
    //document.getElementById('region').addEventListener('change', function () {

    //    var region = this.value;
    //    var holidayTypeDropdown = document.getElementById('h_type');

    //    // Clear existing options
    //    holidayTypeDropdown.innerHTML = '<option value="">Select Holiday Type</option>';

    //    // Add options based on region
    //    if (region === 'APH') {
    //        holidayTypeDropdown.innerHTML += '<option value="1">SUNDAY/SATURDAY</option>';
    //        holidayTypeDropdown.innerHTML += '<option value="2">SPECIAL HOLIDAY</option>';
    //        holidayTypeDropdown.innerHTML += '<option value="3">APH SPECIAL HOLIDAY</option>';
    //        document.getElementById('holidayLengthField').style.display = 'block';
    //    }

    //    else {
    //        holidayTypeDropdown.innerHTML += '<option value="1">SUNDAY/SATURDAY</option>';
    //        holidayTypeDropdown.innerHTML += '<option value="2">SPECIAL HOLIDAY</option>';
    //        document.getElementById('holidayLengthField').style.display = 'none';
    //    }
    //});



    //    $('#rpt_grid').hide();

    //$('#region').change(function () {
    //    var selectedRegion = $(this).val();

    //    var region = {
    //        Region: selectedRegion
    //    };
    //    $.post(apiURL + 'GetDepartmentsByRegion', region, function (response) {

    //        console.log(response);
    //        // Clear existing options
    //        $('#department').empty();

    //        // Add default option
    //        $('#department').append($('<option>', {
    //            value: '',
    //            text: 'Select Department'
    //        }));

    //        $.each(response, function (index, department) {
    //            $('#department').append($('<option>', {
    //                value: department,
    //                text: department
    //            }));
    //        });

    //    }).fail(function (jqxhr, settings, ex) {
    //        $(".dimmer").hide();
    //        alert("error: " + ex);
    //    });
    //    // var departments = departmentOptions[selectedRegion] || [];

    //    // Clear existing options
    //    //$('#department').empty();

    //    //// Add default option
    //    //$('#department').append($('<option>', {
    //    //    value: '',
    //    //    text: 'Select Department'
    //    //}));

    //    //// Add options for the selected region
    //    //departments.forEach(function (department) {
    //    //    $('#department').append($('<option>', {
    //    //        value: department,
    //    //        text: department
    //    //    }));
    //    //});


    //});

});

//$("#e_date,#M_date").datepicker({
//    dateFormat: 'yy-mm-dd',
//    changeMonth: true,
//    changeYear: true,

//});
$("#e_date").datepicker({
    dateFormat: "yy-mm-dd",
    changeMonth: true,
    changeYear: true,
    beforeShowDay: function (date) {
        var day = date.getDay();
        var holidayType = $("#h_type").val();


        // Enable only Saturdays (6) and Sundays (0) if holiday type is SUNDAY/SATURDAY
        if (holidayType == "1") {
            return [(day == 6 || day == 0)];
        } else if (day == 0) {
            // Disable Sundays for other holiday types
            return [false];
        }

        return [true];
    }
});

$("#M_date").datepicker({
    dateFormat: "yy-mm-dd",
    changeMonth: true,
    changeYear: true,
    beforeShowDay: function (date) {
        var day = date.getDay();
        var holidayType = $("#M_type").val();
        // holidayType = $("#M_type").val();

        // Enable only Saturdays (6) and Sundays (0) if holiday type is SUNDAY/SATURDAY
        if (holidayType == "1") {
            return [(day == 6 || day == 0)];
        } else if (day == 0) {
            // Disable Sundays for other holiday types
            return [false];
        }

        return [true];
    }
});


$("#h_type,M_type").change(function () {
    // Refresh datepicker to reflect changes
    $("#e_date,M_date").datepicker("refresh");
});
var User = {};
var rowData = '';
var datatableVariable = '';

function Holiday_list() {
    $.ajax({
        type: "GET",
        dataType: "json",
        data: '',
        url: apiURL + 'Get_Holiday_details',
        success: function (data) {
            datatableVariable = $('#RegistrationGrid').DataTable({
                "destroy": "true",
                "dataSrc": "",
                data: data,
                columns: [


                    /* { 'data': 'Id' },*/
                    {
                        data: null, title: 'S.No.', visible: true, render: function (data, type, row, meta) {
                            return meta.row + 1;
                        }
                    },
                    { 'data': 'Region' },
                    {
                        'data': 'HolidayType',

                        render: function (data, type, row) {
                            if (type === 'display') {

                                switch (row.HolidayType) {
                                    case '1':
                                        return 'SUNDAY/SATURDAY';
                                    case '2':
                                        return 'SPECIAL HOLIDAY';
                                    case '3':
                                        return 'Not-Full Day HOLIDAY';
                                    default:
                                        return 'Unknown Holiday Type';
                                }
                            }
                            return data; // For other types (e.g., 'filter' or 'sort'), return the original data
                        }

                    },
                    { 'data': 'HolidayLength' },


                    {
                        data: 'HolidayDate',
                        render: function (d) {
                            return moment(d).format("YYYY-MM-DD");
                        }
                    },
                    { 'data': 'CreatedDept' },
                    { 'data': 'CreatedUser' },

                    { 'data': 'LastUser' },
                    {
                        data: null,
                        render: function (data, type, row) {
                            return '<div class="action-group">' +
                                '<button class="editBtn btn btn-link" data-id="' + row.Id + '"><i class="fas fa-pencil-alt"></i></button>' +
                                '<button class="deleteBtn btn btn-link custom-delete-btn" data-id="' + row.Id + '"><i class="fas fa-trash-alt"></i></button>' +
                                '</div>';
                        },

                        orderable: false,
                        searchable: false
                    }

                ],
                dom: 'Bfrtip',
                buttons:
                    [
                        {
                            extend: 'excelHtml5',
                            title: 'Holiday List Excel',
                            text: 'Export to excel'

                        }
                    ]
            });

        }

    });
}

$('#RegistrationGrid').on('click', '.editBtn', function () {

    rowData = datatableVariable.row($(this).closest('tr')).data();
    console.log(rowData);
    populateEditForm(rowData);
    $('#updateModal').modal('show');
});

function populateEditForm(rowData) {

    $('#M_region').val(rowData.Region);


    //var holidayTypeDropdown = document.getElementById('M_type');

    //// Clear existing options
    //holidayTypeDropdown.innerHTML = '<option value="">Select Holiday Type</option>';

    //// Add options based on region
    //if (rowData.Region == 'APH') {
    //    holidayTypeDropdown.innerHTML += '<option value="1">SUNDAY/SATURDAY</option>';
    //    holidayTypeDropdown.innerHTML += '<option value="2">SPECIAL HOLIDAY</option>';
    //    holidayTypeDropdown.innerHTML += '<option value="3">APH SPECIAL HOLIDAY</option>';
    //   // document.getElementById('holidayLengthField').style.display = 'block';
    //}

    //else {
    //    holidayTypeDropdown.innerHTML += '<option value="1">SUNDAY/SATURDAY</option>';
    //    holidayTypeDropdown.innerHTML += '<option value="2">SPECIAL HOLIDAY</option>';
    //   // document.getElementById('holidayLengthField').style.display = 'none';
    //}


    $('#M_type').val(rowData.HolidayType);

    var fillDate = new Date(rowData.HolidayDate);
    var year = fillDate.getFullYear();
    var month = ('0' + (fillDate.getMonth() + 1)).slice(-2); // Adding 1 because months are zero-based
    var day = ('0' + fillDate.getDate()).slice(-2);
    var formattedDate = year + '-' + month + '-' + day;
    $('#M_date').val(formattedDate);


}

$('#btnUpdate').click(function () {


    if ($('#M_region').val() == '') {
        alert('Please Select Region');
        $('#M_region').focus();
    } else if ($('#M_type').val() == '') {
        alert('Select Holiday Type');
        $('#M_type').focus();
    } else if ($('#M_date').val == '') {
        alert('Select Holiday Date');
        $('#M_date').focus();
    }
    else {

        var update_role = {};
        /* rowData = datatableVariable.row($(this).closest('tr')).data();*/

        update_role.ID = rowData.ID;
        update_role.Region = $('#M_region').val();
        update_role.HolidayType = $('#M_type').val();
        update_role.HolidayDate = $('#M_date').val();
        update_role.LastUser = $('#userid').val();


        $.post(apiURL + 'Update_Holiday_details', update_role, function (response) {

            console.log(response);
            if (response == "Success") {
                toastr.success('Holidays Updated Successfully!', 'Success', { timeOut: 3000 });
                //  alert('User Rights Updated Successfully');
                $('#updateModal').modal('hide');
                Holiday_list();
            } else {
                alert("somthing error");
                $('#updateModal').modal('hide');
            }

        }).fail(function (jqxhr, settings, ex) {
            $(".dimmer").hide();
            alert("error: " + ex);
        });
    }
});

$('#RegistrationGrid').on('click', '.deleteBtn', function () {

    var delete_info = {};
    rowData = datatableVariable.row($(this).closest('tr')).data();

    delete_info.ID = rowData.ID;
    var confirmDelete = confirm("Are you sure you want to delete this record?");
    if (confirmDelete) {
        $.post(apiURL + 'Delete_Holiday', delete_info, function (response) {


            if (response == "Success") {
                toastr.success('Record Deleted!', 'Deleted', { timeOut: 3000 });

                Holiday_list();
            } else {
                alert("somthing error");
            }

        }).fail(function (jqxhr, settings, ex) {
            $(".dimmer").hide();
            alert("error: " + ex);
        });
    }
});


$('#submit').click(function () {


    if ($("#region").val() == "") {
        alert('Please Select Region');
        $("#region").focus();
    }
    else if
        ($("#h_type").val() == "") {
        alert('Please Select To Date');
        $("#e_date").focus();
        return false;
    } else if ($("#e_date").val() == "") {
        alert('Please select Holiday Date');
        $("#e_date").focus();
    }
    else {

        User.Region = $('#region').val();
        User.HolidayType = $('#h_type').val();
        User.HolidayDate = $('#e_date').val();
        User.CreatedUser = $('#userid').val();

        if (User.HolidayType == 1 || User.HolidayType == 2) {
            User.HolidayLength = 8;
        } else {
            User.HolidayLength = $('#h_len').val();
        }



        $.post(apiURL + 'Insert_Holiday_details', User, function (response) {

            //console.log(response);
            var insertedRows = [];
            var failedRows = [];
            var ExistedRows = [];

            for (var i = 0; i < response.length; i++) {
                if (response[i].Result === 'Success') {
                    insertedRows.push(response[i].Region);
                } else if (response[i].Result === 'Failed') {
                    failedRows.push(response[i].Region);
                } else if (response[i].Result === 'exist') {
                    ExistedRows.push(response[i].Region);
                }
            }

            if (insertedRows.length > 0) {
                Holiday_list();
                toastr.success('Inserted Region: ' + insertedRows.join(', '), 'Success', { timeOut: 3000 });
            }

            if (failedRows.length > 0) {
                toastr.warning('Failed to insert Region: ' + failedRows.join(', '), 'Warning', { timeOut: 3000 });
                // console.log('Failed rows:', failedRows);
            }
            if (ExistedRows.length > 0) {
                toastr.warning('Already Holiday Date is Present : ' + ExistedRows.join(', '), 'Warning', { timeOut: 3000 });

            }
            //if (response == "Success") {
            //    toastr.success('Holiday Added Successfully!', 'Success', { timeOut: 3000 });
            //   // alert('Holiday Added Successfully');
            //    Holiday_list();
            //} else if (response == 'registered') {
            //    toastr.warning('Already Holiday exists!', 'Warning', { timeOut: 3000 });
            //}
            //else {
            //    alert("somthing error");
            //}

        }).fail(function (jqxhr, settings, ex) {
            $(".dimmer").hide();
            alert("error: " + ex);
        });



    }
});

