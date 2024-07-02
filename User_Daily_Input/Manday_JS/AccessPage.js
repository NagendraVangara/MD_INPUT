

$('.top.menu .item').tab();
 //  var apiURL = 'http://localhost:53943/api/apcnote/';

var apiURL = 'http://10.3.0.70:9001/api/apcnote/';
//  var apiURL = 'http://10.3.0.208:9001/api/apcnote/';



var selectedRegion = '';

$(document).ready(function () {


    $('#rpt_grid').hide();
    // Initialize datepicker for from date and to date fields
    $('#fromDate, #toDate,#t_fromDate,#t_toDate').datepicker({
        dateFormat: 'yy-mm-dd',
        changeMonth: true,
        changeYear: true,
    });
    Get_Projects();


    $('#region,#t_region').change(function () {

        selectedRegion = $(this).val();


        if (selectedRegion == '' || selectedRegion == null) {
            alert('Please select Region');
        }
        else if (selectedRegion == 'ALL') {
            $('#department,#t_department').empty();
            $('#department,#t_department').dropdown('clear');

            $('#department,#t_department').append($('<option>', {
                value: '',
                text: 'Select Department'
            }));
            $('#department,#t_department').append($('<option>', {
                value: 'ALL',
                text: 'ALL'
            }));
        } else {


            var region = {
                Region: selectedRegion
            };
            $.post(apiURL + 'GetDepartmentsByRegion', region, function (response) {


                // Clear existing options
                $('#department,#t_department').empty();

                // Add default option
                $('#department,#t_department').append($('<option>', {
                    value: '',
                    text: 'Select Department'
                }));
                $('#department,#t_department').append($('<option>', {
                    value: 'ALL',
                    text: 'ALL'
                }));
                $.each(response, function (index, department) {

                    $('#department,#t_department').append($('<option>', {
                        value: department,
                        text: department
                    }));

                });


            }).fail(function (jqxhr, settings, ex) {
                $(".dimmer").hide();
                alert("error: " + ex);
            });




        }


    });


    $('#department,#t_department').change(function () {

        var selectedDepartment = $(this).val();


        if (selectedDepartment == 'ALL') {
            $('#employee,#t_employee').empty();

            $('#employee,#t_employee').append($('<option>', {
                value: 'ALL',
                text: 'ALL'
            }));
        }
        else {
            $('#employee,#t_employee').empty();


            $('#employee,#t_employee').append($('<option>', {
                value: '',
                text: 'Select Employee'
            }));
            var region = {
                Region: selectedRegion,
                Department: selectedDepartment
            };
            $.post(apiURL + 'GetEmpNosByRegion', region, function (response) {



                if (response.length > 1) {
                    $('#employee,#t_employee').append($('<option>', {
                        value: 'ALL',
                        text: 'ALL'
                    }));
                }
                $.each(response, function (index, e_no) {

                    $('#employee,#t_employee').append($('<option>', {
                        value: e_no,
                        text: e_no
                    }));
                });



            }).fail(function (jqxhr, settings, ex) {
                $(".dimmer").hide();
                alert("error: " + ex);
            });

        }


    });


});
function Get_Projects() {

    $.ajax({
        url: apiURL + 'Get_Project',
        method: 'GET',
        data: { category: '' },
        success: function (data) {

            var projects = JSON.parse(data);


            projects.forEach(function (project) {
                $('#project_name').append('<option value="' + project.PROJECT_NO + '">' + project.PROJECT_NAME + '</option>');
                //$('#t_project_name').append('<option value="' + project.project_no + '">' + project.project_name + '</option>');

            });
        },
        error: function () {
            // Handle error if needed
            console.error('Error fetching project list');
        }
    });
}


$('#submit').click(function () {

    if ($("#region").val() == "") {
        alert('Please Select Region');
        $("#region").focus();
    }
    else if ($("#department").val() == "") {
        alert('Please Select Department');
        $("#department").focus();
    } else if ($("#employee").val() == "") {
        alert('Please Select Employee Number');
        $("#employee").focus();
    }
    else if ($("#Category").val() == "") {
        alert('Please Select Category');
        $("#Category").focus();
    }
    else if ($("#fromDate").val() == "") {
        alert('Please Select From Date');
        $("#s_date").focus();
        return false;
    } else if
        ($("#toDate").val() == "") {
        alert('Please Select To Date');
        $("#e_date").focus();
        return false;
    } else if ($("#fromDate").val() > $("#toDate").val()) {
        alert('Start Date greater than To Date');
        $("#fromDate").focus();
    } else if (!$('input[name="frequency"]:checked').length) {
        alert('Please select Lock or Unlock');
        return false;
    }
    else {
        var input_details = {};
        input_details.Region = $('#region').val();
        input_details.Department = $('#department').val();
        input_details.EmployeeNumber = $('#employee').val();
        //  input_details.EmployeeNumber = $('#region').val();
        input_details.Category = $('#Category').val();
        input_details.ProjectName = $('#project_name').val();
        input_details.Start_date = $('#fromDate').val();
        input_details.To_date = $('#toDate').val();
        var lockValue = $('input[name="frequency"]:checked').val();
        var lockStatus = (lockValue === "Lock");
        input_details.Lock = lockStatus;
        // input_details.Region = $('#region').val();
        //input_details.Region = $('#region').val();
        $.post(apiURL + 'Lock_Manday_input', input_details, function (response) {


            if (response == 'Success' && lockValue === "Lock") {
                // alert("Succesfully DATA LOCKED");
                toastr.success('Succesfully DATA LOCKED!', 'Success', { timeOut: 3000 });
                Projects_data();

            } else if (response == 'Success' && lockValue === "UnLock") {
                // alert("Succesfully DATA UN-LOCKED");
                toastr.success('Succesfully DATA UN-LOCKED!', 'Success', { timeOut: 3000 });
                Projects_data();

            }

            else {

                console.log('failed');

            }
        }).fail(function (jqxhr, settings, ex) {
            $(".dimmer").hide();
            alert("Error: " + ex);
        });
    }



});


