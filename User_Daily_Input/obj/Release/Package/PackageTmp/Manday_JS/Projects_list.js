

//var apiURL = 'http://localhost:53943/api/apcnote/';
   var apiURL = 'http://10.3.0.70:9001/api/apcnote/';
 //  var apiURL = 'http://10.3.0.208:9001/api/apcnote/';

var update_prjcts = {};

$("#s_date,#go_live_date,#exit_date").datepicker({
    dateFormat: 'yy-mm-dd',
    changeMonth: true,
    changeYear: true,

});
//$("#go_live_date").datepicker({
//    format: 'yyyy-mm-dd',
//    dateFormat: 'yy-mm-dd',
//    autoclose: true,
//    todayHighlight: true,

//});
//$("#exit_date").datepicker({
//    format: 'yyyy-mm-dd',
//    dateFormat: 'yy-mm-dd',
//    autoclose: true,
//    todayHighlight: true,

//});

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



function performSearch() {
    var searchText = document.getElementById('searchInput').value.toLowerCase();
    var rows = document.querySelectorAll('#dataTable tbody tr');

    rows.forEach(row => {
        var cells = row.querySelectorAll('td');
        var found = false;
        cells.forEach(cell => {
            if (cell.textContent.toLowerCase().indexOf(searchText) > -1) {
                found = true;
            }
        });
        if (found) {
            row.style.display = '';
        } else {
            row.style.display = 'none';
        }
    });
}




