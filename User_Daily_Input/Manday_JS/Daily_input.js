//var apiURL = 'http://localhost:53943/api/apcnote/';

   var apiURL = 'http://10.3.0.70:9001/api/apcnote/';
//  var apiURL = 'http://10.3.0.208:9001/api/apcnote/';
var APIexcelData;

var Project_names = [];
// var Project_Nos = [];

var projectDetails = {};

var Regions_names = [];
var Departments_names = [];
var All_data;
var projectMapping = {};

var save_info = {};
var employee_data = '';
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
var intial_emp_no = '';
var Role = '';
var empNo = '';
document.getElementById('lt').addEventListener('input', function () {
    // Limit the input value to two decimal places
    if (this.value.includes('.')) {
        let decimalParts = this.value.split('.');
        // Check if there are more than two decimal places
        if (decimalParts[1].length > 2) {
            // Truncate to two decimal places
            this.value = parseFloat(this.value).toFixed(2);
        }
    }
});

//function getCookie(name) {
//    var cookieValue = null;
//    if (document.cookie && document.cookie !== '') {
//        var cookies = document.cookie.split(';');
//        for (var i = 0; i < cookies.length; i++) {
//            var cookie = cookies[i].trim();
//            if (cookie.substring(0, name.length + 1) === (name + '=')) {
//                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
//                break;
//            }
//        }
//    }
//    return cookieValue;
//}

$(document).ready(function () {

    $('.dimmer').hide();
    //var token = getCookie("token");
    //if (!token) {
    //    window.location.href = 'index.html';
    //}
    qs();
    /*  $.fn.dataTable.ext.errMode = 'none';*/
    $("#divemeritList").hide();
    var todayDate = new Date().toISOString().split('T')[0];

    // Set the default value of the input field to today's date
    document.getElementById('fdate').value = todayDate;
    Login_User_check();
    User_data();
    Get_Projects();

    Get_Project_Bydate();

    Get_company();
    Get_ALl();

    $('#M_dataTable').hide();
    $('#req1').hide();
    $('#requirement1').hide();
    // $('#M_req1').hide();
    // $('#M_requirement1').hide();
    $('#Category').change(function () {

        var selectedCategory = $(this).val();

        // Check if a project is selected (assuming project values start with "50")
        if (selectedCategory == '项目Project') {
            $("#fdate").datepicker("option", "maxDate", 0);
            $('#req1').hide();
            $('#requirement_name').val('');
            $('#requirement1').show();


        }
        else if (selectedCategory == '休假 Leave') {
            $("#fdate").datepicker("option", "maxDate", null);
            $('#requirement_name').val('');
            $('#project_name').val('');
            $('#requirement1').hide();
            $('#req1').hide();
        }
        else {
            $("#fdate").datepicker("option", "maxDate", 0);
            $('#requirement').val('').empty().prop('disabled', true);
            $('#requirement1').hide();
            $('#project_name').val('');
            $('#req1').show();

        }
    });


    $('#M_Category').change(function () {

        var selectedCategory = $(this).val();

        // Check if a project is selected (assuming project values start with "50")
        if (selectedCategory == '项目Project') {

            $('#M_req1').hide();
            $('#M_requirement_name').val('');
            Get_Project_ByM_date();
            $('#M_requirement1').show();

        } else if (selectedCategory == '休假 Leave') {
            $("#M_fdate").datepicker("option", "maxDate", null);
            $('#M_requirement_name').val('');
            $('#M_project_name').val('');
            $('#M_requirement1').hide();
            $('#M_req1').hide();
        }
        else {
            $("#M_fdate").datepicker("option", "maxDate", 0);
            // $('#M_requirement').val('').empty().prop('disabled', true);
            $('#M_requirement1').hide();
            $('#M_project_name').val('');
            $('#M_req1').show();

        }
    });


    $('#emp_no').on('blur', function () {

        empNo = $(this).val();
        if (empNo.trim() !== '' && Role != 'USER') { // Check if the entered employee number is not empty
            var employeeDetails = findEmployeeDetails(empNo);
            if (employeeDetails) {
                $('#name').val(employeeDetails.EmployeeName);
                $('#dept').val(employeeDetails.Department);
                $('#reg').val(employeeDetails.Region);

                User_data();


            }

            else {

                $('#name').val('');
                $('#dept').val('');
                $('#reg').val('');
                alert('Employee details not found.');
            }
        }
        else {
            $('#emp_no').val(intial_emp_no);
        }
    });

});

$('#fdate').change(function () {

    Get_Project_Bydate();
});
$('#M_fdate').change(function () {

    Get_Project_ByM_date();

});
$('#excelModal').on('hidden.bs.modal', function () {

    // Clear all input fields when modal is closed
    clearModalFields();
});

function clearModalFields() {
    $('#excelFile').val('');
    $('#M_dataTable').DataTable().clear().destroy();
    $('#M_dataTable').hide();


};


