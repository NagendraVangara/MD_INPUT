
$('.top.menu .item').tab();
  // var apiURL = 'http://localhost:53943/api/apcnote/';
   var apiURL = 'http://10.3.0.70:9001/api/apcnote/';
//  var apiURL = 'http://10.3.0.208:9001/api/apcnote/';

var datatableVariable = '';
var departmentOptions = {
    'APC': ['IT-Backoffice', 'MES', 'IT_SW Probation', 'Hardware'],
    'APH': ['HR&OA部', '数据部'],
    'APE': ['BackOffice', 'Hardware', 'IT-SW', 'IT-HW'],
    'GROUP': ['PMO']
};
$(document).ready(function () {
    Users_details();


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


    //});


    //var countries = [
    //    "Afghanistan", "Albania", "Algeria", "Andorra", "Angola", "Antigua and Barbuda", "Argentina", "Armenia", "Australia", "Austria", "Azerbaijan",
    //    // Add more countries as needed
    //];

    //$("#account").autocomplete({
    //    source: countries
    //});






});
function clearModalFields() {
    $('#M_account').val('');
    $('#M_right').val('');
    $('#M_region').val('');
    // $('#M_department').val('');
    $('#M_department').empty();
    $('#M_department').append($('<option>', {
        value: '',
        text: 'Select Department'
    }));
    //  $('#M_role').val('');
    $('#M_remark').val('');
}


$('#registerModal').on('hidden.bs.modal', function () {

    // Clear all input fields when modal is closed
    clear_input();
});
$('#updateModal').on('hidden.bs.modal', function () {

    // Clear all input fields when modal is closed
    clearModalFields();
});

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




    //   }


});

$('#M_region').change(function () {


    var selectedRegion = $(this).val();



    var region = {
        Region: selectedRegion
    };
    $.post(apiURL + 'GetDepartmentsByRegion', region, function (response) {


        // Clear existing options
        $('#M_department').empty();

        // Add default option
        $('#M_department').append($('<option>', {
            value: '',
            text: 'Select Department'
        }));

        $.each(response, function (index, department) {

            $('#M_department').append($('<option>', {
                value: department,
                text: department
            }));

        });


    }).fail(function (jqxhr, settings, ex) {
        $(".dimmer").hide();
        alert("error: " + ex);
    });




    //   }


});

function Users_details() {

    $.ajax({
        type: "GET",
        dataType: "json",
        data: '',
        url: apiURL + 'Get_Rights_details',
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
                    { 'data': 'Account' },
                    { 'data': 'Role_right' },
                    { 'data': 'Assigned_region' },
                    { 'data': 'Assigned_dept' },
                    /* { 'data': 'Role' },*/

                    { 'data': 'Remark' },
                    {
                        data: null,
                        render: function (data, type, row) {
                            return '<div class="action-group">' +
                                '<button class="editBtn btn btn-link" data-id="' + row.Id + '"><i class="fas fa-pencil-alt"></i></button>' +
                                '<button class="deleteBtn btn btn-link" data-id="' + row.Id + '"><i class="fas fa-trash-alt"></i></button>' +
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
                            title: 'Excel',
                            text: 'Export to excel'

                        }
                    ]
            });

        }

    });
}


