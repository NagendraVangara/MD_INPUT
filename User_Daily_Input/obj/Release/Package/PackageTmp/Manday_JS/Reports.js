



//var apiURL = 'http://localhost:53943/api/apcnote/';

  var apiURL = 'http://10.3.0.70:9001/api/apcnote/';
//  var apiURL = 'http://10.3.0.208:9001/api/apcnote/';
var user_account = '';
var selectedRegion = '';

var datatableVariable;

var Role;
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
    //Users_details();


    //$('#region').dropdown({

    //    onChange: function (selectedValues, selectedText, $selectedItems) {
    //        debugger
    //        console.log(selectedText);
    //        // Update the content of the selectedOptions element
    //        $('#selectedOptions').text(selectedText.join(', '));
    //    }
    //});

    $('#rpt_grid').hide();
    qs();

    Get_company();
    Get_Userrole();
    $('#save-button').hide();
    $('#data-check-button').hide();



    $('#region').change(function () {


        selectedRegion = $(this).val();


        if (selectedRegion == '' || selectedRegion == null) {
            alert('Please select Region');
        }
        else if (selectedRegion == 'ALL') {
            $('#department').empty();
            $('#department').dropdown('clear');

            $('#department').append($('<option>', {
                value: '',
                text: 'Select Department'
            }));
            $('#department').append($('<option>', {
                value: 'ALL',
                text: 'ALL'
            }));
            $('#emp_no').empty();
            $('#emp_no').append($('<option>', {
                value: '',
                text: 'Select Employee Number'
            }));
            $('#emp_no').append($('<option>', {
                value: 'ALL',
                text: 'ALL'
            }));
        } else {

            user_account = $('#userid').val();
            var dept = {
                Assigned_region: selectedRegion,
                Account: user_account
            };

            $.post(apiURL + 'GetDepartmentsByRight', dept, function (response) {



                $('#department').empty();
                $('#department').append($('<option>', {
                    value: '',
                    text: 'Select Department'
                }));

                //$.each(response[0], function (index, region) {
                //    $('#region').append($('<option>', {
                //        value: region,
                //        text: region
                //    }));
                //});
                var arrdata = JSON.parse(response[0]);


                var content = '';
                if (arrdata.length > 0) {


                    for (j = 0; j < arrdata.length; j++) {

                        content = content + '<option value="' + arrdata[j].DEPARTMENT + '">' + arrdata[j].DEPARTMENT + '</option>';

                    }

                    $('#department').append(content);


                }

            }, 'json').fail(function (jqxhr, settings, ex) {
                $(".dimmer").hide();
                alert("error: " + ex);
            });
            $('#department').dropdown('clear');
        }

        //$.post(apiURL + 'GetDepartmentsByRegion', region, function (response) {

        //    console.log(response);
        //    // Clear existing options
        //    $('#department').empty();

        //    // Add default option
        //    $('#department').append($('<option>', {
        //        value: '',
        //        text: 'Select Department'
        //    }));

        //    $.each(response, function (index, department) {
        //        $('#department').append($('<option>', {
        //            value: department,
        //            text: department
        //        }));
        //    });

        //}).fail(function (jqxhr, settings, ex) {
        //    $(".dimmer").hide();
        //    alert("error: " + ex);
        //});






    });


    $('#department').dropdown({

        onChange: function (selectedValues, selectedText, $selectedItems) {

            // Update the content of the selectedOptions element
            if (Array.isArray(selectedText)) {
                // Update the content of the selectedOptions element
                $('#selectedOptions').text(selectedText.join(', '));
            } else {
                // If selectedText is not an array, it means only one option is selected
                $('#selectedOptions').text(selectedText);
            }
        }
    });





    $('#department').change(function () {


        var selecteddept = $(this).val();


        if (selecteddept == '') {
            alert('Please select Department');
            //$('#emp_no').dropdown('clear');
            $('#emp_no').empty();
        }
        else if (selecteddept == 'ALL' || selecteddept.length > 1) {
            $('#emp_no').empty();
            $('#emp_no').dropdown('clear');

            $('#emp_no').append($('<option>', {
                value: '',
                text: 'Select Employee Number'
            }));
            $('#emp_no').append($('<option>', {
                value: 'ALL',
                text: 'ALL'
            }));
        } else {

            user_account = $('#userid').val();

            var employeeValue = $('#department').val().toString();

            var emp = {
                Region: selectedRegion,
                Account: user_account,
                Department: employeeValue
            };

            $.post(apiURL + 'GetEmpNosByRight', emp, function (response) {



                $('#emp_no').empty();
                $('#emp_no').append($('<option>', {
                    value: '',
                    text: 'Select Employee Number'
                }));

                //$.each(response[0], function (index, region) {
                //    $('#region').append($('<option>', {
                //        value: region,
                //        text: region
                //    }));
                //});
                var arrdata = JSON.parse(response[0]);


                var content = '';

                if (arrdata.length > 1) {

                    content = content + '<option value="ALL">' + 'ALL' + '</option>';
                }
                if (arrdata.length > 0) {


                    for (j = 0; j < arrdata.length; j++) {

                        content = content + '<option value="' + arrdata[j].EMP_NO + '">' + arrdata[j].EMP_NO + ' | ' + arrdata[j].EMP_NAME + '</option>';

                    }
                    $('#emp_no').empty();
                    $('#emp_no').append(content);


                }


            });
        }
    });


    //$('#selectAllCheckbox').on('change', function () {
    //    var isChecked = $(this).prop('checked');
    //    $('#datatable').find('tbody input[type="checkbox"]').prop('checked', isChecked);
    //});

    //$('#data-check-button').on('click', function () {
    //    var checkboxes = $('#datatable').find('tbody input[type="checkbox"]');
    //    checkboxes.prop('disabled', false).prop('checked', true);
    //});


    //$('#data-check-button').on('click', function () {
    //    var checkboxes = $('#datatable').find('tbody input[type="checkbox"]');
    //    var allChecked = checkboxes.length === checkboxes.filter(':checked').length;
    //    checkboxes.prop('checked', !allChecked);
    //    checkboxes.prop('disabled', false).prop('checked', true);
    //});

    //$('#data-check-button').on('click', function () {
    //    var checkboxes = $('#datatable').find('tbody input[type="checkbox"]');
    //    var textboxes = $('#datatable').find('tbody input[type="text"]');
    //    var allChecked = checkboxes.length === checkboxes.filter(':checked').length;

    //    checkboxes.prop('checked', !allChecked);
    //    textboxes.prop('disabled', !allChecked);
    //});


    $('#data-check-button').on('click', function () {

        var checkboxes = $('#datatable').find('tbody input[type="checkbox"]');

        // Check if all checkboxes are currently checked
        var allChecked = checkboxes.filter(':checked').length === checkboxes.length;

        // Toggle the state of checkboxes
        checkboxes.prop('disabled', allChecked).prop('checked', !allChecked);
        $('#save-button').show();
    });







    //$('#data-check-button').on('click', function () {
    //    var checkboxes = $('#datatable').find('tbody input[type="checkbox"]');

    //    // Iterate over each page of the DataTable
    //    $('#datatable').DataTable().rows().every(function () {
    //        var data = this.data();

    //        // Check the checkbox for each row
    //        $(data).each(function () {
    //            checkboxes.eq($(this.index())).prop('checked', true);
    //        });
    //    });
    //});

});