function findEmployeeDetails(empNo) {

    // Loop through All_data to find the matching employee number
    for (var region in All_data) {
        if (All_data.hasOwnProperty(region)) {
            var employeesInRegion = All_data[region];
            for (var i = 0; i < employeesInRegion.length; i++) {
                if (employeesInRegion[i].EmployeeNumber === empNo) {
                    return employeesInRegion[i]; // Return the employee details if found in this region
                }
            }
        }
    }
    return null; // Return null if employee details are not found
}


//  $('#uploadBtn').on('click', function () {

$('#excelFile').change(function () {

    var fileInput = document.getElementById('excelFile');
    var file = fileInput.files[0];
    if (!file.name.endsWith('.xls') && !file.name.endsWith('.xlsx')) {
        alert('Please upload only Excel files.');
        $('#excelFile').val('');
        return;
    }
    var reader = new FileReader();
    let excelData = [];
    reader.onload = function (e) {

        var data = new Uint8Array(e.target.result);
        var workbook = XLSX.read(data, { type: 'array' });

        var sheetName = workbook.SheetNames[0];
        if (sheetName == 'Man_day') {

            var sheet = workbook.Sheets[sheetName];
            var jsonData = XLSX.utils.sheet_to_json(sheet, { header: 1 });



            jsonData = jsonData.filter(function (row) {
                return row.some(function (cell) {
                    return cell !== null;
                });
            });


            jsonData = formatData(jsonData);

            //jsonData.forEach(function (row) {
            //    var excelDate = row[4]; // Assuming FILL_DATE is the third column
            //    var convertedDate = xlsxDateToJSDate(excelDate);
            //    row[4] = convertedDate;
            //});






            var columns = jsonData.shift();
            // Assuming the first row contains column headers
            excelData = jsonData.map(function (row) {

                var rowData = {};

                // console.log(columns.length);
                for (var i = 0; i < columns.length; i++) {
                    rowData[columns[i]] = row[i];
                }
                rowData['CreatedBy'] = $('#userid').val();
                return rowData;
            });
            // Remove header row

            // Clear existing table data
            $('#M_dataTable').DataTable().clear().destroy();

            // Rebuild table with new data
            $('#M_dataTable').show();
            $('#M_dataTable').DataTable({
                data: jsonData,

                scrollX: true,
                columns: columns.map(function (column) {
                    return { title: column };
                })
            });
            APIexcelData = excelData;
        }
        else {
            alert('Please download the excel file and add data according to you');
            $('#excelFile').val('');
            return false;
        }

    };

    reader.readAsArrayBuffer(file);



});




function formatData(data) {
    var formattedData = [];
    var headers = data.shift(); // Remove and store the header row

    // Format date in the data rows
    data.forEach(function (row, rowIndex) {
        var formattedRow = [];
        var isValidRow = true; // Flag to determine if the row is valid

        headers.forEach(function (header, index) {
            var cell = row[index];
            if (header === 'FillDate') {

                var formattedDate = convertExcelDateToFormat(cell);
                if (formattedDate === 'Invalid Date') {
                    alert('Row ' + (rowIndex + 1) + ': Fill date must be a valid date & format(YYYY-MM-DD).');
                    isValidRow = false; // Set the flag to false if date is invalid
                }
                // Push the formatted date or empty string to the row
                formattedRow.push(isValidRow ? formattedDate : '');
            } else {
                formattedRow.push(cell || ''); // Handle empty cells
            }
        });

        // Only push the row to formattedData if it's valid
        if (isValidRow) {
            formattedData.push(formattedRow);
        }
    });

    // Insert the header row back to the beginning
    formattedData.unshift(headers);

    return formattedData;
}




//function formatData(data) {
//    var formattedData = [];
//    var headers = data.shift(); 


//    data.forEach(function (row) {

//        var formattedRow = [];
//        var isValidRow = true;
//        headers.forEach(function (header, index) {
//            var cell = row[index];

//            if (header === 'FillDate') {
//                debugger
//                if (!isValidDate(cell)) {
//                    alert('Row ' + (row[index] + 1) + ': Fill date must be a valid date.');
//                    isValidRow = false;
//                    //return false;
//                }
//                var ExcelformatDate = convertExcelDateToFormat(cell);
//                if (ExcelformatDate === 'Invalid Date') {
//                    alert('Row ' + (row[index] + 1) + ': Fill date must be a valid date.');
//                    isValidRow = false; // Set the flag to false if date is invalid
//                }
//              //  formattedRow.push(convertExcelDateToFormat(cell));
//                formattedRow.push(ExcelformatDate);
//            } else {
//                formattedRow.push(cell || ''); 
//            }
//        });
//        if (isValidRow) {
//            formattedData.push(formattedRow);
//        }
//        //formattedData.push(formattedRow);
//    });

