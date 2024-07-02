using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Data.SqlClient;
using System.Data;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using User_Daily_Input.Models;
using System.Threading.Tasks;
using System.Reflection;
using System.Drawing;
using System.Web.Security;
using System.Text;
using System.Runtime.Remoting;
using System.Globalization;
using System.Configuration;

namespace User_Daily_Input.Controllers
{
    [RoutePrefix("api/apcnote")]
    public class LoginController : ApiController
    {
        User dataobj = new User();
        string objconfig = System.Configuration.ConfigurationManager.ConnectionStrings["DB_PMO"].ToString();
        // string objconfig = System.Configuration.ConfigurationManager.ConnectionStrings["DB_MNT"].ToString();


       

        [HttpPost]
        [Route("Checkuser")]
        public List<string> Checkuser(UserModel obj)
        {
            List<string> list = new List<string>();
            //string result = dataobj.Check_User(obj.EMP_NO, dataobj.CreateMD5(obj.PASSWORD));
            list = dataobj.Check_User(obj.ACCOUNT, obj.PASSWORD);
            return list;
        }


        //[HttpPost]
        //[Route("Get_User")]
        //public List<string> Get_User(UserModel obj)
        //{
        //    List<string> list = new List<string>();
        //    //string result = dataobj.Check_User(obj.EMP_NO, dataobj.CreateMD5(obj.PASSWORD));
        //    list = dataobj.Get_User(obj.ACCOUNT);
        //    return list;
        //}




        [HttpPost]
        [Route("CheckEmail")]
        public List<string> CheckEmail(UserModel obj)
        {
            List<string> list = new List<string>();
            list = dataobj.CheckEmail(obj.ACCOUNT);
            return list;
        }

        [HttpPost]
        [Route("UpdatePasword")]
        public List<string> UpdatePasword(UserModel obj)
        {
            List<string> list = new List<string>();
            string Result = "";
            SqlConnection conn = new SqlConnection(objconfig);
            conn.Open();
            string sql = "Update IT_MEMBER set PASSWORD='" + obj.PASSWORD + "' where ACCOUNT='" + obj.ACCOUNT + "'";
            SqlCommand cmd = new SqlCommand(sql, conn);

            int i = cmd.ExecuteNonQuery();
            if (i > 0)
            {
                Result = "Success";
                list.Add(Result);
            }
            else
            {
                Result = "failed";
                list.Add(Result);
            }

            conn.Close();

            return list;

        }

        [HttpPost]
        [Route("Get_User_Details")]
        public List<ITMember> Get_User_Details(UserModel obj)
        {
            List<ITMember> list = new List<ITMember>();
            //string result = dataobj.Check_User(obj.EMP_NO, dataobj.CreateMD5(obj.PASSWORD));
            list = dataobj.GET_USER(obj.ACCOUNT);
            return list;
        }


        [HttpPost]
        [Route("Get_UserRole")]
        public List<string> Get_UserRole(UserModel obj)
        {
            List<string> list = new List<string>();
            try
            {

                string sql = "select EMP_ROLE from IT_MEMBER where ACCOUNT='" + obj.ACCOUNT + "'";
                SqlConnection connection = new SqlConnection(objconfig);
                connection.Open();
                SqlCommand cmd = new SqlCommand(sql, connection);

                cmd.CommandText = sql;

                SqlDataReader reader = cmd.ExecuteReader();

                //  string dbrole = "";
                while (reader.Read())
                {

                    list.Add(reader["EMP_ROLE"].ToString());

                }




            }
            catch (Exception ex)
            {
                throw ex;
            }

            return list;
        }

        [HttpPost]
        [Route("Add_IT_member")]
        public List<string> Add_IT_member(ITMember obj)
        {
            List<string> list = new List<string>();
            list = dataobj.Add_IT_member(obj.Region, obj.Department, obj.ManDS, obj.Role, obj.EmployeeName, obj.EmployeeNumber, obj.Email, obj.JoinDate, obj.Account, obj.Password, obj.Remark);
            return list;
        }

        [HttpPost]
        [Route("Update_IT_Member_details")]
        public List<string> Update_IT_Member_details(ITMember obj)
        {
            List<string> list = new List<string>();
            list = dataobj.Update_IT_Member_details(obj.ID, obj.Region, obj.Department, obj.ManDS, obj.Role, obj.EmployeeName, obj.EmployeeNumber, obj.Email, obj.JoinDate, obj.ResignDate, obj.Account, obj.Password, obj.Remark);
            return list;
        }
        [HttpGet]
        [Route("Get_IT_member_details")]
        public async Task<List<ITMember>> Get_IT_member_details()
        {
            List<ITMember> Data = new List<ITMember>();
            try
            {
                //string emp_no = obj.ACCOUNT.Substring(4);
                string sql = "select * from IT_MEMBER";
                SqlConnection connection = new SqlConnection(objconfig);
                connection.Open();
                SqlCommand cmd = new SqlCommand(sql, connection);

                cmd.CommandText = sql;

                SqlDataReader reader = cmd.ExecuteReader();
                // SqlDataReader dr = cmd.ExecuteReader();

                while (await reader.ReadAsync())
                {
                    ITMember record = new ITMember
                    {
                        ID = reader["ID"] as int?,
                        Region = reader["REGION"] as string,
                        Department = reader["DEPARTMENT"] as string,
                        EmployeeName = reader["EMP_NAME"] as string,
                        EmployeeNumber = reader["EMP_NO"] as string,
                        Email = reader["EMAIL"] as string,
                        JoinDate = reader["JOIN_DATE"] as DateTime?,
                        ResignDate = reader["RESIGN_DATE"] as DateTime?,
                        ManDS = reader["MAN_DS"] as int?,
                        Account = reader["ACCOUNT"] as string,
                        Password = reader["PASSWORD"] as string,
                        Remark = reader["REMARK"] as string,
                        Role = reader["EMP_ROLE"] as string
                    };

                    Data.Add(record);
                }



            }
            catch (Exception ex)
            {
                throw ex;
            }

            return Data;
        }


        [HttpPost]
        [Route("Delete_IT_member")]
        public List<string> Delete_IT_member(ITMember obj)
        {
            List<string> list = new List<string>();
            list = dataobj.Delete_IT_member(obj.ID, obj.EmployeeNumber);
            return list;
        }



        [HttpPost]
        [Route("Set_Manday_Input")]
        public List<string> Set_Manday_Input(User_data obj)
        {
            List<string> list = new List<string>();
            list = dataobj.User_input(obj.FillDate, obj.Region, obj.EmployeeName, obj.EmployeeNumber, obj.Department, obj.LtH, obj.Category, obj.ProjectName, obj.RequirementName, obj.ContentName, obj.Remark, obj.Username);
            return list;
        }

        [HttpPost]
        [Route("Update_Manday_Input")]
        public List<string> Update_Manday_Input(User_data obj)
        {
            List<string> list = new List<string>();
            list = dataobj.Upadte_input(obj.ID, obj.FillDate, obj.EmployeeNumber, obj.LtH, obj.Category, obj.ProjectName, obj.RequirementName, obj.ContentName, obj.Remark, obj.Username);
            return list;
        }
        [HttpPost]
        [Route("Delete_Manday_Input")]
        public List<string> Delete_Manday_Input(User_data obj)
        {
            List<string> list = new List<string>();
            list = dataobj.Delete_input(obj.ID, obj.FillDate, obj.EmployeeNumber);
            return list;
        }

        [HttpGet]
        [Route("Get_Project")]
        public List<string> Get_Project()
        {
            List<string> lsop = new List<string>();
            SqlConnection connection = new SqlConnection(objconfig);
            connection.Open();
            SqlCommand cmd = new SqlCommand();
            cmd.Connection = connection;
            cmd.CommandType = CommandType.StoredProcedure;
            cmd.CommandText = "SP_PROJECT_LIST";
            cmd.ExecuteNonQuery();
            SqlDataAdapter sda1 = new SqlDataAdapter(cmd);
            DataTable dt = new DataTable();
            sda1.Fill(dt);
            connection.Close();
            string Result = JsonConvert.SerializeObject(dt);

            lsop.Add(Result);
            return lsop;

        }

        [HttpGet]
        [Route("Get_Project_Bydate")]
        public List<string> Get_Project_Bydate(DateTime Fill_date) // Modify method signature to accept date parameter
        {
            List<string> lsop = new List<string>();
            SqlConnection connection = new SqlConnection(objconfig);
            connection.Open();
            SqlCommand cmd = new SqlCommand();
            cmd.Connection = connection;
            cmd.CommandType = CommandType.StoredProcedure;
            cmd.CommandText = "SP_PROJECT_LIST_ByDate";
            cmd.Parameters.AddWithValue("@Fill_date", Fill_date); // Pass date parameter to stored procedure
            cmd.ExecuteNonQuery();
            SqlDataAdapter sda1 = new SqlDataAdapter(cmd);
            DataTable dt = new DataTable();
            sda1.Fill(dt);
            connection.Close();
            string Result = JsonConvert.SerializeObject(dt);

            lsop.Add(Result);
            return lsop;
        }



        [HttpPost]
        [Route("Get_Manday_Input")]
        public async Task<List<User_data>> Get_Manday_Input(UserModel obj)
        {
            List<User_data> Data = new List<User_data>();
            try
            {

                string sql = "";
                if (obj.EmployeeNumber == null || obj.EmployeeNumber == "")
                {

                    sql = "SELECT [MANDAY_INPUT].[ID],[REGION],[DEPARTMENT],[EMP_NAME],[EMP_NO], " +
                        "[FILL_DATE],[LT_H],[CATEGORY],PROJECT_LIST.[PROJECT_NAME],[REQUIREMENT_NAME], " +
                        "[CONTENT_NAME],[MANDAY_INPUT].[REMARK],[CHECK_TYPE],[LOCK],[CREATED_DATE], " +
                        "[CREATED_TIME],[CREATED_BY],[UPDATED_DATE],[UPDATED_TIME],[UPDATED_BY] " +
                        "FROM MANDAY_INPUT " +
                        "LEFT JOIN PROJECT_LIST ON MANDAY_INPUT.PROJECT_NAME = PROJECT_LIST.PROJECT_NO where [MANDAY_INPUT].EMP_NO in(select EMP_NO from IT_MEMBER where ACCOUNT='" + obj.ACCOUNT + "') ORDER BY [MANDAY_INPUT].CREATED_DATE desc";
                }
                else
                {

                    sql = "SELECT [MANDAY_INPUT].[ID],[REGION],[DEPARTMENT],[EMP_NAME],[EMP_NO], " +
                                            "[FILL_DATE],[LT_H],[CATEGORY],PROJECT_LIST.[PROJECT_NAME],[REQUIREMENT_NAME], " +
                                            "[CONTENT_NAME],[MANDAY_INPUT].[REMARK],[CHECK_TYPE],[LOCK],[CREATED_DATE], " +
                                            "[CREATED_TIME],[CREATED_BY],[UPDATED_DATE],[UPDATED_TIME],[UPDATED_BY] " +
                                            "FROM MANDAY_INPUT " +
                                            "LEFT JOIN PROJECT_LIST ON MANDAY_INPUT.PROJECT_NAME = PROJECT_LIST.PROJECT_NO where [MANDAY_INPUT].EMP_NO in('" + obj.EmployeeNumber + "') ORDER BY [MANDAY_INPUT].FILL_DATE,ID asc";
                }



                SqlConnection connection = new SqlConnection(objconfig);
                connection.Open();
                SqlCommand cmd = new SqlCommand(sql, connection);

                cmd.CommandText = sql;

                SqlDataReader reader = cmd.ExecuteReader();
                // SqlDataReader dr = cmd.ExecuteReader();

                while (await reader.ReadAsync())
                {
                    User_data record = new User_data
                    {
                        ID = reader.GetInt32(reader.GetOrdinal("ID")),
                        Region = reader["REGION"] as string,
                        Department = reader["DEPARTMENT"] as string,
                        EmployeeName = reader["EMP_NAME"] as string,
                        EmployeeNumber = reader["EMP_NO"] as string,
                        FillDate = reader.IsDBNull(reader.GetOrdinal("FILL_DATE")) ? (DateTime?)null : reader.GetDateTime(reader.GetOrdinal("FILL_DATE")),
                        //  LtH = reader.IsDBNull(reader.GetOrdinal("LT_H")) ? (int?)null : reader.GetInt32(reader.GetOrdinal("LT_H")),
                        LtH = reader.IsDBNull(reader.GetOrdinal("LT_H")) ? (float?)null : (float)reader.GetDouble(reader.GetOrdinal("LT_H")),
                        Category = reader["CATEGORY"] as string,
                        ProjectName = reader["PROJECT_NAME"] as string,
                        RequirementName = reader["REQUIREMENT_NAME"] as string,
                        ContentName = reader["CONTENT_NAME"] as string,
                        Remark = reader["REMARK"] as string,
                        Lock = reader.GetBoolean(reader.GetOrdinal("LOCK")),
                        CheckType = reader.GetBoolean(reader.GetOrdinal("CHECK_TYPE")),
                        CreatedDate = reader["CREATED_DATE"] as string,
                        CreatedTime = reader["CREATED_TIME"] as string,
                        CreatedBy = reader["CREATED_BY"] as string,
                        UpdatedDate = reader["UPDATED_DATE"] as string,
                        UpdatedTime = reader["UPDATED_TIME"] as string,
                        UpdatedBy = reader["UPDATED_BY"] as string
                    };

                    Data.Add(record);
                }



            }
            catch (Exception ex)
            {
                throw ex;
            }

            return Data;
        }

        [HttpGet]
        [Route("Get_Project_Details")]
        public async Task<List<Project>> Get_Project_Details()
        {
            List<Project> Data = new List<Project>();
            try
            {
                string sql = "select * from PROJECT_LIST";
                SqlConnection connection = new SqlConnection(objconfig);
                connection.Open();
                SqlCommand cmd = new SqlCommand(sql, connection);

                cmd.CommandText = sql;

                SqlDataReader reader = cmd.ExecuteReader();
                while (await reader.ReadAsync())
                {
                    Project record = new Project
                    {
                        ID = reader.GetInt32(reader.GetOrdinal("ID")),
                        PROJECT_NAME = reader["PROJECT_NAME"] as string,
                        PROJECT_NO = reader["PROJECT_NO"] as string,
                        IT_PM = reader["IT_PM"] as string,
                        IT_PM_REGION = reader["IT_PM_REGION"] as string,
                        START_DATE = reader.IsDBNull(reader.GetOrdinal("START_DATE")) ? (DateTime?)null : reader.GetDateTime(reader.GetOrdinal("START_DATE")),
                        EX_GO_LIVE_DATE = reader.IsDBNull(reader.GetOrdinal("EX_GO_LIVE_DATE")) ? (DateTime?)null : reader.GetDateTime(reader.GetOrdinal("EX_GO_LIVE_DATE")),
                        EXIT_DATE = reader.IsDBNull(reader.GetOrdinal("EXIT_DATE")) ? (DateTime?)null : reader.GetDateTime(reader.GetOrdinal("EXIT_DATE")),
                        STATUS = reader["STATUS"] as string,
                        REMARK = reader["REMARK"] as string

                    };

                    Data.Add(record);
                }



            }
            catch (Exception ex)
            {
                throw ex;
            }

            return Data;
        }