//$('#save-button').on('click', function () {
//    debugger
//    // Extract the data of all rows
//    var tableData = [];
//    datatableVariable.rows().every(function () {
//        tableData.push(this.data());
//    });

//    // Send the data to the API for updating the "CheckType" field
//    $.ajax({
//        type: "POST",
//        contentType: "application/json",
//        data: JSON.stringify(tableData),
//        url: apiURL + 'UpdateCheckType',
//        success: function (response) {
//            // Handle success response from the API
//            console.log("Data updated successfully:", response);
//        },
//        error: function (xhr, status, error) {
//            // Handle error response from the API
//            console.error("Error updating data:", error);
//        }
//    });
//});

$('#save-button').on('click', function () {

    // Extract the data of all rows
    var tableData = [];
    datatableVariable.rows().every(function () {

        var rowData = this.data();
        var checkbox = $(this.node()).find('input[type="checkbox"]');
        if (!checkbox.prop('disabled')) {
            rowData.CheckType = checkbox.prop('checked'); // Set CheckType based on checkbox status
            tableData.push(rowData);
        }
        //rowData.CheckType = checkbox.prop('checked');
        // tableData.push(rowData);
    });


    // Send the data to the API for updating the "CheckType" field
    $.ajax({
        type: "POST",
        contentType: "application/json",
        data: JSON.stringify(tableData),
        url: apiURL + 'UpdateCheckType',
        success: function (response) {

            if (response == 'updated') {

                // alert("Data updated successfully");
                toastr.success('Succesfully DATA UPDATED!', 'Success', { timeOut: 3000 });
                datatableVariable.rows().every(function () {
                    var checkbox = $(this.node()).find('input[type="checkbox"]');
                    if (!checkbox.prop('disabled')) {
                        checkbox.prop('disabled', true);
                    }
                });

            }

        }, beforeSend: function () {
            $('#cover-spin').show();
        },
        complete: function () {
            $('#cover-spin').hide();

        },
        error: function (xhr, status, error) {
            // Handle error response from the API
            toastr.error('Error updating data:', error, 'Error', { timeOut: 3000 });
            //  console.error("Error updating data:", error);
        }
    });
});