//    // Insert the header row back to the beginning
//    formattedData.unshift(headers);

//    return formattedData;
//}



function isValidDate(dateString) {


    var date = new Date(dateString);


    if (isNaN(date.getTime())) {
        // Invalid date
        return false;
    }

    var day = date.getDate();
    var month = date.getMonth() + 1;
    var year = date.getFullYear();

    if (year < 1000 || year > 9999 || month < 1 || month > 12 || day < 1 || day > daysInMonth(month, year)) {
        return false;
    }
    return true;
}

function daysInMonth(month, year) {
    return new Date(year, month, 0).getDate();
}



// Function to convert Excel date format to 'yyyy-mm-dd' format
function convertExcelDateToFormat(excelDate) {

    var date = new Date((excelDate - (25569)) * 86400 * 1000);
    if (isNaN(date.getTime())) {
        return 'Invalid Date';
    }
    var formatedDate = date.toISOString().split('T')[0];
    return formatedDate;
}




$('#savefileBtn').on('click', function () {

    if (!$('#excelFile').val()) {
        alert('Select Excel file');
        return false
    }
    var tableData = $('#M_dataTable').DataTable().data().toArray();
    var isValid = validateData(tableData);
    if (isValid) {
        // Send data to API for saving

        sendDataToAPI(APIexcelData);
    } else {
        $('#excelFile').val('');
        alert('Validation failed. Please check your data.');


    }
});


function validateData(tableData) {
    
    for (var i = 0; i < tableData.length; i++) {
        var row = tableData[i];



        for (var j = 0; j < 7; j++) {
            if (!row[j]) {
                alert('Row ' + (i + 1) + ': All fields are required.');
                return false;
            }
        }


        if (!isNaN(row[0])) {
            alert('Row ' + (i + 1) + ': Invalid Region');
            return false;
        }
        if (!isNaN(row[2])) {
            alert('Row ' + (i + 1) + ': Employee name must be non-numeric');
            return false;
        }
        var region = row[0].toUpperCase();
        var emp_name = row[2].toUpperCase();
        var dept = row[1];
        var barcode = row[3];
        var filldate = row[4];
        var lth = row[5];
        var content = row[6];
        var project = row[7];


        if (isNaN(barcode)) {
            alert('Row ' + (i + 1) + ': EmployeeNumber must be a number.');
            // isValid = false;
            return false;
        }

        if (isNaN(Date.parse(filldate))) {
            alert('Row ' + (i + 1) + ': FILL DATE must be in date format.');
            return false;
        }

        var cd = (new Date()).toISOString().split('T')[0];
        //console.log(cd);
        if (filldate > cd && content !== '休假 Leave') {
            alert('Row ' + (i + 1) + ': Future dates are not allowed for categories other than "休假 Leave".');
            return false;
        }
        
        if (typeof lth != 'string') {
            
            // Convert lth to a string if it's not already
            lth = lth.toString();
        }

        // Check if lth is a valid string and then perform further validation
        if (!/^\d+(\.\d{1,2})?$/.test(lth)) {
            alert('Row ' + (i + 1) + ': LT(hrs) must have at most 2 digits after the decimal.');
            return false;
        }
        /*if (!/^\d+(\.\d{1, 2})?$/.test(lth)) {         
           alert('Row ' + (i + 1) + ': LT(hrs)  must have at most 2 digits after the decimal.');
            return false;
        }*/

        if (!All_data.hasOwnProperty(region)) {
            alert('Row ' + (i + 1) + ': You dont have permission to add this region.');
            return; // Skip further validation for this row
        }


        var employeeInfoList = All_data[region];


        var check_emp = false;
        for (var k = 0; k < employeeInfoList.length; k++) {
            var employeeInfo = employeeInfoList[k];
            if (employeeInfo.Department == dept && employeeInfo.EmployeeNumber == barcode) {
                check_emp = true;
                break; // Exit the loop since the combination is found
            }
        }

        if (!check_emp) {
            alert('Row ' + (i + 1) + ': You dont have permission to add this Department or Employee.');
            return false; // The department and employee number combination does not exist
        }

        if (!Regions_names.includes(region)) {
            alert('Row ' + (i + 1) + ': You dont have permission to add this region.');
            return false;
        }


        var validCategories = [
            '项目Project',
            '运维-需求Maintenance-Req.',
            '运维-日常Maintenance-Daily',
            '行政管理Administration',
            '培训学习 Training/Study',
            '休假 Leave',
            '空闲 Idle'
        ];

        if (!validCategories.includes(content)) {
            alert('Row ' + (i + 1) + ': Invalid Category.');
            return false;
        }
        if (content != '项目Project' && project != '') {
            alert('Row ' + (i + 1) + ':Please change category to 项目Project or remove project name ');
            return false;
        }

        //if (content == '项目Project') {
        //    if (!Project_names.includes(project)) {
        //        alert('Row ' + (i + 1) + ': Invalid Project Name.');
        //        return false;
        //    }
        //}



        if (content == '项目Project') {

            if (!Project_names.includes(project)) {
                alert('Row ' + (i + 1) + ': Invalid Project Name.');
                return false;
            }

            // Assuming project details are available in a global object named projectDetails
            var projectDetail = projectDetails[project];
            if (!projectDetail) {
                alert('Row ' + (i + 1) + ': Project details not found.');
                return false;
            }


            var projectStartDate = new Date(projectDetail.start_date);
            // console.log(projectStartDate);

            var projectExitDate;
            if (projectDetail.exit_date !== null) {
                projectExitDate = new Date(projectDetail.exit_date);
               
            } else {
                projectExitDate = new Date(); // Load today's date
            }

            // Ensure that filldate is also a Date object
            var filldate = new Date(row[4]);

            if (filldate < projectStartDate || filldate > projectExitDate) {
                alert('Row ' + (i + 1) + ': Fill date must be between project start and exit dates.');
                return false;
            }

            //var projectStartDate = projectDetail.start_date;
            //console.log(projectStartDate);

            //var projectExitDate;
            //if (projectDetail.exit_date !== null) {
            //    projectExitDate = projectDetail.exit_date;
            //    console.log(projectExitDate);
            //} else {
            //    projectExitDate = (new Date()).toISOString().split('T')[0]; // Load today's date
            //}
            //if (filldate < projectStartDate || filldate >projectExitDate) {
            //    alert('Row ' + (i + 1) + ': Fill date must be between project start and exit dates.');
            //    return false;
            //}
        }






    }
    return true;
}

