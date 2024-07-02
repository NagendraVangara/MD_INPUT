// var apiURL = 'http://localhost:53943/api/apcnote/';
   var apiURL = 'http://10.3.0.70:9001/api/apcnote/';
//var apiURL = 'http://10.3.0.208:9001/api/apcnote/';
var user_account = '';


var jsonData;
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






$("#s_date,#e_date").datepicker({
    dateFormat: 'yy-mm-dd',
    changeMonth: true,
    changeYear: true

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
$(document).ready(function () {
    qs();
    $('#excelModal').modal('hide');
    Get_company();
    // $('#department_field').hide();
    //  $("department_field").hide();
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






    });

    $('#chart_type').change(function () {
        var selectedValue = $(this).val();
        if (selectedValue === 'byregion') {
            $('#department_field').hide();
        } else if (selectedValue === 'bydepartment') {
            $('#department_field').show();
        }
    });
    $('#date_type').change(function () {

        var selectedValue = $(this).val();
        if (selectedValue == 'byweek' || selectedValue == 'bymonth') {
            $('#strt').hide();
            $('#enddt').hide();

        } else {
            $('#strt').show();
            $('#enddt').show();
        }
    });
    // Initially hide the department field on page load
    $('#department_field').hide();
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



});



function generateColumns(data) {
    
    const columns = [
        { data: 'REGION', title: 'REGION' },
        { data: 'EmployeeCount', title: 'EmployeeCount' },
        { data: 'BaseCount', title: 'BaseCount' },
        { data: '项目Project_LT_H', title: '项目Project LT_H' },
        { data: '运维-需求Maintenance-Req_LT_H', title: '运维-需求Maintenance-Req. LT_H' },
        { data: '运维-日常Maintenance-Daily_LT_H', title: '运维-日常Maintenance-Daily LT_H' },
        { data: '行政管理Administration_LT_H', title: '行政管理Administration LT_H' },
        { data: '培训学习 Training/Study_LT_H', title: '培训学习Training/Study LT_H' },
        { data: '休假 Leave_LT_H', title: '休假 Leave LT_H' },

        { data: '空闲 Idle_LT_H', title: '空闲 Idle LT_H' },

    ];


    const sumColumn = {
        title: 'SUM (LT_H)',
        render: function (data, type, row) {
            let sum = 0;
            Object.keys(row).forEach(key => {
                if (key.endsWith('_LT_H')) {

                    sum += parseFloat(row[key] || 0);
                }
            });

            return sum.toFixed(2);
        }
    };
    columns.push(sumColumn);

    columns.push({ data: '项目Project_Percentage', title: '项目Project %' });
    columns.push({ data: '运维-需求Maintenance-Req_Percentage', title: '运维-需求Maintenance-Req. %' });
    columns.push({ data: '运维-日常Maintenance-Daily_Percentage', title: '运维-日常Maintenance-Daily %' });
    columns.push({ data: '行政管理Administration_Percentage', title: '行政管理Administration %' });
    columns.push({ data: '培训学习 Training/Study_Percentage', title: '休假 Leave %' });
    columns.push({ data: '休假 Leave_Percentage', title: '培训学习 Training/Study %' });
    columns.push({ data: '空闲 Idle_Percentage', title: '空闲 Idle %' });

    const sumPercent = {
        title: 'SUM (%)',
        render: function (data, type, row) {
            let sum = 0;
            Object.keys(row).forEach(key => {
                if (key.endsWith('_Percentage')) {
                    sum += parseFloat(row[key] || 0);
                }
            });
            return sum.toFixed(2);
        }
    };
    columns.push(sumPercent);

    columns.push({ data: 'FromDate', title: 'From Date' });
    columns.push({ data: 'ToDate', title: 'To Date' });


    return columns;
}


function reshapeData(data) {
    
    const categories = [
        '项目Project',
        '运维-需求Maintenance-Req.',
        '运维-日常Maintenance-Daily',
        '行政管理Administration',
        '培训学习 Training/Study',
        '休假 Leave',
        '空闲 Idle'
    ];
    const reshapedData = [];

    data.forEach(item => {

        const region = item.Region;

        const fromDate = item.fromdate.substring(0, 10);
        const toDate = item.todate.substring(0, 10);
        const employeeCount = item.EmployeeCount;
        const baseCount = item.BaseCount;

        if (!reshapedData[region]) {
            reshapedData[region] = {
                REGION: region,
                EmployeeCount: employeeCount,
                BaseCount: baseCount,
                FromDate: fromDate,
                ToDate: toDate
            };
            // Initialize all columns with a default value of 0
            categories.forEach(category => {
                const categoryKey = category.replace('.', ''); // Remove special characters
                reshapedData[region][categoryKey + '_LT_H'] = 0;
                reshapedData[region][categoryKey + '_Percentage'] = 0;
            });
        }

        const category = item.Category.replace('.', ''); // Remove periods
        // const categoryKey = category.replace('.', ''); // Remove special characters
        reshapedData[region][category + '_LT_H'] = item.LT_H;
        reshapedData[region][category + '_Percentage'] = item.Percentage;
    });

    // Convert the reshapedData object into an array
    const reshapedArray = Object.values(reshapedData);
    return reshapedArray;
}

function populateDataTable(data, columns, start_date, to_date) {
    
    if ($.fn.DataTable.isDataTable('#M_dataTable')) {
        // $('#M_dataTable').DataTable().destroy();
        $('#M_dataTable').DataTable().clear().destroy();
    }



    $('#M_dataTable').DataTable({
        data: data,
        columns: columns,
        autoWidth: false,
        scrollX: true,
        dom: 'Bfrtip',
        buttons: [
            {
                extend: 'excelHtml5',
                title: `Manday Input Excel Report from ${start_date} to ${to_date}`,
                text: 'Download Excel',
                className: 'excel-button'

            }
        ]
    });
}



function generateDeptColumns(data) {

    const columns = [
        { data: 'REGION', title: 'REGION' },
        { data: 'DEPARTMENT', title: 'DEPARTMENT' },
        { data: 'EmployeeCount', title: 'EmployeeCount' },
        { data: 'BaseCount', title: 'BaseCount' },
        { data: '项目Project_LT_H', title: '项目Project LT_H' },
        { data: '运维-需求Maintenance-Req_LT_H', title: '运维-需求Maintenance-Req. LT_H' },
        { data: '运维-日常Maintenance-Daily_LT_H', title: '运维-日常Maintenance-Daily LT_H' },
        { data: '行政管理Administration_LT_H', title: '行政管理Administration LT_H' },
        { data: '培训学习 Training/Study_LT_H', title: '培训学习Training/Study LT_H' },
        { data: '休假 Leave_LT_H', title: '休假 Leave LT_H' },

        { data: '空闲 Idle_LT_H', title: '空闲 Idle LT_H' },
    ];

    /* const categories = { };
             const categories2 = { };
     data.forEach(item => {
         const category = item.Category.replace('.', ''); // Remove periods
             const originalCategory = item.Category;
             if (!categories[category]) {

                 categories[category] = true;
             columns.push({data: category + '_LT_H', title: originalCategory + ' (LT_H)' });
         }
     });*/

    // Add SUM (LT_H) column
    /* const sumColumn = {
                 title: 'SUM (LT_H)',
             render: function (data, type, row) {
                 let sum = 0;
             Object.keys(categories).forEach(category => {
                 sum += parseInt(row[category + '_LT_H'] || 0);
             });
             return sum;
         }
     };*/
    const sumColumn = {
        title: 'SUM (LT_H)',
        render: function (data, type, row) {
            let sum = 0;
            Object.keys(row).forEach(key => {
                if (key.endsWith('_LT_H')) {
                    sum += parseFloat(row[key] || 0);
                }
            });
            return sum.toFixed(2);
        }
    };
    columns.push(sumColumn);

    // Add Percentage columns
    /* data.forEach(item => {

         const category = item.Category.replace('.', ''); // Remove periods
             const originalCategory = item.Category;
             if (!categories2[category]) {
                 categories2[category] = true;

             columns.push({data: category + '_Percentage', title: originalCategory + '%' });
         }
     });*/
    columns.push({ data: '项目Project_Percentage', title: '项目Project %' });
    columns.push({ data: '运维-需求Maintenance-Req_Percentage', title: '运维-需求Maintenance-Req. %' });
    columns.push({ data: '运维-日常Maintenance-Daily_Percentage', title: '运维-日常Maintenance-Daily %' });
    columns.push({ data: '行政管理Administration_Percentage', title: '行政管理Administration %' });
    columns.push({ data: '培训学习 Training/Study_Percentage', title: '休假 Leave %' });
    columns.push({ data: '休假 Leave_Percentage', title: '培训学习 Training/Study %' });
    columns.push({ data: '空闲 Idle_Percentage', title: '空闲 Idle %' });
    /* const sumPercent = {
                 title: 'SUM (%)',
             render: function (data, type, row) {
                 let sum = 0;
             Object.keys(categories).forEach(category => {
                 sum += parseInt(row[category + '_Percentage'] || 0);
             });
             return sum;
         }
     };*/
    const sumPercent = {
        title: 'SUM (%)',
        render: function (data, type, row) {
            let sum = 0;
            Object.keys(row).forEach(key => {
                if (key.endsWith('_Percentage')) {
                    sum += parseFloat(row[key] || 0);
                }
            });
            return sum.toFixed(2);
        }
    };
    columns.push(sumPercent);
    columns.push({ data: 'FromDate', title: 'From Date' });
    columns.push({ data: 'ToDate', title: 'To Date' });

    return columns;
}