$('#btnSubmit').click(function () {

    if ($('#account').val() == '') {
        alert('Enter Account number');
    } else if ($('#right').val() == '') {
        alert('Select Role Right');

    } else if ($('#role').val() == '') {
        alert('Select Role');
    }
    else {
        var insert_role = {};
        insert_role.Account = $('#account').val();
        insert_role.Role_right = $('#right').val();
        insert_role.Assigned_region = $('#region').val();
        insert_role.Assigned_dept = $('#department').val();
        //  insert_role.Role = $('#role').val();

        $.post(apiURL + 'Insert_Rights_details', insert_role, function (response) {

           // console.log(response);
            if (response == "Success") {
                toastr.success('User Added Successfully!', 'Success', { timeOut: 3000 });
                //alert('User Added Successfully');
                $('#registerModal').modal('hide');
                Users_details();
                clear_input();
            } else if (response == 'registered') {
                toastr.warning('User Already exists!', 'WARNING', { timeOut: 3000 });
            }
            else if (response == "No_Account") {
                toastr.warning('No Account found with this username!', 'WARNING', { timeOut: 3000 });
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
    $('#account').val('');
    $('#right').val('');
    $('#region').val('');
    $('#department').val('');
    $('#role').val('');
}


$('#RegistrationGrid').on('click', '.editBtn', function () {

    rowData = datatableVariable.row($(this).closest('tr')).data();
   // console.log(rowData);
    populateEditForm(rowData);
    $('#updateModal').modal('show');
});

function populateEditForm(rowData) {



    $('#M_account').val(rowData.Account);
    $('#M_right').val(rowData.Role_right);
    //  $('#department').val(rowData.Department);
    $('#M_region').val(rowData.Assigned_region);

    var region_modal = {
        Region: rowData.Assigned_region
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

            $('#M_department').append($('<option>', {
                value: department,
                text: department
            }));

        });
        $('#M_department').val(rowData.Assigned_dept);

    }).fail(function (jqxhr, settings, ex) {
        $(".dimmer").hide();
        alert("error: " + ex);
    });



    //var departments = departmentOptions[rowData.Assigned_region] || [];
    //$('#M_department').empty().append($('<option>', {
    //    value: '',
    //    text: 'Select Department'
    //}));
    //departments.forEach(function (department) {
    //    $('#M_department').append($('<option>', {
    //        value: department,
    //        text: department
    //    }));
    //});

    $('#M_role').val(rowData.Role);

    $('#M_remark').val(rowData.Remark);


}

$('#btnUpdate').click(function () {

    if ($('#M_account').val() == '') {
        alert('Enter Account number');
    } else if ($('#M_right').val() == '') {
        alert('Select Role Right');

    } else {
        var update_role = {};
        update_role.Account = $('#M_account').val();
        update_role.Role_right = $('#M_right').val();
        update_role.Assigned_region = $('#M_region').val();
        update_role.Assigned_dept = $('#M_department').val();
        update_role.Id = rowData.Id;
        update_role.Remark = $('#M_remark').val();
        update_role.Role = $('#M_role').val();

        $.post(apiURL + 'Update_Rights_details', update_role, function (response) {

          //  console.log(response);
            if (response == "Success") {
                toastr.success('User Rights Updated Successfully!', 'Success', { timeOut: 3000 });
                //  alert('User Rights Updated Successfully');
                $('#updateModal').modal('hide');
                Users_details();
            } else if (response == 'registered') {
                toastr.warning('Already User have same Rights !', 'Warning', { timeOut: 3000 });
                $('#updateModal').modal('hide');
            }
            else {
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

    rowData = datatableVariable.row($(this).closest('tr')).data();


    var delete_info = {};
    rowData = datatableVariable.row($(this).closest('tr')).data();

    delete_info.Id = rowData.Id;
    delete_info.Account = rowData.Account;
    var confirmDelete = confirm("Are you sure you want to delete this record?");
    if (confirmDelete) {
        $.post(apiURL + 'Delete_Rights', delete_info, function (response) {


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


function fetchAccounts() {

    $.ajax({
        url: apiURL + 'Get_IT_member_details', // Replace with your API endpoint URL
        method: 'GET',
        success: function (data) {


        },
        error: function (xhr, status, error) {
            console.error(error);
        }
    });
}

// Function to initialize autocomplete with fetched data
//function initializeAutocomplete(accounts) {
//    $("#txtName").autocomplete({
//        source: accounts,
//        minLength: 0 // Show suggestions even when input is empty
//    }).focus(function () {
//        $(this).autocomplete("search");
//    });
//}

//$.ajax({
//    url: 'api/Employee/GetEmployees', // Replace with your Web API endpoint URL
//    method: 'GET',
//    success: function (data) {
//        initializeDropdown(data);
//    },
//    error: function (xhr, status, error) {
//        console.error(error);
//    }
//});

function initializeDropdown(accountsData) {

    //$('#accountDropdown').dropdown({
    //    values: employeeData.map(function (employee) {
    //        return { name: employee.EmployeeName, value: employee.Account };
    //    }),
    //    onChange: function (value, text, $selectedItem) {
    //        // Handle dropdown change event if needed
    //    }
    //});
    $('#accountInput').autocomplete({
        source: accountsData.map(function (account) {
            return { label: account.Account, value: account.Account };
        }),
        select: function (event, ui) {
            // Handle selection event if needed
            console.log('Selected barcode:', ui.item.value);
        }
    });
}
