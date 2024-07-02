using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace User_Daily_Input.Models
{
    public class UserModel
    {
        public string ACCOUNT { get; set; }
        public string PASSWORD { get; set; }
        public string EMAIL { get; set; }
        public string EmployeeNumber { get; set; }
    }

    public class User_data
    {
        public string Username { get; set; }    
        public int ID { get; set; }
        public string Region { get; set; }
        public string Department { get; set; }
        public string EmployeeName { get; set; }
        public string EmployeeNumber { get; set; }
        public DateTime? FillDate { get; set; }
        public float? LtH { get; set; }
        public string Category { get; set; }
        public string ProjectName { get; set; }
        public string ProjectNumber { get; set; }
        public string RequirementName { get; set; }
       // public string RequirementName_drop { get; set; }
        public string ContentName { get; set; }
        public string Remark { get; set; }
        public bool? CheckType { get; set; }
        public bool? Lock { get; set; }
        public string CreatedDate { get; set; }
        public string CreatedTime { get; set; }
        public string CreatedBy { get; set; }
        public string UpdatedDate { get; set; }
        public string UpdatedTime { get; set; }
        public string UpdatedBy { get; set; }
        public DateTime Start_date {  get; set; } 
        public DateTime To_date { get; set;}
        public string[] Department2 { get; set; }
    }

    public class ITMember
    {
        public int? ID { get; set; }
        public string Region { get; set; }
        public string Department { get; set; }
        public string EmployeeName { get; set; }
        public string EmployeeNumber { get; set; }
        public string Email { get; set; }
        public DateTime? JoinDate { get; set; }
        public DateTime? ResignDate { get; set; }
        public int? ManDS { get; set; }
        public string Account { get; set; }
        public string Password { get; set; }
        public string Remark { get; set; }
        public string Role { get; set; }
    }
    public class Rights_List
    {
        public int? Id { get; set; }
        public string Account { get; set; }
        public string Role_right { get; set; }
        public string Assigned_region { get; set; }
        public string Assigned_dept { get; set; }
        public string Remark { get; set; }
        public string Role { get; set; }

    }
    public class EmployeeData
    {
        public List<string> Departments { get; set; }
        public List<string> EmpNos { get; set; }
        public List<string> EmpNames { get; set; }
    }
    public class Holiday_List
    {
        public int? ID { get; set; }

        public string Region { get; set; }
        public string HolidayType { get; set; }
        public DateTime? HolidayDate { get; set; }
        public int? HolidayLength { get; set; }

        public string CreatedDept { get; set; }
        public string CreatedUser { get; set; }
        public string LastUser { get; set; }
        public DateTime? LastDate { get; set; }
    }
    public class InsertResult
    {
        public string Result { get; set; }
        public string Region { get; set; }
        public int RowNumber { get; set; }
    }
    public class MandayData
    {
        public string Category { get; set; }
        public string Region { get; set; }
        public string Department { get; set; }
        public int EmployeeCount { get; set; }
        public int BaseCount { get; set; }
        public float LT_H { get; set; }
        public float Percentage { get; set; }
        public string fromdate { get; set; }
        public string todate { get; set; }
        public string week_no {  get; set; }    
        public string month_name {  get; set; }
    }

    public class emp_working_info
    {
        public string Region { get; set; }
        public string Dept { get; set; }
        public int BaseHours { get; set; }
        public string week {  get; set; }   
        public string month_name {  get; set; }   
    }
}