function reshapeDeptData(data) {

    const categories = [
        '项目Project',
        '运维-需求Maintenance-Req.',
        '运维-日常Maintenance-Daily',
        '行政管理Administration',
        '培训学习 Training/Study',
        '休假 Leave',
        '空闲 Idle'
    ];
    const reshapedData = [];

    data.forEach(item => {
        const region = item.Region;
        const department = item.Department; // Add department
        const fromDate = item.fromdate.substring(0, 10);
        const toDate = item.todate.substring(0, 10);
        const employeeCount = item.EmployeeCount;
        const baseCount = item.BaseCount;

        const key = region + '_' + department; // Generate key combining region and department

        if (!reshapedData[key]) {
            reshapedData[key] = {
                REGION: region,
                DEPARTMENT: department, // Add department
                EmployeeCount: employeeCount,
                BaseCount: baseCount,
                FromDate: fromDate,
                ToDate: toDate
            };
            // Initialize all columns with a default value of 0
            categories.forEach(category => {
                const categoryKey = category.replace('.', ''); // Remove special characters
                reshapedData[key][categoryKey + '_LT_H'] = 0;
                reshapedData[key][categoryKey + '_Percentage'] = 0;
            });
        }

        const category = item.Category.replace('.', ''); // Remove periods
        //const categoryKey = category.replace(/[^a-zA-Z0-9]/g, ''); // Remove special characters
        reshapedData[key][category + '_LT_H'] = item.LT_H;
        reshapedData[key][category + '_Percentage'] = item.Percentage;
    });

    // Convert the reshapedData object into an array
    const reshapedArray = Object.values(reshapedData);
    return reshapedArray;
}



function reshapeRegWeekData(data) {

    const categories = [
        '项目Project',
        '运维-需求Maintenance-Req.',
        '运维-日常Maintenance-Daily',
        '行政管理Administration',
        '培训学习 Training/Study',
        '休假 Leave',
        '空闲 Idle'
    ];
    const reshapedData = [];

    data.forEach(item => {
        const region = item.Region;
        const week = item.week_no; // Add department
        const fromDate = item.fromdate.substring(0, 10);
        const toDate = item.todate.substring(0, 10);
        const employeeCount = item.EmployeeCount;
        const baseCount = item.BaseCount;

        const key = region + '_' + week; // Generate key combining region and department

        if (!reshapedData[key]) {
            reshapedData[key] = {
                REGION: region,
                WEEK: week, // Add department
                EmployeeCount: employeeCount,
                BaseCount: baseCount,
                FromDate: fromDate,
                ToDate: toDate
            };
            // Initialize all columns with a default value of 0
            categories.forEach(category => {
                const categoryKey = category.replace('.', ''); // Remove special characters
                reshapedData[key][categoryKey + '_LT_H'] = 0;
                reshapedData[key][categoryKey + '_Percentage'] = 0;
            });
        }

        const category = item.Category.replace('.', ''); // Remove periods
        //const categoryKey = category.replace(/[^a-zA-Z0-9]/g, ''); // Remove special characters
        reshapedData[key][category + '_LT_H'] = item.LT_H;
        reshapedData[key][category + '_Percentage'] = item.Percentage;
    });

    // Convert the reshapedData object into an array
    const reshapedArray = Object.values(reshapedData);
    return reshapedArray;
}

function generateRegWeekColumns(data) {
    
    const columns = [
        { data: 'REGION', title: 'REGION' },
        { data: 'EmployeeCount', title: 'EmployeeCount' },
        { data: 'BaseCount', title: 'BaseCount' },
        { data: 'WEEK', title: 'Week No' },
        { data: '项目Project_LT_H', title: '项目Project LT_H' },
        { data: '运维-需求Maintenance-Req_LT_H', title: '运维-需求Maintenance-Req. LT_H' },
        { data: '运维-日常Maintenance-Daily_LT_H', title: '运维-日常Maintenance-Daily LT_H' },
        { data: '行政管理Administration_LT_H', title: '行政管理Administration LT_H' },
        { data: '培训学习 Training/Study_LT_H', title: '培训学习Training/Study LT_H' },
        { data: '休假 Leave_LT_H', title: '休假 Leave LT_H' },

        { data: '空闲 Idle_LT_H', title: '空闲 Idle LT_H' },

    ];


    const sumColumn = {
        title: 'SUM (LT_H)',
        render: function (data, type, row) {
            let sum = 0;
            Object.keys(row).forEach(key => {
                if (key.endsWith('_LT_H')) {

                    sum += parseFloat(row[key] || 0);
                }
            });

            return sum.toFixed(2);
        }
    };
    columns.push(sumColumn);

    columns.push({ data: '项目Project_Percentage', title: '项目Project %' });
    columns.push({ data: '运维-需求Maintenance-Req_Percentage', title: '运维-需求Maintenance-Req. %' });
    columns.push({ data: '运维-日常Maintenance-Daily_Percentage', title: '运维-日常Maintenance-Daily %' });
    columns.push({ data: '行政管理Administration_Percentage', title: '行政管理Administration %' });
    columns.push({ data: '培训学习 Training/Study_Percentage', title: '休假 Leave %' });
    columns.push({ data: '休假 Leave_Percentage', title: '培训学习 Training/Study %' });
    columns.push({ data: '空闲 Idle_Percentage', title: '空闲 Idle %' });

    const sumPercent = {
        title: 'SUM (%)',
        render: function (data, type, row) {
            let sum = 0;
            Object.keys(row).forEach(key => {
                if (key.endsWith('_Percentage')) {
                    sum += parseFloat(row[key] || 0);
                }
            });
            return sum.toFixed(2);
        }
    };
    columns.push(sumPercent);

    columns.push({ data: 'FromDate', title: 'From Date' });
    columns.push({ data: 'ToDate', title: 'To Date' });


    return columns;
}

function reshapeRegMonthData(data) {
    
    const categories = [
        '项目Project',
        '运维-需求Maintenance-Req.',
        '运维-日常Maintenance-Daily',
        '行政管理Administration',
        '培训学习 Training/Study',
        '休假 Leave',
        '空闲 Idle'
    ];
    const reshapedData = [];

    data.forEach(item => {
        const region = item.Region;
        const mnth = item.month_name; // Add department
        const fromDate = item.fromdate.substring(0, 10);
        const toDate = item.todate.substring(0, 10);
        const employeeCount = item.EmployeeCount;
        const baseCount = item.BaseCount;

        const key = region + '_' + mnth; // Generate key combining region and department

        if (!reshapedData[key]) {
            reshapedData[key] = {
                REGION: region,
                MONTH: mnth, // Add department
                EmployeeCount: employeeCount,
                BaseCount: baseCount,
                FromDate: fromDate,
                ToDate: toDate
            };
            // Initialize all columns with a default value of 0
            categories.forEach(category => {
                const categoryKey = category.replace('.', ''); // Remove special characters
                reshapedData[key][categoryKey + '_LT_H'] = 0;
                reshapedData[key][categoryKey + '_Percentage'] = 0;
            });
        }

        const category = item.Category.replace('.', ''); // Remove periods
        //const categoryKey = category.replace(/[^a-zA-Z0-9]/g, ''); // Remove special characters
        reshapedData[key][category + '_LT_H'] = item.LT_H;
        reshapedData[key][category + '_Percentage'] = item.Percentage;
    });

    // Convert the reshapedData object into an array
    const reshapedArray = Object.values(reshapedData);
    return reshapedArray;
}

function generateRegMonthColumns(data) {
    
    const columns = [
        { data: 'REGION', title: 'REGION' },
        { data: 'EmployeeCount', title: 'EmployeeCount' },
        { data: 'BaseCount', title: 'BaseCount' },
        { data: 'MONTH', title: 'Month Name' },
        { data: '项目Project_LT_H', title: '项目Project LT_H' },
        { data: '运维-需求Maintenance-Req_LT_H', title: '运维-需求Maintenance-Req. LT_H' },
        { data: '运维-日常Maintenance-Daily_LT_H', title: '运维-日常Maintenance-Daily LT_H' },
        { data: '行政管理Administration_LT_H', title: '行政管理Administration LT_H' },
        { data: '培训学习 Training/Study_LT_H', title: '培训学习Training/Study LT_H' },
        { data: '休假 Leave_LT_H', title: '休假 Leave LT_H' },

        { data: '空闲 Idle_LT_H', title: '空闲 Idle LT_H' },

    ];


    const sumColumn = {
        title: 'SUM (LT_H)',
        render: function (data, type, row) {
            let sum = 0;
            Object.keys(row).forEach(key => {
                if (key.endsWith('_LT_H')) {

                    sum += parseFloat(row[key] || 0);
                }
            });

            return sum.toFixed(2);
        }
    };
    columns.push(sumColumn);

    columns.push({ data: '项目Project_Percentage', title: '项目Project %' });
    columns.push({ data: '运维-需求Maintenance-Req_Percentage', title: '运维-需求Maintenance-Req. %' });
    columns.push({ data: '运维-日常Maintenance-Daily_Percentage', title: '运维-日常Maintenance-Daily %' });
    columns.push({ data: '行政管理Administration_Percentage', title: '行政管理Administration %' });
    columns.push({ data: '培训学习 Training/Study_Percentage', title: '休假 Leave %' });
    columns.push({ data: '休假 Leave_Percentage', title: '培训学习 Training/Study %' });
    columns.push({ data: '空闲 Idle_Percentage', title: '空闲 Idle %' });

    const sumPercent = {
        title: 'SUM (%)',
        render: function (data, type, row) {
            let sum = 0;
            Object.keys(row).forEach(key => {
                if (key.endsWith('_Percentage')) {
                    sum += parseFloat(row[key] || 0);
                }
            });
            return sum.toFixed(2);
        }
    };
    columns.push(sumPercent);

    columns.push({ data: 'FromDate', title: 'From Date' });
    columns.push({ data: 'ToDate', title: 'To Date' });


    return columns;
}