        [HttpPost]
        [Route("Insert_Project_details")]
        public List<string> Insert_Project_details(Project obj)
        {
            List<string> list = new List<string>();
            list = dataobj.Insert_Project_details(obj.PROJECT_NAME, obj.PROJECT_NO, obj.IT_PM, obj.IT_PM_REGION, obj.START_DATE, obj.EX_GO_LIVE_DATE, obj.STATUS);
            return list;
        }

        [HttpPost]
        [Route("Update_Project_Details")]
        public List<string> Update_Project_Details(Project obj)
        {
            List<string> list = new List<string>();
            list = dataobj.Update_Project_Details(obj.ID, obj.PROJECT_NAME, obj.IT_PM, obj.IT_PM_REGION, obj.START_DATE, obj.EX_GO_LIVE_DATE, obj.EXIT_DATE, obj.STATUS, obj.REMARK);
            return list;
        }
        [HttpPost]
        [Route("Delete_Project_details")]
        public List<string> Delete_Project_details(Project obj)
        {
            List<string> list = new List<string>();
            list = dataobj.Delete_project(obj.ID);
            return list;
        }


        [HttpGet]
        [Route("Get_Rights_details")]
        public async Task<List<Rights_List>> Get_Rights_details()
        {
            List<Rights_List> Data = new List<Rights_List>();
            try
            {
                //string emp_no = obj.ACCOUNT.Substring(4);
                string sql = "select * from RIGHTS_LIST";
                SqlConnection connection = new SqlConnection(objconfig);
                connection.Open();
                SqlCommand cmd = new SqlCommand(sql, connection);

                cmd.CommandText = sql;

                SqlDataReader reader = cmd.ExecuteReader();
                // SqlDataReader dr = cmd.ExecuteReader();

                while (await reader.ReadAsync())
                {
                    Rights_List record = new Rights_List
                    {
                        Id = reader["ID"] as int?,
                        Role_right = reader["ROLE_RIGHT"] as string,
                        Assigned_region = reader["ASSIGNED_REGION"] as string,
                        Assigned_dept = reader["ASSIGNED_DEPT"] as string,
                        Account = reader["ACCOUNT"] as string,
                        Role = reader["USER_ROLE"] as string,

                        Remark = reader["REMARK"] as string
                    };

                    Data.Add(record);
                }



            }
            catch (Exception ex)
            {
                throw ex;
            }

            return Data;
        }

        [HttpPost]
        [Route("Insert_Rights_details")]
        public List<string> Insert_Rights_details(Rights_List obj)
        {
            List<string> list = new List<string>();
            list = dataobj.Insert_Rights_details(obj.Account, obj.Role_right, obj.Assigned_dept, obj.Assigned_region, obj.Remark);
            return list;
        }
        [HttpPost]
        [Route("Update_Rights_details")]
        public List<string> Update_Rights_details(Rights_List obj)
        {
            List<string> list = new List<string>();
            list = dataobj.Update_Rights_details(obj.Id, obj.Account, obj.Role_right, obj.Assigned_dept, obj.Assigned_region, obj.Remark);
            return list;
        }
        [HttpPost]
        [Route("Delete_Rights")]
        public List<string> Delete_Rights(Rights_List obj)
        {
            List<string> list = new List<string>();
            list = dataobj.Delete_Rights(obj.Id, obj.Account);
            return list;
        }


        //[HttpGet]
        //[Route("Daily_Input_Report")]

        ////public List<User_data> Daily_Input_Report(User_data obj)
        //public List<User_data> Daily_Input_Report(string Region, string Department, string EmployeeNumber, string Category, string Start_date, string To_date)
        //{
        //    var result = dataobj.Daily_Input_Report(Region, Department, EmployeeNumber, Category, Start_date, To_date);
        //    return result;
        //}

        [HttpGet]
        [Route("Daily_Input_Report")]
        public async Task<List<User_data>> Daily_Input_ReportAsync(string Region, string Department, string EmployeeNumber, string Category, string Start_date, string To_date)
        {
            var result = await Task.Run(() => dataobj.Daily_Input_Report(Region, Department, EmployeeNumber, Category, Start_date, To_date));
            return result;
        }



        [HttpGet]
        [Route("Daily_Manday_Report_LockStatus")]
        public List<User_data> Daily_Manday_Report_LockStatus(string Region, string Department, string Category, string Start_date, string To_date)
        {
            var result = dataobj.Daily_Manday_Report_LockStatus(Region, Department, Category, Start_date, To_date);
            return result;
        }

        [HttpPost]
        [Route("Lock_Manday_input")]
        public List<string> Lock_Manday_input(User_data obj)
        {
            List<string> list = new List<string>();
            list = dataobj.Lock_Manday_input(obj.Region, obj.Department, obj.EmployeeNumber, obj.Category, obj.ProjectName, obj.Start_date, obj.To_date, obj.Lock);
            return list;
        }






        [HttpPost]
        [Route("GetDepartmentsByRegion")]
        public List<string> GetDepartmentsByRegion(User_data obj)
        {
            string connectionString = objconfig;

            string sql = "SELECT DISTINCT DEPARTMENT FROM IT_MEMBER WHERE REGION = @Region and DEPARTMENT not in('')";

            List<string> departments = new List<string>();

            using (SqlConnection connection = new SqlConnection(connectionString))
            {
                using (SqlCommand cmd = new SqlCommand(sql, connection))
                {
                    cmd.Parameters.AddWithValue("@Region", obj.Region);

                    try
                    {
                        connection.Open();
                        using (SqlDataReader reader = cmd.ExecuteReader())
                        {
                            while (reader.Read())
                            {
                                departments.Add(reader["DEPARTMENT"].ToString());
                            }
                        }
                    }
                    catch (SqlException ex)
                    {
                        Console.WriteLine("Error retrieving departments: " + ex.Message);
                    }
                }
            }

            return departments;
        }


        [HttpPost]
        [Route("GetCompanyByRight")]
        public List<string> GetCompanyByRight(Rights_List obj)
        {
            List<string> list = new List<string>();
            list = dataobj.GetCompanyByRight(obj.Account);
            return list;
        }

        [HttpPost]
        [Route("GetDepartmentsByRight")]
        public List<string> GetDepartmentsByRight(Rights_List obj)
        {

            List<string> list = new List<string>();
            list = dataobj.GetDepartmentsByRight(obj.Account, obj.Assigned_region);
            return list;
        }

        [HttpPost]
        [Route("GetEmpNosByRegion")]
        public List<string> GetEmpNosByRegion(User_data obj)
        {
            List<string> list = new List<string>();
            list = dataobj.GetEmpNosByRegion(obj.Region, obj.Department);
            return list;
        }






        [HttpGet]
        [Route("Get_ALLForUser")]
        public IHttpActionResult Get_ALLForUser(string Account)
        {

            List<string> userRegions = new List<string>();

            // Call a method to retrieve the regions for the specified user ID from the database
            // Assuming you have a method like GetRegionsForUser(userId) that returns a list of regions
            userRegions = dataobj.GetREGIONByRight(Account);

            // Loop through each region and fetch departments and employee numbers
            Dictionary<string, List<ITMember>> regionData = new Dictionary<string, List<ITMember>>();

            foreach (string region in userRegions)
            {
                // Call a method to retrieve departments for the region
                List<string> departments = dataobj.GetDEPTSByRight(Account, region);

                // Initialize list to store employee info for each department in the region
                List<ITMember> employeeInfoList = new List<ITMember>();

                foreach (string department in departments)
                {
                    // Call a method to retrieve employee numbers for the department
                    //List<int> employeeNumbers = dataobj.GetEmpNosByRegionAndRight(region, department, Account);
                    List<string> employeeNumbers = dataobj.GetEMPLOYEE_NUMBERRegionAndRight(region, department, Account);

                    // Construct EmployeeInfo objects and add them to the list
                    foreach (string empNo in employeeNumbers)
                    {
                        employeeInfoList.Add(new ITMember { Department = department, EmployeeNumber = empNo });
                    }
                }

                // Add region and its corresponding employee info list to the dictionary
                regionData.Add(region, employeeInfoList);
            }


            return Ok(regionData);
        }


        [HttpGet]
        [Route("Get_EmpDetailsByRight")]
        public IHttpActionResult Get_EmpDetailsByRight(string Account)
        {

            List<string> userRegions = dataobj.GetREGIONByRight(Account);
            Dictionary<string, List<ITMember>> regionData = new Dictionary<string, List<ITMember>>();

            foreach (string region in userRegions)
            {
                List<string> departments = dataobj.GetDEPTSByRight(Account, region);
                List<ITMember> employeeInfoList = new List<ITMember>();

                foreach (string department in departments)
                {
                    List<ITMember> employees = dataobj.GetEMPLOYEE_NAME_NUMBERRegionAndRight(region, department, Account);
                    employeeInfoList.AddRange(employees);
                }

                regionData.Add(region, employeeInfoList);
            }

            return Ok(regionData);
        }


        private List<string> GetEmpNamesByRegion(string region)
        {
            string connectionString = objconfig;

            string sql = "SELECT DISTINCT EMP_NAME FROM IT_MEMBER WHERE REGION = @Region";

            List<string> emp_names = new List<string>();

            using (SqlConnection connection = new SqlConnection(connectionString))
            {
                using (SqlCommand cmd = new SqlCommand(sql, connection))
                {
                    cmd.Parameters.AddWithValue("@Region", region);

                    try
                    {
                        connection.Open();
                        using (SqlDataReader reader = cmd.ExecuteReader())
                        {
                            while (reader.Read())
                            {
                                emp_names.Add(reader["EMP_NAME"].ToString());
                            }
                        }
                    }
                    catch (SqlException ex)
                    {
                        Console.WriteLine("Error retrieving departments: " + ex.Message);
                    }
                }
            }

            return emp_names;
        }

        [HttpPost]
        [Route("GetEmpNosByRight")]
        public List<string> GetEmpNosByRight(ITMember obj)
        {
            List<string> list = new List<string>();
            list = dataobj.GetEmpNosByRegionAndRight(obj.Region, obj.Department, obj.Account);
            return list;
        }


        [HttpPost]
        [Route("CheckForMissingInput1")]
        public void CheckForMissingInput1()
        {
            DayOfWeek today = DateTime.Today.DayOfWeek;

            //if (today == DayOfWeek.Monday)
            //{
            string[] regions = { "APC", "APH", "APE", "GROUP" };
            DateTime startDate = DateTime.Today.AddDays(-15);
            DateTime endDate = DateTime.Today.AddDays(-2);

            foreach (string region in regions)
            {
                if (region == "APE" || region == "GROUP")
                {
                    endDate = DateTime.Today.AddDays(-3);
                }

                var missingInputEmployees = dataobj.GetMissingInputEmployees(startDate, endDate, region);
                var incompleteInputTiming = dataobj.GetMissingInputTiming(startDate, endDate, region);

                // Grouping employees by department
                var employeesByDepartment = missingInputEmployees.Concat(incompleteInputTiming)
                                                                .GroupBy(emp => emp.Department);

                foreach (var departmentGroup in employeesByDepartment)
                {
                    // Get department head's email
                    string departmentHeadEmail = dataobj.GetDepartmentHeadEmail(departmentGroup.Key); // Assuming you have a method to get department head's email

                    if (!string.IsNullOrEmpty(departmentHeadEmail))
                    {
                        // Compose email content
                        string subject = "Missing Input Employees Report";
                        string body = $"Dear Department Head,<br/><br/>Please find below the list of employees with missing or incomplete input for the region {region}:<br/><br/>";
                        body += "<table border='1'>";
                        body += "<tr><th>Employee Name</th><th>Employee Number</th><th>Department</th><th>Region</th><th>Fill Date</th><th>LT(h)</th></tr>";
                        foreach (var emp in departmentGroup)
                        {
                            body += $"<tr><td>{emp.EmployeeName}</td><td>{emp.EmployeeNumber}</td><td>{emp.Department}</td><td>{emp.Region}</td><td>{emp.FillDate}</td><td>{emp.LtH}</td></tr>";
                        }
                        body += "</table>";

                        // Send email
                        dataobj.Send_Mail(departmentHeadEmail, subject, body);
                    }
                }
            }
            //}
            //else
            //{
            //    Console.WriteLine("Today is not Monday.");
            //}

        }



        [HttpPost]
        [Route("Insert_Holiday_details")]
        public List<InsertResult> Insert_Holiday_details(Holiday_List obj)
        {
            List<InsertResult> list = new List<InsertResult>();
            list = dataobj.Insert_Holiday_details(obj.Region, obj.HolidayType, obj.HolidayLength, obj.HolidayDate, obj.CreatedUser);
            return list;
        }

        [HttpPost]
        [Route("Update_Holiday_details")]
        public List<string> Update_Holiday_details(Holiday_List obj)
        {
            List<string> list = new List<string>();
            list = dataobj.Update_Holiday_details(obj.ID, obj.Region, obj.HolidayType, obj.HolidayDate, obj.LastUser);
            return list;
        }

        [HttpPost]
        [Route("Delete_Holiday")]
        public List<string> Delete_Holiday(Holiday_List obj)
        {
            List<string> list = new List<string>();
            list = dataobj.Delete_Holiday(obj.ID);
            return list;
        }

        [HttpGet]
        [Route("Get_Holiday_details")]
        public async Task<List<Holiday_List>> Get_Holiday_details()
        {
            List<Holiday_List> Data = new List<Holiday_List>();
            try
            {

                string sql = "select * from DM_CALENDAR_S";
                SqlConnection connection = new SqlConnection(objconfig);
                connection.Open();
                SqlCommand cmd = new SqlCommand(sql, connection);

                cmd.CommandText = sql;

                SqlDataReader reader = cmd.ExecuteReader();
                // SqlDataReader dr = cmd.ExecuteReader();

                while (await reader.ReadAsync())
                {
                    Holiday_List record = new Holiday_List
                    {
                        ID = reader["ID"] as int?,
                        Region = reader["REGION"] as string,
                        HolidayType = reader["HOLIDAY_TYPE"] as string,
                        HolidayDate = reader["HOLIDAY_DATE"] as DateTime?,
                        HolidayLength = reader["HOLIDAY_LENGTH"] as int?,
                        CreatedDept = reader["CREATED_DEPT"] as string,
                        CreatedUser = reader["CREATED_USER"] as string,
                        LastUser = reader["LAST_USER"] as string,
                        LastDate = reader["LAST_DATE"] as DateTime?,

                    };

                    Data.Add(record);
                }



            }
            catch (Exception ex)
            {
                throw ex;
            }

            return Data;
        }


