
var departmentOptions = {
    'APC': ['IT-Backoffice', 'MES', 'IT_SW Probation', 'Hardware'],
    'APH': ['HR&OA部', '数据部'],
    'APE': ['BackOffice', 'IT_SW Probation', 'Hardware', 'IT-SW', 'IT-HW'],
    'GROUP': ['PMO']
};
$(document).ready(function () {

    Users_details();
    $("#join_date,#resign_date").datepicker({
        dateFormat: 'yy-mm-dd',
        autoclose: true,
        changeMonth: true,
        changeYear: true,
        todayHighlight: true,

    });




});



//var apiURL = 'http://localhost:53943/api/apcnote/';
  var apiURL = 'http://10.3.0.70:9001/api/apcnote/';
 //  var apiURL = 'http://10.3.0.208:9001/api/apcnote/';
var rowData = '';
var datatableVariable = '';

function clearModalFields() {
    //$('#M_account').val('');
    //$('#M_right').val('');
    //$('#M_region').val('');
    // $('#M_department').val('');
    $('#department').empty();
    $('#department').append($('<option>', {
        value: '',
        text: 'Select Department'
    }));
    //$('#M_role').val('');
    //$('#M_remark').val('');
}

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

$('#editEmployeeModal').on('hidden.bs.modal', function () {

    // Clear all input fields when modal is closed
    clearModalFields();
});