function generateDeptWeekColumns(data) {

    const columns = [
        { data: 'REGION', title: 'REGION' },
        { data: 'DEPARTMENT', title: 'DEPARTMENT' },
        { data: 'WEEK', title: 'Week No' },
        { data: 'EmployeeCount', title: 'EmployeeCount' },
        { data: 'BaseCount', title: 'BaseCount' },
        { data: '项目Project_LT_H', title: '项目Project LT_H' },
        { data: '运维-需求Maintenance-Req_LT_H', title: '运维-需求Maintenance-Req. LT_H' },
        { data: '运维-日常Maintenance-Daily_LT_H', title: '运维-日常Maintenance-Daily LT_H' },
        { data: '行政管理Administration_LT_H', title: '行政管理Administration LT_H' },
        { data: '培训学习 Training/Study_LT_H', title: '培训学习Training/Study LT_H' },
        { data: '休假 Leave_LT_H', title: '休假 Leave LT_H' },

        { data: '空闲 Idle_LT_H', title: '空闲 Idle LT_H' },
    ];

    /* const categories = { };
             const categories2 = { };
     data.forEach(item => {
         const category = item.Category.replace('.', ''); // Remove periods
             const originalCategory = item.Category;
             if (!categories[category]) {

                 categories[category] = true;
             columns.push({data: category + '_LT_H', title: originalCategory + ' (LT_H)' });
         }
     });*/

    // Add SUM (LT_H) column
    /* const sumColumn = {
                 title: 'SUM (LT_H)',
             render: function (data, type, row) {
                 let sum = 0;
             Object.keys(categories).forEach(category => {
                 sum += parseInt(row[category + '_LT_H'] || 0);
             });
             return sum;
         }
     };*/
    const sumColumn = {
        title: 'SUM (LT_H)',
        render: function (data, type, row) {
            let sum = 0;
            Object.keys(row).forEach(key => {
                if (key.endsWith('_LT_H')) {
                    sum += parseFloat(row[key] || 0);
                }
            });
            return sum.toFixed(2);
        }
    };
    columns.push(sumColumn);

    // Add Percentage columns
    /* data.forEach(item => {

         const category = item.Category.replace('.', ''); // Remove periods
             const originalCategory = item.Category;
             if (!categories2[category]) {
                 categories2[category] = true;

             columns.push({data: category + '_Percentage', title: originalCategory + '%' });
         }
     });*/
    columns.push({ data: '项目Project_Percentage', title: '项目Project %' });
    columns.push({ data: '运维-需求Maintenance-Req_Percentage', title: '运维-需求Maintenance-Req. %' });
    columns.push({ data: '运维-日常Maintenance-Daily_Percentage', title: '运维-日常Maintenance-Daily %' });
    columns.push({ data: '行政管理Administration_Percentage', title: '行政管理Administration %' });
    columns.push({ data: '培训学习 Training/Study_Percentage', title: '休假 Leave %' });
    columns.push({ data: '休假 Leave_Percentage', title: '培训学习 Training/Study %' });
    columns.push({ data: '空闲 Idle_Percentage', title: '空闲 Idle %' });
    /* const sumPercent = {
                 title: 'SUM (%)',
             render: function (data, type, row) {
                 let sum = 0;
             Object.keys(categories).forEach(category => {
                 sum += parseInt(row[category + '_Percentage'] || 0);
             });
             return sum;
         }
     };*/
    const sumPercent = {
        title: 'SUM (%)',
        render: function (data, type, row) {
            let sum = 0;
            Object.keys(row).forEach(key => {
                if (key.endsWith('_Percentage')) {
                    sum += parseFloat(row[key] || 0);
                }
            });
            return sum.toFixed(2);
        }
    };
    columns.push(sumPercent);
    columns.push({ data: 'FromDate', title: 'From Date' });
    columns.push({ data: 'ToDate', title: 'To Date' });

    return columns;
}

function reshapeDeptWeekData(data) {
    
    const categories = [
        '项目Project',
        '运维-需求Maintenance-Req.',
        '运维-日常Maintenance-Daily',
        '行政管理Administration',
        '培训学习 Training/Study',
        '休假 Leave',
        '空闲 Idle'
    ];
    const reshapedData = {};

    data.forEach(item => {
        const region = item.Region;
        const department = item.Department; // Add department
        const week = item.week_no;
        const fromDate = item.fromdate.substring(0, 10);
        const toDate = item.todate.substring(0, 10);
        const employeeCount = item.EmployeeCount;
        const baseCount = item.BaseCount;

        const key = region + '_' + department + '_' + week; // Generate key combining region, department, and week

        if (!reshapedData[key]) {
            reshapedData[key] = {
                REGION: region,
                DEPARTMENT: department, // Add department
                WEEK: week,
                EmployeeCount: employeeCount,
                BaseCount: baseCount,
                FromDate: fromDate,
                ToDate: toDate
            };
            // Initialize all columns with a default value of 0
            categories.forEach(category => {
                // const categoryKey = category.replace(/[^a-zA-Z0-9]/g, ''); // Remove special characters

                const categoryKey = category.replace('.', '');
                reshapedData[key][categoryKey + '_LT_H'] = 0;
                reshapedData[key][categoryKey + '_Percentage'] = 0;
            });
        }

        // const category = item.Category.replace(/[^a-zA-Z0-9]/g, ''); // Remove special characters
        const category = item.Category.replace('.', '');
        reshapedData[key][category + '_LT_H'] = item.LT_H;
        reshapedData[key][category + '_Percentage'] = item.Percentage;
    });

    // Convert the reshapedData object into an array
    const reshapedArray = Object.values(reshapedData);
    return reshapedArray;
}

function generateDeptMonthColumns(data) {

    const columns = [
        { data: 'REGION', title: 'REGION' },
        { data: 'DEPARTMENT', title: 'DEPARTMENT' },
        { data: 'MONTH', title: 'Month Name' },
        { data: 'EmployeeCount', title: 'EmployeeCount' },
        { data: 'BaseCount', title: 'BaseCount' },
        { data: '项目Project_LT_H', title: '项目Project LT_H' },
        { data: '运维-需求Maintenance-Req_LT_H', title: '运维-需求Maintenance-Req. LT_H' },
        { data: '运维-日常Maintenance-Daily_LT_H', title: '运维-日常Maintenance-Daily LT_H' },
        { data: '行政管理Administration_LT_H', title: '行政管理Administration LT_H' },
        { data: '培训学习 Training/Study_LT_H', title: '培训学习Training/Study LT_H' },
        { data: '休假 Leave_LT_H', title: '休假 Leave LT_H' },

        { data: '空闲 Idle_LT_H', title: '空闲 Idle LT_H' },
    ];

    /* const categories = { };
             const categories2 = { };
     data.forEach(item => {
         const category = item.Category.replace('.', ''); // Remove periods
             const originalCategory = item.Category;
             if (!categories[category]) {

                 categories[category] = true;
             columns.push({data: category + '_LT_H', title: originalCategory + ' (LT_H)' });
         }
     });*/

    // Add SUM (LT_H) column
    /* const sumColumn = {
                 title: 'SUM (LT_H)',
             render: function (data, type, row) {
                 let sum = 0;
             Object.keys(categories).forEach(category => {
                 sum += parseInt(row[category + '_LT_H'] || 0);
             });
             return sum;
         }
     };*/
    const sumColumn = {
        title: 'SUM (LT_H)',
        render: function (data, type, row) {
            let sum = 0;
            Object.keys(row).forEach(key => {
                if (key.endsWith('_LT_H')) {
                    sum += parseFloat(row[key] || 0);
                }
            });
            return sum.toFixed(2);
        }
    };
    columns.push(sumColumn);

    // Add Percentage columns
    /* data.forEach(item => {

         const category = item.Category.replace('.', ''); // Remove periods
             const originalCategory = item.Category;
             if (!categories2[category]) {
                 categories2[category] = true;

             columns.push({data: category + '_Percentage', title: originalCategory + '%' });
         }
     });*/
    columns.push({ data: '项目Project_Percentage', title: '项目Project %' });
    columns.push({ data: '运维-需求Maintenance-Req_Percentage', title: '运维-需求Maintenance-Req. %' });
    columns.push({ data: '运维-日常Maintenance-Daily_Percentage', title: '运维-日常Maintenance-Daily %' });
    columns.push({ data: '行政管理Administration_Percentage', title: '行政管理Administration %' });
    columns.push({ data: '培训学习 Training/Study_Percentage', title: '休假 Leave %' });
    columns.push({ data: '休假 Leave_Percentage', title: '培训学习 Training/Study %' });
    columns.push({ data: '空闲 Idle_Percentage', title: '空闲 Idle %' });
    /* const sumPercent = {
                 title: 'SUM (%)',
             render: function (data, type, row) {
                 let sum = 0;
             Object.keys(categories).forEach(category => {
                 sum += parseInt(row[category + '_Percentage'] || 0);
             });
             return sum;
         }
     };*/
    const sumPercent = {
        title: 'SUM (%)',
        render: function (data, type, row) {
            let sum = 0;
            Object.keys(row).forEach(key => {
                if (key.endsWith('_Percentage')) {
                    sum += parseFloat(row[key] || 0);
                }
            });
            return sum.toFixed(2);
        }
    };
    columns.push(sumPercent);
    columns.push({ data: 'FromDate', title: 'From Date' });
    columns.push({ data: 'ToDate', title: 'To Date' });

    return columns;
}

function reshapeDeptMonthData(data) {
    
    const categories = [
        '项目Project',
        '运维-需求Maintenance-Req.',
        '运维-日常Maintenance-Daily',
        '行政管理Administration',
        '培训学习 Training/Study',
        '休假 Leave',
        '空闲 Idle'
    ];
    const reshapedData = {};

    data.forEach(item => {
        const region = item.Region;
        const department = item.Department; // Add department
        const mnth = item.month_name;
        const fromDate = item.fromdate.substring(0, 10);
        const toDate = item.todate.substring(0, 10);
        const employeeCount = item.EmployeeCount;
        const baseCount = item.BaseCount;

        const key = region + '_' + department + '_' + mnth; // Generate key combining region, department, and week

        if (!reshapedData[key]) {
            reshapedData[key] = {
                REGION: region,
                DEPARTMENT: department, // Add department
                MONTH: mnth,
                EmployeeCount: employeeCount,
                BaseCount: baseCount,
                FromDate: fromDate,
                ToDate: toDate
            };
            // Initialize all columns with a default value of 0
            categories.forEach(category => {
                // const categoryKey = category.replace(/[^a-zA-Z0-9]/g, ''); // Remove special characters

                const categoryKey = category.replace('.', '');
                reshapedData[key][categoryKey + '_LT_H'] = 0;
                reshapedData[key][categoryKey + '_Percentage'] = 0;
            });
        }

        // const category = item.Category.replace(/[^a-zA-Z0-9]/g, ''); // Remove special characters
        const category = item.Category.replace('.', '');
        reshapedData[key][category + '_LT_H'] = item.LT_H;
        reshapedData[key][category + '_Percentage'] = item.Percentage;
    });

    // Convert the reshapedData object into an array
    const reshapedArray = Object.values(reshapedData);
    return reshapedArray;
}