        //[HttpPost]
        //[Route("Insert_Excel_Data")]
        //public List<InsertResult> Insert_Excel_Data([FromBody] List<User_data> tableData)
        //{
        //    List<InsertResult> resultList = new List<InsertResult>();

        //    using (SqlConnection connection = new SqlConnection(objconfig))
        //    {
        //        connection.Open();

        //        for (int i = 0; i < tableData.Count; i++)
        //        {
        //            var userData = tableData[i];




        //            string sql = @"INSERT INTO MANDAY_INPUT(REGION, DEPARTMENT, EMP_NAME, EMP_NO, FILL_DATE, LT_H, CATEGORY, 
        //                    PROJECT_NAME, REQUIREMENT_NAME, CONTENT_NAME, REMARK, CREATED_DATE, CREATED_TIME, CREATED_BY, LOCK,CHECK_TYPE) 
        //                    VALUES (@Region, @Department, @EmployeeName, @EmployeeNumber, @FillDate, @LtH, @Category, 
        //                    @ProjectName, @RequirementName, @ContentName, @Remark, @CreatedDate, @CreatedTime, @CreatedBy, 0,0)";

        //            using (SqlCommand command = new SqlCommand(sql, connection))
        //            {
        //                command.Parameters.AddWithValue("@Region", userData.Region);
        //                command.Parameters.AddWithValue("@Department", userData.Department);
        //                command.Parameters.AddWithValue("@EmployeeName", userData.EmployeeName);
        //                command.Parameters.AddWithValue("@EmployeeNumber", userData.EmployeeNumber);
        //                command.Parameters.AddWithValue("@FillDate", userData.FillDate);
        //                command.Parameters.AddWithValue("@LtH", userData.LtH);
        //                command.Parameters.AddWithValue("@Category", userData.Category);
        //                command.Parameters.AddWithValue("@ProjectName", (object)userData.ProjectNumber ?? DBNull.Value);
        //                command.Parameters.AddWithValue("@RequirementName", (object)userData.RequirementName ?? DBNull.Value);
        //                command.Parameters.AddWithValue("@ContentName", (object)userData.ContentName ?? DBNull.Value);
        //                command.Parameters.AddWithValue("@Remark", (object)userData.Remark ?? DBNull.Value);
        //                command.Parameters.AddWithValue("@CreatedDate", DateTime.Now.ToString("yyyy-MM-dd"));
        //                command.Parameters.AddWithValue("@CreatedTime", DateTime.Now.ToString("HH:mm:ss"));
        //                command.Parameters.AddWithValue("@CreatedBy", userData.CreatedBy);

        //                int rowsAffected = command.ExecuteNonQuery();

        //                if (rowsAffected > 0)
        //                {
        //                    resultList.Add(new InsertResult { Result = "Success", RowNumber = i + 1 });
        //                }
        //                else
        //                {
        //                    resultList.Add(new InsertResult { Result = "Failed", RowNumber = i + 1 });
        //                }
        //            }
        //        }

        //        connection.Close();
        //    }
        //    return resultList;
        //}

        [HttpPost]
        [Route("Insert_Excel_Data")]
        public List<InsertResult> Insert_Excel_Data([FromBody] List<User_data> tableData)
        {
            List<InsertResult> resultList = new List<InsertResult>();

            using (SqlConnection connection = new SqlConnection(objconfig))
            {
                connection.Open();
                SqlTransaction transaction = connection.BeginTransaction();
                try
                {
                    for (int i = 0; i < tableData.Count; i++)
                    {
                        var userData = tableData[i];
                        var category = userData.Category;
                        string checkIfExistsQuery = "";
                        //if (category != "项目Project")
                        //{
                        //     checkIfExistsQuery = @"SELECT COUNT(*) FROM MANDAY_INPUT WHERE REGION = @Region 
                        //                    AND EMP_NO = @EmployeeNumber AND FILL_DATE = @FillDate AND CATEGORY = @Category";

                        //}
                        //else
                        //{
                        //    checkIfExistsQuery = @"SELECT COUNT(*) FROM MANDAY_INPUT WHERE REGION = @Region 
                        //                    AND EMP_NO = @EmployeeNumber AND FILL_DATE = @FillDate AND CATEGORY = @Category AND PROJECT_NAME=@ProjectName";
                        //}
                        //// Check if the record already exists


                        //using (SqlCommand checkIfExistsCommand = new SqlCommand(checkIfExistsQuery, connection))
                        //{
                        //    checkIfExistsCommand.Parameters.AddWithValue("@Region", userData.Region);
                        //    checkIfExistsCommand.Parameters.AddWithValue("@EmployeeNumber", userData.EmployeeNumber);
                        //    checkIfExistsCommand.Parameters.AddWithValue("@FillDate", userData.FillDate);
                        //    checkIfExistsCommand.Parameters.AddWithValue("@Category", userData.Category);
                        //    if (category == "项目Project")
                        //    {
                        //        checkIfExistsCommand.Parameters.AddWithValue("@ProjectName", userData.ProjectNumber);
                        //    }
                        //    int existingRecordsCount = (int)checkIfExistsCommand.ExecuteScalar();

                        //    if (existingRecordsCount > 0)
                        //    {
                        //        // Record already exists, skip insertion
                        //        resultList.Add(new InsertResult { Result = "exist", RowNumber = i + 1 });
                        //        continue;
                        //    }
                        //}

                        // Insert the record if it doesn't exist
                        string insertQuery = @"INSERT INTO MANDAY_INPUT(REGION, DEPARTMENT, EMP_NAME, EMP_NO, FILL_DATE, LT_H, CATEGORY, 
                                PROJECT_NAME, REQUIREMENT_NAME, CONTENT_NAME, REMARK, CREATED_DATE, CREATED_TIME, CREATED_BY, LOCK, CHECK_TYPE) 
                                VALUES (@Region, @Department, @EmployeeName, @EmployeeNumber, @FillDate, @LtH, @Category, 
                                @ProjectName, @RequirementName, @ContentName, @Remark, @CreatedDate, @CreatedTime, @CreatedBy, 0, 0)";

                        using (SqlCommand insertCommand = new SqlCommand(insertQuery, connection, transaction))
                        {
                            insertCommand.Parameters.AddWithValue("@Region", userData.Region);
                            insertCommand.Parameters.AddWithValue("@Department", userData.Department);
                            insertCommand.Parameters.AddWithValue("@EmployeeName", userData.EmployeeName);
                            insertCommand.Parameters.AddWithValue("@EmployeeNumber", userData.EmployeeNumber);

                            insertCommand.Parameters.AddWithValue("@FillDate", userData.FillDate);

                            //float roundedLtH = (float)Math.Round((double)userData.LtH, 2);
                            //decimal roundedLtH = Math.Round(userData.LtH, 2);
                            // float roundedLtH = (float)Math.Round(userData.LtH.Value, 2);
                            string formattedLtH = userData.LtH?.ToString("F2");
                            //insertCommand.Parameters.AddWithValue("@LtH", roundedLtH);
                            insertCommand.Parameters.AddWithValue("@LtH", formattedLtH);
                            //  insertCommand.Parameters.AddWithValue("@LtH", userData.LtH);
                            insertCommand.Parameters.AddWithValue("@Category", userData.Category);
                            insertCommand.Parameters.AddWithValue("@ProjectName", (object)userData.ProjectNumber ?? DBNull.Value);
                            insertCommand.Parameters.AddWithValue("@RequirementName", (object)userData.RequirementName ?? DBNull.Value);
                            insertCommand.Parameters.AddWithValue("@ContentName", (object)userData.ContentName ?? DBNull.Value);
                            insertCommand.Parameters.AddWithValue("@Remark", (object)userData.Remark ?? DBNull.Value);
                            insertCommand.Parameters.AddWithValue("@CreatedDate", DateTime.Now.ToString("yyyy-MM-dd"));
                            insertCommand.Parameters.AddWithValue("@CreatedTime", DateTime.Now.ToString("HH:mm:ss"));
                            insertCommand.Parameters.AddWithValue("@CreatedBy", userData.CreatedBy);

                            int rowsAffected = insertCommand.ExecuteNonQuery();

                            if (rowsAffected > 0)
                            {
                                resultList.Add(new InsertResult { Result = "Success", RowNumber = i + 1 });
                            }
                            else
                            {
                                resultList.Add(new InsertResult { Result = "Failed", RowNumber = i + 1 });
                            }
                        }
                    }
                    transaction.Commit();
                }
                catch (Exception ex)
                {
                    // Roll back the transaction if an exception occurs
                    transaction.Rollback();
                    resultList.Clear(); // Clear any partially added results
                    resultList.Add(new InsertResult { Result = "Error: " + ex.Message });

                }
                finally
                {
                    connection.Close();
                }

            }

            return resultList;
        }



        //        public List<MandayData> GetMandayChartDataByRegion(string Region, string Category, string Start_date, string To_date)
        //        {
        //            List<MandayData> mandayDataList = new List<MandayData>();

        //            using (SqlConnection connection = new SqlConnection(objconfig))
        //            {
        //                connection.Open();
        //                string sql = @"WITH BaseCount AS (
        //    SELECT 
        //        MI.REGION,
        //        SUM(
        //            CASE 
        //                WHEN MI.TOTAL_LT_H > 4 THEN 8 
        //                ELSE MI.TOTAL_LT_H 
        //            END
        //        ) AS BaseCount
        //    FROM (
        //        SELECT 
        //            MI.REGION, 
        //            MI.EMP_NAME, 
        //            MI.EMP_NO, 
        //            MI.FILL_DATE,
        //            SUM(
        //                CASE
        //                    WHEN HL.HOLIDAY_TYPE = 3 THEN

        //                        CASE
        //                            WHEN MI.LT_H >= 4 THEN 4 
        //                            ELSE MI.LT_H  
        //                        END
        //                    ELSE MI.LT_H 
        //                END
        //            ) AS TOTAL_LT_H
        //        FROM MANDAY_INPUT MI
        //        LEFT JOIN DM_CALENDAR_S HL ON MI.REGION = HL.REGION AND MI.FILL_DATE = HL.HOLIDAY_DATE";
        //                if (Region != "ALL")
        //                {
        //                    sql += " WHERE MI.REGION IN ('" + Region + "')";
        //                }
        //                else if (Region == "ALL")
        //                {
        //                    sql += " WHERE MI.REGION IN ('APC','APH','APE','GROUP')";
        //                }



        //                sql += @" AND (HL.HOLIDAY_DATE IS NULL OR HL.HOLIDAY_TYPE = 3) 
        //            AND MI.FILL_DATE BETWEEN @StartDate AND @EndDate
        //        GROUP BY MI.REGION, MI.EMP_NAME, MI.EMP_NO, MI.FILL_DATE
        //        HAVING SUM(
        //                CASE
        //                    WHEN HL.HOLIDAY_TYPE = 3 THEN
        //                        CASE
        //                            WHEN MI.LT_H >= 4 THEN 4 ELSE MI.LT_H END
        //                    ELSE MI.LT_H
        //                END
        //            ) >= 4
        //    ) AS MI
        //    GROUP BY MI.REGION
        //), DepartmentEmployeeCount AS (
        //    SELECT REGION, COUNT(emp_no) AS EmployeeCount
        //    FROM IT_MEMBER
        //    WHERE MAN_DS = 1
        //    GROUP BY REGION
        //)

        //SELECT 
        //    MI.REGION, 
        //    DEC.EmployeeCount,
        //    BC.BaseCount,
        //    MI.CATEGORY,
        //    SUM(MI.LT_H) AS LT_H,
        //    ROUND((SUM(MI.LT_H) / BC.BaseCount * 100), 2) AS Percentage,
        //    MIN(MI.FILL_DATE) AS FromDate,
        //    MAX(MI.FILL_DATE) AS ToDate
        //FROM 
        //    MANDAY_INPUT MI
        //LEFT JOIN 
        //    DM_CALENDAR_S HL ON MI.REGION = HL.REGION AND MI.FILL_DATE = HL.HOLIDAY_DATE
        //LEFT JOIN
        //    DepartmentEmployeeCount DEC ON MI.REGION = DEC.REGION
        //LEFT JOIN
        //    BaseCount BC ON MI.REGION = BC.REGION";
        //                if (Region != "ALL")
        //                {
        //                    sql += " WHERE MI.REGION IN ('" + Region + "')";
        //                }
        //                else if (Region == "ALL")
        //                {
        //                    sql += " WHERE MI.REGION IN ('APC','APH','APE','GROUP')";
        //                }

        //                sql += @" AND HL.HOLIDAY_DATE IS NULL 
        //    AND MI.FILL_DATE BETWEEN @StartDate AND @EndDate";
        //                if (Category != "ALL")
        //                {
        //                    sql += " AND MI.CATEGORY= @Category ";
        //                }
        //                sql += @" GROUP BY 
        //    MI.REGION, DEC.EmployeeCount, BC.BaseCount, MI.CATEGORY
        //ORDER BY 
        //    MI.REGION;
        //";



        //                using (SqlCommand command = new SqlCommand(sql, connection))
        //                {
        //                    // command.Parameters.AddWithValue("@Region", Region);
        //                    command.Parameters.AddWithValue("@StartDate", Start_date);
        //                    command.Parameters.AddWithValue("@EndDate", To_date);
        //                    if (Category != "ALL")
        //                    {
        //                        command.Parameters.AddWithValue("@Category", Category);
        //                    }
        //                    using (SqlDataReader reader = command.ExecuteReader())
        //                    {
        //                        while (reader.Read())
        //                        {
        //                            MandayData mandayData = new MandayData
        //                            {
        //                                Region = reader["REGION"].ToString(),
        //                               //Department = reader["REGION"].ToString(),
        //                                Category = reader["CATEGORY"].ToString(),
        //                                fromdate = reader["FromDate"].ToString(),
        //                                todate = reader["ToDate"].ToString(),
        //                                LT_H = reader.IsDBNull(reader.GetOrdinal("LT_H")) ? 0f : Convert.ToSingle(reader["LT_H"]), // Changed Convert.ToInt32 to Convert.ToSingle for float
        //                                Percentage = reader.IsDBNull(reader.GetOrdinal("Percentage")) ? 0f : Convert.ToSingle(reader["Percentage"]), // Changed Convert.ToInt32 to Convert.ToSingle for float//Count = Convert.ToInt32(reader["TOTAL_LT_H"])
        //                                BaseCount = reader.IsDBNull(reader.GetOrdinal("BaseCount")) ? 0 : Convert.ToInt32(reader["BaseCount"]),
        //                                EmployeeCount = reader.IsDBNull(reader.GetOrdinal("EmployeeCount")) ? 0 : Convert.ToInt32(reader["EmployeeCount"]),
        //                            };