$(document).ready(function () {
    // Initialize date pickers
    var currentRow = '';
    var PROJECT_NAME = '';
    var PROJECT_NO = '';
    var IT_PM = '';
    var IT_PM_REGION = '';

    var START_DATE = '';
    var EX_GO_LIVE_DATE = '';
    var EXIT_DATE = '';
    var STATUS = '';
    var REMARK = '';
    var ID = '';
    qs();
    Projects_data();
    $('.datepicker').datepicker({
        format: 'yyyy-mm-dd',
        autoclose: true
    });

    // Add Row button click event
    $('#addRowBtn').click(function () {
        var newRow = '<tr>' +
            /* '<td><input type="text" class="form-control"></td>' +*/
            '<td><input type="text" class="form-control"></td>' +
            '<td><input type="text" class="form-control"></td>' +
            '<td><input type="text" class="form-control"></td>' +
            '<td><input type="text" class="form-control datepicker" placeholder="YYYY-MM-DD"></td>' +
            '<td><input type="text" class="form-control datepicker" placeholder="YYYY-MM-DD"></td>' +
            '<td><input type="text" class="form-control datepicker" placeholder="YYYY-MM-DD"></td>' +
            '<td>' +
            '<select class="form-control">' +
            '<option value="Ongoing">Not Start</option>' +
            '<option value="Ongoing">Ongoing</option>' +
            '<option value="Delay">Delay</option>' +
            '<option value="Close">Close</option>' +
            '<option value="Cancel ">Cancel</option>' +
            '<option value="Pending">Pending</option>' +
            '<option value="Maintanance">Maintanance</option>' +

            '</select>' +
            '</td>' +
            '<td><input type="text" class="form-control"></td>' +
            '<td>' +
            '<button class="btn btn-success btn-sm mr-2 btnEdit" style="display: none;"><i class="fas fa-pencil-alt"></i> Edit</button>' +
            '<button class="btn btn-danger btn-sm btnDelete" style="display: none;"><i class="fas fa-trash-alt"></i> Delete</button>' +
            '<button class="btn btn-success btn-sm mr-2 btnAdd"><i class="fas fa-save"></i> ADD</button>' +
            '<button class="btn btn-danger btn-sm btnCancel"><i class="fas fa-times"></i> Cancel</button>' +
            '</td>' +
            '</tr>';
        $('#dataTable tbody').prepend(newRow);
        // Reinitialize date pickers
        $('.datepicker').datepicker({
            format: 'yyyy-mm-dd',
            autoclose: true
        });
    });



    document.getElementById('searchInput').addEventListener('input', performSearch);

    $('#dataTable').on('click', '.btnEdit', function () {


        if (currentRow == '') {
            currentRow = $(this).closest('tr');


            PROJECT_NAME = currentRow.find('td:eq(2)').text().trim();
            IT_PM = currentRow.find('td:eq(3)').text().trim();
            IT_PM_REGION = currentRow.find('td:eq(4)').text().trim();

            START_DATE = currentRow.find('td:eq(5)').text().trim();
            EX_GO_LIVE_DATE = currentRow.find('td:eq(6)').text().trim();
            EXIT_DATE = currentRow.find('td:eq(7)').text().trim();
            STATUS = currentRow.find('td:eq(8)').text().trim();
            REMARK = currentRow.find('td:eq(9)').text().trim();
            //startDate = currentRow.find('td:eq(4)').find('input').val();
            //goLiveDate = currentRow.find('td:eq(5)').find('input').val();
            //exitDate = currentRow.find('td:eq(6)').find('input').val();
            //p_status = currentRow.find('td:eq(7)').find('select').val();

        }

        // Replace date inputs with date pickers and set existing values
        currentRow.find('td:eq(2)').html('<input type="text" class="form-control" value="' + PROJECT_NAME + '">');
        currentRow.find('td:eq(3)').html('<input type="text" class="form-control" value="' + IT_PM + '">');
        currentRow.find('td:eq(4)').html('<select class="ui dropdown">' +
            '<option value="APC">APC</option>' +
            '<option value="APH">APH</option>' +
            '<option value="APE">APE</option>' +
            '<option value="Group">Group</option>' +
            '</select>');
        currentRow.find('td:eq(4) select').val(IT_PM_REGION);


        currentRow.find('td:eq(5)').html('<input type="text" class="form-control datepicker" placeholder="YYYY-MM-DD" value="' + START_DATE + '">');
        currentRow.find('td:eq(6)').html('<input type="text" class="form-control datepicker" placeholder="YYYY-MM-DD" value="' + EX_GO_LIVE_DATE + '">');
        currentRow.find('td:eq(7)').html('<input type="text" class="form-control datepicker" placeholder="YYYY-MM-DD" value="' + EXIT_DATE + '">');
        currentRow.find('.datepicker').datepicker({
            dateFormat: 'yy-mm-dd',
            changeMonth: true,
            changeYear: true
        });
        // Replace dropdown with editable dropdown
        currentRow.find('td:eq(8)').html('<select class="ui dropdown">' +
            '<option value="NotStart">Not Start</option>' +
            '<option value="ongoing">Ongoing</option>' +
            '<option value="Delay">Delay</option>' +
            '<option value="Close">Close</option>' +
            '<option value="Cancel">Cancel</option>' +
            '<option value="Pending">Pending</option>' +
            '<option value="Maintanance">Maintanance</option>' +
            '</select>');
        currentRow.find('td:eq(8) select').val(STATUS);
        currentRow.find('td:eq(9)').html('<input type="text" class="form-control" value="' + REMARK + '">');


        $(this).hide(); // Hide Edit button
        currentRow.find('.btnDelete').hide(); // Hide Delete button
        currentRow.find('.btnSave').remove(); // Remove existing Save button
        currentRow.find('.btnCancel').remove(); // Remove existing Cancel button

        // Append Save and Cancel buttons
        $('<button class="ui positive button btnSave"><i class="fas fa-save"></i> </button>').insertBefore(currentRow.find('.btnDelete'));
        $('<button class="ui yellow button  btnCancel"><i class="fas fa-times"></i> </button>').insertBefore(currentRow.find('.btnDelete'));
        currentRow = '';
    });

    // Save and Cancel button click event (Event Delegation)
    $('#dataTable').on('click', '.btnSave', function () {
        var updatedRow = $(this).closest('tr');



        //ID = updatedRow.find('td:eq(0)').text();
        //START_DATE = updatedRow.find('td:eq(5)').text();
        //EX_GO_LIVE_DATE = updatedRow.find('td:eq(6)').text();
        //EXIT_DATE = updatedRow.find('td:eq(7)').text();
        //STATUS = updatedRow.find('td:eq(8)').text();
        //REMARK = updatedRow.find('td:eq(9)').text();

        //ID = updatedRow.find('td:eq(0)').find('input').val();
        //  ID = updatedRow.find('td:eq(0)').text();

        ID = updatedRow.attr('data-project-id');



        PROJECT_NAME = updatedRow.find('td:eq(2)').find('input').val();
        IT_PM = updatedRow.find('td:eq(3)').find('input').val();
        IT_PM_REGION = updatedRow.find('td:eq(4)').find('select').val();



        START_DATE = updatedRow.find('td:eq(5)').find('input').val();

        EX_GO_LIVE_DATE = updatedRow.find('td:eq(6)').find('input').val();

        EXIT_DATE = updatedRow.find('td:eq(7)').find('input').val();

        STATUS = updatedRow.find('td:eq(8)').find('select').val();

        REMARK = updatedRow.find('td:eq(9)').find('input').val();

        //  if (START_DATE < EX_GO_LIVE_DATE && EX_GO_LIVE_DATE < EXIT_DATE) {
        if ((EXIT_DATE === '' && START_DATE < EX_GO_LIVE_DATE) ||
            (EXIT_DATE !== '' && START_DATE < EX_GO_LIVE_DATE)) {
            var update_prjct_details = {
                ID: ID,
                PROJECT_NAME: PROJECT_NAME,
                IT_PM: IT_PM,
                IT_PM_REGION: IT_PM_REGION,
                START_DATE: START_DATE,
                EX_GO_LIVE_DATE: EX_GO_LIVE_DATE,
                EXIT_DATE: EXIT_DATE,
                STATUS: STATUS,
                REMARK: REMARK
            };
            updatedRow.find('input, select').prop('disabled', true); // Disable editing



            $.post(apiURL + 'Update_Project_Details', update_prjct_details, function (response) {


                if (response == 'Success') {
                    //alert("succesfully updated");
                    toastr.success('Project Details Updated!', 'Success', { timeOut: 3000 });

                    Projects_data();

                }

                else {
                    alert("Failed to update");
                    Projects_data();

                }
            }).fail(function (jqxhr, settings, ex) {
                $(".dimmer").hide();
                alert("Error: " + ex);
            });


            updatedRow.find('.btnEdit').show(); // Show Edit button
            updatedRow.find('.btnDelete').show(); // Show Delete button
            $(this).remove(); // Remove Save button
            updatedRow.find('.btnCancel').remove(); // Remove Cancel button
        } else {
            alert("Start date or go live date is not within the expected range.");

            updatedRow.find('td:eq(5)').find('input').focus();
        }
    });


    $('#dataTable').on('click', '.btnAdd', function () {
        var InsertRow = $(this).closest('tr');



        //ID = updatedRow.find('td:eq(0)').text();
        //START_DATE = updatedRow.find('td:eq(5)').text();
        //EX_GO_LIVE_DATE = updatedRow.find('td:eq(6)').text();
        //EXIT_DATE = updatedRow.find('td:eq(7)').text();
        //STATUS = updatedRow.find('td:eq(8)').text();
        //REMARK = updatedRow.find('td:eq(9)').text();

        //ID = updatedRow.find('td:eq(0)').find('input').val();


        //ID = InsertRow.find('td:eq(0)').text();
        //PROJECT_NAME = InsertRow.find('td:eq(2)').find('input').val();
        //PROJECT_NO = InsertRow.find('td:eq(1)').find('input').val();
        //IT_PM = InsertRow.find('td:eq(3)').find('input').val();

        //IT_PM_REGION = InsertRow.find('td:eq(4)').find('input').val();

        //START_DATE = InsertRow.find('td:eq(5)').find('input').val();

        //EX_GO_LIVE_DATE = InsertRow.find('td:eq(6)').find('input').val();

        //EXIT_DATE = InsertRow.find('td:eq(7)').find('input').val();

        //STATUS = InsertRow.find('td:eq(8)').find('select').val();

        //REMARK = InsertRow.find('td:eq(9)').find('input').val();

        //// Perform save operation here

        //var Insert_prjct_dtls = {
        //    ID: ID,
        //    START_DATE: START_DATE,
        //    EX_GO_LIVE_DATE: EX_GO_LIVE_DATE,
        //    EXIT_DATE: EXIT_DATE,
        //    STATUS: STATUS,
        //    REMARK: REMARK
        //};
        //InsertRow.find('input, select').prop('disabled', true); // Disable editing



        //$.post(apiURL + 'Insert_Project_details', Insert_prjct_dtls, function (response) {
        //    debugger

        //    if (response == 'Success') {
        //        alert("succesfully updated");
        //        Projects_data();

        //    }

        //    else {

        //        console.log('failed');

        //    }
        //}).fail(function (jqxhr, settings, ex) {
        //    $(".dimmer").hide();
        //    alert("Error: " + ex);
        //});


        updatedRow.find('.btnEdit').show(); // Show Edit button
        updatedRow.find('.btnDelete').show(); // Show Delete button
        $(this).remove(); // Remove Save button
        updatedRow.find('.btnCancel').remove(); // Remove Cancel button
    });

    $('#dataTable').on('click', '.btnCancel', function () {




        //var startDate = currentRow.find('td:eq(4)').find('input').val();
        //var goLiveDate = currentRow.find('td:eq(5)').find('input').val();
        //var exitDate = currentRow.find('td:eq(6)').find('input').val();
        //var status = currentRow.find('td:eq(7)').find('select').val();


        // Replace date inputs with date pickers and set existing values


        //currentRow.find('td:eq(4)').html('<input type="text" class="form-control datepicker" placeholder="YYYY-MM-DD" value="' + startDate + '">');
        //currentRow.find('td:eq(5)').html('<input type="text" class="form-control datepicker" placeholder="YYYY-MM-DD" value="' + goLiveDate + '">');
        //currentRow.find('td:eq(6)').html('<input type="text" class="form-control datepicker" placeholder="YYYY-MM-DD" value="' + exitDate + '">');
        //currentRow.find('.datepicker').datepicker({
        //    format: 'yyyy-mm-dd',
        //    autoclose: true
        //});
        //// Replace dropdown with editable dropdown
        //currentRow.find('td:eq(7)').html('<select class="form-control">' +
        //    '<option value="Not Start">Not Start</option>' +
        //    '<option value="ongoing">Ongoing</option>' +
        //    '<option value="Delay">Delay</option>' +
        //    '<option value="Close">Close</option>' +
        //    '<option value="Cancel">Cancel</option>' +
        //    '<option value="Pending">Pending</option>' +
        //    '<option value="Maintanance">Maintanance</option>' +
        //    '</select>');
        //currentRow.find('td:eq(7) select').val(p_status);

        // Disable editing
        currentRow = $(this).closest('tr');
        currentRow.find('input, select').prop('disabled', true);

        // Show Edit and Delete buttons
        currentRow.find('.btnEdit').show();
        currentRow.find('.btnDelete').show();

        // Remove Cancel and Save buttons
        $(this).remove();
        currentRow.find('.btnSave').remove();
        currentRow = '';
        Projects_data();

    });




    // Delete button click event


    $('#dataTable').on('click', '.btnDelete', function () {

        var deletedRow = $(this).closest('tr');

        ID = deletedRow.attr('data-project-id');

        // ID = deletedRow.find('td:eq(0)').text();
        // $(this).closest('tr').remove();
        var Delete_prjct_dtls = {
            ID: ID

        };
        var confirmDelete = confirm("Are you sure you want to delete this record?");
        if (confirmDelete) {
            $.post(apiURL + 'Delete_Project_details', Delete_prjct_dtls, function (response) {


                if (response == 'Success') {
                    //alert("succesfully Deleted");
                    toastr.success('DATA DELETED!', 'Success', { timeOut: 3000 });

                    Projects_data();

                }

                else {
                    alert("Something error");
                    Projects_data();


                }
            }).fail(function (jqxhr, settings, ex) {
                $(".dimmer").hide();
                alert("Error: " + ex);
            });
        }

    });









});