function sendDataToAPI(tableData) {

    tableData.forEach(function (rowData) {
        if (rowData.hasOwnProperty('ProjectName')) {
            var projectNumber = projectMapping[rowData.ProjectName];
            if (projectNumber) {
                rowData.ProjectNumber = projectNumber;
                delete rowData.ProjectName; // Remove project name property
            }
        }
    });


    $.ajax({

        url: apiURL + 'Insert_Excel_Data',
        type: 'POST',
        contentType: 'application/json',
        data: JSON.stringify(tableData),
        success: function (response) {

            $('#excelFile').val('');
            var insertedRows = [];
            var failedRows = [];
            var ExistedRows = [];

            for (var i = 0; i < response.length; i++) {
                if (response[i].Result === 'Success') {
                    insertedRows.push(response[i].RowNumber);
                } else if (response[i].Result === 'Failed') {
                    failedRows.push(response[i].RowNumber);
                } else if (response[i].Result === 'exist') {
                    ExistedRows.push(response[i].RowNumber);
                } else {
                    toastr.error('Error saving data: ' + response[i].Result, 'Error', { timeOut: 10000 });
                }
            }

            if (insertedRows.length > 0) {
                User_data();
                toastr.success('Inserted rows: ' + insertedRows.join(', '), 'Success', { timeOut: 7000 });
            }

            if (failedRows.length > 0) {
                toastr.warning('Failed to insert rows: ' + failedRows.join(', '), 'Warning', { timeOut: 10000 });
                // console.log('Failed rows:', failedRows);
            }
            if (ExistedRows.length > 0) {
                toastr.warning('Already Data is Present: ' + ExistedRows.join(', '), 'Warning', { timeOut: 10000 });

            }
        },
        error: function (xhr, status, error) {
            console.error('Error saving data:', error);
        }
    });

}





//function Get_Projects() {

//    $.ajax({
//        url: apiURL + 'Get_Project',
//        method: 'GET',
//        data: { category: '' },
//        success: function (data) {


//            var projects = JSON.parse(data);


//            projects.forEach(function (project) {

//                Project_names.push(project.project_name);


//            });
//            projects.forEach(function (project) {
//                projectMapping[project.project_name] = project.project_no;

//            });
//        },
//        error: function () {

//            console.error('Error fetching project list');
//        }
//    });
//}


function Get_Projects() {
    $.ajax({
        url: apiURL + 'Get_Project',
        method: 'GET',
        data: { category: '' },
        success: function (data) {
            var projects = JSON.parse(data);

            // Assuming projectDetails is an object to store project details
            projects.forEach(function (project) {
                // Populate projectDetails object with project details
                projectDetails[project.PROJECT_NAME] = {
                    project_no: project.PROJECT_NO,
                    start_date: project.START_DATE, // Add start date property
                    exit_date: project.EXIT_DATE // Add exit date property
                    // Add more properties as needed
                };
            });
            // console.log(projectDetails);
            // Optionally, you can also store project names in Project_names array
            projects.forEach(function (project) {
                Project_names.push(project.PROJECT_NAME);
            });

            projects.forEach(function (project) {
                projectMapping[project.PROJECT_NAME] = project.PROJECT_NO;

            });
        },
        error: function () {
            // Handle error if needed
            console.error('Error fetching project list');
        }
    });
}