function Get_company() {

    user_account = $('#userid').val();
    var User1 = {
        Account: user_account
    };

    $.post(apiURL + 'GetCompanyByRight', User1, function (response) {


        $('#region').append($('<option>', {
            value: '',
            text: 'Select Company'
        }));


        var arrdata = JSON.parse(response[0]);

        var content = '';

        if (arrdata.length > 2) {
            var all = '<option value="ALL">ALL</option>';
            $('#region').append(all);
        }
        if (arrdata.length > 0) {
            for (j = 0; j < arrdata.length; j++) {
                content += '<option value="' + arrdata[j].REGION + '">' + arrdata[j].REGION + '</option>';
            }
            $('#region').append(content);
        }


    }, 'json').fail(function (jqxhr, settings, ex) {
        $(".dimmer").hide();
        alert("error: " + ex);
    });
}
function Get_Userrole() {

    user_account = $('#userid').val();
    var User1 = {
        ACCOUNT: user_account
    };

    $.post(apiURL + 'Get_UserRole', User1, function (response) {



        Role = response;

    }, 'json').fail(function (jqxhr, settings, ex) {
        $(".dimmer").hide();
        alert("error: " + ex);
    });
}

$("#s_date,#e_date").datepicker({
    dateFormat: 'yy-mm-dd',
    changeMonth: true,
    changeYear: true

});