function Users_details() {
    $.ajax({
        type: "GET",
        dataType: "json",
        data: '',
        url: apiURL + 'Get_IT_member_details',
        success: function (data) {
            datatableVariable = $('#datatable').DataTable({
                "destroy": "true",
                "dataSrc": "",
                data: data,
                scrollX: true,
                columns: [


                    //{ 'data': 'ID', visible:false },
                    {
                        data: null, title: 'S.No.', visible: true, render: function (data, type, row, meta) {
                            return meta.row + 1;
                        }
                    },
                    { 'data': 'Region' },
                    { 'data': 'Department' },
                    { 'data': 'EmployeeName' },
                    { 'data': 'EmployeeNumber' },
                    { 'data': 'Email' },

                    {
                        data: "JoinDate",
                        render: function (d) {
                            return moment(d).format("YYYY-MM-DD");
                        }
                    },

                    {
                        data: "ResignDate",
                        render: function (d) {
                            if (d) {
                                return moment(d).format("YYYY-MM-DD");
                            } else {
                                return "";
                            }
                        }
                    },
                    /* { 'data': 'ManDS' },*/
                    {
                        data: "ManDS",
                        render: function (data) {
                            return data === 1 ? "Need to Input" : "No Need to Input";
                        }
                    },
                    { 'data': 'Account' },
                    { 'data': 'Password' },
                    { 'data': 'Role' },
                    { 'data': 'Remark' },
                    {
                        data: null,
                        render: function (data, type, row) {
                            return '<div class="action-group">' +
                                '<button class="editBtn btn btn-link" data-id="' + row.ID + '"><i class="fas fa-pencil-alt"></i></button>' +
                                '<button class="deleteBtn btn btn-link" data-id="' + row.ID + '"><i class="fas fa-trash-alt"></i></button>' +
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
                            title: 'Users List Excel',
                            text: 'Export to excel'

                        }
                    ]
            });

        }

    });
}

$('#datatable').on('click', '.editBtn', function () {

    rowData = datatableVariable.row($(this).closest('tr')).data();
    console.log(rowData);
    populateEditForm(rowData);
    $('#editEmployeeModal').modal('show');
});

function populateEditForm(rowData) {



    var fillDate = new Date(rowData.JoinDate);
    var year = fillDate.getFullYear();
    var month = ('0' + (fillDate.getMonth() + 1)).slice(-2); // Adding 1 because months are zero-based
    var day = ('0' + fillDate.getDate()).slice(-2);
    var formattedDate = year + '-' + month + '-' + day;


    $('#join_date').val(formattedDate);

    //var fillDate1 = new Date(rowData.ResignDate);
    //var year1 = fillDate1.getFullYear();
    //var month1 = ('0' + (fillDate1.getMonth() + 1)).slice(-2); // Adding 1 because months are zero-based
    //var day1 = ('0' + fillDate1.getDate()).slice(-2);
    //var formattedDate1 = year1 + '-' + month1 + '-' + day1;
    //$('#resign_date').val(formattedDate1);
    if (rowData.ResignDate == null) {
        $('#resign_date').val(rowData.ResignDate);
    } else {
        var fillDate1 = new Date(rowData.ResignDate);
        var year1 = fillDate1.getFullYear();
        var month1 = ('0' + (fillDate1.getMonth() + 1)).slice(-2); // Adding 1 because months are zero-based
        var day1 = ('0' + fillDate1.getDate()).slice(-2);
        var formattedDate1 = year1 + '-' + month1 + '-' + day1;
        $('#resign_date').val(formattedDate1);
    }



    $('#username').val(rowData.Account);
    $('#region').val(rowData.Region);
    //  $('#department').val(rowData.Department);
    $('#email').val(rowData.Email);
    $('#emp_name').val(rowData.EmployeeName);
    $('#emp_no').val(rowData.EmployeeNumber);
    //  $('#M_Category').val(rowData.ID);


    $('#man_ds').val(rowData.ManDS);
    $('#password').val(rowData.Password);

    $('#remark').val(rowData.Remark);
    $('#role').val(rowData.Role);

    //var departments = departmentOptions[rowData.Region] || [];
    //$('#department').empty().append($('<option>', {
    //    value: '',
    //    text: 'Select Department'
    //}));
    //departments.forEach(function (department) {
    //    $('#department').append($('<option>', {
    //        value: department,
    //        text: department
    //    }));
    //});

    var region_modal = {
        Region: rowData.Region
    };
    $.post(apiURL + 'GetDepartmentsByRegion', region_modal, function (response) {


        // Clear existing options
        //  $('#M_department').empty();

        // Add default option
        //$('#M_department').append($('<option>', {
        //    value: '',
        //    text: 'Select Department'
        //}));
        //$('#department,#t_department').append($('<option>', {
        //    value: 'ALL',
        //    text: 'ALL'
        //}));
        $.each(response, function (index, department) {

            $('#department').append($('<option>', {
                value: department,
                text: department
            }));

        });
        $('#department').val(rowData.Department);

    }).fail(function (jqxhr, settings, ex) {
        $(".dimmer").hide();
        alert("error: " + ex);
    });





}


$('#updatebtn').click(function () {

    if ($('#region').val() == '' || $('#region').val() == null) {
        alert("Please select Region");
        $('#region').focus();
    }
    //else if ($('#department').val() == '') {
    //    alert("Please select department");
    //    $('#department').focus();

    //}
    else if ($('#man_ds').val() == '') {
        alert("Please select Man day input type");
        $('#man_ds').focus();

    } else if ($('#role').val() == '') {
        alert("Please select User Role");
        $('#role').focus();

    }
    else if ($('#emp_name').val() == '') {
        alert("Please enter Employee Name");
        $('#emp_name').focus();

    }
    else if ($('#emp_no').val() == '') {
        alert("Please enter Employee Number");
        $('#emp_no').focus();

    }
    else {
        var update_info = {};


        update_info.Region = $('#region').val();
        update_info.Department = $('#department').val();
        update_info.EmployeeName = $('#emp_name').val();
        update_info.EmployeeNumber = $('#emp_no').val();
        update_info.Email = $('#email').val();
        update_info.JoinDate = $('#join_date').val();
        update_info.ResignDate = $('#resign_date').val();
        update_info.ManDS = $('#man_ds').val();
        update_info.Account = $('#username').val();
        update_info.Password = $('#password').val();
        update_info.Remark = $('#remark').val();
        update_info.Role = $('#role').val();
        update_info.ID = rowData.ID;

        $.post(apiURL + 'Update_IT_Member_details', update_info, function (response) {

            console.log(response);
            if (response == "Success") {
                toastr.success('Successfully submitted!', 'Success', { timeOut: 3000 });
                $('#editEmployeeModal').modal('hide');
                Users_details();
            } else {
                alert("somthing error");
                $('#editEmployeeModal').modal('hide');
            }

        }).fail(function (jqxhr, settings, ex) {
            $(".dimmer").hide();
            alert("error: " + ex);
        });
    }
});
$('#datatable').on('click', '.deleteBtn', function () {


    var delete_info = {};
    rowData = datatableVariable.row($(this).closest('tr')).data();
    // var rowId = $(this).data('id');
    delete_info.ID = rowData.ID;
    // delete_info.FillDate = rowData.FILL_DATE;
    delete_info.EmployeeNumber = rowData.EmployeeNumber;
    var confirmDelete = confirm("Are you sure you want to delete this record?");
    if (confirmDelete) {
        $.post(apiURL + 'Delete_IT_member', delete_info, function (response) {


            if (response == "Success") {
                toastr.success('Record Deleted!', 'Deleted', { timeOut: 3000 });

                Users_details();
            } else {
                alert("somthing error");
            }

        }).fail(function (jqxhr, settings, ex) {
            $(".dimmer").hide();
            alert("error: " + ex);
        });
    }
});