$('#search').click(function () {
    
    if ($("#region").val() == "") {
        alert('Please Select Region');
        $("#region").focus();
    }

    //else if ($("#department").val() == "") {
    //    alert('Please Select Department');
    //    $("#department").focus();
    //}

    //else if ($("#emp_no").val() == "") {
    //    alert('Please Select Employee');
    //    $("#emp_no").focus();
    //}
    else if ($('#category').val() == '') {
        alert('Please Select Category');
        $("#category").focus();
    }
    else if ($("#s_date").val() == "" && $('#date_type').val()=='') {
        alert('Please Select From Date');
        $("#s_date").focus();
        return false;
    } else if
        ($("#e_date").val() == "" && $('#date_type').val() == '') {
        alert('Please Select To Date');
        $("#e_date").focus();
        return false;
    }
    else if ($("#s_date").val() > $("#e_date").val()) {
        alert('Start Date greater than To Date');
        $("#s_date").focus();
    }
    else {

        var User = {};
        User.Start_date = $("#s_date").val();
        User.To_date = $("#e_date").val();
        User.Region = $('#region').val();
        User.Category = $('#category').val();


        // User.EmployeeNumber = $('#emp_no').val();
        // User.Department = $('#department').val();
        // var departmentValue = $('#department').val().toString();
        // var departmentArray = departmentValue.split(',');




        if ($('#chart_type').val() == 'byregion' && $('#date_type').val() != 'byweek' && $('#date_type').val() != 'bymonth') {
            $.ajax({
                type: "GET",
                dataType: "json",
                //contentType: "application/json",
                data: User,
                url: apiURL + 'GetMandayChartDataByRegion',
                success: function (data) {
                    jsonData = data;
                   
                    var regions = jsonData.map(function (item) {
                        return item.Region;
                    });
                    regions = [...new Set(regions)];

                    /* var categories = jsonData.map(function (item) {
                         return item.Category;
                     });
                     categories = [...new Set(categories)]; */


                    var option = {
                        'stroke-width': 1,
                        stroke: '#2f7ed8', // Background color
                        fill: '#2f7ed8', // Border color
                        r: 2,
                        padding: 5,
                        style: {
                            color: '#FFFFFF' // Text color
                        }
                    };
                    var fixedCategoriesOrder = [
                        '空闲 Idle',
                        '休假 Leave',
                        '培训学习 Training/Study',
                        '行政管理Administration',
                        '运维-日常Maintenance-Daily',
                        '运维-需求Maintenance-Req.',
                        '项目Project'


                    ];

                    var categoryColors = {
                        '项目Project': '#00b050',
                        '运维-需求Maintenance-Req.': '#00b0f0',
                        '运维-日常Maintenance-Daily': '#b4c7e7',
                        '行政管理Administration': '#e2aa00',
                        '培训学习 Training/Study': '#56247a',
                        '休假 Leave': '#a0a0a0',
                        '空闲 Idle': '#ff0101'
                    };

                    // Initialize Highcharts chart
                    Highcharts.chart('container', {
                        chart: {
                            type: 'column',
                            events: {
                                load: function () {
                                    this.renderer.button('Excel Report', this.chartWidth - 100, 40, function () {
                                        // Add button click functionality here
                                        console.log(data);
                                        const reshapedData = reshapeData(data);
                                        const columns = generateColumns(data);
                                        const start_date = $('#s_date').val();
                                        const to_date = $('#e_date').val();
                                        populateDataTable(reshapedData, columns, start_date, to_date);
                                        $('#excelModal').modal('show');
                                    }, option, option, option)
                                        .attr({
                                            id: 'excelButton'
                                        })
                                        .on('mouseover', function () {
                                            $(this.element).css({
                                                'fill': '#2f7ed8',
                                                'stroke': '#2f7ed8',
                                            });
                                        })
                                        .on('mouseout', function () {
                                            $(this.element).css({
                                                'fill': '#2f7ed8',
                                                'stroke': '#2f7ed8',
                                            });
                                        })
                                        .add();
                                    // });
                                }
                            }
                        },
                        title: {
                            text: 'Region Category Percentage Stacked Bar Graph'
                        },
                        xAxis: {
                            categories: regions, // Set regions as X-axis categories
                            title: {
                                text: 'Region'
                            }
                        },
                        yAxis: {
                            min: 0,
                            title: {
                                text: 'Percentage'
                            },
                            stackLabels: {
                                enabled: true,
                                style: {
                                    fontWeight: 'bold',
                                    color: (Highcharts.defaultOptions.title.style && Highcharts.defaultOptions.title.style.color) || 'gray'
                                }
                            }
                        },
                        tooltip: {
                            headerFormat: '<b>{point.x}</b><br/>',
                            pointFormat: '{series.name}: {point.y}<br/>Total: {point.stackTotal}'
                        },
                        plotOptions: {
                            column: {
                                stacking: 'normal',
                                dataLabels: {
                                    enabled: true
                                },
                                colorByPoint: false
                            }
                        },
                        /* series: categories.map(function (category) { // Map categories to series
                             return {
                                 name: category,
                                 color: categoryColors[category] || null,
                                 data: regions.map(function (region) { // Map regions to data for each category
                                     var dataPoint = jsonData.find(function (item) {
                                         return item.Region === region && item.Category === category;
                                     });
                                     return dataPoint ? dataPoint.Percentage : 0;
                                 })
                             };
                         })
 */
                        series: fixedCategoriesOrder.map(function (category) { // Use fixed order to map categories to series
                            return {
                                name: category,
                                color: categoryColors[category] || null,
                                data: regions.map(function (region) { // Map regions to data for each category
                                    var dataPoint = jsonData.find(function (item) {
                                        return item.Region === region && item.Category === category;
                                    });
                                    return dataPoint ? dataPoint.Percentage : 0;
                                })
                            };
                        })


                    });
                    // console.log(data);
                }
            });
        }
        else if ($('#chart_type').val() == 'bydepartment' && $('#date_type').val() != 'byweek' && $('#date_type').val() != 'bymonth') {


            var departmentValue = $('#department').val().toString();
            var departmentArray = departmentValue.split(',').map(function (dept) {
                return "'" + dept.trim() + "'";
            });
            var formattedDepartmentValue = departmentArray.join(',');

            User.Department = formattedDepartmentValue


            //$.ajax({
            //    type: "GET",
            //    dataType: "json",
            //    //  contentType: "application/json",
            //    data: User,
            //    url: apiURL + 'GetMandayChartDataByDepartment',
            //    success: function (data) {
            //        debugger
            //        jsonData = data;

            //        var departments = [...new Set(jsonData.map(item => item.Department))];
            //        var regions = [...new Set(jsonData.map(item => item.Region))];
            //        var categories = [...new Set(jsonData.map(item => item.Category))];

            //        var categoryColors = {
            //            '项目Project': '#00b050',
            //            '运维-需求Maintenance-Req.': '#00b0f0',
            //            '运维-日常Maintenance-Daily': '#b4c7e7',
            //            '行政管理Administration': '#e2aa00',
            //            '培训学习 Training/Study': '#56247a',
            //            '休假 Leave': '#a0a0a0',
            //            '空闲 Idle': '#ff0101'
            //        };

            //        // Sort categories based on the order in categoryColors
            //        //categories.sort((a, b) => {
            //        //    return Object.keys(categoryColors).indexOf(a) - Object.keys(categoryColors).indexOf(b);
            //        //});

            //        categories.sort((a, b) => {
            //            const colorKeys = Object.keys(categoryColors);
            //            return colorKeys.indexOf(a) - colorKeys.indexOf(b);
            //        }).reverse();

            //        var series = [];

            //        // Loop through each sorted category
            //        categories.forEach(function (category) {
            //            // Create series data for the current category
            //            var seriesData = departments.map(function (department) {
            //                var dataPoint = jsonData.find(item => item.Department === department && item.Category === category);
            //                return dataPoint ? dataPoint.Percentage : 0;
            //            });

            //            // Push the series object for the current category
            //            series.push({
            //                name: category,
            //                data: seriesData
            //            });
            //        });

            //        var option = {
            //            'stroke-width': 1,
            //            stroke: '#2f7ed8', // Background color
            //            fill: '#2f7ed8', // Border color
            //            r: 2,
            //            padding: 5,
            //            style: {
            //                color: '#FFFFFF' // Text color
            //            }
            //        };

            //        // Initialize Highcharts chart
            //        Highcharts.chart('container', {
            //            chart: {
            //                type: 'column',
            //                events: {
            //                    load: function () {
            //                        this.renderer.button('Excel Report', this.chartWidth - 100, 40, function () {
            //                            // Add button click functionality here

            //                            const reshapedData = reshapeDeptData(data);
            //                            const columns = generateDeptColumns(data);
            //                            const start_date = $('#s_date').val();
            //                            const to_date = $('#e_date').val();
            //                            populateDataTable(reshapedData, columns, start_date, to_date);
            //                            $('#excelModal').modal('show');
            //                        }, option, option, option)
            //                            .attr({
            //                                id: 'excelButton'
            //                            })
            //                            .on('mouseover', function () {
            //                                $(this.element).css({
            //                                    'fill': '#2f7ed8',
            //                                    'stroke': '#2f7ed8',
            //                                });
            //                            })
            //                            .on('mouseout', function () {
            //                                $(this.element).css({
            //                                    'fill': '#2f7ed8',
            //                                    'stroke': '#2f7ed8',
            //                                });
            //                            })
            //                            .add();
            //                    }
            //                }
            //            },
            //            title: {
            //                text: 'Department Category Count by Region'
            //            },
            //            xAxis: {
            //                categories: departments.map(department => department + '<br>(' + regions.find(region => jsonData.some(item => item.Department === department && item.Region === region)) + ')'),
            //                title: {
            //                    text: 'Department (Region)'
            //                }
            //            },
            //            yAxis: {
            //                min: 0,
            //                title: {
            //                    text: 'Percentage'
            //                },
            //                stackLabels: {
            //                    enabled: true,
            //                    style: {
            //                        fontWeight: 'bold',
            //                        color: (Highcharts.defaultOptions.title.style && Highcharts.defaultOptions.title.style.color) || 'gray'
            //                    }
            //                }
            //            },
            //            legend: {
            //                reversed: true
            //            },
            //            plotOptions: {
            //                column: {
            //                    stacking: 'normal',
            //                    dataLabels: {
            //                        enabled: true
            //                    }
            //                }
            //            },
            //            series: series.map(function (s) {









            //                return {
            //                    name: s.name,
            //                    data: s.data,
            //                    color: categoryColors[s.name] || null // Assign color from categoryColors, or null if not specified
            //                };
            //            })
            //        });

            //    }
            //});
            $.ajax({
                type: "GET",
                dataType: "json",
                data: User,
                url: apiURL + 'GetMandayChartDataByDepartment',
                success: function (data) {
                    
                    jsonData = data;
                    
                    // Create unique identifiers for each department-region pair
                    var departmentRegionPairs = jsonData.map(item => ({
                        department: item.Department,
                        region: item.Region,
                        uniqueIdentifier: `${item.Department} (${item.Region})`
                    }));

                    // Get unique department-region pairs
                    var uniqueDepartmentRegionPairs = [...new Set(departmentRegionPairs.map(item => item.uniqueIdentifier))];

                    var categories = [...new Set(jsonData.map(item => item.Category))];

                    var categoryColors = {
                        '项目Project': '#00b050',
                        '运维-需求Maintenance-Req.': '#00b0f0',
                        '运维-日常Maintenance-Daily': '#b4c7e7',
                        '行政管理Administration': '#e2aa00',
                        '培训学习 Training/Study': '#56247a',
                        '休假 Leave': '#a0a0a0',
                        '空闲 Idle': '#ff0101'
                    };

                    categories.sort((a, b) => {
                        const colorKeys = Object.keys(categoryColors);
                        return colorKeys.indexOf(a) - colorKeys.indexOf(b);
                    }).reverse();

                    var series = [];

                    // Loop through each sorted category
                    categories.forEach(function (category) {
                        // Create series data for the current category
                        var seriesData = uniqueDepartmentRegionPairs.map(function (uniqueIdentifier) {
                            var [department, region] = uniqueIdentifier.split(' (');
                            region = region.replace(')', '');
                            var dataPoint = jsonData.find(item => item.Department === department && item.Region === region && item.Category === category);
                            return dataPoint ? dataPoint.Percentage : 0;
                        });

                        // Push the series object for the current category
                        series.push({
                            name: category,
                            data: seriesData
                        });
                    });

                    var option = {
                        'stroke-width': 1,
                        stroke: '#2f7ed8',
                        fill: '#2f7ed8',
                        r: 2,
                        padding: 5,
                        style: {
                            color: '#FFFFFF'
                        }
                    };

                    // Initialize Highcharts chart
                    Highcharts.chart('container', {
                        chart: {
                            type: 'column',
                            events: {
                                load: function () {
                                    this.renderer.button('Excel Report', this.chartWidth - 100, 40, function () {
                                        const reshapedData = reshapeDeptData(data);
                                        const columns = generateDeptColumns(data);
                                        const start_date = $('#s_date').val();
                                        const to_date = $('#e_date').val();
                                        populateDataTable(reshapedData, columns, start_date, to_date);
                                        $('#excelModal').modal('show');
                                    }, option, option, option)
                                        .attr({
                                            id: 'excelButton'
                                        })
                                        .on('mouseover', function () {
                                            $(this.element).css({
                                                'fill': '#2f7ed8',
                                                'stroke': '#2f7ed8',
                                            });
                                        })
                                        .on('mouseout', function () {
                                            $(this.element).css({
                                                'fill': '#2f7ed8',
                                                'stroke': '#2f7ed8',
                                            });
                                        })
                                        .add();
                                }
                            }
                        },
                        title: {
                            text: 'Department Category Count by Region'
                        },
                        xAxis: {
                            categories: uniqueDepartmentRegionPairs,
                            title: {
                                text: 'Department (Region)'
                            }
                        },
                        yAxis: {
                            min: 0,
                            title: {
                                text: 'Percentage'
                            },
                            stackLabels: {
                                enabled: true,
                                style: {
                                    fontWeight: 'bold',
                                    color: (Highcharts.defaultOptions.title.style && Highcharts.defaultOptions.title.style.color) || 'gray'
                                }
                            }
                        },
                        legend: {
                            reversed: true
                        },
                        plotOptions: {
                            column: {
                                stacking: 'normal',
                                dataLabels: {
                                    enabled: true
                                }
                            }
                        },
                        series: series.map(function (s) {
                            return {
                                name: s.name,
                                data: s.data,
                                color: categoryColors[s.name] || null
                            };
                        })
                    });
                }
            });

        } else if ($('#chart_type').val() == 'byregion' && $('#date_type').val() == 'byweek') {

            
            //$.ajax({
            //    type: "GET",
            //    dataType: "json",
            //    //contentType: "application/json",
            //    data: User,
            //    url: apiURL + 'GetChartBYREG_Weekly',
            //    success: function (data) {
                    
            //        jsonData = data;

            //        var weeks = [...new Set(jsonData.map(item => item.week_no))];
            //        var regions = [...new Set(jsonData.map(item => item.Region))];
            //        var categories = [...new Set(jsonData.map(item => item.Category))];
            //        var series = [];

                  


            //        categories.forEach(function (category) {
            //            // Create series data for the current category
            //            var seriesData = [];
            //            weeks.forEach(function (week) {
            //                regions.forEach(function (region) {
            //                    var dataPoint = jsonData.find(item => item.week_no === week && item.Category === category && item.Region === region);
            //                    seriesData.push(dataPoint ? dataPoint.Percentage : 0);
            //                });
            //            });

            //            // Push the series object for the current category
            //            series.push({
            //                name: category,
            //                data: seriesData
            //            });
            //        });
            //        var xCategories = [];
            //        weeks.forEach(week => {
            //            regions.forEach(region => {
            //                xCategories.push(`${week}<br>(${region})`);
            //            });
            //        });

                   
            //        var option = {
            //            'stroke-width': 1,
            //            stroke: '#2f7ed8', // Background color
            //            fill: '#2f7ed8', // Border color
            //            r: 2,
            //            padding: 5,
            //            style: {
            //                color: '#FFFFFF' // Text color
            //            }
            //        };
            //        var categoryColors = {
            //            '项目Project': '#00b050',
            //            '运维-需求Maintenance-Req.': '#00b0f0',
            //            '运维-日常Maintenance-Daily': '#b4c7e7',
            //            '行政管理Administration': '#e2aa00',
            //            '培训学习 Training/Study': '#56247a',
            //            '休假 Leave': '#a0a0a0',
            //            '空闲 Idle': '#ff0101'
            //        };

            //        // Initialize Highcharts chart
            //        Highcharts.chart('container', {
            //            chart: {
            //                type: 'column',
            //                events: {
            //                    load: function () {
            //                        this.renderer.button('Excel Report', this.chartWidth - 100, 40, function () {
            //                            // Add button click functionality here

            //                            const reshapedData = reshapeRegWeekData(data);
            //                            const columns = generateRegWeekColumns(data);
            //                            const start_date = $('#s_date').val();
            //                            const to_date = $('#e_date').val();
            //                            populateDataTable(reshapedData, columns, start_date, to_date);
            //                            $('#excelModal').modal('show');
            //                        }, option, option, option)
            //                            .attr({
            //                                id: 'excelButton'
            //                            })
            //                            .on('mouseover', function () {
            //                                $(this.element).css({
            //                                    'fill': '#2f7ed8',
            //                                    'stroke': '#2f7ed8',
            //                                });
            //                            })
            //                            .on('mouseout', function () {
            //                                $(this.element).css({
            //                                    'fill': '#2f7ed8',
            //                                    'stroke': '#2f7ed8',
            //                                });
            //                            })
            //                            .add();
            //                    }
            //                }
            //            },
            //            title: {
            //                text: 'Department Category Count by Region'
            //            },
            //            //xAxis: {
            //            //    categories: weeks.map(week => week + '<br>(' + regions.find(region => jsonData.some(item => item.week_no === week && item.Region === region)) + ')'),
            //            //    title: {
            //            //        text: 'Department (Region)'
            //            //    }
            //            //},
            //            xAxis: {
            //                categories: xCategories,
            //                title: {
            //                    text: 'Week (Region)'
            //                }
            //            },
            //            yAxis: {
            //                min: 0,
            //                title: {
            //                    text: 'Percentage'
            //                },
            //                stackLabels: {
            //                    enabled: true,
            //                    style: {
            //                        fontWeight: 'bold',
            //                        color: (Highcharts.defaultOptions.title.style && Highcharts.defaultOptions.title.style.color) || 'gray'
            //                    }
            //                }
            //            },
            //            legend: {
            //                reversed: true
            //            },
            //            plotOptions: {
            //                column: {
            //                    stacking: 'normal',
            //                    dataLabels: {
            //                        enabled: true
            //                    }

            //                }
            //            },
            //            series: series.map(function (s) {
            //                return {
            //                    name: s.name,
            //                    data: s.data,
            //                    color: categoryColors[s.name] || null // Assign color from categoryColors, or null if not specified
            //                };
            //            })

            //        });


            //    }
            //});
           
            $.ajax({
                type: "GET",
                dataType: "json",
                data: User,
                url: apiURL + 'GetChartBYREG_Weekly',
                success: function (data) {

                    jsonData = data;

                    var weeks = [...new Set(jsonData.map(item => item.week_no))];
                    var regions = [...new Set(jsonData.map(item => item.Region))];
                    var categoryColors = {
                        '项目Project': '#00b050',
                        '运维-需求Maintenance-Req.': '#00b0f0',
                        '运维-日常Maintenance-Daily': '#b4c7e7',
                        '行政管理Administration': '#e2aa00',
                        '培训学习 Training/Study': '#56247a',
                        '休假 Leave': '#a0a0a0',
                        '空闲 Idle': '#ff0101'
                    };
                    var series = [];

                    // Reverse the order of categoryColors keys
                    var categoryKeys = Object.keys(categoryColors).reverse();
                    categoryKeys.forEach(function (category) {
                        // Create series data for the current category
                        var seriesData = [];
                        weeks.forEach(function (week) {
                            regions.forEach(function (region) {
                                var dataPoint = jsonData.find(item => item.week_no === week && item.Category === category && item.Region === region);
                                seriesData.push(dataPoint ? dataPoint.Percentage : 0);
                            });
                        });

                        // Push the series object for the current category
                        series.push({
                            name: category,
                            data: seriesData,
                            color: categoryColors[category] // Assign color from categoryColors
                        });
                    });

                    var xCategories = [];
                    weeks.forEach(week => {
                        regions.forEach(region => {
                            xCategories.push(`${week}<br>(${region})`);
                        });
                    });

                    var option = {
                        'stroke-width': 1,
                        stroke: '#2f7ed8',
                        fill: '#2f7ed8',
                        r: 2,
                        padding: 5,
                        style: {
                            color: '#FFFFFF'
                        }
                    };

                    Highcharts.chart('container', {
                        chart: {
                            type: 'column',
                            events: {
                                load: function () {
                                    this.renderer.button('Excel Report', this.chartWidth - 100, 40, function () {
                                        // Add button click functionality here

                                        const reshapedData = reshapeRegWeekData(data);
                                        const columns = generateRegWeekColumns(data);
                                        const start_date = $('#s_date').val();
                                        const to_date = $('#e_date').val();
                                        populateDataTable(reshapedData, columns, start_date, to_date);
                                        $('#excelModal').modal('show');
                                    }, option, option, option)
                                        .attr({
                                            id: 'excelButton'
                                        })
                                        .on('mouseover', function () {
                                            $(this.element).css({
                                                'fill': '#2f7ed8',
                                                'stroke': '#2f7ed8',
                                            });
                                        })
                                        .on('mouseout', function () {
                                            $(this.element).css({
                                                'fill': '#2f7ed8',
                                                'stroke': '#2f7ed8',
                                            });
                                        })
                                        .add();
                                }
                            }
                        },
                        title: {
                            text: 'Department Category Count by Region'
                        },
                        xAxis: {
                            categories: xCategories,
                            title: {
                                text: 'Week (Region)'
                            }
                        },
                        yAxis: {
                            min: 0,
                            title: {
                                text: 'Percentage'
                            },
                            stackLabels: {
                                enabled: true,
                                style: {
                                    fontWeight: 'bold',
                                    color: (Highcharts.defaultOptions.title.style && Highcharts.defaultOptions.title.style.color) || 'gray'
                                }
                            }
                        },
                        legend: {
                            reversed: true
                        },
                        plotOptions: {
                            column: {
                                stacking: 'normal',
                                dataLabels: {
                                    enabled: true
                                }
                            }
                        },
                        series: series
                    });
                }
            });


        }
        else if ($('#chart_type').val() == 'byregion' && $('#date_type').val() == 'bymonth') {
            
            //$.ajax({
            //    type: "GET",
            //    dataType: "json",
            //    //contentType: "application/json",
            //    data: User,
            //    url: apiURL + 'GetChartBYREG_Monthly',
            //    success: function (data) {
                    
            //        jsonData = data;

            //        var months = [...new Set(jsonData.map(item => item.month_name))];
            //        var regions = [...new Set(jsonData.map(item => item.Region))];
            //        var categories = [...new Set(jsonData.map(item => item.Category))];
            //        var series = [];

            //        // Loop through each category
            //        //categories.forEach(function (category) {

            //        //    var seriesData = weeks.map(function (week) {
            //        //        var dataPoint = jsonData.find(item => item.week_no === week && item.Category === category);
            //        //        return dataPoint ? dataPoint.Percentage : 0;
            //        //    });

            //        //    // Push the series object for the current category
            //        //    series.push({
            //        //        name: category,
            //        //        data: seriesData
            //        //    });
            //        //});
            //        categories.forEach(function (category) {
            //            // Create series data for the current category
            //            var seriesData = [];
            //            months.forEach(function (mnth) {
            //                regions.forEach(function (region) {
            //                    var dataPoint = jsonData.find(item => item.month_name === mnth && item.Category === category && item.Region === region);
            //                    seriesData.push(dataPoint ? dataPoint.Percentage : 0);
            //                });
            //            });

            //            // Push the series object for the current category
            //            series.push({
            //                name: category,
            //                data: seriesData
            //            });
            //        });
            //        var xCategories = [];
            //        months.forEach(mnth => {
            //            regions.forEach(region => {
            //                xCategories.push(`${mnth}<br>(${region})`);
            //            });
            //        });
            //        var option = {
            //            'stroke-width': 1,
            //            stroke: '#2f7ed8', // Background color
            //            fill: '#2f7ed8', // Border color
            //            r: 2,
            //            padding: 5,
            //            style: {
            //                color: '#FFFFFF' // Text color
            //            }
            //        };
            //        var categoryColors = {
            //            '项目Project': '#00b050',
            //            '运维-需求Maintenance-Req.': '#00b0f0',
            //            '运维-日常Maintenance-Daily': '#b4c7e7',
            //            '行政管理Administration': '#e2aa00',
            //            '培训学习 Training/Study': '#56247a',
            //            '休假 Leave': '#a0a0a0',
            //            '空闲 Idle': '#ff0101'
            //        };

            //        // Initialize Highcharts chart
            //        Highcharts.chart('container', {
            //            chart: {
            //                type: 'column',
            //                events: {
            //                    load: function () {
            //                        this.renderer.button('Excel Report', this.chartWidth - 100, 40, function () {
            //                            // Add button click functionality here

            //                            const reshapedData = reshapeRegMonthData(data);
            //                            const columns = generateRegMonthColumns(data);
            //                            const start_date = $('#s_date').val();
            //                            const to_date = $('#e_date').val();
            //                            populateDataTable(reshapedData, columns, start_date, to_date);
            //                            $('#excelModal').modal('show');
            //                        }, option, option, option)
            //                            .attr({
            //                                id: 'excelButton'
            //                            })
            //                            .on('mouseover', function () {
            //                                $(this.element).css({
            //                                    'fill': '#2f7ed8',
            //                                    'stroke': '#2f7ed8',
            //                                });
            //                            })
            //                            .on('mouseout', function () {
            //                                $(this.element).css({
            //                                    'fill': '#2f7ed8',
            //                                    'stroke': '#2f7ed8',
            //                                });
            //                            })
            //                            .add();
            //                    }
            //                }
            //            },
            //            title: {
            //                text: 'Department Category Count by Region'
            //            },
            //            //xAxis: {
            //            //    categories: weeks.map(week => week + '<br>(' + regions.find(region => jsonData.some(item => item.week_no === week && item.Region === region)) + ')'),
            //            //    title: {
            //            //        text: 'Department (Region)'
            //            //    }
            //            //},
            //            xAxis: {
            //                categories: xCategories,
            //                title: {
            //                    text: 'Week (Region)'
            //                }
            //            },
            //            yAxis: {
            //                min: 0,
            //                title: {
            //                    text: 'Percentage'
            //                },
            //                stackLabels: {
            //                    enabled: true,
            //                    style: {
            //                        fontWeight: 'bold',
            //                        color: (Highcharts.defaultOptions.title.style && Highcharts.defaultOptions.title.style.color) || 'gray'
            //                    }
            //                }
            //            },
            //            legend: {
            //                reversed: true
            //            },
            //            plotOptions: {
            //                column: {
            //                    stacking: 'normal',
            //                    dataLabels: {
            //                        enabled: true
            //                    }

            //                }
            //            },
            //            series: series.map(function (s) {
            //                return {
            //                    name: s.name,
            //                    data: s.data,
            //                    color: categoryColors[s.name] || null // Assign color from categoryColors, or null if not specified
            //                };
            //            })

            //        });


            //    }
            //});

            $.ajax({
                type: "GET",
                dataType: "json",
                data: User,
                url: apiURL + 'GetChartBYREG_Monthly',
                success: function (data) {

                    jsonData = data;

                    var months = [...new Set(jsonData.map(item => item.month_name))];
                    var regions = [...new Set(jsonData.map(item => item.Region))];
                    var categoryColors = {
                        '项目Project': '#00b050',
                        '运维-需求Maintenance-Req.': '#00b0f0',
                        '运维-日常Maintenance-Daily': '#b4c7e7',
                        '行政管理Administration': '#e2aa00',
                        '培训学习 Training/Study': '#56247a',
                        '休假 Leave': '#a0a0a0',
                        '空闲 Idle': '#ff0101'
                    };
                    var series = [];

                    // Reverse the order of categoryColors keys
                    var categoryKeys = Object.keys(categoryColors).reverse();
                    categoryKeys.forEach(function (category) {
                        // Create series data for the current category
                        var seriesData = [];
                        months.forEach(function (month) {
                            regions.forEach(function (region) {
                                var dataPoint = jsonData.find(item => item.month_name === month && item.Category === category && item.Region === region);
                                seriesData.push(dataPoint ? dataPoint.Percentage : 0);
                            });
                        });

                        // Push the series object for the current category
                        series.push({
                            name: category,
                            data: seriesData,
                            color: categoryColors[category] // Assign color from categoryColors
                        });
                    });

                    var xCategories = [];
                    months.forEach(month => {
                        regions.forEach(region => {
                            xCategories.push(`${month}<br>(${region})`);
                        });
                    });

                    var option = {
                        'stroke-width': 1,
                        stroke: '#2f7ed8',
                        fill: '#2f7ed8',
                        r: 2,
                        padding: 5,
                        style: {
                            color: '#FFFFFF'
                        }
                    };

                    Highcharts.chart('container', {
                        chart: {
                            type: 'column',
                            events: {
                                load: function () {
                                    this.renderer.button('Excel Report', this.chartWidth - 100, 40, function () {
                                        // Add button click functionality here

                                        const reshapedData = reshapeRegMonthData(data);
                                        const columns = generateRegMonthColumns(data);
                                        const start_date = $('#s_date').val();
                                        const to_date = $('#e_date').val();
                                        populateDataTable(reshapedData, columns, start_date, to_date);
                                        $('#excelModal').modal('show');
                                    }, option, option, option)
                                        .attr({
                                            id: 'excelButton'
                                        })
                                        .on('mouseover', function () {
                                            $(this.element).css({
                                                'fill': '#2f7ed8',
                                                'stroke': '#2f7ed8',
                                            });
                                        })
                                        .on('mouseout', function () {
                                            $(this.element).css({
                                                'fill': '#2f7ed8',
                                                'stroke': '#2f7ed8',
                                            });
                                        })
                                        .add();
                                }
                            }
                        },
                        title: {
                            text: 'Department Category Count by Region'
                        },
                        xAxis: {
                            categories: xCategories,
                            title: {
                                text: 'Month (Region)'
                            }
                        },
                        yAxis: {
                            min: 0,
                            title: {
                                text: 'Percentage'
                            },
                            stackLabels: {
                                enabled: true,
                                style: {
                                    fontWeight: 'bold',
                                    color: (Highcharts.defaultOptions.title.style && Highcharts.defaultOptions.title.style.color) || 'gray'
                                }
                            }
                        },
                        legend: {
                            reversed: true
                        },
                        plotOptions: {
                            column: {
                                stacking: 'normal',
                                dataLabels: {
                                    enabled: true
                                }
                            }
                        },
                        series: series
                    });
                }
            });


        }
        else if ($('#chart_type').val() == 'bydepartment' && $('#date_type').val() == 'byweek') {
            
            var departmentValue = $('#department').val().toString();
            var departmentArray = departmentValue.split(',').map(function (dept) {
                return "'" + dept.trim() + "'";
            });
            var formattedDepartmentValue = departmentArray.join(',');

            User.Department = formattedDepartmentValue

            $.ajax({
                type: "GET",
                dataType: "json",
                //  contentType: "application/json",
                data: User,
                url: apiURL + 'GetChartBYDEPT_Weekly',
                success: function (data) {
                    
                    jsonData = data;

                    var departments = [...new Set(jsonData.map(item => item.Department))];
                    var weeks = [...new Set(jsonData.map(item => item.week_no))];
                    var regions = [...new Set(jsonData.map(item => item.Region))];
                    var categories = [...new Set(jsonData.map(item => item.Category))];
                    var series = [];

                    // Loop through each category
                    //categories.forEach(function (category) {

                    //    var seriesData = departments.map(function (department) {
                    //        var dataPoint = jsonData.find(item => item.Department === department && item.Category === category);
                    //        return dataPoint ? dataPoint.Percentage : 0;
                    //    });


                    //    series.push({
                    //        name: category,
                    //        data: seriesData
                    //    });
                    //});



                    // Prepare multi-level categories
                    //var xCategories = [];
                    //departments.forEach(department => {
                    //    var deptRegions = [...new Set(jsonData.filter(item => item.Department === department).map(item => item.Region))];
                    //    deptRegions.forEach(region => {
                    //        weeks.forEach(week => {
                                
                    //            xCategories.push({
                    //                name: `${department} (${region})`,
                    //                categories: [`${week}`]
                    //            });
                    //        });
                    //    });
                    //});
                    ////categories.forEach(function (category) {
                    ////    // Create series data for the current category
                    ////    var seriesData = weeks.map(function (week) {
                    ////        return {
                    ////            name: week,
                    ////            data: departments.map(function (department) {
                    ////                var dataPoint = jsonData.find(item => item.Department === department && item.Category === category && item.week_no === week);
                    ////                return dataPoint ? dataPoint.Percentage : 0;
                    ////            })
                    ////        };
                    ////    });

                    ////    // Push the series object for the current category
                    ////    series.push({
                    ////        name: category,
                    ////        data: seriesData
                    ////    });
                    ////});
                    //categories.forEach(function (category) {
                    //    // Create series data for the current category
                    //    var seriesData = [];
                    //    departments.forEach(function (department) {
                    //        var deptRegions = [...new Set(jsonData.filter(item => item.Department === department).map(item => item.Region))];
                    //        deptRegions.forEach(region => {
                    //            debugger
                    //            weeks.forEach(function (week) {
                    //                var dataPoint = jsonData.find(item => item.Department === department && item.Category === category && item.Region === region && item.week_no === week);
                    //                seriesData.push(dataPoint ? dataPoint.Percentage : 0);
                    //            });
                    //        });
                    //    });

                    //    // Push the series object for the current category
                    //    series.push({
                    //        name: category,
                    //        data: seriesData
                    //    });
                    //});


                    var xCategories = [];
                    var flatCategories = [];

                    departments.forEach(department => {
                        regions.forEach(region => {
                            weeks.forEach(week => {
                                xCategories.push({
                                    department: department,
                                    region: region,
                                    week: week
                                });
                                flatCategories.push(`${department} (${region})<br>${week}`);
                            });
                        });
                    });

                    categories.forEach(function (category) {
                        // Create series data for the current category
                        var seriesData = [];
                        xCategories.forEach(function (xCat) {
                            var dataPoint = jsonData.find(item =>
                                item.Department === xCat.department &&
                                item.Category === category &&
                                item.Region === xCat.region &&
                                item.week_no === xCat.week
                            );
                            seriesData.push(dataPoint ? dataPoint.Percentage : 0);
                        });

                        // Push the series object for the current category
                        series.push({
                            name: category,
                            data: seriesData
                        });
                    });

                    var option = {
                        'stroke-width': 1,
                        stroke: '#2f7ed8', // Background color
                        fill: '#2f7ed8', // Border color
                        r: 2,
                        padding: 5,
                        style: {
                            color: '#FFFFFF' // Text color
                        }
                    };
                    var categoryColors = {
                        '项目Project': '#00b050',
                        '运维-需求Maintenance-Req.': '#00b0f0',
                        '运维-日常Maintenance-Daily': '#b4c7e7',
                        '行政管理Administration': '#e2aa00',
                        '培训学习 Training/Study': '#56247a',
                        '休假 Leave': '#a0a0a0',
                        '空闲 Idle': '#ff0101'
                    };
                    // Initialize Highcharts chart
                    Highcharts.chart('container', {
                        chart: {
                            type: 'column',
                            events: {
                                load: function () {
                                    this.renderer.button('Excel Report', this.chartWidth - 100, 40, function () {
                                        // Add button click functionality here

                                        const reshapedData = reshapeDeptWeekData(data);
                                        const columns = generateDeptWeekColumns(data);
                                        const start_date = $('#s_date').val();
                                        const to_date = $('#e_date').val();
                                        populateDataTable(reshapedData, columns, start_date, to_date);
                                        $('#excelModal').modal('show');
                                    }, option, option, option)
                                        .attr({
                                            id: 'excelButton'
                                        })
                                        .on('mouseover', function () {
                                            $(this.element).css({
                                                'fill': '#2f7ed8',
                                                'stroke': '#2f7ed8',
                                            });
                                        })
                                        .on('mouseout', function () {
                                            $(this.element).css({
                                                'fill': '#2f7ed8',
                                                'stroke': '#2f7ed8',
                                            });
                                        })
                                        .add();
                                }
                            }
                        },
                        title: {
                            text: 'Department Category Count by Region'
                        },
                        //xAxis: {
                        //    categories: departments.map(department => department + '<br>(' + regions.find(region => jsonData.some(item => item.Department === department && item.Region === region)) + ')'),
                        //    title: {
                        //        text: 'Department (Region)'
                        //    }
                        //},
                        xAxis: {
                            categories: flatCategories,
                            title: {
                                text: 'Department (Region)'
                            }
                        },
                        yAxis: {
                            min: 0,
                            title: {
                                text: 'Percentage'
                            },
                            stackLabels: {
                                enabled: true,
                                style: {
                                    fontWeight: 'bold',
                                    color: (Highcharts.defaultOptions.title.style && Highcharts.defaultOptions.title.style.color) || 'gray'
                                }
                            }
                        },
                        legend: {
                            reversed: true
                        },
                        plotOptions: {
                            column: {
                                stacking: 'normal',
                                dataLabels: {
                                    enabled: true
                                }

                            }
                        },
                        series: series.map(function (s) {
                            return {
                                name: s.name,
                                data: s.data,
                                color: categoryColors[s.name] || null // Assign color from categoryColors, or null if not specified
                            };
                        })

                    });
                }




            });

        }
        else if ($('#chart_type').val() == 'bydepartment' && $('#date_type').val() == 'bymonth') {

            
            var departmentValue = $('#department').val().toString();
            var departmentArray = departmentValue.split(',').map(function (dept) {
                return "'" + dept.trim() + "'";
            });
            var formattedDepartmentValue = departmentArray.join(',');

            User.Department = formattedDepartmentValue
            $.ajax({
    type: "GET",
    dataType: "json",
    data: User,
    url: apiURL + 'GetChartBYDEPT_Monthly',
    success: function (data) {
        
        jsonData = data;

        var departments = [...new Set(jsonData.map(item => item.Department))];
        var mnths = [...new Set(jsonData.map(item => item.month_name))];
        var regions = [...new Set(jsonData.map(item => item.Region))];
        var categories = [...new Set(jsonData.map(item => item.Category))];
        var series = [];

      
        //var xCategories = [];
        //departments.forEach(department => {
        //    var deptRegions = [...new Set(jsonData.filter(item => item.Department === department).map(item => item.Region))];
        //    deptRegions.forEach(region => {
        //        var monthCategories = mnths.map(mnth => `${mnth}`);
        //        xCategories.push({
        //            name: `${department} (${region})`,
        //            categories: monthCategories
        //        });
        //    });
        //});

      
        //categories.forEach(function (category) {
        //    var seriesData = [];
        //    departments.forEach(function (department) {
        //        var deptRegions = [...new Set(jsonData.filter(item => item.Department === department).map(item => item.Region))];
        //        deptRegions.forEach(region => {
        //            mnths.forEach(function (mnth) {
        //                var dataPoint = jsonData.find(item => item.Department === department && item.Category === category && item.Region === region && item.month_name === mnth);
        //                seriesData.push(dataPoint ? dataPoint.Percentage : 0);
        //            });
        //        });
        //    });

        //    series.push({
        //        name: category,
        //        data: seriesData
        //    });
        //});
        var xCategories = [];
        var flatCategories = [];

        departments.forEach(department => {
            regions.forEach(region => {
                mnths.forEach(mnth => {
                    xCategories.push({
                        department: department,
                        region: region,
                        mnth: mnth
                    });
                    flatCategories.push(`${department} (${region})<br>${mnth}`);
                });
            });
        });

        categories.forEach(function (category) {
            // Create series data for the current category
            var seriesData = [];
            xCategories.forEach(function (xCat) {
                var dataPoint = jsonData.find(item =>
                    item.Department === xCat.department &&
                    item.Category === category &&
                    item.Region === xCat.region &&
                    item.month_name === xCat.mnth
                );
                seriesData.push(dataPoint ? dataPoint.Percentage : 0);
            });

            // Push the series object for the current category
            series.push({
                name: category,
                data: seriesData
            });
        });
        var option = {
            'stroke-width': 1,
            stroke: '#2f7ed8',
            fill: '#2f7ed8',
            r: 2,
            padding: 5,
            style: {
                color: '#FFFFFF'
            }
        };

        var categoryColors = {
            '项目Project': '#00b050',
            '运维-需求Maintenance-Req.': '#00b0f0',
            '运维-日常Maintenance-Daily': '#b4c7e7',
            '行政管理Administration': '#e2aa00',
            '培训学习 Training/Study': '#56247a',
            '休假 Leave': '#a0a0a0',
            '空闲 Idle': '#ff0101'
        };

        // Initialize Highcharts chart
        Highcharts.chart('container', {
            chart: {
                type: 'column',
                events: {
                    load: function () {
                        this.renderer.button('Excel Report', this.chartWidth - 100, 40, function () {
                            const reshapedData = reshapeDeptMonthData(data);
                            const columns = generateDeptMonthColumns(data);
                            const start_date = $('#s_date').val();
                            const to_date = $('#e_date').val();
                            populateDataTable(reshapedData, columns, start_date, to_date);
                            $('#excelModal').modal('show');
                        }, option, option, option)
                            .attr({
                                id: 'excelButton'
                            })
                            .on('mouseover', function () {
                                $(this.element).css({
                                    'fill': '#2f7ed8',
                                    'stroke': '#2f7ed8',
                                });
                            })
                            .on('mouseout', function () {
                                $(this.element).css({
                                    'fill': '#2f7ed8',
                                    'stroke': '#2f7ed8',
                                });
                            })
                            .add();
                    }
                }
            },
            title: {
                text: 'Department Category Count by Region'
            },
            //xAxis: {
            //    categories: xCategories.map(xCategory => xCategory.categories).flat(),
            //    title: {
            //        text: 'Department (Region)'
            //    }
            //},
            xAxis: {
                categories: flatCategories,
                title: {
                    text: 'Department (Region) and Month'
                }
            },
            yAxis: {
                min: 0,
                title: {
                    text: 'Percentage'
                },
                stackLabels: {
                    enabled: true,
                    style: {
                        fontWeight: 'bold',
                        color: (Highcharts.defaultOptions.title.style && Highcharts.defaultOptions.title.style.color) || 'gray'
                    }
                }
            },
            legend: {
                reversed: true
            },
            plotOptions: {
                column: {
                    stacking: 'normal',
                    dataLabels: {
                        enabled: true
                    }
                }
            },
            series: series.map(function (s) {
                return {
                    name: s.name,
                    data: s.data,
                    color: categoryColors[s.name] || null
                };
            })
        });
    }
});

            //$.ajax({
            //    type: "GET",
            //    dataType: "json",
            //    //  contentType: "application/json",
            //    data: User,
            //    url: apiURL + 'GetChartBYDEPT_Monthly',
            //    success: function (data) {
            //        debugger
            //        jsonData = data;

            //        var departments = [...new Set(jsonData.map(item => item.Department))];
            //        var mnths = [...new Set(jsonData.map(item => item.month_name))];
            //        var regions = [...new Set(jsonData.map(item => item.Region))];
            //        var categories = [...new Set(jsonData.map(item => item.Category))];
            //        var series = [];

            //        // Loop through each category
            //        //categories.forEach(function (category) {

            //        //    var seriesData = departments.map(function (department) {
            //        //        var dataPoint = jsonData.find(item => item.Department === department && item.Category === category);
            //        //        return dataPoint ? dataPoint.Percentage : 0;
            //        //    });


            //        //    series.push({
            //        //        name: category,
            //        //        data: seriesData
            //        //    });
            //        //});



            //        // Prepare multi-level categories
            //        var xCategories = [];
            //        departments.forEach(department => {
            //            var deptRegions = [...new Set(jsonData.filter(item => item.Department === department).map(item => item.Region))];
            //            deptRegions.forEach(region => {
            //                mnths.forEach(mnth => {

            //                    xCategories.push({
            //                        name: `${department} (${region})`,
            //                        categories: [`${mnth}`]
            //                    });
            //                });
            //            });
            //        });
            //        //categories.forEach(function (category) {
            //        //    // Create series data for the current category
            //        //    var seriesData = weeks.map(function (week) {
            //        //        return {
            //        //            name: week,
            //        //            data: departments.map(function (department) {
            //        //                var dataPoint = jsonData.find(item => item.Department === department && item.Category === category && item.week_no === week);
            //        //                return dataPoint ? dataPoint.Percentage : 0;
            //        //            })
            //        //        };
            //        //    });

            //        //    // Push the series object for the current category
            //        //    series.push({
            //        //        name: category,
            //        //        data: seriesData
            //        //    });
            //        //});
            //        categories.forEach(function (category) {
            //            // Create series data for the current category
            //            var seriesData = [];
            //            departments.forEach(function (department) {
            //                var deptRegions = [...new Set(jsonData.filter(item => item.Department === department).map(item => item.Region))];
            //                deptRegions.forEach(region => {
            //                    mnths.forEach(function (mnth) {
            //                        var dataPoint = jsonData.find(item => item.Department === department && item.Category === category && item.Region === region && item.month_name === mnth);
            //                        seriesData.push(dataPoint ? dataPoint.Percentage : 0);
            //                    });
            //                });
            //            });

            //            // Push the series object for the current category
            //            series.push({
            //                name: category,
            //                data: seriesData
            //            });
            //        });
            //        var option = {
            //            'stroke-width': 1,
            //            stroke: '#2f7ed8', // Background color
            //            fill: '#2f7ed8', // Border color
            //            r: 2,
            //            padding: 5,
            //            style: {
            //                color: '#FFFFFF' // Text color
            //            }
            //        };
            //        var categoryColors = {
            //            '项目Project': '#00b050',
            //            '运维-需求Maintenance-Req.': '#00b0f0',
            //            '运维-日常Maintenance-Daily': '#b4c7e7',
            //            '行政管理Administration': '#e2aa00',
            //            '培训学习 Training/Study': '#56247a',
            //            '休假 Leave': '#a0a0a0',
            //            '空闲 Idle': '#ff0101'
            //        };
            //        // Initialize Highcharts chart
            //        Highcharts.chart('container', {
            //            chart: {
            //                type: 'column',
            //                events: {
            //                    load: function () {
            //                        this.renderer.button('Excel Report', this.chartWidth - 100, 40, function () {
            //                            // Add button click functionality here

            //                            const reshapedData = reshapeDeptMonthData(data);
            //                            const columns = generateDeptMonthColumns(data);
            //                            const start_date = $('#s_date').val();
            //                            const to_date = $('#e_date').val();
            //                            populateDataTable(reshapedData, columns, start_date, to_date);
            //                            $('#excelModal').modal('show');
            //                        }, option, option, option)
            //                            .attr({
            //                                id: 'excelButton'
            //                            })
            //                            .on('mouseover', function () {
            //                                $(this.element).css({
            //                                    'fill': '#2f7ed8',
            //                                    'stroke': '#2f7ed8',
            //                                });
            //                            })
            //                            .on('mouseout', function () {
            //                                $(this.element).css({
            //                                    'fill': '#2f7ed8',
            //                                    'stroke': '#2f7ed8',
            //                                });
            //                            })
            //                            .add();
            //                    }
            //                }
            //            },
            //            title: {
            //                text: 'Department Category Count by Region'
            //            },
            //            //xAxis: {
            //            //    categories: departments.map(department => department + '<br>(' + regions.find(region => jsonData.some(item => item.Department === department && item.Region === region)) + ')'),
            //            //    title: {
            //            //        text: 'Department (Region)'
            //            //    }
            //            //},
            //            xAxis: {
            //                categories: xCategories,
            //                title: {
            //                    text: 'Department (Region)'
            //                }
            //            },
            //            yAxis: {
            //                min: 0,
            //                title: {
            //                    text: 'Percentage'
            //                },
            //                stackLabels: {
            //                    enabled: true,
            //                    style: {
            //                        fontWeight: 'bold',
            //                        color: (Highcharts.defaultOptions.title.style && Highcharts.defaultOptions.title.style.color) || 'gray'
            //                    }
            //                }
            //            },
            //            legend: {
            //                reversed: true
            //            },
            //            plotOptions: {
            //                column: {
            //                    stacking: 'normal',
            //                    dataLabels: {
            //                        enabled: true
            //                    }

            //                }
            //            },
            //            series: series.map(function (s) {
            //                return {
            //                    name: s.name,
            //                    data: s.data,
            //                    color: categoryColors[s.name] || null // Assign color from categoryColors, or null if not specified
            //                };
            //            })

            //        });
            //    }




            //});

        }

    }
});