async function fetchData() {
    try {
        const data = await new Promise((resolve, reject) => {
            $.ajax({
                type: "GET",
                dataType: "json",
                data: User,
                url: apiURL + 'Daily_Input_Report',
                success: function (data) {
                    resolve(data);
                },
                beforeSend: function () {
                    $('#cover-spin').show();
                },
                complete: function () {
                    $('#cover-spin').hide();

                },
                error: function (xhr, status, error) {
                    reject(error);
                }
            });
        });



        $('#rpt_grid').show();
        if (Role != 'USER') {
            $('#data-check-button').show();
        }
        datatableVariable = $('#datatable').DataTable({
            "destroy": "true",
            "dataSrc": "",
            data: data,
            scrollX: true,
            pageLength: 10,
            columns: [
                /* {data: 'ID', visible: true },*/

                {
                    data: null, title: 'S.No.', visible: true, render: function (data, type, row, meta) {
                        return meta.row + 1;
                    }
                },
                {
                    data: 'FillDate',
                    render: function (d) {
                        return moment(d).format("YYYY-MM-DD");
                    }
                },
                { data: 'Region' },
                { data: 'Department' },
                { data: 'EmployeeName' },
                { data: 'EmployeeNumber' },
                { data: 'LtH' },
                { data: 'Category' },
                { data: 'ProjectName' },
                { data: 'RequirementName', visible: true },
                {
                    data: 'ContentName',

                    visible: true,
                    width: "20px",
                    //render: function (data, type, row) {
                    //    if (type === 'display') {
                    //        var paragraphs = data.split('\n');
                    //        return paragraphs.join('<br>');
                    //    }
                    //    return data;
                    //}
                },
                { data: 'Remark', visible: true },
                { data: 'CreatedDate', visible: true },
                { data: 'CreatedTime', visible: true },
                { data: 'CreatedBy', visible: true },
                { data: 'UpdatedDate', visible: true },
                { data: 'UpdatedTime', visible: true },
                { data: 'UpdatedBy', visible: true },
                {
                    data: 'Lock',
                    title: 'Lock',
                    visible: true,
                    render: function (data, type, row) {
                        if (type === 'display') {
                            if (row.Lock) {
                                return '<i class="fas fa-lock" style="color: red;"></i>';
                            } else {
                                return '<i class="fas fa-lock-open" style="color: green;"></i>';
                            }
                        } else if (type == 'myExport') {

                            return row.Lock ? 'Y' : 'N';
                        } else {
                            return data;
                        }
                    }
                },
                {
                    data: 'CheckType',
                    title: 'Check Type',
                    visible: true,
                    render: function (data, type, row) {
                        if (type === 'display') {
                            if (row.CheckType) {
                                return '<input type="checkbox" checked disabled>';
                            } else {
                                return '<input type="checkbox" disabled>';
                            }
                        } else if (type == 'myExport') {

                            return row.CheckType ? 'Y' : 'N';
                        } else {
                            return data;
                        }
                    }
                }





            ],
            dom: 'lBfrtip',


            // dom: '<Blfrip>rt<"bottom"ip><"clear">',
            buttons: [
                {
                    extend: 'excelHtml5',
                    title: 'Daily Input Report',
                    text: 'Export to Excel',
                    // className: 'excel-button',
                    exportOptions: {
                        orthogonal: "myExport"
                    }
                    // action: function (e, dt, node, config) {

                    //    var data = dt.data();

                    //    $.fn.dataTable.ext.buttons.excelHtml5.action.call(this, e, dt, node, config);
                    //}
                },
                //{
                //    text: 'Custom Button',
                //    action: function (e, dt, node, config) {
                //        // Custom button action goes here
                //        // Enable the checkboxes in the "Check Type" column for all records
                //        dt.rows().every(function () {
                //            var checkbox = $(this.node()).find('input[type="checkbox"]');
                //            checkbox.prop('disabled', false);
                //        });
                //    }

                //}
            ],

            drawCallback: function (settings) {
                var api = this.api();
                var rows = api.rows({ page: 'current' }).nodes();
                var lastRegion = null;
                var lastDepartment = null;

                api.column(2, { page: 'current' }).data().each(function (group, i) {
                    if (lastRegion !== group) {
                        $(rows).eq(i).before('<tr class="group region-group"><td colspan="19">' + group + '</td></tr>');
                        lastRegion = group;
                    }

                    var department = api.column(3, { page: 'current' }).data()[i];
                    if (lastDepartment !== department) {
                        $(rows).eq(i).before('<tr class="subgroup department-subgroup"><td colspan="19">' + department + '</td></tr>');
                        lastDepartment = department;
                    }
                });

                // Apply background colors to the region and department groups
                $('.group.region-group').css('background-color', '#FADBD8'); // Change color as needed
                $('.subgroup.department-subgroup').css('background-color', '#D4E6F1'); // Change color as needed
            }



        });
    } catch (error) {
        console.error('Error fetching data:', error);
    }
}