function Get_Project_Bydate() {


    var todayDate = new Date().toISOString().split('T')[0];
    var date = document.getElementById('fdate').value;
    if (date > todayDate) {

        date = todayDate;
    }
    $.ajax({
        url: apiURL + 'Get_Project_Bydate',
        method: 'GET',
        data: { Fill_date: date },
        success: function (data) {

            // Update the requirement field with the received project list
            var projects = JSON.parse(data);

            // Clear and enable the project dropdown
            $('#project_name').empty();
            $('#project_name').append('<option value="">Select project</option>');
            // Populate the project dropdown with the fetched projects
            projects.forEach(function (project) {
                $('#project_name').append('<option value="' + project.project_no + '">' + project.project_name + '</option>');
                $('#M_project_name').append('<option value="' + project.project_no + '">' + project.project_name + '</option>');
                //    Project_names.push(project.project_name);


            });
            //projects.forEach(function (project) {
            //    projectMapping[project.project_name] = project.project_no;

            //});
        },
        error: function () {
            // Handle error if needed
            console.error('Error fetching project list');
        }
    });
}
function Get_Project_ByM_date() {


    var date = document.getElementById('M_fdate').value;
    $.ajax({
        url: apiURL + 'Get_Project_Bydate',
        method: 'GET',
        data: { Fill_date: date },
        success: function (data) {

            // Update the requirement field with the received project list
            var projects = JSON.parse(data);

            // Clear and enable the project dropdown
            $('#M_project_name').empty();
            $('#M_project_name').append('<option value="">Select project</option>');
            // Populate the project dropdown with the fetched projects
            projects.forEach(function (project) {
                //  $('#project_name').append('<option value="' + project.project_no + '">' + project.project_name + '</option>');
                $('#M_project_name').append('<option value="' + project.project_no + '">' + project.project_name + '</option>');
                //    Project_names.push(project.project_name);


            });
            //projects.forEach(function (project) {
            //    projectMapping[project.project_name] = project.project_no;

            //});
        },
        error: function () {
            // Handle error if needed
            console.error('Error fetching project list');
        }
    });
}


function Get_company() {

    var user_account = $('#userid').val();
    var User1 = {
        Account: user_account
    };

    $.post(apiURL + 'GetCompanyByRight', User1, function (response) {

        var arrdata = JSON.parse(response[0]);

        if (arrdata.length > 0) {
            for (j = 0; j < arrdata.length; j++) {
                Regions_names.push(arrdata[j].REGION);
            }

        }


    }, 'json').fail(function (jqxhr, settings, ex) {
        $(".dimmer").hide();
        alert("error: " + ex);
    });
}

function Get_ALl() {

    var user_account = $('#userid').val();
    var User1 = {
        Account: user_account
    };

    $.get(apiURL + 'Get_EmpDetailsByRight', User1, function (response) {

       
        All_data = response;


    }, 'json').fail(function (jqxhr, settings, ex) {
        $(".dimmer").hide();
        alert("error: " + ex);
    });
}

$("#fdate").datepicker({
    dateFormat: 'yy-mm-dd',
    changeMonth: true,
    changeYear: false,
    defaultDate: 0, // Set the default date to today
    // minDate: -5, // 5 past dates
    maxDate: 0, // Disable future dates
    //beforeShowDay: function (date) {
    //    var day = date.getDay();
    //    var today = new Date();
    //    today.setHours(0, 0, 0, 0);

    //    var selectedCategory = $('#Category').val();

    //    if (selectedCategory == '休假Leave' && date > today) {
    //        // Allow future dates for "Leave" category
    //        return [true, ''];
    //    } else {
    //        // Disable past Mondays and Saturdays for both "Leave" and other categories
    //        return [(date <= today && (day != 1 && day != 6)), ''];
    //    }
    //}

});

$("#M_fdate").datepicker({
    dateFormat: 'yy-mm-dd',
    changeMonth: true,
    changeYear: false,
    // Set the default date to today
    // minDate: -5, // 5 past dates
    maxDate: 0, // Disable future dates
});

$('#clear').click(function () {
    //$('#lt').val('');
    //$('#Category').val('');
    //$('#project_name').val('');
    //$('#requirement_name').val('');
    //$('#content').val('');
    //$('#remark').val('');
    clear_input();

});


$('#back').click(function () {

    window.location.href = "more.html";
});


//$('#fdate').datepicker({dateFormat: 'dd-mm-yy' });
/*  $('#tdate').datepicker({dateFormat: 'dd-mm-yy' });*/