var rowData = '';


$('#btnAdd').click(function () {

    if ($('#p_no').val() == '' || $('#p_no').val() == null) {
        alert("Please enter project number");
        $('#p_no').focus();
    } else if ($('#p_name').val() == '' || $('#p_name').val() == null) {
        alert("Please enter project name");
        $('#p_name').focus();
    } else if ($('#p_head').val() == '' || $('#p_head').val() == null) {
        alert("Please enter IT project head");
        $('#p_head').focus();
    } else if ($('#region').val() == '' || $('#region').val() == null) {
        alert("Please project head region");
        $('#region').focus();
    } else if ($('#s_date').val() == '' || $('#s_date').val() == null) {
        alert("Please select project start date");
        $('#s_date').focus();
    } else if ($('#go_live_date').val() == '' || $('#go_live_date').val() == null) {
        alert("Please select estimated go live date");
        $('#go_live_date').focus();
    } else if ($('#status').val() == '' || $('#status').val() == null) {
        alert("Please select status of project");
        $('#status').focus();
    } else if ($('#s_date').val() > $('#go_live_date').val()) {
        alert("Project Start date is greater than Go live date");
        $('#s_date').focus();
    }

    else {
        var Insert_prjct_dtls = {};
        Insert_prjct_dtls.PROJECT_NO = $('#p_no').val();
        Insert_prjct_dtls.PROJECT_NAME = $('#p_name').val();
        Insert_prjct_dtls.IT_PM = $('#p_head').val();
        Insert_prjct_dtls.IT_PM_REGION = $('#region').val();
        Insert_prjct_dtls.START_DATE = $('#s_date').val();
        Insert_prjct_dtls.EX_GO_LIVE_DATE = $('#go_live_date').val();
        //  save_info.EX_GO_LIVE_DATE = $('#go_live_date').val();
        Insert_prjct_dtls.STATUS = $('#status').val();
        // save_info.REMARK = $('#').val();
        //  save_info.RequirementName = $('#requirement_name').val();


        $.post(apiURL + 'Insert_Project_details', Insert_prjct_dtls, function (response) {


            if (response == 'Success') {

                toastr.success('Succesfully DATA ADDED!', 'Success', { timeOut: 3000 });
                // alert("succesfully Added");
                Projects_data();
                clear_input();
            } else if (response == 'registered') {
                toastr.warning('Already Project Number Exists', 'Warning', { timeOut: 3000 });
            }

            else {
                alert("Something error");
                Projects_data();
                clear_input();

            }
        }).fail(function (jqxhr, settings, ex) {
            $(".dimmer").hide();
            alert("Error: " + ex);
        });
    }

});