$('#search').click(function () {

    if ($("#t_region").val() == "") {
        alert('Please Select Region');
        $("#region").focus();
    }
    else if ($("#t_department").val() == "") {
        alert('Please Select Department');
        $("#department").focus();
    }
    else if ($("#t_fromDate").val() == "") {
        alert('Please Select From Date');
        $("#s_date").focus();
        return false;
    } else if
        ($("#t_toDate").val() == "") {
        alert('Please Select To Date');
        $("#e_date").focus();
        return false;
    } else if ($("#t_fromDate").val() > $("#t_toDate").val()) {
        alert('Start Date greater than To Date');
        $("#s_date").focus();
    }
    else {
        var User = {};

        User.Start_date = $("#t_fromDate").val();
        User.To_date = $("#t_toDate").val();
        User.Region = $('#t_region').val();
        User.Department = $('#t_department').val();


        User.Category = $('#t_Category').val();

        //$.ajax({
        //    type: "GET",
        //    contentType: "application/json", // Set Content-Type header to JSON
        //    dataType: "json",
        //    //contentType: "json",
        //   // data: JSON.stringify(User),
        //    data:User,
        //    url: apiURL + 'Daily_Manday_Report_LockStatus',
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
        //                { data: 'EmployeeNumber' },
        //                { data: 'LtH' },
        //                { data: 'Category' },
        //                { data: 'ProjectName' },
        //                { data: 'RequirementName' },
        //                { data: 'ContentName' },
        //                { data: 'Remark' },
        //                {
        //                    data: 'Lock',
        //                    render: function (data) {
        //                        if (data === true) {
        //                            return '<span style="color: red;">Lock</span>';
        //                        } else {
        //                            return '<span style="color: green;">Not Locked</span>';
        //                        }
        //                    }
        //                }


        //                //{ data: 'RequirementName', visible: false },
        //                //{
        //                //    data: 'ContentName',

        //                //    visible: false,
        //                //    width: "20px",
        //                //    render: function (data, type, row) {
        //                //        if (type === 'display') {
        //                //            var paragraphs = data.split('\n');
        //                //            return paragraphs.join('<br>');
        //                //        }
        //                //        return data;
        //                //    }
        //                //},
        //                //{ data: 'Remark', visible: false }

        //            ],
        //            //dom: 'Bfrtip',
        //            //buttons:
        //            //    [
        //            //        {
        //            //            extend: 'excelHtml5',
        //            //            title: 'Excel',
        //            //            text: 'Export to excel'

        //            //        }
        //            //    ]
        //        });

        //    }

        //});


        $.ajax({
            type: "GET",
            dataType: "json",
            //contentType: "application/json",
            data: User,
            url: apiURL + 'Daily_Manday_Report_LockStatus',
            success: function (data) {

                $('#rpt_grid').show();
                var datatableVariable = $('#datatable').DataTable({
                    "destroy": "true",
                    "dataSrc": "",
                    data: data,
                    scrollX: true,

                    columns: [
                        /* { data: 'ID', visible: true },*/
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
                            data: 'CheckType',
                            title: 'Check',
                            // title: '<input type="checkbox" id="selectAllCheckbox">',
                            visible: true,
                            render: function (data, type, row) {
                                if (type === 'display') {
                                    if (row.CheckType == true) {
                                        return '<i class="fas fa-check" style="color: blue;"></i>';
                                    } else {
                                        return '<i class="fas fa-exclamation-circle" style="color: blue;"></i>';
                                    }
                                } else if (type == 'myExport') {

                                    return row.CheckType ? 'Y' : 'N';
                                } else {
                                    return data;
                                }
                            }
                            //render: function (data, type, row) {
                            //    if (row.CheckType == true) {
                            //        return '<i class="fas fa-check" style="color: blue;"></i>';
                            //    } else
                            //        return '';
                            //}
                        },
                        {
                            data: 'Lock',
                            render: function (data) {
                                if (data === true) {
                                    /* return '<span style="color: red;">Lock</span>';*/
                                    return '<div class="lock">' + 'LOCKED' + '</div>';
                                } else {
                                    /*return '<span style="color: green;">Not Locked</span>';*/
                                    return '<div class="unlock">' + 'NOT LOCKED' + '</div>';
                                }
                            }
                        }
                    ],
                    dom: 'Bfrtip',
                    buttons: [
                        {
                            extend: 'excelHtml5',
                            title: 'Excel for lock/unlock',
                            text: 'Export to Excel',
                            exportOptions: {
                                orthogonal: "myExport"
                            }
                        }
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
            },

            beforeSend: function () {
                $('#cover-spin').show();
            },
            complete: function () {
                $('#cover-spin').hide();

            }

        });
    }
});