$("#Save").click(function () {

    if ($('#fdate').val() == '' || $('#fdate').val() == null) {
        alert("Please select date");
        $('#fdate').focus();
    } else if ($('#reg').val() == '' || $('#reg').val() == null) {
        alert("Please select Region");
        $('#reg').focus();
    } else if ($('#dept').val() == '' || $('#dept').val() == null) {
        alert("Please select department");
        $('#dept').focus();
    } else if ($('#name').val() == '' || $('#name').val() == null) {
        alert("Please select Name");
        $('#name').focus();
    } else if ($('#emp_no').val() == '' || $('#emp_no').val() == null) {
        alert("Please select barcode");
        $('#emp_no').focus();
    } else if ($('#lt').val() == '' || $('#lt').val() == null || $('#lt').val() < 0.1 || $('#lt').val() > 24) {
        alert("Please input valid LT(hrs)");
        $('#lt').focus();
    }
    else if ($('#Category').val() == '' || $('#Category').val() == null) {
        alert("Please select Category");
        $('#Category').focus();
    }
    else if ($('#content').val() == '' && $('#Category').val() != '休假 Leave') {
        alert("Please enter Content");
        $('#content').focus();
    } else if ($('#Category').val() == '项目Project' && $('#project_name').val() == '') {
        alert("Please select Project");
        $('#project_name').focus();

    }
    else {


        save_info.FillDate = $('#fdate').val();
        save_info.Region = $('#reg').val();
        save_info.Department = $('#dept').val();
        save_info.EmployeeName = $('#name').val();
        save_info.EmployeeNumber = $('#emp_no').val();

        if (intial_emp_no != save_info.EmployeeNumber) {
            alert('You are going to insert another Employee details');
        }

        save_info.LtH = $('#lt').val();
        save_info.Category = $('#Category').val();
        save_info.ProjectName = $('#project_name').val();
        save_info.RequirementName = $('#requirement_name').val();


        save_info.Username = $('#userid').val();

        save_info.ContentName = $('#content').val();
        save_info.Remark = $('#remark').val();
        $('.dimmer').show();

        $.post(apiURL + 'Set_Manday_Input', save_info, function (response) {

           
            if (response == "Success") {
                $('.dimmer').hide();
                toastr.success('Successfully submitted!', 'Success', { timeOut: 3000 });
                clear_input();
                User_data();
                // Get_Project_Bydate();

            } else {
                alert("somthing error");
            }

        }).fail(function (jqxhr, settings, ex) {
            $(".dimmer").hide();
            alert("error: " + ex);
        });
    }
});



function clear_input() {

    var todayDate = new Date().toISOString().split('T')[0];
    document.getElementById('fdate').value = todayDate;
    Get_Project_Bydate();
    $("#fdate").datepicker("option", "maxDate", 0);
    $('#lt').val('');
    $('#Category').val('');
    $('#project_name').val('');
    $('#requirement_name').val('');
    $('#content').val('');
    $('#remark').val('');
    $('#req1').hide();
    $('#requirement1').hide();
}