function Projects_data() {


    $.get(apiURL + 'Get_Project_Details', function (response) {

        if (Array.isArray(response) && response.length > 0) {

            $('#dataTable tbody').empty();

            var serialNumber = 1;
            // Loop through the response data and populate the table
            response.forEach(function (project) {
                var row = $('<tr>');

                // Populate each cell with corresponding project data
                // row.append('<td>' + project.ID + '</td>');
                row.attr('data-project-id', project.ID);
                row.append('<td>' + serialNumber + '</td>');
                row.append('<td>' + project.PROJECT_NO + '</td>');
                row.append('<td>' + project.PROJECT_NAME + '</td>');
                row.append('<td>' + project.IT_PM + '</td>');
                row.append('<td>' + project.IT_PM_REGION + '</td>');
                row.append('<td>' + formatDate(project.START_DATE) + '</td>');
                row.append('<td>' + formatDate(project.EX_GO_LIVE_DATE) + '</td>');
                row.append('<td>' + formatDate(project.EXIT_DATE) + '</td>');
                row.append('<td>' + project.STATUS + '</td>');
                row.append('<td>' + project.REMARK + '</td>');
                row.append('<td><button class="ui primary button btnEdit"><i class="fas fa-pencil-alt"></i></button> <button class="ui red button btnDelete"><i class="fas fa-trash-alt"></button></td>');
                // Add row to the table
                serialNumber++;
                $('#dataTable tbody').append(row);
            });

        } else {

            console.log('hh');

        }
    }).fail(function (jqxhr, settings, ex) {
        $(".dimmer").hide();
        alert("Error: " + ex);
    });
    function formatDate(date) {
        return date ? moment(date).format("YYYY-MM-DD") : '';
    }

};


function clear_input() {
    $('#p_no').val('');
    $('#p_name').val('');
    $('#p_head').val('');
    $('#region').val('');
    $('#s_date').val('');
    $('#go_live_date').val('');
    $('#status').val('');
};



