var User = {};
$('#search').click(function () {


    if ($("#region").val() == "") {
        alert('Please Select Region');
        $("#region").focus();
    }
    else if ($("#department").val() == "") {
        alert('Please Select Department');
        $("#department").focus();
    } else if ($("#emp_no").val() == "") {
        alert('Please Select Employee');
        $("#emp_no").focus();
    }
    else if ($('#category').val() == '') {
        alert('Please Select Category');
        $("#category").focus();
    }
    else if ($("#s_date").val() == "") {
        alert('Please Select From Date');
        $("#s_date").focus();
        return false;
    } else if
        ($("#e_date").val() == "") {
        alert('Please Select To Date');
        $("#e_date").focus();
        return false;
    } else if ($("#s_date").val() > $("#e_date").val()) {
        alert('Start Date greater than To Date');
        $("#s_date").focus();
    }
    else {
        //  $("#loader").show();
        User.Start_date = $("#s_date").val();
        User.To_date = $("#e_date").val();
        User.Region = $('#region').val();
        User.Category = $('#category').val();
        User.EmployeeNumber = $('#emp_no').val();
        // User.Department = $('#department').val();
        // var departmentValue = $('#department').val().toString();
        // var departmentArray = departmentValue.split(',');
        var departmentValue = $('#department').val().toString();
        var departmentArray = departmentValue.split(',').map(function (dept) {
            return "'" + dept.trim() + "'";
        });
        var formattedDepartmentValue = departmentArray.join(',');

        User.Department = formattedDepartmentValue


        fetchData();

        //$.ajax({
        //    type: "GET",
        //    dataType: "json",
        //   // contentType: "application/json",
        //    data: User,
        //    url: apiURL + 'Daily_Input_Report',
        //    success: function (data) {
        //        $('#rpt_grid').show();
        //        var datatableVariable = $('#datatable').DataTable({
        //            "destroy": "true",
        //            "dataSrc": "",
        //            data: data,
        //            columns: [
        //              /*  { data: 'ID', visible: true },*/
        //                {
        //                    data: null, title: 'S.No.', visible: true, render: function (data, type, row, meta) {
        //                        return meta.row + 1;
        //                    }
        //                },
        //                {
        //                    data: 'FillDate',
        //                    render: function (d) {
        //                        return moment(d).format("YYYY-MM-DD");
        //                    }
        //                },
        //                { data: 'Region' },
        //                { data: 'Department' },
        //                { data: 'EmployeeName' },
        //                { data: 'EmployeeNumber'},
        //                { data: 'LtH' },
        //                { data: 'Category' },
        //                { data: 'ProjectName' },
        //                { data: 'RequirementName' ,visible: true },
        //                //{ data: 'CONTENT_NAME', title: 'CONTENT NAME', visible: true, width: "20px" },
        //                {
        //                    data: 'ContentName',

        //                    visible: true,
        //                    width: "20px",
        //                    render: function (data, type, row) {
        //                        if (type === 'display') {
        //                            // Split the text into paragraphs
        //                            var paragraphs = data.split('\n');
        //                            // Join the paragraphs with <br> tags
        //                            return paragraphs.join('<br>');
        //                        }
        //                        return data;
        //                    }
        //                },
        //                { data: 'Remark',visible: true }

        //            ],
        //            dom: 'Bfrtip',
        //            buttons:
        //                [
        //                    {
        //                        extend: 'excelHtml5',
        //                        title: 'Excel',
        //                        text: 'Export to excel'

        //                    }
        //                ]
        //        });

        //    }

        //});

        // async function fetchData() {


        //test




        //$.ajax({
        //    type: "GET",
        //    dataType: "json",
        //    ////contentType: "application/json",
        //    data: User,
        //    url: apiURL + 'Daily_Input_Report',                

        //    success: function (data) {
        //      //  $("#loader").hide();

        //        $('#rpt_grid').show();
        //        if (Role != 'USER') {
        //            $('#data-check-button').show();
        //        }
        //        datatableVariable = $('#datatable').DataTable({
        //            "destroy": "true",
        //            "dataSrc": "",
        //            data: data,
        //            scrollX: true,
        //            columns: [
        //                /* { data: 'ID', visible: true },*/
        //                {
        //                    data: null, title: 'S.No.', visible: true, render: function (data, type, row, meta) {
        //                        return meta.row + 1;
        //                    }
        //                },
        //                {
        //                    data: 'FillDate',
        //                    render: function (d) {
        //                        return moment(d).format("YYYY-MM-DD");
        //                    }
        //                },
        //                { data: 'Region' },
        //                { data: 'Department' },
        //                { data: 'EmployeeName' },
        //                { data: 'EmployeeNumber' },
        //                { data: 'LtH' },
        //                { data: 'Category' },
        //                { data: 'ProjectName' },
        //                { data: 'RequirementName', visible: true },
        //                {
        //                    data: 'ContentName',

        //                    visible: true,
        //                    width: "20px",
        //                    //render: function (data, type, row) {
        //                    //    if (type === 'display') {
        //                    //        var paragraphs = data.split('\n');
        //                    //        return paragraphs.join('<br>');
        //                    //    }
        //                    //    return data;
        //                    //}
        //                },
        //                { data: 'Remark', visible: true },
        //                { data: 'CreatedDate', visible: true },
        //                { data: 'CreatedTime', visible: true },
        //                { data: 'CreatedBy', visible: true },
        //                { data: 'UpdatedDate', visible: true },
        //                { data: 'UpdatedTime', visible: true },
        //                { data: 'UpdatedBy', visible: true },
        //                {
        //                    data: 'Lock',
        //                    title: 'Lock',
        //                    visible: true,
        //                    render: function (data, type, row) {
        //                        if (type === 'display') {
        //                            if (row.Lock) {
        //                                return '<i class="fas fa-lock" style="color: blue;"></i>';
        //                            } else {
        //                                return '';
        //                            }
        //                        } else if (type == 'myExport') {

        //                            return row.Lock ? 'Y' : 'N';
        //                        } else {
        //                            return data;
        //                        }
        //                    }
        //                },
        //                {
        //                    data: 'CheckType',
        //                    title: 'Check Type',
        //                    visible: true,
        //                    render: function (data, type, row) {
        //                        if (type === 'display') {
        //                            if (row.CheckType) {
        //                                return '<input type="checkbox" checked disabled>';
        //                            } else {
        //                                return '<input type="checkbox" disabled>';
        //                            }
        //                        } else if (type == 'myExport') {

        //                            return row.CheckType ? 'Y' : 'N';
        //                        } else {
        //                            return data;
        //                        }
        //                    }
        //                }

        //                //{
        //                //    data: 'Lock',
        //                //    title: 'Lock',
        //                //    visible: true,
        //                //    render: function (data, type, row) {

        //                //        if (row.Lock == true) {
        //                //            return '<i class="fas fa-lock" style="color: blue;"></i>';
        //                //        }
        //                //        else if (type === 'excel') {
        //                //            return data ? 'Y' : 'N';
        //                //        } else {
        //                //            return '';
        //                //        }

        //                //    }
        //                //},
        //                //{
        //                //    data: 'CheckType',
        //                //    title: 'Check Type',
        //                //    //title: '<input type="checkbox" id="selectAllCheckbox">',
        //                //    visible: true,
        //                //    render: function (data, type, row) {
        //                //        if (row.CheckType == true) {
        //                //           //  return '<i class="fas fa-check" style="color: blue;"></i>';
        //                //            return '<input type="checkbox" ' + (data ? 'checked' : '') + ' disabled>';
        //                //        } else if (type === 'excel') {
        //                //            return data ? 'Y' : 'N';
        //                //        } 
        //                //        else
        //                //            return '<input type="checkbox" disabled>';
        //                //    }
        //                //},
        //                //{
        //                //    data: 'CheckType',
        //                //    title: 'Check Type',
        //                //    visible: false, // Initially hide the column
        //                //    render: function (data, type, row) {
        //                //        if (type === 'display') {
        //                //            return '<input type="checkbox" ' + (data ? 'checked' : '') + ' disabled>';
        //                //        }
        //                //        return data;
        //                //    }
        //                //}


        //            ],
        //            dom: 'Bfrtip',
        //            buttons: [
        //                {
        //                    extend: 'excelHtml5',
        //                    title: 'Daily Input Report',
        //                    text: 'Export to Excel',
        //                    exportOptions: {
        //                        orthogonal: "myExport"
        //                    }
        //                    // action: function (e, dt, node, config) {

        //                    //    var data = dt.data();

        //                    //    $.fn.dataTable.ext.buttons.excelHtml5.action.call(this, e, dt, node, config);
        //                    //}
        //                },
        //                //{
        //                //    text: 'Custom Button',
        //                //    action: function (e, dt, node, config) {
        //                //        // Custom button action goes here
        //                //        // Enable the checkboxes in the "Check Type" column for all records
        //                //        dt.rows().every(function () {
        //                //            var checkbox = $(this.node()).find('input[type="checkbox"]');
        //                //            checkbox.prop('disabled', false);
        //                //        });
        //                //    }

        //                //}
        //            ],

        //            drawCallback: function (settings) {
        //                var api = this.api();
        //                var rows = api.rows({ page: 'current' }).nodes();
        //                var lastRegion = null;
        //                var lastDepartment = null;

        //                api.column(2, { page: 'current' }).data().each(function (group, i) {
        //                    if (lastRegion !== group) {
        //                        $(rows).eq(i).before('<tr class="group region-group"><td colspan="19">' + group + '</td></tr>');
        //                        lastRegion = group;
        //                    }

        //                    var department = api.column(3, { page: 'current' }).data()[i];
        //                    if (lastDepartment !== department) {
        //                        $(rows).eq(i).before('<tr class="subgroup department-subgroup"><td colspan="19">' + department + '</td></tr>');
        //                        lastDepartment = department;
        //                    }
        //                });

        //                // Apply background colors to the region and department groups
        //                $('.group.region-group').css('background-color', '#FADBD8'); // Change color as needed
        //                $('.subgroup.department-subgroup').css('background-color', '#D4E6F1'); // Change color as needed
        //            }



        //        });
        //    },
        //    beforeSend: function () {
        //        $('#cover-spin').show();
        //    },
        //    complete: function () {
        //        $('#cover-spin').hide();

        //    },
        //});



        //test
        // }



    }
});