var rowData = '';
//var i = 1;
var table = $('#gridContainer').DataTable({
    autoWidth: false,
    scrollX: true,
    bSort: true,
    columns: [
        { data: 'ID', title: 'ID', visible: false },
        {
            data: null, title: 'S.No.', visible: true, render: function (data, type, row, meta) {

                return meta.row + 1;
            }
        },
        {
            data: 'FILL_DATE', title: 'DATE',
            render: function (d) {
                return moment(d).format("YYYY-MM-DD");
            }
        },
        { data: 'REGION', title: 'REGION' },
        { data: 'DEPARTMENT', title: 'DEPARTMENT' },
        { data: 'EMP_NAME', title: 'EMP_NAME' },
        { data: 'EMP_NO', title: 'EMP_NO' },
        { data: 'LT_H', title: 'LT(hrs)' },
        { data: 'CATEGORY', title: 'CATEGORY' },
        { data: 'PROJECT_NAME', title: 'PROJECT NAME' },
        { data: 'REQUIREMENT_NAME', title: 'REQUIREMENT NAME', visible: true },
        //{data: 'CONTENT_NAME', title: 'CONTENT NAME', visible: true, width: "20px" },
        {
            data: 'CONTENT_NAME',
            title: 'CONTENT NAME',
            visible: true,
            width: "20px",
            render: function (data, type, row) {
                if (type === 'display') {

                    var paragraphs = data.split('\n');

                    return paragraphs.join('<br>');
                }
                return data;
            }
            //render: function (data, type, row) {
            //    // Check if data is not null or undefined
            //    if (data != null && data !== undefined) {
            //        // Display the first two words, and hide the rest
            //        var displayedText = data.split(' ').slice(0, 2).join(' ');

            //        // Add tooltip to show full text on mouseover
            //        return '<div class="tooltip-cell" title="' + data + '">' + displayedText + '</div>';
            //    } else {
            //        return ''; // Return an empty string or handle accordingly if data is null or undefined
            //    }
            //}
        },
        { data: 'REMARK', title: 'REMARK', visible: true },
        { data: 'CREATED_DATE', title: 'CREATED DATE', visible: true },
        { data: 'CREATED_TIME', title: 'CREATED TIME', visible: true },
        { data: 'CREATED_BY', title: 'CREATED BY', visible: true },
        { data: 'UPDATED_DATE', title: 'UPDATED DATE', visible: true },
        { data: 'UPDATED_TIME', title: 'UPDATED TIME', visible: true },
        { data: 'UPDATED_BY', title: 'UPDATED BY', visible: true },
        {
            //data: null,
            //render: function (data, type, row) {
            //    return '<div class="action-group">' +
            //        '<button class="editBtn btn btn-link" data-id="' + row.ID + '"><i class="fas fa-pencil-alt"></i></button>' +
            //        '<button class="deleteBtn btn btn-link" data-id="' + row.ID + '"><i class="fas fa-trash-alt"></i></button>' +
            //        '</div>';
            //},

            data: null,
            render: function (data, type, row) {
                if (row.CHECK === true) { // Only render buttons if LOCK is false
                    return '<i class="fas fa-check" style="color: blue;"></i>';
                } else {


                    return '<i class="fas fa-exclamation-circle" style="color: blue;"></i>';
                }
            },
            title: 'Check'

        },
        {
            //data: null,
            //render: function (data, type, row) {
            //    return '<div class="action-group">' +
            //        '<button class="editBtn btn btn-link" data-id="' + row.ID + '"><i class="fas fa-pencil-alt"></i></button>' +
            //        '<button class="deleteBtn btn btn-link" data-id="' + row.ID + '"><i class="fas fa-trash-alt"></i></button>' +
            //        '</div>';
            //},

            data: null,
            render: function (data, type, row) {
                if (row.LOCK === false) { // Only render buttons if LOCK is false
                    return '<div class="action-group">' +
                        '<button class="editBtn btn btn-link" data-id="' + row.ID + '"><i class="fas fa-pencil-alt"></i></button>' +
                        '<button class="deleteBtn btn btn-link" data-id="' + row.ID + '"><i class="fas fa-trash-alt"></i></button>' +
                        '</div>';
                } else {
                    //  return ''; // Return empty string if LOCK is true

                    return '<i class="fas fa-lock" style="color: red;"></i>';
                }
            },
            title: 'Actions',
            orderable: false,
            searchable: false
        }
    ],
    //columnDefs: [{"width": "200px", "targets": 11 }]

});





function Login_User_check() {

    var userData = {};
    userData.ACCOUNT = $("#userid").val();



    // $.post(apiURL + 'Get_User', userData, function (response) {
    $.post(apiURL + 'Get_User_Details', userData, function (response) {

        // console.log(response);
        document.getElementById('name').value = response[0].EmployeeName;
        document.getElementById('dept').value = response[0].Department;
        document.getElementById('reg').value = response[0].Region;
        document.getElementById('emp_no').value = response[0].EmployeeNumber;
        intial_emp_no = response[0].EmployeeNumber;
        Role = response[0].Role;

    }).fail(function (jqxhr, settings, ex) {
        $(".dimmer").hide();
        alert("error: " + ex);
    });

};


function User_data() {

    var userData = {};
    userData.ACCOUNT = $("#userid").val();

    userData.EmployeeNumber = empNo;

    $.post(apiURL + 'Get_Manday_Input', userData, function (response) {

        if (Array.isArray(response) && response.length > 0) {
            var transformedData = response.map(item => ({
                ID: item.ID,
                REGION: item.Region,
                DEPARTMENT: item.Department,
                EMP_NAME: item.EmployeeName,
                EMP_NO: item.EmployeeNumber,
                FILL_DATE: item.FillDate,
                LT_H: item.LtH,
                CATEGORY: item.Category,
                PROJECT_NAME: item.ProjectName,
                REQUIREMENT_NAME: item.RequirementName,
                CONTENT_NAME: item.ContentName,
                REMARK: item.Remark,
                LOCK: item.Lock,
                CHECK: item.CheckType,
                CREATED_DATE: item.CreatedDate,
                CREATED_TIME: item.CreatedTime,
                CREATED_BY: item.CreatedBy,
                UPDATED_DATE: item.UpdatedDate,
                UPDATED_TIME: item.UpdatedTime,
                UPDATED_BY: item.UpdatedBy
            }));

            // Clear existing data and add new data
            table.clear().rows.add(transformedData).draw();
        } else {
            // If no data is returned, you may want to handle this case
            table.clear().draw();
            console.log("No data found.");
        }
    }).fail(function (jqxhr, settings, ex) {
        $(".dimmer").hide();
        alert("Error: " + ex);
    });


};

// Function to populate the modal form with row data