        //                            mandayDataList.Add(mandayData);
        //                        }
        //                    }
        //                }

        //                connection.Close();
        //            }

        //            return mandayDataList;
        //        }



        /*        public List<MandayData> GetMandayDataByDepartment(string Region, string Department, string Category, string Start_date, string To_date)
                {
                    List<MandayData> mandayDataList = new List<MandayData>();

                    using (SqlConnection connection = new SqlConnection(objconfig))
                    {
                        connection.Open();
                        string sql = @"WITH BaseCount AS (
            SELECT 
                MI.REGION,
                MI.DEPARTMENT, 
                SUM(
                    CASE 
                        WHEN MI.TOTAL_LT_H > 4 THEN 8 
                        ELSE MI.TOTAL_LT_H 
                    END
                ) AS BaseCount
            FROM (
             SELECT 
            MI.REGION, 
            MI.DEPARTMENT, 
            MI.EMP_NAME, 
            MI.EMP_NO, 
            MI.FILL_DATE,
            SUM(
                CASE
                    WHEN HL.HOLIDAY_TYPE = 3 THEN

                        CASE
                            WHEN MI.LT_H >= 4 THEN 4  
                            ELSE MI.LT_H  
                        END
                    ELSE MI.LT_H  
                END
            ) AS TOTAL_LT_H
        FROM MANDAY_INPUT MI
        LEFT JOIN DM_CALENDAR_S HL ON MI.REGION = HL.REGION AND MI.FILL_DATE = HL.HOLIDAY_DATE";
                        if (Region != "ALL")
                        {
                            sql += " WHERE MI.REGION IN ('" + Region + "')";
                        }
                        else if (Region == "ALL")
                        {
                            sql += " WHERE MI.REGION IN ('APC','APH','APE','GROUP')";
                        }
                        sql += @" AND (HL.HOLIDAY_DATE IS NULL OR HL.HOLIDAY_TYPE = 3) 
            AND MI.FILL_DATE BETWEEN @StartDate AND @EndDate
        GROUP BY MI.REGION, MI.DEPARTMENT, MI.EMP_NAME, MI.EMP_NO, MI.FILL_DATE
        HAVING SUM(
                CASE
                    WHEN HL.HOLIDAY_TYPE = 3 THEN
                        CASE
                            WHEN MI.LT_H > 4 THEN 4 ELSE MI.LT_H END
                    ELSE MI.LT_H
                END
            ) >= 4
            ) AS MI
            GROUP BY MI.REGION, MI.DEPARTMENT
        ), DepartmentEmployeeCount AS (
            SELECT REGION, DEPARTMENT, COUNT(emp_no) AS EmployeeCount
            FROM IT_MEMBER
            WHERE MAN_DS = 1
            GROUP BY REGION, DEPARTMENT
        )

        SELECT 
            MI.REGION, 
            MI.DEPARTMENT,
            DEC.EmployeeCount,
            BC.BaseCount,
            MI.CATEGORY,
            SUM(MI.LT_H) AS LT_H,
            ROUND((SUM(MI.LT_H) / BC.BaseCount * 100), 2) AS Percentage,
            MIN(MI.FILL_DATE) AS FromDate,
            MAX(MI.FILL_DATE) AS ToDate
        FROM 
            MANDAY_INPUT MI
        LEFT JOIN 
            DM_CALENDAR_S HL ON MI.REGION = HL.REGION AND MI.FILL_DATE = HL.HOLIDAY_DATE
        LEFT JOIN
            DepartmentEmployeeCount DEC ON MI.REGION = DEC.REGION AND MI.DEPARTMENT = DEC.DEPARTMENT
        LEFT JOIN
            BaseCount BC ON MI.REGION = BC.REGION AND MI.DEPARTMENT = BC.DEPARTMENT";
                        if (Region != "ALL")
                        {
                            sql += " WHERE MI.REGION IN ('" + Region + "')";
                        }
                        else if (Region == "ALL")
                        {
                            sql += " WHERE MI.REGION IN ('APC','APH','APE','GROUP')";
                        }

                        sql += @" AND HL.HOLIDAY_DATE IS NULL 
            AND MI.FILL_DATE BETWEEN @StartDate AND @EndDate";
                        if (Department != "'ALL'")
                        {
                            string[] departments = Department.Split(','); // Splitting multiple departments
                            StringBuilder deptBuilder = new StringBuilder();

                            // Append 'N' prefix to each department
                            foreach (string department in departments)
                            {
                                deptBuilder.Append("N" + department + ",");
                            }

                            // Remove the trailing comma
                            deptBuilder.Length--;
                            sql += " AND MI.DEPARTMENT IN(" + deptBuilder.ToString() + ")";
                        }
                        if (Category != "ALL")
                        {
                            sql += " AND MI.CATEGORY= @Category ";
                        }
                        sql += @" GROUP BY 
            MI.REGION, MI.DEPARTMENT, DEC.EmployeeCount, BC.BaseCount, MI.CATEGORY
        ORDER BY 
            MI.DEPARTMENT;";
                        *//*  string sql = @"SELECT MI.REGION, MI.CATEGORY, MI.DEPARTMENT, SUM(MI.LT_H) AS TOTAL_LT_H
                                FROM MANDAY_INPUT MI
                                LEFT JOIN HOLIDAY_LIST HL ON MI.REGION = HL.REGION AND MI.FILL_DATE = HL.H_DATE
                                WHERE HL.H_DATE IS NULL
                                AND MI.FILL_DATE BETWEEN @StartDate AND @EndDate";


                          if (Region != "ALL")
                          {
                              sql += " AND MI.REGION = '" + Region + "'";
                          }
                          if (Category != "ALL")
                          {
                              sql += " AND CATEGORY = @Category ";
                          }
                          if (Department != "'ALL'")
                          {
                              sql += " AND DEPARTMENT IN(" + Department + ")";
                          }
                          sql += " GROUP BY MI.REGION, MI.CATEGORY, MI.DEPARTMENT";
          *//*

                        //if (EmployeeNumber != "ALL")
                        //{
                        //    sql += " AND EMP_NO = '" + EmployeeNumber + "'";
                        //}
                        using (SqlCommand command = new SqlCommand(sql, connection))
                        {
                            // command.Parameters.AddWithValue("@Region", Region);
                            command.Parameters.AddWithValue("@StartDate", Start_date);
                            command.Parameters.AddWithValue("@EndDate", To_date);
                            if (Category != "ALL")
                            {
                                command.Parameters.AddWithValue("@Category", Category);
                            }
                            using (SqlDataReader reader = command.ExecuteReader())
                            {
                                while (reader.Read())
                                {
                                    MandayData mandayData = new MandayData
                                    {
                                        Region = reader["REGION"].ToString(),
                                        Department = reader["DEPARTMENT"].ToString(),
                                        Category = reader["CATEGORY"].ToString(),
                                        fromdate = reader["FromDate"].ToString(),
                                        todate = reader["ToDate"].ToString(),
                                        LT_H = reader.IsDBNull(reader.GetOrdinal("LT_H")) ? 0f : Convert.ToSingle(reader["LT_H"]), // Changed Convert.ToInt32 to Convert.ToSingle for float
                                        Percentage = reader.IsDBNull(reader.GetOrdinal("Percentage")) ? 0f : Convert.ToSingle(reader["Percentage"]), // Changed Convert.ToInt32 to Convert.ToSingle for float//Count = Convert.ToInt32(reader["TOTAL_LT_H"])
                                        BaseCount = reader.IsDBNull(reader.GetOrdinal("BaseCount")) ? 0 : Convert.ToInt32(reader["BaseCount"]),
                                        EmployeeCount = reader.IsDBNull(reader.GetOrdinal("EmployeeCount")) ? 0 : Convert.ToInt32(reader["EmployeeCount"]),
                                    };

                                    mandayDataList.Add(mandayData);
                                }
                            }
                        }

                        connection.Close();
                    }

                    return mandayDataList;
                }
        */
        [HttpGet]
        [Route("GetMandayChartDataByRegion")]
        public List<MandayData> GetMandayChartDataByRegion(string Region, string Category, string Start_date, string To_date)
        {
            List<MandayData> mandayDataList = new List<MandayData>();
            List<emp_working_info> workingReport = new List<emp_working_info>();

            List<string> regions;
            List<DateTime> workingDates = new List<DateTime>();
            List<DateTime> splWorkingDates = new List<DateTime>();



           

            if (Region == "ALL")
            {
                regions = new List<string> { "APC", "APH", "APE", "GROUP" };
            }
            else
            {
                regions = new List<string> { Region };
            }
            int totalBaseHours = 0;

            //foreach (var wk in weekDt)
            //{

            //    Start_date = wk.StartDate;
            //    To_date = wk.EndDate;

                foreach (var reg in regions)
                {


                    // Get special working dates

                    workingDates = GetWorkingDates(Start_date, To_date, reg);

                    // Get special working dates
                    splWorkingDates = GetSpecialWorkingDates(Start_date, To_date, reg);
                    int baseHours = 0;

                    foreach (var wDate in workingDates)
                    {
                        int empCount = GetEmployeeCount(reg, wDate);
                        baseHours += empCount * 8;
                    }

                    if (splWorkingDates.Any())
                    {
                        foreach (var spl in splWorkingDates)
                        {
                            int empCount = GetEmployeeCount(reg, spl);
                            baseHours += empCount * (8 - GetSpecialHolidayLength(spl));
                        }
                    }
                    totalBaseHours += baseHours;
                    workingReport.Add(new emp_working_info { Region = reg, BaseHours = baseHours });
                }
                // workingReport.Add(new emp_working_info { Region = "OVERALL", BaseHours = totalBaseHours });


                using (SqlConnection connection = new SqlConnection(objconfig))
                {
                    connection.Open();
                //                    string sql = @"WITH DepartmentEmployeeCount AS (
                //    SELECT REGION, COUNT(emp_no) AS EmployeeCount
                //    FROM IT_MEMBER
                //    WHERE MAN_DS = 1 
                //      AND (JOIN_DATE <= @EndDate OR JOIN_DATE IS NULL)
                //      AND (RESIGN_DATE >= @StartDate OR RESIGN_DATE IS NULL) 
                //    GROUP BY REGION
                //)

                //SELECT 
                //    MI.REGION, 
                //    DEC.EmployeeCount,
                //    MI.CATEGORY,
                //    SUM(
                //                CASE
                //                    WHEN HL.HOLIDAY_TYPE = 3 THEN
                //                      MI.LT_H                       
                //                    ELSE MI.LT_H 
                //                END
                //            ) AS LT_H,
                //    MIN(MI.FILL_DATE) AS FromDate,
                //    MAX(MI.FILL_DATE) AS ToDate
                //FROM 
                //    MANDAY_INPUT MI
                //LEFT JOIN 
                //    DM_CALENDAR_S HL ON MI.REGION = HL.REGION AND MI.FILL_DATE = HL.HOLIDAY_DATE
                //LEFT JOIN
                //    DepartmentEmployeeCount DEC ON MI.REGION = DEC.REGION";
                string sql = @"WITH DepartmentEmployeeCount AS (
    SELECT REGION, COUNT(emp_no) AS EmployeeCount
    FROM IT_MEMBER
    WHERE MAN_DS = 1 
      AND (JOIN_DATE <= @EndDate OR JOIN_DATE IS NULL)
      AND (RESIGN_DATE >= @StartDate OR RESIGN_DATE IS NULL) 
    GROUP BY REGION
)

SELECT 
    MI.REGION, 
    DEC.EmployeeCount,
    MI.CATEGORY,
    SUM(MI.LT_H) AS LT_H,
    MIN(MI.FILL_DATE) AS FromDate,
    MAX(MI.FILL_DATE) AS ToDate
FROM 
    MANDAY_INPUT MI

LEFT JOIN
    DepartmentEmployeeCount DEC ON MI.REGION = DEC.REGION";
                if (Region != "ALL")
                    {
                        sql += " WHERE MI.REGION IN ('" + Region + "') AND MI.LOCK=1";
                    }
                    else if (Region == "ALL")
                    {
                        sql += " WHERE MI.REGION IN ('APC','APH','APE','GROUP') AND MI.LOCK=1";
                    }
                    if (Category != "ALL")
                    {
                        sql += " AND MI.CATEGORY= @Category ";
                    }

                //                    sql += @" AND(HL.HOLIDAY_DATE IS NULL OR HL.HOLIDAY_TYPE = 3) 
                //    AND MI.FILL_DATE BETWEEN  @StartDate AND @EndDate 
                //GROUP BY 
                //    MI.REGION, DEC.EmployeeCount, MI.CATEGORY
                //ORDER BY 
                //    MI.REGION";
                sql += @" AND MI.FILL_DATE BETWEEN  @StartDate AND @EndDate 
GROUP BY 
    MI.REGION, DEC.EmployeeCount, MI.CATEGORY
ORDER BY 
    MI.REGION";



                using (SqlCommand command = new SqlCommand(sql, connection))
                    {
                        // command.Parameters.AddWithValue("@Region", Region);
                        command.Parameters.AddWithValue("@StartDate", Start_date);
                        command.Parameters.AddWithValue("@EndDate", To_date);
                        if (Category != "ALL")
                        {
                            command.Parameters.AddWithValue("@Category", Category);
                        }
                        using (SqlDataReader reader = command.ExecuteReader())
                        {
                            while (reader.Read())
                            {
                                MandayData mandayData = new MandayData
                                {
                                    Region = reader["REGION"].ToString(),
                                    //Department = reader["REGION"].ToString(),
                                    Category = reader["CATEGORY"].ToString(),
                                    fromdate = reader["FromDate"].ToString(),//Start_date
                                  //  fromdate = Start_date,
                                    todate = reader["ToDate"].ToString(),//To_date
                                   // todate = To_date,
                                    LT_H = reader.IsDBNull(reader.GetOrdinal("LT_H")) ? 0f : Convert.ToSingle(reader["LT_H"]),


                                    EmployeeCount = reader.IsDBNull(reader.GetOrdinal("EmployeeCount")) ? 0 : Convert.ToInt32(reader["EmployeeCount"]),
                                };

                                emp_working_info matchingWorkingInfo = workingReport.FirstOrDefault(w => w.Region == mandayData.Region);
                                if (matchingWorkingInfo != null)
                                {
                                    mandayData.BaseCount = matchingWorkingInfo.BaseHours;
                                    float percentage = (mandayData.LT_H / matchingWorkingInfo.BaseHours) * 100;
                                    mandayData.Percentage = (float)Math.Round(percentage, 2);


                                }
                                else
                                {

                                    mandayData.BaseCount = 0;
                                }

                                mandayDataList.Add(mandayData);
                            }
                        }
                    }

                    connection.Close();
                }
                if (Region == "ALL")
                {
                    var overallCategorySums = mandayDataList
              .GroupBy(md => md.Category)
              .Select(g => new MandayData
              {

                  Region = "OVERALL",
                  Category = g.Key,
                  LT_H = (float)Math.Round(g.Sum(md => md.LT_H),2),
                  EmployeeCount = g.Sum(md => md.EmployeeCount),
                  BaseCount = totalBaseHours,
                  Percentage = (float)Math.Round(g.Sum(md => md.LT_H) / totalBaseHours * 100, 2),
                  fromdate = Start_date,
                  todate = To_date
              })
              .ToList();

                    mandayDataList.AddRange(overallCategorySums);

                }
           // }
            return mandayDataList;



        }

        /* public List<DateTime> GetWorkingDates(string startDate, string endDate, List<string> regions)
         {
             List<DateTime> workingDates = new List<DateTime>();

             using (SqlConnection connection = new SqlConnection(objconfig))
             {
                 string query = @"SELECT DISTINCT FILL_DATE 
                          FROM MANDAY_INPUT MI
                          WHERE MI.REGION IN ('" + string.Join("','", regions) + "') " +
                         $"AND MI.FILL_DATE BETWEEN '{startDate}' AND '{endDate}' " +
                         "AND NOT EXISTS (SELECT 1 FROM DM_CALENDAR_S HL " +
                         "WHERE MI.REGION = HL.REGION AND MI.FILL_DATE = HL.HOLIDAY_DATE)";

                 SqlCommand command = new SqlCommand(query, connection);
                 connection.Open();
                 SqlDataReader reader = command.ExecuteReader();

                 while (reader.Read())
                 {
                     workingDates.Add(reader.GetDateTime(0));
                 }
             }

             return workingDates;
         }*/
        public List<DateTime> GetWorkingDates(string startDate, string endDate, string regions)
        {
            List<DateTime> workingDates = new List<DateTime>();

            using (SqlConnection connection = new SqlConnection(objconfig))
            {
                string query = @"WITH DateRange AS (
                            SELECT DATEADD(DAY, number, @StartDate) AS Date
                            FROM master.dbo.spt_values
                            WHERE type = 'P' AND number BETWEEN 0 AND DATEDIFF(DAY, @StartDate, @EndDate)
                        )
                        SELECT Date
                        FROM DateRange
                        WHERE NOT EXISTS (
                            SELECT 1
                            FROM DM_CALENDAR_S
                            WHERE REGION IN ('" + regions + "') AND HOLIDAY_DATE = Date)";



                SqlCommand command = new SqlCommand(query, connection);
                command.Parameters.AddWithValue("@StartDate", startDate);
                command.Parameters.AddWithValue("@EndDate", endDate);
                connection.Open();
                SqlDataReader reader = command.ExecuteReader();

                while (reader.Read())
                {
                    workingDates.Add(reader.GetDateTime(0));
                }
            }

            return workingDates;
        }

        public List<DateTime> GetSpecialWorkingDates(string startDate, string endDate, string regions)
        {
            List<DateTime> splWorkingDates = new List<DateTime>();

            using (SqlConnection connection = new SqlConnection(objconfig))
            {
                string query = @"SELECT HOLIDAY_DATE 
                             FROM DM_CALENDAR_S 
                             WHERE HOLIDAY_TYPE = 3 
                             AND REGION IN ('" + string.Join("','", regions) + "') " +
                              $"AND HOLIDAY_DATE BETWEEN '{startDate}' AND '{endDate}'";

                SqlCommand command = new SqlCommand(query, connection);
                connection.Open();
                SqlDataReader reader = command.ExecuteReader();

                while (reader.Read())
                {
                    splWorkingDates.Add(reader.GetDateTime(0));
                }
            }

            return splWorkingDates;
        }

        public int GetEmployeeCount(string region, DateTime date)
        {
            int employeeCount = 0;

            using (SqlConnection connection = new SqlConnection(objconfig))
            {
                // string query = $"SELECT COUNT(*) FROM IT_MEMBER WHERE MAN_DS=1 and REGION = '{region}' AND JOIN_DATE <= '{date:yyyy-MM-dd}' AND (RESIGN_DATE IS NULL OR RESIGN_DATE >= '{date:yyyy-MM-dd}')";

                string query = "SELECT COUNT(*) FROM IT_MEMBER WHERE MAN_DS = 1 AND REGION = '" + region + "' " +
                       "AND JOIN_DATE <= '" + date + "' AND (RESIGN_DATE IS NULL OR RESIGN_DATE >= '" + date + "')";

                SqlCommand command = new SqlCommand(query, connection);

                connection.Open();
                employeeCount = Convert.ToInt32(command.ExecuteScalar());
            }

            return employeeCount;
        }

        public int GetTotalEmployeeCount(string region, string startdt,string todt)
        {
            int employeeCount = 0;

            using (SqlConnection connection = new SqlConnection(objconfig))
            {
                // string query = $"SELECT COUNT(*) FROM IT_MEMBER WHERE MAN_DS=1 and REGION = '{region}' AND JOIN_DATE <= '{date:yyyy-MM-dd}' AND (RESIGN_DATE IS NULL OR RESIGN_DATE >= '{date:yyyy-MM-dd}')";

                string query = "SELECT COUNT(*) FROM IT_MEMBER WHERE MAN_DS = 1 AND REGION = '" + region + "' " +
                       "AND JOIN_DATE <= '" + todt + "' AND (RESIGN_DATE IS NULL OR RESIGN_DATE >= '" + startdt + "')";

                SqlCommand command = new SqlCommand(query, connection);

                connection.Open();
                employeeCount = Convert.ToInt32(command.ExecuteScalar());
            }

            return employeeCount;
        }

        public int GetSpecialHolidayLength(DateTime date)
        {
            int holidayLength = 0;

            using (SqlConnection connection = new SqlConnection(objconfig))
            {
                string query = $"SELECT HOLIDAY_LENGTH FROM DM_CALENDAR_S WHERE HOLIDAY_DATE = '{date:yyyy-MM-dd}'";

                SqlCommand command = new SqlCommand(query, connection);
                connection.Open();

                object result = command.ExecuteScalar();
                if (result != DBNull.Value)
                {
                    holidayLength = Convert.ToInt32(result);
                }
            }

            return holidayLength;
        }

        public int GetEmployeeCountBydept(string region, string department, DateTime date)
        {
            int employeeCount = 0;

            using (SqlConnection connection = new SqlConnection(objconfig))
            {
                string query = "SELECT COUNT(*) FROM IT_MEMBER WHERE MAN_DS = 1 AND REGION = @Region " +
                               "AND DEPARTMENT = @Department AND JOIN_DATE <= @Date AND (RESIGN_DATE IS NULL OR RESIGN_DATE >= @Date)";

                SqlCommand command = new SqlCommand(query, connection);
                command.Parameters.AddWithValue("@Region", region);
                command.Parameters.AddWithValue("@Department", department); // Prefix "N" to department name
                command.Parameters.AddWithValue("@Date", date);

                connection.Open();
                employeeCount = Convert.ToInt32(command.ExecuteScalar());
            }

            return employeeCount;
        }

        private List<string> GetDepartmentsInRegion(string region)
        {
            List<string> departments = new List<string>();

            using (SqlConnection connection = new SqlConnection(objconfig))
            {
                string query = "SELECT DISTINCT DEPARTMENT FROM IT_MEMBER WHERE REGION = @Region AND DEPARTMENT IS NOT NULL AND DEPARTMENT <> ''";
                SqlCommand command = new SqlCommand(query, connection);
                command.Parameters.AddWithValue("@Region", region);
                connection.Open();
                using (SqlDataReader reader = command.ExecuteReader())
                {
                    while (reader.Read())
                    {
                        departments.Add(reader["DEPARTMENT"].ToString());
                    }
                }
            }

            return departments;
        }
        [HttpGet]
        [Route("GetMandayChartDataByDepartment")]
        public List<MandayData> GetMandayDataByDepartment(string Region, string Department, string Category, string Start_date, string To_date)
        {
            List<MandayData> mandayDataList = new List<MandayData>();
            List<emp_working_info> workingReport = new List<emp_working_info>();

            List<string> regions;
            List<DateTime> workingDates = new List<DateTime>();
            List<DateTime> splWorkingDates = new List<DateTime>();



            if (Region == "ALL")
            {
                regions = new List<string> { "APC", "APH", "APE", "GROUP" };
            }
            else
            {
                regions = new List<string> { Region };
            }

            //   workingDates = GetWorkingDates(Start_date, To_date, regions);

            // Get special working dates
            //  splWorkingDates = GetSpecialWorkingDates(Start_date, To_date, regions);

            int totalBaseHours = 0;
            foreach (var reg in regions)
            {
                workingDates = GetWorkingDates(Start_date, To_date, reg);

                // Get special working dates
                splWorkingDates = GetSpecialWorkingDates(Start_date, To_date, reg);

                foreach (var department in GetDepartmentsInRegion(reg))
                {
                    int baseHours = 0;

                    foreach (var wDate in workingDates)
                    {
                        int empCount = GetEmployeeCountBydept(reg, department, wDate);
                        baseHours += empCount * 8;
                    }

                    if (splWorkingDates.Any())
                    {
                        foreach (var spl in splWorkingDates)
                        {
                            int empCount = GetEmployeeCountBydept(reg, department, spl);
                            baseHours += empCount * (8 - GetSpecialHolidayLength(spl));
                        }
                    }
                    totalBaseHours += baseHours;
                    workingReport.Add(new emp_working_info { Region = reg, Dept = department, BaseHours = baseHours });
                }
            }


            using (SqlConnection connection = new SqlConnection(objconfig))
            {
                connection.Open();
                string sql = @"WITH DepartmentEmployeeCount AS (
    SELECT REGION, DEPARTMENT, COUNT(emp_no) AS EmployeeCount
    FROM IT_MEMBER
    WHERE MAN_DS = 1
	AND (JOIN_DATE <= @EndDate OR JOIN_DATE IS NULL)
      AND (RESIGN_DATE >= @StartDate OR RESIGN_DATE IS NULL) 
    GROUP BY REGION, DEPARTMENT
)

SELECT 
    MI.REGION, 
    MI.DEPARTMENT,
    DEC.EmployeeCount,
    MI.CATEGORY,
    SUM(
        CASE
            WHEN HL.HOLIDAY_TYPE = 3 THEN
                MI.LT_H                  
            ELSE MI.LT_H  
        END
    ) AS LT_H,
    MIN(MI.FILL_DATE) AS FromDate,
    MAX(MI.FILL_DATE) AS ToDate
FROM 
    MANDAY_INPUT MI
LEFT JOIN 
    DM_CALENDAR_S HL ON MI.REGION = HL.REGION AND MI.FILL_DATE = HL.HOLIDAY_DATE
LEFT JOIN
    DepartmentEmployeeCount DEC ON MI.REGION = DEC.REGION AND MI.DEPARTMENT = DEC.DEPARTMENT";
                if (Region != "ALL")
                {
                    sql += " WHERE MI.REGION IN ('" + Region + "') AND MI.LOCK=1";
                }
                else if (Region == "ALL")
                {
                    sql += " WHERE MI.REGION IN ('APC','APH','APE','GROUP') AND MI.LOCK=1";
                }
                sql += @"  AND (HL.HOLIDAY_DATE IS NULL OR HL.HOLIDAY_TYPE = 3) 
    AND MI.FILL_DATE BETWEEN @StartDate AND @EndDate";

                if (Department != "'ALL'")
                {
                    string[] departments = Department.Split(','); // Splitting multiple departments
                    StringBuilder deptBuilder = new StringBuilder();

                    // Append 'N' prefix to each department
                    foreach (string department in departments)
                    {
                        deptBuilder.Append("N" + department + ",");
                    }

                    // Remove the trailing comma
                    deptBuilder.Length--;
                    sql += " AND MI.DEPARTMENT IN(" + deptBuilder.ToString() + ")";
                }
                if (Category != "ALL")
                {
                    sql += " AND MI.CATEGORY= @Category ";
                }
                sql += @" GROUP BY 
    MI.REGION, MI.DEPARTMENT, DEC.EmployeeCount, MI.CATEGORY
ORDER BY 
    MI.REGION;";

                using (SqlCommand command = new SqlCommand(sql, connection))
                {
                    // command.Parameters.AddWithValue("@Region", Region);
                    command.Parameters.AddWithValue("@StartDate", Start_date);
                    command.Parameters.AddWithValue("@EndDate", To_date);
                    if (Category != "ALL")
                    {
                        command.Parameters.AddWithValue("@Category", Category);
                    }
                    using (SqlDataReader reader = command.ExecuteReader())
                    {
                        while (reader.Read())
                        {
                            MandayData mandayData = new MandayData
                            {
                                Region = reader["REGION"].ToString(),
                                Department = reader["DEPARTMENT"].ToString(),

                                Category = reader["CATEGORY"].ToString(),
                                fromdate = reader["FromDate"].ToString(),
                                todate = reader["ToDate"].ToString(),
                                LT_H = reader.IsDBNull(reader.GetOrdinal("LT_H")) ? 0f : Convert.ToSingle(reader["LT_H"]), // Changed Convert.ToInt32 to Convert.ToSingle for float
                                                                                                                           // Percentage = reader.IsDBNull(reader.GetOrdinal("Percentage")) ? 0f : Convert.ToSingle(reader["Percentage"]), // Changed Convert.ToInt32 to Convert.ToSingle for float//Count = Convert.ToInt32(reader["TOTAL_LT_H"])
                                                                                                                           // BaseCount = reader.IsDBNull(reader.GetOrdinal("BaseCount")) ? 0 : Convert.ToInt32(reader["BaseCount"]),
                                EmployeeCount = reader.IsDBNull(reader.GetOrdinal("EmployeeCount")) ? 0 : Convert.ToInt32(reader["EmployeeCount"]),
                            };


                            emp_working_info matchingWorkingInfo = workingReport.FirstOrDefault(w => w.Region == mandayData.Region && w.Dept == mandayData.Department);
                            if (matchingWorkingInfo != null)
                            {
                                mandayData.BaseCount = matchingWorkingInfo.BaseHours;
                                float percentage = (mandayData.LT_H / matchingWorkingInfo.BaseHours) * 100;
                                mandayData.Percentage = (float)Math.Round(percentage, 2);


                            }

                            mandayDataList.Add(mandayData);
                        }
                    }
                }

                connection.Close();
            }
          
            
            if (Region == "ALL")
            {
                var overallCategorySums = mandayDataList
          .GroupBy(md => md.Category)
          .Select(g => new MandayData
          {

              Region = "OVERALL",
              Department= "OVERALL",
              Category = g.Key,
              LT_H = (float)Math.Round(g.Sum(md => md.LT_H),2),
              EmployeeCount = g.Sum(md => md.EmployeeCount),
              BaseCount = totalBaseHours,
              Percentage = (float)Math.Round(g.Sum(md => md.LT_H) / totalBaseHours * 100, 2),
              fromdate = Start_date,
              todate = To_date
          })
          .ToList();

                mandayDataList.AddRange(overallCategorySums);

            }
            return mandayDataList;
        }





        [HttpGet]
        [Route("GetChartBYREG_Weekly")]

        public List<MandayData> GetChartBYREG_Weekly(string Region, string Category,string Start_wk, string End_wk)
        {
            string Start_date;
            string To_date;
            string wk_no;
            List<MandayData> mandayDataList = new List<MandayData>();
            List<MandayData> mandayOverallDataList = new List<MandayData>();
            List<emp_working_info> workingReport = new List<emp_working_info>();
            List<WeeklyDateRange> weekDt = GetWeeklyDateRanges(Start_wk, End_wk);
            List<string> regions;
            List<DateTime> workingDates = new List<DateTime>();
            List<DateTime> splWorkingDates = new List<DateTime>();

            if (Region == "ALL")
            {
                regions = new List<string> { "APC", "APH", "APE", "GROUP" };
            }
            else
            {
                regions = new List<string> { Region };
            }
            int totalBaseHours;
            int totalEmpcount;
            foreach (var wk in weekDt)
            {
                totalBaseHours = 0;
                totalEmpcount = 0;
                Start_date = wk.StartDate;
                To_date = wk.EndDate;
                wk_no = wk.Week;

                foreach (var reg in regions)
                {

                    int Totalempcount=GetTotalEmployeeCount(reg,Start_date,To_date);    
                    // Get special working dates

                    workingDates = GetWorkingDates(Start_date, To_date, reg);

                    // Get special working dates
                    splWorkingDates = GetSpecialWorkingDates(Start_date, To_date, reg);
                    int baseHours = 0;
                    int empCount = 0;
                    foreach (var wDate in workingDates)
                    {
                        empCount = GetEmployeeCount(reg, wDate);
                        baseHours += empCount * 8;
                    }

                    if (splWorkingDates.Any())
                    {
                        foreach (var spl in splWorkingDates)
                        {
                            empCount = GetEmployeeCount(reg, spl);
                            baseHours += empCount * (8 - GetSpecialHolidayLength(spl));
                        }
                    }
                    totalBaseHours += baseHours;
                   // totalEmpcount += empCount;
                    totalEmpcount += Totalempcount;
                    workingReport.Add(new emp_working_info { Region = reg, BaseHours = baseHours,week=wk_no });
                }
                // workingReport.Add(new emp_working_info { Region = "OVERALL", BaseHours = totalBaseHours });


                using (SqlConnection connection = new SqlConnection(objconfig))
                {
                    connection.Open();
                    //                    string sql = @"WITH DepartmentEmployeeCount AS (
                    //    SELECT REGION, COUNT(emp_no) AS EmployeeCount
                    //    FROM IT_MEMBER
                    //    WHERE MAN_DS = 1 
                    //      AND (JOIN_DATE <= @EndDate OR JOIN_DATE IS NULL)
                    //      AND (RESIGN_DATE >= @StartDate OR RESIGN_DATE IS NULL) 
                    //    GROUP BY REGION
                    //)

                    //SELECT 
                    //    MI.REGION, 
                    //    DEC.EmployeeCount,
                    //    MI.CATEGORY,
                    //    SUM(
                    //                CASE
                    //                    WHEN HL.HOLIDAY_TYPE = 3 THEN
                    //                      MI.LT_H                       
                    //                    ELSE MI.LT_H 
                    //                END
                    //            ) AS LT_H,
                    //    MIN(MI.FILL_DATE) AS FromDate,
                    //    MAX(MI.FILL_DATE) AS ToDate
                    //FROM 
                    //    MANDAY_INPUT MI
                    //LEFT JOIN 
                    //    DM_CALENDAR_S HL ON MI.REGION = HL.REGION AND MI.FILL_DATE = HL.HOLIDAY_DATE
                    //LEFT JOIN
                    //    DepartmentEmployeeCount DEC ON MI.REGION = DEC.REGION";
                    string sql = @"WITH DepartmentEmployeeCount AS (
    SELECT REGION, COUNT(emp_no) AS EmployeeCount
    FROM IT_MEMBER
    WHERE MAN_DS = 1 
      AND (JOIN_DATE <= @EndDate OR JOIN_DATE IS NULL)
      AND (RESIGN_DATE >= @StartDate OR RESIGN_DATE IS NULL) 
    GROUP BY REGION
)

SELECT 
    MI.REGION, 
    DEC.EmployeeCount,
    MI.CATEGORY,
    SUM(MI.LT_H ) AS LT_H,
    MIN(MI.FILL_DATE) AS FromDate,
    MAX(MI.FILL_DATE) AS ToDate
FROM 
    MANDAY_INPUT MI
LEFT JOIN
    DepartmentEmployeeCount DEC ON MI.REGION = DEC.REGION";
                    if (Region != "ALL")
                    {
                        sql += " WHERE MI.REGION IN ('" + Region + "') AND MI.LOCK=1";
                    }
                    else if (Region == "ALL")
                    {
                        sql += " WHERE MI.REGION IN ('APC','APH','APE','GROUP') AND MI.LOCK=1";
                    }
                    if (Category != "ALL")
                    {
                        sql += " AND MI.CATEGORY= @Category ";
                    }

//                    sql += @" AND(HL.HOLIDAY_DATE IS NULL OR HL.HOLIDAY_TYPE = 3) 
//    AND MI.FILL_DATE BETWEEN  @StartDate AND @EndDate 
//GROUP BY 
//    MI.REGION, DEC.EmployeeCount, MI.CATEGORY
//ORDER BY 
//    MI.REGION";
                    sql += @" AND MI.FILL_DATE BETWEEN  @StartDate AND @EndDate 
GROUP BY 
    MI.REGION, DEC.EmployeeCount, MI.CATEGORY
ORDER BY 
    MI.REGION";



                    using (SqlCommand command = new SqlCommand(sql, connection))
                    {
                        // command.Parameters.AddWithValue("@Region", Region);
                        command.Parameters.AddWithValue("@StartDate", Start_date);
                        command.Parameters.AddWithValue("@EndDate", To_date);
                        if (Category != "ALL")
                        {
                            command.Parameters.AddWithValue("@Category", Category);
                        }
                        using (SqlDataReader reader = command.ExecuteReader())
                        {
                            while (reader.Read())
                            {
                                MandayData mandayData = new MandayData
                                {
                                    Region = reader["REGION"].ToString(),
                                    //Department = reader["REGION"].ToString(),
                                    Category = reader["CATEGORY"].ToString(),
                                    fromdate = Start_date,
                                    todate = To_date,
                                    // fromdate = reader["FromDate"].ToString(),//Start_date
                                    //todate = reader["ToDate"].ToString(),//To_date
                                    LT_H = reader.IsDBNull(reader.GetOrdinal("LT_H")) ? 0f : Convert.ToSingle(reader["LT_H"]),
                                    
                                    week_no=wk_no,
                                    EmployeeCount = reader.IsDBNull(reader.GetOrdinal("EmployeeCount")) ? 0 : Convert.ToInt32(reader["EmployeeCount"]),
                                };

                                emp_working_info matchingWorkingInfo = workingReport.FirstOrDefault(w => w.Region == mandayData.Region && w.week==mandayData.week_no);
                                if (matchingWorkingInfo != null)
                                {
                                    mandayData.BaseCount = matchingWorkingInfo.BaseHours;
                                    float percentage = (mandayData.LT_H / matchingWorkingInfo.BaseHours) * 100;
                                    mandayData.Percentage = (float)Math.Round(percentage, 2);


                                }
                                else
                                {

                                    mandayData.BaseCount = 0;
                                }

                                mandayDataList.Add(mandayData);
                            }
                        }
                    }

                    connection.Close();
                }
                /*                if (Region == "ALL")
                                {
                                    var overallCategorySums = mandayDataList
                              .GroupBy(md => md.Category && md.week_no)
                              .Select(g => new MandayData
                              {

                                  Region = "OVERALL",
                                  Category = g.Key,
                                  LT_H = g.Sum(md => md.LT_H),
                                  EmployeeCount = g.Sum(md => md.EmployeeCount),
                                  BaseCount = totalBaseHours,

                                  Percentage = (float)Math.Round(g.Sum(md => md.LT_H) / totalBaseHours * 100, 2),
                                  fromdate = Start_date,
                                  todate = To_date
                              })
                              .ToList();

                                    mandayDataList.AddRange(overallCategorySums);

                                }
                */
                if (Region == "ALL")
                {
                    var overallCategorySums = mandayDataList
                        .Where(md => md.week_no == wk_no) // Ensure aggregation is done for each week
                        .GroupBy(md => md.Category)
                        .Select(g => new MandayData
                        {
                            Region = "OVERALL",
                            Category = g.Key,
                          //  LT_H = g.Sum(md => md.LT_H),
                            LT_H = (float)Math.Round(g.Sum(md => md.LT_H), 2),

                           // EmployeeCount = g.Sum(md => md.EmployeeCount),
                            EmployeeCount = totalEmpcount,
                            BaseCount = totalBaseHours,
                            Percentage = (float)Math.Round(g.Sum(md => md.LT_H) / totalBaseHours * 100, 2),
                            fromdate = Start_date,
                            todate = To_date,
                            week_no = wk_no
                        })
                        .ToList();

                    mandayOverallDataList.AddRange(overallCategorySums);
                }
            }
            if (Region == "ALL")
            {
                return mandayOverallDataList;
            }
            return mandayDataList;



        }

        [HttpGet]
        [Route("GetChartBYDEPT_Weekly")]
        public List<MandayData> GetChartBYDEPT_Weekly(string Region, string Category, string Department,string Start_wk,string End_wk)
        {
            string Start_date;
            string To_date;
            string wk_no;
            List<MandayData> mandayDataList = new List<MandayData>();
            List<MandayData> mandayOverallDataList = new List<MandayData>();
            List<emp_working_info> workingReport = new List<emp_working_info>();
            List<WeeklyDateRange> weekDt = GetWeeklyDateRanges(Start_wk,End_wk);
            List<string> regions;
            List<DateTime> workingDates = new List<DateTime>();
            List<DateTime> splWorkingDates = new List<DateTime>();

            if (Region == "ALL")
            {
                regions = new List<string> { "APC", "APH", "APE", "GROUP" };
            }
            else
            {
                regions = new List<string> { Region };
            }
            int totalBaseHours = 0;
            foreach (var wk in weekDt)
            {

                Start_date = wk.StartDate;
                To_date = wk.EndDate;
                wk_no = wk.Week;

                foreach (var reg in regions)
                {
                    workingDates = GetWorkingDates(Start_date, To_date, reg);

                    // Get special working dates
                    splWorkingDates = GetSpecialWorkingDates(Start_date, To_date, reg);

                    foreach (var department in GetDepartmentsInRegion(reg))
                    {
                        int baseHours = 0;

                        foreach (var wDate in workingDates)
                        {
                            int empCount = GetEmployeeCountBydept(reg, department, wDate);
                            baseHours += empCount * 8;
                        }

                        if (splWorkingDates.Any())
                        {
                            foreach (var spl in splWorkingDates)
                            {
                                int empCount = GetEmployeeCountBydept(reg, department, spl);
                                baseHours += empCount * (8 - GetSpecialHolidayLength(spl));
                            }
                        }
                        totalBaseHours += baseHours;
                        workingReport.Add(new emp_working_info { Region = reg, Dept = department, BaseHours = baseHours,week=wk_no });
                    }
                }

                // workingReport.Add(new emp_working_info { Region = "OVERALL", BaseHours = totalBaseHours });


                using (SqlConnection connection = new SqlConnection(objconfig))
                {
                    connection.Open();
                    //                    string sql = @"WITH DepartmentEmployeeCount AS (
                    //    SELECT REGION, DEPARTMENT, COUNT(emp_no) AS EmployeeCount
                    //    FROM IT_MEMBER
                    //    WHERE MAN_DS = 1
                    //	AND (JOIN_DATE <= @EndDate OR JOIN_DATE IS NULL)
                    //      AND (RESIGN_DATE >= @StartDate OR RESIGN_DATE IS NULL) 
                    //    GROUP BY REGION, DEPARTMENT
                    //)

                    //SELECT 
                    //    MI.REGION, 
                    //    MI.DEPARTMENT,
                    //    DEC.EmployeeCount,
                    //    MI.CATEGORY,
                    //    SUM(
                    //        CASE
                    //            WHEN HL.HOLIDAY_TYPE = 3 THEN
                    //                MI.LT_H                  
                    //            ELSE MI.LT_H  
                    //        END
                    //    ) AS LT_H,
                    //    MIN(MI.FILL_DATE) AS FromDate,
                    //    MAX(MI.FILL_DATE) AS ToDate
                    //FROM 
                    //    MANDAY_INPUT MI
                    //LEFT JOIN 
                    //    DM_CALENDAR_S HL ON MI.REGION = HL.REGION AND MI.FILL_DATE = HL.HOLIDAY_DATE
                    //LEFT JOIN
                    //    DepartmentEmployeeCount DEC ON MI.REGION = DEC.REGION AND MI.DEPARTMENT = DEC.DEPARTMENT";
                    string sql = @"WITH DepartmentEmployeeCount AS (
    SELECT REGION, DEPARTMENT, COUNT(emp_no) AS EmployeeCount
    FROM IT_MEMBER
    WHERE MAN_DS = 1
	AND (JOIN_DATE <= @EndDate OR JOIN_DATE IS NULL)
      AND (RESIGN_DATE >= @StartDate OR RESIGN_DATE IS NULL) 
    GROUP BY REGION, DEPARTMENT
)

SELECT 
    MI.REGION, 
    MI.DEPARTMENT,
    DEC.EmployeeCount,
    MI.CATEGORY,
    SUM( MI.LT_H) AS LT_H,
    MIN(MI.FILL_DATE) AS FromDate,
    MAX(MI.FILL_DATE) AS ToDate
FROM 
    MANDAY_INPUT MI

LEFT JOIN
    DepartmentEmployeeCount DEC ON MI.REGION = DEC.REGION AND MI.DEPARTMENT = DEC.DEPARTMENT";
                    if (Region != "ALL")
                    {
                        sql += " WHERE MI.REGION IN ('" + Region + "') AND MI.LOCK=1";
                    }
                    else if (Region == "ALL")
                    {
                        sql += " WHERE MI.REGION IN ('APC','APH','APE','GROUP') AND MI.LOCK=1";
                    }
                    sql += @" AND MI.FILL_DATE BETWEEN @StartDate AND @EndDate";

                    if (Department != "'ALL'")
                    {
                        string[] departments = Department.Split(','); // Splitting multiple departments
                        StringBuilder deptBuilder = new StringBuilder();

                        // Append 'N' prefix to each department
                        foreach (string department in departments)
                        {
                            deptBuilder.Append("N" + department + ",");
                        }

                        // Remove the trailing comma
                        deptBuilder.Length--;
                        sql += " AND MI.DEPARTMENT IN(" + deptBuilder.ToString() + ")";
                    }
                    if (Category != "ALL")
                    {
                        sql += " AND MI.CATEGORY= @Category ";
                    }
                    sql += @" GROUP BY 
    MI.REGION, MI.DEPARTMENT, DEC.EmployeeCount, MI.CATEGORY
ORDER BY 
    MI.REGION;";

                    using (SqlCommand command = new SqlCommand(sql, connection))
                    {
                        // command.Parameters.AddWithValue("@Region", Region);
                        command.Parameters.AddWithValue("@StartDate", Start_date);
                        command.Parameters.AddWithValue("@EndDate", To_date);
                        if (Category != "ALL")
                        {
                            command.Parameters.AddWithValue("@Category", Category);
                        }
                        using (SqlDataReader reader = command.ExecuteReader())
                        {
                            while (reader.Read())
                            {
                                MandayData mandayData = new MandayData
                                {
                                    Region = reader["REGION"].ToString(),
                                    Department = reader["DEPARTMENT"].ToString(),

                                    Category = reader["CATEGORY"].ToString(),
                                    fromdate = Start_date,
                                    todate = To_date,
                                    week_no = wk_no,
                                    LT_H = reader.IsDBNull(reader.GetOrdinal("LT_H")) ? 0f : Convert.ToSingle(reader["LT_H"]),
                                                                                                                              
                                                                                                                               
                                    EmployeeCount = reader.IsDBNull(reader.GetOrdinal("EmployeeCount")) ? 0 : Convert.ToInt32(reader["EmployeeCount"]),
                                };


                                emp_working_info matchingWorkingInfo = workingReport.FirstOrDefault(w => w.Region == mandayData.Region && w.Dept == mandayData.Department && w.week==mandayData.week_no);
                                if (matchingWorkingInfo != null)
                                {
                                    mandayData.BaseCount = matchingWorkingInfo.BaseHours;
                                    float percentage = (mandayData.LT_H / matchingWorkingInfo.BaseHours) * 100;
                                    mandayData.Percentage = (float)Math.Round(percentage, 2);


                                }

                                mandayDataList.Add(mandayData);
                            }
                        }
                    }

                    connection.Close();
                }
                //  if (Region == "ALL")
                //  {
                //      var overallCategorySums = mandayDataList
                //.GroupBy(md => md.Category)
                //.Select(g => new MandayData
                //{

                //    Region = "OVERALL",
                //    Category = g.Key,
                //    LT_H = g.Sum(md => md.LT_H),
                //    EmployeeCount = g.Sum(md => md.EmployeeCount),
                //    BaseCount = totalBaseHours,
                //    Percentage = (float)Math.Round(g.Sum(md => md.LT_H) / totalBaseHours * 100, 2),
                //    fromdate = Start_date,
                //    todate = To_date
                //})
                //.ToList();

                //      mandayDataList.AddRange(overallCategorySums);

                //  }
                //if (Region == "ALL")
                //{
                //    var overallCategorySums = mandayDataList
                //        .Where(md => md.week_no == wk_no) // Ensure aggregation is done for each week
                //        .GroupBy(md => md.Category)
                //        .Select(g => new MandayData
                //        {
                //            Region = "OVERALL",
                //            Category = g.Key,
                //            LT_H = g.Sum(md => md.LT_H),
                //            EmployeeCount = g.Sum(md => md.EmployeeCount),
                //            BaseCount = totalBaseHours,
                //            Percentage = (float)Math.Round(g.Sum(md => md.LT_H) / totalBaseHours * 100, 2),
                //            fromdate = Start_date,
                //            todate = To_date,
                //            week_no = wk_no
                //        })
                //        .ToList();

                //    mandayOverallDataList.AddRange(overallCategorySums);
                //}
                //if (Region == "ALL")
                //{
                //    return mandayOverallDataList;
                //}
            }
            return mandayDataList;



        }



        [HttpGet]
        [Route("GetChartBYREG_Monthly")]

        public List<MandayData> GetChartBYREG_Monthly(string Region, string Category, string Start_month, string To_month)
        {
            string Start_date;
            string To_date;
            string mnth_name;
            List<MandayData> mandayDataList = new List<MandayData>();
            List<MandayData> mandayOverallDataList = new List<MandayData>();
            List<emp_working_info> workingReport = new List<emp_working_info>();
            List<MonthlyDateRange> weekDt = GetMonthlyDateRanges(Start_month, To_month);
            List<string> regions;
            List<DateTime> workingDates = new List<DateTime>();
            List<DateTime> splWorkingDates = new List<DateTime>();

            if (Region == "ALL")
            {
                regions = new List<string> { "APC", "APH", "APE", "GROUP" };
            }
            else
            {
                regions = new List<string> { Region };
            }
            int totalBaseHours;
            int totalEmpcount;
            foreach (var wk in weekDt)
            {
                totalBaseHours = 0;
                totalEmpcount = 0;
                Start_date = wk.StartDate;
                To_date = wk.EndDate;
                mnth_name = wk.Month;

                foreach (var reg in regions)
                {


                    // Get special working dates

                   int TotalEmpcount = GetTotalEmployeeCount(reg, Start_date, To_date);

                    workingDates = GetWorkingDates(Start_date, To_date, reg);

                    // Get special working dates
                    splWorkingDates = GetSpecialWorkingDates(Start_date, To_date, reg);
                    int baseHours = 0;
                    int empCount = 0;
                    foreach (var wDate in workingDates)
                    {
                        empCount = GetEmployeeCount(reg, wDate);
                        baseHours += empCount * 8;
                    }

                    if (splWorkingDates.Any())
                    {
                        foreach (var spl in splWorkingDates)
                        {
                            empCount = GetEmployeeCount(reg, spl);
                            baseHours += empCount * (8 - GetSpecialHolidayLength(spl));
                        }
                    }
                    totalBaseHours += baseHours;
                    totalEmpcount += TotalEmpcount;
                    workingReport.Add(new emp_working_info { Region = reg, BaseHours = baseHours, month_name = mnth_name });
                }
                // workingReport.Add(new emp_working_info { Region = "OVERALL", BaseHours = totalBaseHours });


                using (SqlConnection connection = new SqlConnection(objconfig))
                {
                    connection.Open();
                    //                    string sql = @"WITH DepartmentEmployeeCount AS (
                    //    SELECT REGION, COUNT(emp_no) AS EmployeeCount
                    //    FROM IT_MEMBER
                    //    WHERE MAN_DS = 1 
                    //      AND (JOIN_DATE <= @EndDate OR JOIN_DATE IS NULL)
                    //      AND (RESIGN_DATE >= @StartDate OR RESIGN_DATE IS NULL) 
                    //    GROUP BY REGION
                    //)

                    //SELECT 
                    //    MI.REGION, 
                    //    DEC.EmployeeCount,
                    //    MI.CATEGORY,
                    //    SUM(
                    //                CASE
                    //                    WHEN HL.HOLIDAY_TYPE = 3 THEN
                    //                      MI.LT_H                       
                    //                    ELSE MI.LT_H 
                    //                END
                    //            ) AS LT_H,
                    //    MIN(MI.FILL_DATE) AS FromDate,
                    //    MAX(MI.FILL_DATE) AS ToDate
                    //FROM 
                    //    MANDAY_INPUT MI
                    //LEFT JOIN 
                    //    DM_CALENDAR_S HL ON MI.REGION = HL.REGION AND MI.FILL_DATE = HL.HOLIDAY_DATE
                    //LEFT JOIN
                    //    DepartmentEmployeeCount DEC ON MI.REGION = DEC.REGION";
                    string sql = @"WITH DepartmentEmployeeCount AS (
    SELECT REGION, COUNT(emp_no) AS EmployeeCount
    FROM IT_MEMBER
    WHERE MAN_DS = 1 
      AND (JOIN_DATE <= @EndDate OR JOIN_DATE IS NULL)
      AND (RESIGN_DATE >= @StartDate OR RESIGN_DATE IS NULL) 
    GROUP BY REGION
)

SELECT 
    MI.REGION, 
    DEC.EmployeeCount,
    MI.CATEGORY,
    SUM(MI.LT_H) AS LT_H,
    MIN(MI.FILL_DATE) AS FromDate,
    MAX(MI.FILL_DATE) AS ToDate
FROM 
    MANDAY_INPUT MI

LEFT JOIN
    DepartmentEmployeeCount DEC ON MI.REGION = DEC.REGION";
                    if (Region != "ALL")
                    {
                        sql += " WHERE MI.REGION IN ('" + Region + "') AND MI.LOCK=1";
                    }
                    else if (Region == "ALL")
                    {
                        sql += " WHERE MI.REGION IN ('APC','APH','APE','GROUP') AND MI.LOCK=1";
                    }
                    if (Category != "ALL")
                    {
                        sql += " AND MI.CATEGORY= @Category ";
                    }

                    //                    sql += @" AND(HL.HOLIDAY_DATE IS NULL OR HL.HOLIDAY_TYPE = 3) 
                    //    AND MI.FILL_DATE BETWEEN  @StartDate AND @EndDate 
                    //GROUP BY 
                    //    MI.REGION, DEC.EmployeeCount, MI.CATEGORY
                    //ORDER BY 
                    //    MI.REGION";
                    sql += @" AND MI.FILL_DATE BETWEEN  @StartDate AND @EndDate 
GROUP BY 
    MI.REGION, DEC.EmployeeCount, MI.CATEGORY
ORDER BY 
    MI.REGION";



                    using (SqlCommand command = new SqlCommand(sql, connection))
                    {
                        // command.Parameters.AddWithValue("@Region", Region);
                        command.Parameters.AddWithValue("@StartDate", Start_date);
                        command.Parameters.AddWithValue("@EndDate", To_date);
                        if (Category != "ALL")
                        {
                            command.Parameters.AddWithValue("@Category", Category);
                        }
                        using (SqlDataReader reader = command.ExecuteReader())
                        {
                            while (reader.Read())
                            {
                                MandayData mandayData = new MandayData
                                {
                                    Region = reader["REGION"].ToString(),
                                    //Department = reader["REGION"].ToString(),
                                    Category = reader["CATEGORY"].ToString(),
                                    fromdate = Start_date,
                                    todate = To_date,
                                    // fromdate = reader["FromDate"].ToString(),//Start_date
                                    //todate = reader["ToDate"].ToString(),//To_date
                                    LT_H = reader.IsDBNull(reader.GetOrdinal("LT_H")) ? 0f : Convert.ToSingle(reader["LT_H"]),

                                    month_name = mnth_name,
                                    EmployeeCount = reader.IsDBNull(reader.GetOrdinal("EmployeeCount")) ? 0 : Convert.ToInt32(reader["EmployeeCount"]),
                                };

                                emp_working_info matchingWorkingInfo = workingReport.FirstOrDefault(w => w.Region == mandayData.Region && w.month_name == mandayData.month_name);
                                if (matchingWorkingInfo != null)
                                {
                                    mandayData.BaseCount = matchingWorkingInfo.BaseHours;
                                    float percentage = (mandayData.LT_H / matchingWorkingInfo.BaseHours) * 100;
                                    mandayData.Percentage = (float)Math.Round(percentage, 2);


                                }
                                else
                                {

                                    mandayData.BaseCount = 0;
                                }

                                mandayDataList.Add(mandayData);
                            }
                        }
                    }

                    connection.Close();
                }
                //  if (Region == "ALL")
                //  {
                //      var overallCategorySums = mandayDataList
                //.GroupBy(md => md.Category)
                //.Select(g => new MandayData
                //{

                //    Region = "OVERALL",
                //    Category = g.Key,
                //    LT_H = g.Sum(md => md.LT_H),
                //    EmployeeCount = g.Sum(md => md.EmployeeCount),
                //    BaseCount = totalBaseHours,
                //    Percentage = (float)Math.Round(g.Sum(md => md.LT_H) / totalBaseHours * 100, 2),
                //    fromdate = Start_date,
                //    todate = To_date
                //})
                //.ToList();

                //      mandayDataList.AddRange(overallCategorySums);

                //  }


                if (Region == "ALL")
                {
                    var overallCategorySums = mandayDataList
                        .Where(md => md.month_name == mnth_name) // Ensure aggregation is done for each week
                        .GroupBy(md => md.Category)
                        .Select(g => new MandayData
                        {
                            Region = "OVERALL",
                            Category = g.Key,
                           // LT_H = g.Sum(md => md.LT_H),
                            LT_H = (float)Math.Round(g.Sum(md => md.LT_H), 2),
                           // EmployeeCount = g.Sum(md => md.EmployeeCount),
                            EmployeeCount =totalEmpcount,
                            BaseCount = totalBaseHours,
                            Percentage = (float)Math.Round(g.Sum(md => md.LT_H) / totalBaseHours * 100, 2),
                            fromdate = Start_date,
                            todate = To_date,
                            month_name = mnth_name
                        })
                        .ToList();

                    mandayOverallDataList.AddRange(overallCategorySums);
                }
            }

            if (Region == "ALL")
            {
                return mandayOverallDataList;
            }
            return mandayDataList;



        }






        [HttpGet]
        [Route("GetChartBYDEPT_Monthly")]
        public List<MandayData> GetChartBYDEPT_Monthly(string Region, string Category, string Department,string Start_month,string To_month)
        {
            string Start_date;
            string To_date;
            string mnth;
            List<MandayData> mandayDataList = new List<MandayData>();
            List<emp_working_info> workingReport = new List<emp_working_info>();
            List<MonthlyDateRange> weekDt = GetMonthlyDateRanges(Start_month, To_month);
            List<string> regions;
            List<DateTime> workingDates = new List<DateTime>();
            List<DateTime> splWorkingDates = new List<DateTime>();

            if (Region == "ALL")
            {
                regions = new List<string> { "APC", "APH", "APE", "GROUP" };
            }
            else
            {
                regions = new List<string> { Region };
            }
            int totalBaseHours = 0;
            foreach (var wk in weekDt)
            {

                Start_date = wk.StartDate;
                To_date = wk.EndDate;
                mnth = wk.Month;

                foreach (var reg in regions)
                {
                    workingDates = GetWorkingDates(Start_date, To_date, reg);

                    // Get special working dates
                    splWorkingDates = GetSpecialWorkingDates(Start_date, To_date, reg);

                    foreach (var department in GetDepartmentsInRegion(reg))
                    {
                        int baseHours = 0;

                        foreach (var wDate in workingDates)
                        {
                            int empCount = GetEmployeeCountBydept(reg, department, wDate);
                            baseHours += empCount * 8;
                        }

                        if (splWorkingDates.Any())
                        {
                            foreach (var spl in splWorkingDates)
                            {
                                int empCount = GetEmployeeCountBydept(reg, department, spl);
                                baseHours += empCount * (8 - GetSpecialHolidayLength(spl));
                            }
                        }
                        totalBaseHours += baseHours;
                        workingReport.Add(new emp_working_info { Region = reg, Dept = department, BaseHours = baseHours, month_name = mnth });
                    }
                }

                // workingReport.Add(new emp_working_info { Region = "OVERALL", BaseHours = totalBaseHours });


                using (SqlConnection connection = new SqlConnection(objconfig))
                {
                    connection.Open();
                    //                    string sql = @"WITH DepartmentEmployeeCount AS (
                    //    SELECT REGION, DEPARTMENT, COUNT(emp_no) AS EmployeeCount
                    //    FROM IT_MEMBER
                    //    WHERE MAN_DS = 1
                    //	AND (JOIN_DATE <= @EndDate OR JOIN_DATE IS NULL)
                    //      AND (RESIGN_DATE >= @StartDate OR RESIGN_DATE IS NULL) 
                    //    GROUP BY REGION, DEPARTMENT
                    //)

                    //SELECT 
                    //    MI.REGION, 
                    //    MI.DEPARTMENT,
                    //    DEC.EmployeeCount,
                    //    MI.CATEGORY,
                    //    SUM(
                    //        CASE
                    //            WHEN HL.HOLIDAY_TYPE = 3 THEN
                    //                MI.LT_H                  
                    //            ELSE MI.LT_H  
                    //        END
                    //    ) AS LT_H,
                    //    MIN(MI.FILL_DATE) AS FromDate,
                    //    MAX(MI.FILL_DATE) AS ToDate
                    //FROM 
                    //    MANDAY_INPUT MI
                    //LEFT JOIN 
                    //    DM_CALENDAR_S HL ON MI.REGION = HL.REGION AND MI.FILL_DATE = HL.HOLIDAY_DATE
                    //LEFT JOIN
                    //    DepartmentEmployeeCount DEC ON MI.REGION = DEC.REGION AND MI.DEPARTMENT = DEC.DEPARTMENT";

                    string sql = @"WITH DepartmentEmployeeCount AS (
    SELECT REGION, DEPARTMENT, COUNT(emp_no) AS EmployeeCount
    FROM IT_MEMBER
    WHERE MAN_DS = 1
	AND (JOIN_DATE <= @EndDate OR JOIN_DATE IS NULL)
      AND (RESIGN_DATE >= @StartDate OR RESIGN_DATE IS NULL) 
    GROUP BY REGION, DEPARTMENT
)

SELECT 
    MI.REGION, 
    MI.DEPARTMENT,
    DEC.EmployeeCount,
    MI.CATEGORY,
    SUM(MI.LT_H) AS LT_H,
    MIN(MI.FILL_DATE) AS FromDate,
    MAX(MI.FILL_DATE) AS ToDate
FROM 
    MANDAY_INPUT MI

LEFT JOIN
    DepartmentEmployeeCount DEC ON MI.REGION = DEC.REGION AND MI.DEPARTMENT = DEC.DEPARTMENT";
                    if (Region != "ALL")
                    {
                        sql += " WHERE MI.REGION IN ('" + Region + "') AND MI.LOCK=1";
                    }
                    else if (Region == "ALL")
                    {
                        sql += " WHERE MI.REGION IN ('APC','APH','APE','GROUP') AND MI.LOCK=1";
                    }
                    sql += @" AND MI.FILL_DATE BETWEEN @StartDate AND @EndDate";

                    if (Department != "'ALL'")
                    {
                        string[] departments = Department.Split(','); // Splitting multiple departments
                        StringBuilder deptBuilder = new StringBuilder();

                        // Append 'N' prefix to each department
                        foreach (string department in departments)
                        {
                            deptBuilder.Append("N" + department + ",");
                        }

                        // Remove the trailing comma
                        deptBuilder.Length--;
                        sql += " AND MI.DEPARTMENT IN(" + deptBuilder.ToString() + ")";
                    }
                    if (Category != "ALL")
                    {
                        sql += " AND MI.CATEGORY= @Category ";
                    }
                    sql += @" GROUP BY 
    MI.REGION, MI.DEPARTMENT, DEC.EmployeeCount, MI.CATEGORY
ORDER BY 
    MI.REGION;";

                    using (SqlCommand command = new SqlCommand(sql, connection))
                    {
                        // command.Parameters.AddWithValue("@Region", Region);
                        command.Parameters.AddWithValue("@StartDate", Start_date);
                        command.Parameters.AddWithValue("@EndDate", To_date);
                        if (Category != "ALL")
                        {
                            command.Parameters.AddWithValue("@Category", Category);
                        }
                        using (SqlDataReader reader = command.ExecuteReader())
                        {
                            while (reader.Read())
                            {
                                MandayData mandayData = new MandayData
                                {
                                    Region = reader["REGION"].ToString(),
                                    Department = reader["DEPARTMENT"].ToString(),

                                    Category = reader["CATEGORY"].ToString(),
                                    fromdate = Start_date,
                                    todate = To_date,
                                    month_name = mnth,
                                    LT_H = reader.IsDBNull(reader.GetOrdinal("LT_H")) ? 0f : Convert.ToSingle(reader["LT_H"]),


                                    EmployeeCount = reader.IsDBNull(reader.GetOrdinal("EmployeeCount")) ? 0 : Convert.ToInt32(reader["EmployeeCount"]),
                                };


                                emp_working_info matchingWorkingInfo = workingReport.FirstOrDefault(w => w.Region == mandayData.Region && w.Dept == mandayData.Department && w.month_name == mandayData.month_name);
                                if (matchingWorkingInfo != null)
                                {
                                    mandayData.BaseCount = matchingWorkingInfo.BaseHours;
                                    float percentage = (mandayData.LT_H / matchingWorkingInfo.BaseHours) * 100;
                                    mandayData.Percentage = (float)Math.Round(percentage, 2);


                                }

                                mandayDataList.Add(mandayData);
                            }
                        }
                    }

                    connection.Close();
                }
                //  if (Region == "ALL")
                //  {
                //      var overallCategorySums = mandayDataList
                //.GroupBy(md => md.Category)
                //.Select(g => new MandayData
                //{

                //    Region = "OVERALL",
                //    Category = g.Key,
                //    LT_H = g.Sum(md => md.LT_H),
                //    EmployeeCount = g.Sum(md => md.EmployeeCount),
                //    BaseCount = totalBaseHours,
                //    Percentage = (float)Math.Round(g.Sum(md => md.LT_H) / totalBaseHours * 100, 2),
                //    fromdate = Start_date,
                //    todate = To_date
                //})
                //.ToList();

                //      mandayDataList.AddRange(overallCategorySums);

                //  }
            }
            return mandayDataList;



        }


        public class MonthlyDateRange
        {
            public string Month { get; set; }
            public string StartDate { get; set; }
            public string EndDate { get; set; }
        }

        public List<MonthlyDateRange> GetMonthlyDateRanges(string Start_month,string To_month)
        {

            DateTime startDate;
            DateTime endDate;

            List<MonthlyDateRange> monthlyDateRanges = new List<MonthlyDateRange>();

            if (!DateTime.TryParse(Start_month, out startDate) || !DateTime.TryParse(To_month, out endDate))
            {
                throw new ArgumentException("Invalid date format. Please provide dates in the format 'yyyy-MM-dd'.");
            }
            DateTime currentStartDate = startDate;
            endDate = Get_last_LockDate(startDate, endDate);
            while (currentStartDate <= endDate)
            {
                DateTime currentEndDate = new DateTime(currentStartDate.Year, currentStartDate.Month, DateTime.DaysInMonth(currentStartDate.Year, currentStartDate.Month));

                if (currentEndDate > endDate)
                {
                    currentEndDate = endDate;
                }

                monthlyDateRanges.Add(new MonthlyDateRange
                {
                    Month = currentStartDate.ToString("MMMM"),
                    StartDate = currentStartDate.ToString("yyyy-MM-dd"),
                    EndDate = currentEndDate.ToString("yyyy-MM-dd")
                });

                currentStartDate = currentEndDate.AddDays(1);
            }

            return monthlyDateRanges;
        }



        public class WeeklyDateRange
        {
            public string Week { get; set; }
            public string StartDate { get; set; }
            public string EndDate { get; set; }
        }

        //public List<WeeklyDateRange> GetWeeklyDateRanges(string strt_wk,string end_wk)
        //{

        //    DateTime startDate = new DateTime(2024, 1, 1);
        //    // DateTime endDate = new DateTime(2024, 1, 31);
        //    DateTime endDate = new DateTime(2024, 2, 10);

        //    List<WeeklyDateRange> weeklyDateRanges = new List<WeeklyDateRange>();

        //    DateTime currentStartDate = startDate;
        //    int weekNumber = 1;

        //    while (currentStartDate <= endDate)
        //    {
        //        DateTime currentEndDate = currentStartDate.AddDays(6);
        //        if (currentEndDate > endDate)
        //        {
        //            currentEndDate = endDate;
        //        }

        //        weeklyDateRanges.Add(new WeeklyDateRange
        //        {
        //            Week = "W" + weekNumber,
        //            StartDate = currentStartDate.ToString("yyyy-MM-dd"),
        //            EndDate = currentEndDate.ToString("yyy-MM-dd")
        //        });

        //        currentStartDate = currentEndDate.AddDays(1);
        //        weekNumber++;
        //    }

        //    return weeklyDateRanges;
        //}

        public List<WeeklyDateRange> GetWeeklyDateRanges(string strt_wk, string end_wk)
        {
            DateTime startDate;
            DateTime endDate;

            // Try parsing the input strings to DateTime
            if (!DateTime.TryParse(strt_wk, out startDate) || !DateTime.TryParse(end_wk, out endDate))
            {
                throw new ArgumentException("Invalid date format. Please provide dates in the format 'yyyy-MM-dd'.");
            }
            endDate = Get_last_LockDate(startDate,endDate);

            List<WeeklyDateRange> weeklyDateRanges = new List<WeeklyDateRange>();

            DateTime currentStartDate = startDate;
          //  int weekNumber = 1;
            Calendar calendar = CultureInfo.CurrentCulture.Calendar;
            CalendarWeekRule calendarWeekRule = CalendarWeekRule.FirstFourDayWeek;
            DayOfWeek firstDayOfWeek = DayOfWeek.Monday;
            int weekNumber = calendar.GetWeekOfYear(currentStartDate, calendarWeekRule, firstDayOfWeek);
          
            
            while (currentStartDate <= endDate)
            {
                DateTime currentEndDate = currentStartDate.AddDays(6);
                if (currentEndDate > endDate)
                {
                    currentEndDate = endDate;
                }

                weeklyDateRanges.Add(new WeeklyDateRange
                {
                    Week = "W" + weekNumber,
                    StartDate = currentStartDate.ToString("yyyy-MM-dd"),
                    EndDate = currentEndDate.ToString("yyyy-MM-dd")
                });

                currentStartDate = currentEndDate.AddDays(1);
                weekNumber++;
            }

            return weeklyDateRanges;
        }


        public DateTime Get_last_LockDate(DateTime start_dt, DateTime end_dt)
        {
            DateTime res = DateTime.MinValue; // Default value if no result is found

            string sql = "select max(fill_date) as max_date from MANDAY_INPUT where FILL_DATE between @start_dt and @end_dt";

            using (SqlConnection connection = new SqlConnection(objconfig))
            {
                using (SqlCommand cmd = new SqlCommand(sql, connection))
                {
                    cmd.Parameters.AddWithValue("@start_dt", start_dt);
                    cmd.Parameters.AddWithValue("@end_dt", end_dt);

                    try
                    {
                        connection.Open();
                        var result = cmd.ExecuteScalar();
                        if (result != DBNull.Value)
                        {
                            res = (DateTime)result;
                        }
                    }
                    catch (SqlException ex)
                    {
                        Console.WriteLine("Error retrieving Role: " + ex.Message);
                    }
                }
            }

            return res;
        }


        [HttpPost]
        [Route("UpdateCheckType")]
        // public List<string> UpdateCheckType(User_data table)
        public IHttpActionResult UpdateCheckType(DataTable table)
        {
            try
            {
                using (SqlConnection connection = new SqlConnection(objconfig))
                {
                    connection.Open();

                    foreach (DataRow row in table.Rows)
                    {
                        int Id = Convert.ToInt32(row["Id"]); // Replace "EmployeeId" with the actual column name

                        // Assuming "CheckType" is a boolean column
                        bool checkType = Convert.ToBoolean(row["CheckType"]); // Replace "CheckType" with the actual column name

                        // Update query
                        string query = "UPDATE MANDAY_INPUT SET CHECK_TYPE = @CheckType WHERE ID = @EmployeeId";

                        using (SqlCommand command = new SqlCommand(query, connection))
                        {
                            command.Parameters.AddWithValue("@CheckType", checkType);
                            command.Parameters.AddWithValue("@EmployeeId", Id);

                            command.ExecuteNonQuery();
                        }
                    }
                }

                return Ok("updated");
            }
            catch (Exception ex)
            {
                return InternalServerError(ex);
            }
        }

        //[HttpPost]
        //[Route("GetRoleRight")]
        //public List<string> GetRoleRight(Rights_List obj )
        //{
        //    string connectionString = objconfig;

        //    string sql = "SELECT DISTINCT USER_ROLE FROM RIGHTS_LIST WHERE ACCOUNT = @Account";

        //    List<string> role = new List<string>();

        //    using (SqlConnection connection = new SqlConnection(connectionString))
        //    {
        //        using (SqlCommand cmd = new SqlCommand(sql, connection))
        //        {
        //            cmd.Parameters.AddWithValue("@Account", obj.Account);

        //            try
        //            {
        //                connection.Open();
        //                using (SqlDataReader reader = cmd.ExecuteReader())
        //                {
        //                    while (reader.Read())
        //                    {
        //                        role.Add(reader["USER_ROLE"].ToString());
        //                    }
        //                }
        //            }
        //            catch (SqlException ex)
        //            {
        //                Console.WriteLine("Error retrieving Role: " + ex.Message);
        //            }
        //        }
        //    }

        //    return role;



        //}
        
    }
}