$('#gridContainer').on('click', '.editBtn', function () {
    debugger
    rowData = table.row($(this).closest('tr')).data(); // Get data of the clicked row
    populateEditForm(rowData); // Populate the modal form with row data
    $('#editEmployeeModal').modal('show'); // Show the modal
});


$('#gridContainer').on('click', '.deleteBtn', function () {


    var delete_info = {};
    rowData = table.row($(this).closest('tr')).data();
    // var rowId = $(this).data('id');
    delete_info.ID = rowData.ID;
    delete_info.FillDate = rowData.FILL_DATE;
    delete_info.EmployeeNumber = rowData.EMP_NO;
    var confirmDelete = confirm("Are you sure you want to delete this record?");
    if (confirmDelete) {
        $.post(apiURL + 'Delete_Manday_Input', delete_info, function (response) {


            if (response == "Success") {
                toastr.success('Record Deleted!', 'Deleted', { timeOut: 3000 });

                User_data();
            } else if (response == "Locked") {
                toastr.warning('Your Data Locked!', 'Data is Locked', { timeOut: 3000 });


                User_data();
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
function populateEditForm(rowData) {

    var fillDate = new Date(rowData.FILL_DATE);
    var year = fillDate.getFullYear();
    var month = ('0' + (fillDate.getMonth() + 1)).slice(-2);
    var day = ('0' + fillDate.getDate()).slice(-2);
    var formattedDate = year + '-' + month + '-' + day;
    $('#M_fdate').val(formattedDate);

    $('#M_reg').val(rowData.REGION);
    $('#M_dept').val(rowData.DEPARTMENT);
    $('#M_name').val(rowData.EMP_NAME).prop('readonly', true);
    $('#M_emp_no').val(rowData.EMP_NO);
    $('#M_lt').val(rowData.LT_H);
    $('#M_Category').val(rowData.CATEGORY);
    if (rowData.CATEGORY == '项目Project') {
        // $('#M_project_name').val(rowData.PROJECT_NAME);
        $('#M_project_name').val(projectMapping[rowData.PROJECT_NAME]);
       
        $('#M_req1').hide();
        $('#M_requirement1').show();
    }
    if (rowData.CATEGORY != '' && rowData.CATEGORY != '项目Project') {
        $('#M_requirement_name').val(rowData.REQUIREMENT_NAME);
        $('#M_req1').show();
        $('#M_requirement1').hide();
    }
    //if (rowData.PROJECT_NAME == '') {
    //    $('#M_requirement1').hide();
    //    $('#M_req1').show();
    //}
    //  $('#M_project_name').val(rowData.PROJECT_NAME);
    //if (rowData.REQUIREMENT_NAME == '') {
    //    $('#M_req1').hide();
    //    $('#M_requirement1').show();
    //}
    //$('#M_requirement_name').val(rowData.REQUIREMENT_NAME);
    $('#M_content').val(rowData.CONTENT_NAME);
    $('#M_remark').val(rowData.REMARK);
    // Populate other fields similarly for each column
}


$('#updatebtn').click(function () {

    if ($('#M_Category').val() == '' || $('#M_Category').val() == null) {
        alert("Please select Category");
        $('#M_Category').focus();
    } else if ($('#M_Category').val() == '项目Project' && $('#M_project_name').val() == '') {
        alert("Please select Project");
        $('#M_project_name').focus();

    } else if ($('#M_lt').val() == '' || $('#M_lt').val() == null) {
        alert("Please enter LT(hrs)");
        $('#M_lt').focus();

    } else if ($('#M_content').val() == '' || $('#M_content').val() == null) {
        alert("Please enter Content");
        $('#M_content').focus();
    }
    else {
        var update_info = {};

        update_info.FillDate = $('#M_fdate').val();
        update_info.EmployeeNumber = $('#M_emp_no').val();
        update_info.LtH = $('#M_lt').val();
        update_info.Category = $('#M_Category').val();

        //if ($('#M_project_name').val() != '') {
        //    update_info.RequirementName = $('#M_requirement_name').val('');
        //} else if ($('#M_requirement_name').val() != '') {
        //    update_info.ProjectName = $('#M_project_name').val('');
        //}
        update_info.ProjectName = $('#M_project_name').val();

        update_info.RequirementName = $('#M_requirement_name').val();


        update_info.Username = $('#userid').val();

        update_info.ContentName = $('#M_content').val();
        update_info.Remark = $('#M_remark').val();
        update_info.ID = rowData.ID;

        $.post(apiURL + 'Update_Manday_Input', update_info, function (response) {

            // console.log(response);
            if (response == "Success") {
                toastr.success('Successfully submitted!', 'Success', { timeOut: 3000 });
                $('#editEmployeeModal').modal('hide');
                User_data();
            }
            else if (response == "Locked") {
                toastr.warning('Your Data Locked!', 'Data is Locked', { timeOut: 3000 });


                User_data();
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


$('#excel').click(function () {
    $('#excelModal').modal('show');
});





