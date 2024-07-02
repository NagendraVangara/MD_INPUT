using System;
using System.Collections.Generic;
using System.Data.SqlClient;
using System.Linq;
using System.Net.Sockets;
using System.Net;
using System.Text;
using System.Web;
using Microsoft.Win32;
using static System.Net.WebRequestMethods;
using System.Net.Mail;
using System.IO;
using System.Threading.Tasks;
using System.Drawing;
using System.Security.Principal;
using Newtonsoft.Json;
using System.Data;
using System.Runtime.Remoting.Messaging;

namespace User_Daily_Input.Models
{
    public class User
    {
        string objconfig = System.Configuration.ConfigurationManager.ConnectionStrings["DB_PMO"].ToString();
       // string objconfig = System.Configuration.ConfigurationManager.ConnectionStrings["DB_MNT"].ToString();

        public List<string> Check_User(string username, string password)
        {
            string result = "";
            List<string> lstUser = new List<string>();
            SqlConnection con = new SqlConnection(objconfig);
            try
            {
                con.Open();
                SqlCommand cmd = new SqlCommand();
                cmd.Connection = con;
                cmd.CommandType = System.Data.CommandType.StoredProcedure;
                cmd.CommandText = "SP_LOGIN_CHECK";
                cmd.Parameters.AddWithValue("@Username", username);
                SqlDataReader dr = cmd.ExecuteReader();
                string dbempbarcode = "";
                string dbpwd = "";
               // string dbemp = "";
              //   string dbdept = "";
              //  string dbregion = "";
                string dbempusername = "";

                while (dr.Read())
                {
                    dbempusername = dr["ACCOUNT"].ToString();
                    dbpwd = dr["PASSWORD"].ToString();
                  //  dbemp = dr["EMP_NAME"].ToString();
                   // dbdept = dr["DEPARTMENT"].ToString();
                  //  dbregion = dr["REGION"].ToString();
                    dbempbarcode = dr["EMP_NO"].ToString();
                   // lstUser.Add(dbemp);
                  //  lstUser.Add(dbdept);
                  //  lstUser.Add(dbregion);
                  //  lstUser.Add(dbempbarcode);
                }
                con.Close();
                if (dbempusername.ToLower() == username.ToLower() && dbpwd == password)
                {
                    result = "Success";
                    lstUser.Add(result);
                }
                else
                {
                    result = "failed";
                    lstUser.Add(result);
                }
            }
            catch (Exception)
            {
                result = "failed";
            }
            return lstUser;
        }


        public List<string> Get_User(string username)
        {
            string result = "";
            List<string> lstUser = new List<string>();
            SqlConnection con = new SqlConnection(objconfig);
            try
            {
                con.Open();
                SqlCommand cmd = new SqlCommand();
                cmd.Connection = con;
                cmd.CommandType = System.Data.CommandType.StoredProcedure;
                cmd.CommandText = "SP_LOGIN_CHECK";
                cmd.Parameters.AddWithValue("@Username", username);
                SqlDataReader dr = cmd.ExecuteReader();
                string dbempbarcode = "";
                string dbpwd = "";
                string dbemp = "";
                string dbdept = "";
                string dbregion = "";
                string dbempusername = "";

                while (dr.Read())
                {
                    dbempusername = dr["ACCOUNT"].ToString();
                    dbpwd = dr["PASSWORD"].ToString();
                    dbemp = dr["EMP_NAME"].ToString();
                    dbdept = dr["DEPARTMENT"].ToString();
                    dbregion = dr["REGION"].ToString();
                    dbempbarcode = dr["EMP_NO"].ToString();
                    lstUser.Add(dbemp);
                    lstUser.Add(dbdept);
                    lstUser.Add(dbregion);
                    lstUser.Add(dbempbarcode);
                }
                con.Close();
                //if (dbempusername.ToLower() == username.ToLower() && dbpwd.ToUpper() == password)
                //{
                //    result = "Success";
                //    lstUser.Add(result);
                //}
                //else
                //{
                //    result = "failed";
                //    lstUser.Add(result);
                //}
            }
            catch (Exception)
            {
                result = "failed";
            }
            return lstUser;
        }
        public bool IsValidEmailAddress(string email)
        {
            try
            {
                var emailChecked = new System.Net.Mail.MailAddress(email);
                return true;
            }
            catch
            {
                return false;
            }
        }
        public List<string> CheckEmail(string username)
        {
            string result = "";
            List<string> lstUser = new List<string>();
            SqlConnection con = new SqlConnection(objconfig);
            try
            {
                con.Open();
                string sql = "select EMAIL,EMP_NAME from IT_MEMBER where ACCOUNT='"+username+"' ";
                SqlCommand cmd = new SqlCommand(sql,con);
               
                SqlDataReader dr = cmd.ExecuteReader();
         
                string dbempname = "";
                string dbemail = "";
                string otp = "";
                if (dr.HasRows) // Check if SqlDataReader has any rows
                {
                    while (dr.Read())
                    {
                        dbemail = dr["EMAIL"].ToString();

                        if (!IsValidEmailAddress(dbemail))
                        {
                            lstUser.Add("Invalid_Mail");
                            return lstUser;
                        }
                        dbempname = dr["EMP_NAME"].ToString();                    
                        lstUser.Add(dbemail);

                        otp = Email_check(dbemail, dbempname);
                       


                    }
                    con.Close();
                    if (otp != null)
                    {
                        result = "Success";
                        lstUser.Add(result);
                        lstUser.Add(otp);
                    }
                    else
                    {
                        result = "failed";
                        lstUser.Add(result);
                    }

                }
                else
                {
                 
                        lstUser.Add("No_Mail");
                        return lstUser;
                  
                }
            }
            catch (Exception ex)
            {
                result =ex.Message.ToString();
                lstUser.Add(result);
               
            }
            return lstUser;
        }

        public string Email_check(string Email,string name)
        {

            string OTP = "";

            try
            {
            
                 OTP = Generate_otp();

              
                var smtpPort =25;
                var smtpUsername = "IT - announcement@in.apachefootwear.com";
                var smtpPassword = "it-123456";
                var senderEmail = "IT - announcement@in.apachefootwear.com";
                var recipientEmail = Email; // Change to the recipient's email address

                string mailBody = @"
<p>Dear "+name+@",</p>
<p>Recently, you requested to reset your password.</p>
<p>Please use the following secret code to proceed with the password reset:</p>
<p><strong>Secret Code:</strong> " + OTP + @"</p>
<p>If you did not initiate this password reset request, you can ignore this email.</p>
<p>Thank you,</p>
<p>IT Department</p>
";
               /* var message = new MailMessage(senderEmail, recipientEmail)
                {

                    Subject = "OTP for Reset Password",
                    IsBodyHtml = true,
                    Body = mailBody
                };*/

                MailMessage mail = new MailMessage
                {
                    From = new MailAddress(senderEmail, "IT MANDAY INPUT SYSTEM")
                };
                mail.To.Add(recipientEmail);
                mail.Subject ="OTP for Reset Password";
                mail.Body = mailBody;
                mail.IsBodyHtml = true;

                // Configure SMTP client and send the email
                var smtpClient = new SmtpClient()
                {
                    Host = "10.3.0.254",
                    Port = smtpPort,
                    Credentials = new NetworkCredential(smtpUsername, smtpPassword),
                    EnableSsl = true // Use SSL if required
                };
                ServicePointManager.ServerCertificateValidationCallback =
                (sender, certificate, chain, sslPolicyErrors) => true;


                smtpClient.Send(mail);
                // result = "success";
                //lblmsg.Text = "Mail Send .......";
            }
            catch (Exception ex)
            {

                // Response.Write(ex.Message);
            }

            return OTP;
        }
        public string Generate_otp()
        {
            char[] charArr = "0123456789".ToCharArray();
            string strrandom = "";
            Random objran = new Random();
            for (int i = 0; i < 5; i++)
            {
                // It will not allow Repetation of Characters
                int pos = objran.Next(1, charArr.Length);
                if (!strrandom.Contains(charArr.GetValue(pos).ToString()))
                    strrandom += charArr.GetValue(pos);
                else
                    i--;
            }
            return strrandom;
        }
        public List<ITMember> GET_USER(string username)
        {
           // string result = "";
            List<ITMember> lstUser = new List<ITMember>();
            SqlConnection con = new SqlConnection(objconfig);
            try
            {
                con.Open();

                SqlCommand cmd = new SqlCommand();
                cmd.Connection = con;
                cmd.CommandType = System.Data.CommandType.StoredProcedure;
                cmd.CommandText = "SP_LOGIN_CHECK";
                cmd.Parameters.AddWithValue("@Username", username);
                SqlDataReader reader = cmd.ExecuteReader();
                

                while ( reader.Read())
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

                    lstUser.Add(record);
                }

                con.Close();
               
            }
            catch (Exception)
            {
                
            }
            return lstUser;
        }
        public string CreateMD5(string input)
        {
            // Use input string to calculate MD5 hash
            using (System.Security.Cryptography.MD5 md5 = System.Security.Cryptography.MD5.Create())
            {
                byte[] inputBytes = System.Text.Encoding.ASCII.GetBytes(input);
                byte[] hashBytes = md5.ComputeHash(inputBytes);

                // Convert the byte array to hexadecimal string
                StringBuilder sb = new StringBuilder();
                for (int i = 0; i < hashBytes.Length; i++)
                {
                    sb.Append(hashBytes[i].ToString("X2"));
                }
                return sb.ToString();
            }
        }

        public List<string> User_input(DateTime? FillDate, string Region, string EmployeeName, string EmployeeNumber,
        string Department, float? LtH, string Category, string ProjectName, string RequirementName, string ContentName,
        string Remark,string Username)
        {
            List<string> lstUser = new List<string>();
          
            using (SqlConnection connection = new SqlConnection(objconfig))
            {
                string sql = @"INSERT INTO MANDAY_INPUT(REGION, DEPARTMENT, EMP_NAME, EMP_NO, FILL_DATE, LT_H, CATEGORY, 
                          PROJECT_NAME, REQUIREMENT_NAME, CONTENT_NAME, REMARK,CREATED_DATE,CREATED_TIME,CREATED_BY,LOCK,CHECK_TYPE) 
                          VALUES (@Region, @Department, @EmployeeName, @EmployeeNumber, @FillDate, @LtH, @Category, 
                          @ProjectName, @RequirementName, @ContentName, @Remark,CONVERT(varchar, GETDATE(), 23),CONVERT(varchar, GETDATE(), 108),@Created_by,0,0)";

                using (SqlCommand command = new SqlCommand(sql, connection))
                {
                    command.Parameters.AddWithValue("@Region", Region);
                    command.Parameters.AddWithValue("@Department", Department);
                    command.Parameters.AddWithValue("@EmployeeName", EmployeeName);
                    command.Parameters.AddWithValue("@EmployeeNumber", EmployeeNumber);
                    command.Parameters.AddWithValue("@FillDate", FillDate);
                    string formattedLtH = LtH?.ToString("F2");
                    command.Parameters.AddWithValue("@LtH", formattedLtH);
                   // command.Parameters.AddWithValue("@LtH", LtH);
                    command.Parameters.AddWithValue("@Category", Category);
                    command.Parameters.AddWithValue("@ProjectName", ProjectName ?? "");
                    command.Parameters.AddWithValue("@RequirementName", RequirementName ?? "");
                    command.Parameters.AddWithValue("@ContentName", ContentName?? "");
                    command.Parameters.AddWithValue("@Remark", Remark ?? "");
                    command.Parameters.AddWithValue("@Created_by", Username);

                    connection.Open();
                    int rowsAffected = command.ExecuteNonQuery();
                    connection.Close();

                    if (rowsAffected > 0)
                    {
                        lstUser.Add("Success");
                    }
                    else
                    {
                        lstUser.Add("Failed");
                    }
                }
            }

            return lstUser;
        }


        public List<string> Add_IT_member( string Region, string Department,int? mands, string Role,string EmployeeName, string EmployeeNumber,string email,DateTime? Join,string Username,string Password,string Remark)
        {
            List<string> lstUser = new List<string>();
       
            SqlConnection connection = new SqlConnection(objconfig);
            connection.Open();  
                string sql1 = "select * from IT_MEMBER where ACCOUNT='"+Username+"'";
                SqlCommand cmd = new SqlCommand(sql1, connection);
            SqlDataReader sdr = cmd.ExecuteReader();
            
                if (sdr.Read() == true)
                {
              
                    lstUser.Add("registered");
                }
                else
                {
                sdr.Close();
                string sql = @"INSERT INTO IT_MEMBER(REGION, DEPARTMENT, EMP_NAME, EMP_NO, EMAIL, JOIN_DATE, ACCOUNT, PASSWORD, REMARK,MAN_DS,EMP_ROLE) 
                       VALUES (@Region, @Department, @EmployeeName, @EmployeeNumber, @Email, @JoinDate, @Account, @Password, @Remark,@ManDS,@Role)";

                    using (SqlCommand command = new SqlCommand(sql, connection))
                    {
                        command.Parameters.AddWithValue("@Region", Region);
                    // command.Parameters.AddWithValue("@Department", Department);
                    command.Parameters.AddWithValue("@Department", Department ?? "");
                    command.Parameters.AddWithValue("@EmployeeName", EmployeeName);
                        command.Parameters.AddWithValue("@EmployeeNumber", EmployeeNumber);
                        command.Parameters.AddWithValue("@Email", email);
                        command.Parameters.AddWithValue("@JoinDate", Join);
                        // command.Parameters.AddWithValue("@ResignDate",);
                        command.Parameters.AddWithValue("@ManDS", mands);
                        command.Parameters.AddWithValue("@Role", Role);
                        command.Parameters.AddWithValue("@Account", Username);
                        command.Parameters.AddWithValue("@Password", Password);
                        command.Parameters.AddWithValue("@Remark", Remark ?? "");


                        int rowsAffected = command.ExecuteNonQuery();
                        connection.Close();

                        if (rowsAffected > 0)
                        {
                            lstUser.Add("Success");
                        }
                        else
                        {
                            lstUser.Add("Failed");
                        }
                    }
                }
            

            return lstUser;
        }



        public List<string> Upadte_input(int Id,DateTime? FillDate,string Emp_no,float? LtH, string Category, string ProjectName, string RequirementName, string ContentName, string Remark, string Username)
        {
            List<string> lstUser = new List<string>();
           
            using (SqlConnection connection = new SqlConnection(objconfig))
            {
                string sql = @"UPDATE MANDAY_INPUT SET LT_H = @LtH,FILL_DATE = @FillDate,CATEGORY = @Category, PROJECT_NAME = @ProjectName, 
               REQUIREMENT_NAME = @RequirementName, CONTENT_NAME = @ContentName, REMARK = @Remark,CHECK_TYPE=0,
               UPDATED_DATE = CONVERT(varchar, GETDATE(), 23), UPDATED_TIME = CONVERT(varchar, GETDATE(), 108), 
               UPDATED_BY = @Updated_by WHERE EMP_NO=@Emp_NO and ID=@Id and LOCK = '0' ";

                using (SqlCommand command = new SqlCommand(sql, connection))
                {
                  
                    command.Parameters.AddWithValue("@FillDate", FillDate);
                    command.Parameters.AddWithValue("@Emp_NO", Emp_no);
                    command.Parameters.AddWithValue("@Id", Id);

                    command.Parameters.AddWithValue("@LtH", LtH);
                    command.Parameters.AddWithValue("@Category", Category);
                    command.Parameters.AddWithValue("@ProjectName", ProjectName ?? "");
                    command.Parameters.AddWithValue("@RequirementName", RequirementName ?? "");
                    command.Parameters.AddWithValue("@ContentName", ContentName);
                    command.Parameters.AddWithValue("@Remark", Remark ?? "");
                    command.Parameters.AddWithValue("@Updated_by", Username);

                    connection.Open();
                    int rowsAffected = command.ExecuteNonQuery();
                    connection.Close();

                    if (rowsAffected > 0)
                    {
                        lstUser.Add("Success");
                    }
                    else
                    {
                        lstUser.Add("Locked");
                    }
                }
            }

            return lstUser;
        }
        
        public List<string> Delete_input(int Id, DateTime? FillDate, string Emp_no)
        {
            List<string> lstUser = new List<string>();
           
           
            using (SqlConnection connection = new SqlConnection(objconfig))
            {
                string sql = @"DELETE MANDAY_INPUT WHERE LOCK='0' AND FILL_DATE = @FillDate and EMP_NO=@Emp_NO AND ID=@Id ";

                using (SqlCommand command = new SqlCommand(sql, connection))
                {

                    command.Parameters.AddWithValue("@FillDate", FillDate);
                    command.Parameters.AddWithValue("@Emp_NO", Emp_no);
                    command.Parameters.AddWithValue("@Id", Id);

                    connection.Open();
                    int rowsAffected = command.ExecuteNonQuery();
                    connection.Close();

                    if (rowsAffected > 0)
                    {
                        lstUser.Add("Success");
                    }
                    else
                    {
                        lstUser.Add("Locked");
                    }
                }
            }

            return lstUser;
        }


        public  List<string> Update_Project_Details(int Id,string project_name,string project_mngr,string pm_region,DateTime?Start_date, DateTime? ex_go_live_date, DateTime? exit_date,string status,string remark)
        {
            List<string> lstUser = new List<string>();
          
            SqlConnection connection = new SqlConnection(objconfig);
            try
            {
               
                    string sql = @"UPDATE PROJECT_LIST SET PROJECT_NAME=@PROJECT_NAME,IT_PM=@IT_PM,IT_PM_REGION=@IT_PM_REGION,START_DATE = @Start_date, EX_GO_LIVE_DATE = @ex_go_live_date, EXIT_DATE = @exit_date, 
               REMARK = @remark, STATUS = @status where ID=@Id ";

                    using (SqlCommand command = new SqlCommand(sql, connection))
                    {

                     command.Parameters.AddWithValue("@PROJECT_NAME", project_name ?? "");
                     command.Parameters.AddWithValue("@IT_PM", project_mngr ?? "");
                    command.Parameters.AddWithValue("@IT_PM_REGION", pm_region ?? "");
                    command.Parameters.AddWithValue("@Start_date", Start_date ?? (object)DBNull.Value); 
                    command.Parameters.AddWithValue("@ex_go_live_date", ex_go_live_date ?? (object)DBNull.Value); 
                    command.Parameters.AddWithValue("@exit_date", exit_date ?? (object)DBNull.Value);
                    command.Parameters.AddWithValue("@status", status);
                       
                      
                        command.Parameters.AddWithValue("@remark", remark ?? "");

                    command.Parameters.AddWithValue("@Id", Id);
                    connection.Open();
                        int rowsAffected = command.ExecuteNonQuery();
                       

                        if (rowsAffected > 0)
                        {
                            lstUser.Add("Success");

                        }
                        else
                        {
                            lstUser.Add("Failed");
                        }
                    }
                


            }
            catch (Exception ex)
            {
                throw ex;
            }
            finally
            {
                connection.Close();
            }

            return lstUser;
        }


        public List<string> Insert_Project_details(string project_name,string project_no,string it_pm,string it_pm_region, DateTime? start_date, DateTime? ex_go_live, string status)
        {
            List<string> lstUser = new List<string>();
            string Remark = "";
            SqlConnection connection = new SqlConnection(objconfig);
            connection.Open();
            string sql1 = "select * from PROJECT_LIST where PROJECT_NO='" + project_no + "'";
            SqlCommand cmd = new SqlCommand(sql1, connection);
            SqlDataReader sdr = cmd.ExecuteReader();

            if (sdr.Read() == true)
            {

                lstUser.Add("registered");
            }

            else
            {
                sdr.Close();
                string sql = @"INSERT INTO PROJECT_LIST( PROJECT_NAME, PROJECT_NO,IT_PM,IT_PM_REGION,STATUS, START_DATE,EX_GO_LIVE_DATE,REMARK) 
                          VALUES ( @PROJECT_NAME, @PROJECT_NO,@IT_PM,@IT_PM_REGION,@STATUS, @START_DATE,@EX_GO_LIVE_DATE,@REMARK)";

                using (SqlCommand command = new SqlCommand(sql, connection))
                {
                    //command.Parameters.AddWithValue("@ID", Id);
                    command.Parameters.AddWithValue("@PROJECT_NAME", project_name);
                    command.Parameters.AddWithValue("@PROJECT_NO", project_no);
                    command.Parameters.AddWithValue("@STATUS", status);
                    command.Parameters.AddWithValue("@REMARK", Remark);
                    command.Parameters.AddWithValue("@IT_PM", it_pm);
                    command.Parameters.AddWithValue("@IT_PM_REGION", it_pm_region);
                    command.Parameters.AddWithValue("@START_DATE", start_date);
                    command.Parameters.AddWithValue("@EX_GO_LIVE_DATE", ex_go_live);
                    // command.Parameters.AddWithValue("@EXIT_DATE", exit_date);


                  
                    int rowsAffected = command.ExecuteNonQuery();
                    connection.Close();

                    if (rowsAffected > 0)
                    {
                        lstUser.Add("Success");
                    }
                    else
                    {
                        lstUser.Add("Failed");
                    }
                }
            }

            return lstUser;
        }
        public List<string> Delete_project(int Id)
        {
            List<string> lstUser = new List<string>();


            using (SqlConnection connection = new SqlConnection(objconfig))
            {
                string sql = @"DELETE PROJECT_LIST WHERE ID = @Id";

                using (SqlCommand command = new SqlCommand(sql, connection))
                {

                    //command.Parameters.AddWithValue("@FillDate", FillDate);
                    //command.Parameters.AddWithValue("@Emp_NO", Emp_no);
                    command.Parameters.AddWithValue("@Id", Id);

                    connection.Open();
                    int rowsAffected = command.ExecuteNonQuery();
                    connection.Close();

                    if (rowsAffected > 0)
                    {
                        lstUser.Add("Success");
                    }
                    else
                    {
                        lstUser.Add("Failed");
                    }
                }
            }

            return lstUser;
        }


        public List<string> Update_IT_Member_details(int? ID, string Region, string Department, int? ManDS,string Role, string EmployeeName, string EmployeeNumber, string Email, DateTime? JoinDate, DateTime? ResignDate, string Account, string Password, string Remark)
        {
            List<string> lstUser = new List<string>();
          
            using (SqlConnection connection = new SqlConnection(objconfig))
            {
                string sql = @"UPDATE IT_MEMBER SET REGION = @REGION, DEPARTMENT = @DEPARTMENT, EMP_NAME = @EMP_NAME,EMP_NO=@Emp_NO,
               EMAIL = @EMAIL, JOIN_DATE = @JOIN_DATE,RESIGN_DATE=@RESIGN_DATE, REMARK = @Remark,MAN_DS=@MAN_DS,ACCOUNT=@ACCOUNT,
                PASSWORD=@PASSWORD,EMP_ROLE=@Role WHERE ID=@Id ";

                using (SqlCommand command = new SqlCommand(sql, connection))
                {

                    command.Parameters.AddWithValue("@REGION", Region);
                    command.Parameters.AddWithValue("@Emp_NO", EmployeeNumber);
                    command.Parameters.AddWithValue("@Id", ID);

                    command.Parameters.AddWithValue("@DEPARTMENT", Department ??"");
                    command.Parameters.AddWithValue("@EMP_NAME", EmployeeName);
                    command.Parameters.AddWithValue("@MAN_DS", ManDS);
                    command.Parameters.AddWithValue("@EMAIL", Email);
                    command.Parameters.AddWithValue("@JOIN_DATE", JoinDate);
                    command.Parameters.AddWithValue("@ACCOUNT", Account);
                    command.Parameters.AddWithValue("@PASSWORD", Password);
                    command.Parameters.AddWithValue("@Role", Role);

                    command.Parameters.AddWithValue("@Remark", Remark ?? "");
                    command.Parameters.AddWithValue("@RESIGN_DATE", ResignDate.HasValue ? (object)ResignDate : DBNull.Value);

                    connection.Open();
                    int rowsAffected = command.ExecuteNonQuery();
                    connection.Close();

                    if (rowsAffected > 0)
                    {
                        lstUser.Add("Success");
                    }
                    else
                    {
                        lstUser.Add("Failed");
                    }
                }
            }

            return lstUser;
        }
        public List<string> Delete_IT_member(int? Id, string Emp_no)
        {
            List<string> lstUser = new List<string>();


            using (SqlConnection connection = new SqlConnection(objconfig))
            {
                string sql = @"DELETE IT_MEMBER WHERE EMP_NO=@Emp_NO AND ID=@Id";

                using (SqlCommand command = new SqlCommand(sql, connection))
                {

                  
                    command.Parameters.AddWithValue("@Emp_NO", Emp_no);
                    command.Parameters.AddWithValue("@Id", Id);

                    connection.Open();
                    int rowsAffected = command.ExecuteNonQuery();
                    connection.Close();

                    if (rowsAffected > 0)
                    {
                        lstUser.Add("Success");
                    }
                    else
                    {
                        lstUser.Add("Failed");
                    }
                }
            }

            return lstUser;
        }

        //public List<string> Insert_Rights_details(string account, string role_right, string department, string region,string role,string Remark)
        //{
        //    List<string> lstUser = new List<string>();

        //    SqlConnection connection = new SqlConnection(objconfig);
        //    connection.Open();
        //    string sql1 = "select * from RIGHTS_LIST where ACCOUNT='" + account + "' and ROLE_RIGHT='"+role_right+ "' and ASSIGNED_DEPT='"+department+ "' and ASSIGNED_REGION='"+ region + "'";
        //    SqlCommand cmd = new SqlCommand(sql1, connection);
        //    SqlDataReader sdr = cmd.ExecuteReader();

        //    if (sdr.Read() == true)
        //    {

        //        lstUser.Add("registered");
        //    }
        //    else
        //    {
        //        sdr.Close();    
        //        string sql = @"INSERT INTO RIGHTS_LIST( ACCOUNT, ROLE_RIGHT,ASSIGNED_REGION,ASSIGNED_DEPT, USER_ROLE,REMARK) 
        //                  VALUES ( @ACCOUNT, @ROLE_RIGHT,@ASSIGNED_REGION,@ASSIGNED_DEPT,@Role,@REMARK)";

        //        using (SqlCommand command = new SqlCommand(sql, connection))
        //        {
        //            //command.Parameters.AddWithValue("@ID", Id);
        //            command.Parameters.AddWithValue("@ACCOUNT", account);
        //            command.Parameters.AddWithValue("@ROLE_RIGHT", role_right);
        //            command.Parameters.AddWithValue("@ASSIGNED_DEPT", department ?? ""); 
        //            command.Parameters.AddWithValue("@ASSIGNED_REGION", region ?? "");
        //            command.Parameters.AddWithValue("@Role", role);
        //            command.Parameters.AddWithValue("@REMARK", Remark ?? "");


        //            int rowsAffected = command.ExecuteNonQuery();
        //            connection.Close();

        //            if (rowsAffected > 0)
        //            {
        //                lstUser.Add("Success");
        //            }
        //            else
        //            {
        //                lstUser.Add("Failed");
        //            }
        //        }
        //    }


        //    return lstUser;
        //}
        public List<string> Insert_Rights_details(string account, string role_right, string department, string region, string Remark)
        {
            List<string> lstUser = new List<string>();

            using (SqlConnection connection = new SqlConnection(objconfig))
            {
                connection.Open();

                // Check if the record already exists in RIGHTS_LIST
                string sqlCheckDuplicate = @"SELECT COUNT(*) FROM RIGHTS_LIST 
                                    WHERE ACCOUNT = @ACCOUNT 
                                    AND ROLE_RIGHT = @ROLE_RIGHT 
                                    AND ASSIGNED_DEPT = @ASSIGNED_DEPT 
                                    AND ASSIGNED_REGION = @ASSIGNED_REGION";
                SqlCommand cmdCheckDuplicate = new SqlCommand(sqlCheckDuplicate, connection);
                cmdCheckDuplicate.Parameters.AddWithValue("@ACCOUNT", account);
                cmdCheckDuplicate.Parameters.AddWithValue("@ROLE_RIGHT", role_right);
                cmdCheckDuplicate.Parameters.AddWithValue("@ASSIGNED_DEPT", department ?? "");
                cmdCheckDuplicate.Parameters.AddWithValue("@ASSIGNED_REGION", region ?? "");
                int duplicateCount = (int)cmdCheckDuplicate.ExecuteScalar();

                if (duplicateCount > 0)
                {
                    lstUser.Add("registered");
                }
                else
                {
                    // Check if the account exists in the IT_member table
                    string sqlCheckAccount = "SELECT COUNT(*) FROM IT_member WHERE ACCOUNT = @Account";
                    SqlCommand cmdCheckAccount = new SqlCommand(sqlCheckAccount, connection);
                    cmdCheckAccount.Parameters.AddWithValue("@Account", account);
                    int accountExists = (int)cmdCheckAccount.ExecuteScalar();

                    if (accountExists > 0)
                    {
                        // Account exists in IT_member table, proceed with inserting into RIGHTS_LIST table
                        string sqlInsertRights = @"INSERT INTO RIGHTS_LIST (ACCOUNT, ROLE_RIGHT, ASSIGNED_REGION, ASSIGNED_DEPT, REMARK) 
                                           VALUES (@ACCOUNT, @ROLE_RIGHT, @ASSIGNED_REGION, @ASSIGNED_DEPT, @REMARK)";

                        try
                        {
                            using (SqlCommand cmdInsertRights = new SqlCommand(sqlInsertRights, connection))
                            {
                                cmdInsertRights.Parameters.AddWithValue("@ACCOUNT", account);
                                cmdInsertRights.Parameters.AddWithValue("@ROLE_RIGHT", role_right);
                                cmdInsertRights.Parameters.AddWithValue("@ASSIGNED_DEPT", department ?? "");
                                cmdInsertRights.Parameters.AddWithValue("@ASSIGNED_REGION", region ?? "");
                              //  cmdInsertRights.Parameters.AddWithValue("@Role", role);
                                cmdInsertRights.Parameters.AddWithValue("@REMARK", Remark ?? "");

                                int rowsAffected = cmdInsertRights.ExecuteNonQuery();

                                if (rowsAffected > 0)
                                {
                                    lstUser.Add("Success");
                                }
                                else
                                {
                                    lstUser.Add("Failed to insert into RIGHTS_LIST");
                                }
                            }
                        }
                        catch (SqlException ex)
                        {
                            lstUser.Add("Error: " + ex.Message);
                        }
                    }
                    else
                    {
                        lstUser.Add("No_Account");
                    }
                }
            }

            return lstUser;
        }

        public List<string> Update_Rights_details(int? ID,string account, string role_right, string Department, string Region, string Remark)
        {
            List<string> lstUser = new List<string>();

            SqlConnection connection = new SqlConnection(objconfig);
            connection.Open();
            string sql1 = "select * from RIGHTS_LIST where ACCOUNT='" + account + "' and ROLE_RIGHT='" + role_right + "' and ASSIGNED_DEPT='" + Department + "' and ASSIGNED_REGION='" + Region + "'";
            SqlCommand cmd = new SqlCommand(sql1, connection);
            SqlDataReader sdr = cmd.ExecuteReader();

            if (sdr.Read() == true)
            {

                lstUser.Add("registered");
            }
            else
            {
                sdr.Close();


                string sql = @"UPDATE RIGHTS_LIST SET ROLE_RIGHT = @ROLE_RIGHT, ASSIGNED_REGION = @ASSIGNED_REGION, ASSIGNED_DEPT = @ASSIGNED_DEPT,REMARK=@Remark               
                 WHERE ACCOUNT=@ACCOUNT and ID=@Id ";

                using (SqlCommand command = new SqlCommand(sql, connection))
                {

                    command.Parameters.AddWithValue("@ROLE_RIGHT", role_right);
                    command.Parameters.AddWithValue("@ASSIGNED_REGION", Region ?? "");
                    command.Parameters.AddWithValue("@Id", ID);

                    command.Parameters.AddWithValue("@ASSIGNED_DEPT", Department ?? "");
                    command.Parameters.AddWithValue("@Remark", Remark ?? "");
                    command.Parameters.AddWithValue("@ACCOUNT", account);
                  //  command.Parameters.AddWithValue("@User_role", role);

                    //connection.Open();
                    int rowsAffected = command.ExecuteNonQuery();
                    connection.Close();

                    if (rowsAffected > 0)
                    {
                        lstUser.Add("Success");
                    }
                    else
                    {
                        lstUser.Add("Failed");
                    }
                }
            }

            return lstUser;
        }
        public List<string> Delete_Rights(int? Id,string account)
        {
            List<string> lstUser = new List<string>();


            using (SqlConnection connection = new SqlConnection(objconfig))
            {
                string sql = @"DELETE RIGHTS_LIST WHERE ACCOUNT =@Account and ID = @Id";

                using (SqlCommand command = new SqlCommand(sql, connection))
                {

                    command.Parameters.AddWithValue("@Account", account);
                    command.Parameters.AddWithValue("@Id", Id);

                    connection.Open();
                    int rowsAffected = command.ExecuteNonQuery();
                    connection.Close();

                    if (rowsAffected > 0)
                    {
                        lstUser.Add("Success");
                    }
                    else
                    {
                        lstUser.Add("Failed");
                    }
                }
            }

            return lstUser;
        }

        //public List<User_data> Daily_Input_Report(string region, string dept, string emp_no, string category, string s_date, string t_date)
        //{

        //    List<User_data> Data = new List<User_data>();
        //    try
        //    {

                

        //        string sql = "SELECT[MANDAY_INPUT].[ID],[REGION],[DEPARTMENT],[EMP_NAME],[EMP_NO], " +
        //                 "[FILL_DATE],[LT_H],[CATEGORY],PROJECT_LIST.[PROJECT_NAME],[REQUIREMENT_NAME], " +
        //                 "[CONTENT_NAME],[MANDAY_INPUT].[REMARK],[CHECK_TYPE],[LOCK],[CREATED_DATE], " +
        //                 "[CREATED_TIME],[CREATED_BY],[UPDATED_DATE],[UPDATED_TIME],[UPDATED_BY] " +
        //                 "FROM [PMO_ITMANPOWER_INPUT].[dbo].[MANDAY_INPUT] " +
        //                 "LEFT JOIN PROJECT_LIST ON MANDAY_INPUT.PROJECT_NAME = PROJECT_LIST.PROJECT_NO WHERE FILL_DATE BETWEEN '" + s_date + "' AND '" + t_date + "'";

        //        //string sql = "SELECT * FROM MANDAY_INPUT WHERE FILL_DATE BETWEEN '" + s_date + "' AND '" + t_date + "'";

        //        // Check if region is not 'ALL'
        //        if (region != "ALL")
        //        {
        //            sql += " AND REGION = '" + region + "'";
        //        }
        //        if (category != "ALL")
        //        {
        //            sql += " AND CATEGORY = @Category";
        //        }


        //        if (dept != "'ALL'")
        //        {
        //            sql += " AND DEPARTMENT IN(N" + dept + ")";
        //        }
        //        if (emp_no != "ALL")
        //        {
        //            sql += " AND EMP_NO = '" + emp_no + "'";
        //        }
        //        SqlConnection connection = new SqlConnection(objconfig);
        //        connection.Open();
        //        SqlCommand cmd = new SqlCommand(sql, connection);
        //        if (category != "ALL")
        //        {
        //            cmd.Parameters.AddWithValue("@Category", category);
        //        }

        //        //cmd.Parameters.AddWithValue("@StartDate", s_date);
        //        // cmd.Parameters.AddWithValue("@EndDate", t_date);

        //        // Add region parameters if not 'ALL'
        //        //if (region != "ALL")
        //        //{
        //        //    cmd.Parameters.AddWithValue("@Region", region);
        //        //}
        //        //if (category != "ALL")
        //        //{
        //        //    cmd.Parameters.AddWithValue("@Category", category);
        //        //}

        //        //// Add parameters for each department
        //        //if (dept != null)
        //        //{

        //        //   cmd.Parameters.AddWithValue("@Department", dept);

        //        //}

        //        SqlDataReader reader = cmd.ExecuteReader();
        //        while (reader.Read())
        //        {
        //            User_data record = new User_data
        //            {
        //                ID = reader.GetInt32(reader.GetOrdinal("ID")),
        //                Region = reader["REGION"] as string,
        //                Department = reader["DEPARTMENT"] as string,
        //                EmployeeName = reader["EMP_NAME"] as string,
        //                EmployeeNumber = reader["EMP_NO"] as string,
        //                FillDate = reader.IsDBNull(reader.GetOrdinal("FILL_DATE")) ? (DateTime?)null : reader.GetDateTime(reader.GetOrdinal("FILL_DATE")),
        //                //  LtH = reader.IsDBNull(reader.GetOrdinal("LT_H")) ? (int?)null : reader.GetInt32(reader.GetOrdinal("LT_H")),
        //                LtH = reader.IsDBNull(reader.GetOrdinal("LT_H")) ? (float?)null : (float)reader.GetDouble(reader.GetOrdinal("LT_H")),
        //                Category = reader["CATEGORY"] as string,
        //                ProjectName = reader["PROJECT_NAME"] as string,
        //                RequirementName = reader["REQUIREMENT_NAME"] as string,
        //                ContentName = reader["CONTENT_NAME"] as string,
        //                Remark = reader["REMARK"] as string,
        //                //Lock = (reader["LOCK"] as int?) == 1 ? true : false
        //                Lock = reader["LOCK"] is DBNull ? false : Convert.ToInt32(reader["LOCK"]) == 1 ? true : false,
        //                CheckType = reader["CHECK_TYPE"] is DBNull ? false : Convert.ToInt32(reader["CHECK_TYPE"]) == 1 ? true : false,
        //                CreatedDate = reader["CREATED_DATE"] as string,
        //                CreatedTime = reader["CREATED_TIME"] as string,
        //                CreatedBy = reader["CREATED_BY"] as string,
        //                UpdatedDate = reader["UPDATED_DATE"] as string,
        //                UpdatedTime = reader["UPDATED_TIME"] as string,
        //                UpdatedBy = reader["UPDATED_BY"] as string


        //            };

        //            Data.Add(record);
        //        }

        //    }
        //    catch (Exception ex)
        //    {
        //        throw ex;
        //    }

        //    return Data;


        //}

        // // public List<User_data> Daily_Manday_Report_LockStatus(string region, string dept, string category, DateTime? s_date, DateTime? t_date)


        public async Task<List<User_data>> Daily_Input_Report(string region, string dept, string emp_no, string category, string s_date, string t_date)
        {
            List<User_data> Data = new List<User_data>();
            try
            {
                // string sql = "SELECT * FROM MANDAY_INPUT WHERE FILL_DATE BETWEEN @StartDate AND @EndDate";
                string sql = "SELECT[MANDAY_INPUT].[ID],[REGION],[DEPARTMENT],[EMP_NAME],[EMP_NO], " +
                          "[FILL_DATE],[LT_H],[CATEGORY],PROJECT_LIST.[PROJECT_NAME],[REQUIREMENT_NAME], " +
                          "[CONTENT_NAME],[MANDAY_INPUT].[REMARK],[CHECK_TYPE],[LOCK],[CREATED_DATE], " +
                          "[CREATED_TIME],[CREATED_BY],[UPDATED_DATE],[UPDATED_TIME],[UPDATED_BY] " +
                          "FROM [PMO_ITMANPOWER_INPUT].[dbo].[MANDAY_INPUT] " +
                          "LEFT JOIN PROJECT_LIST ON MANDAY_INPUT.PROJECT_NAME = PROJECT_LIST.PROJECT_NO WHERE FILL_DATE BETWEEN '" + s_date + "' AND '" + t_date + "'";

                // Check if region is not 'ALL'
                if (region != "ALL")
                {
                    sql += " AND REGION = @Region";
                }
                if (category != "ALL")
                {
                    sql += " AND CATEGORY = @Category";
                }
                if (dept != "'ALL'")
                {
                    // sql += " AND DEPARTMENT IN(N" + dept + ")";
                    string[] departments = dept.Split(','); // Splitting multiple departments
                    StringBuilder deptBuilder = new StringBuilder();

                    // Append 'N' prefix to each department
                    foreach (string department in departments)
                    {
                        deptBuilder.Append("N" + department + ",");
                    }

                    // Remove the trailing comma
                    deptBuilder.Length--;

                    sql += " AND DEPARTMENT IN (" + deptBuilder.ToString() + ")";
                }
                if (emp_no != "ALL")
                {
                    sql += " AND EMP_NO = @EmployeeNumber";
                }

                using (SqlConnection connection = new SqlConnection(objconfig))
                {
                    await connection.OpenAsync();
                    using (SqlCommand cmd = new SqlCommand(sql, connection))
                    {
                        cmd.Parameters.AddWithValue("@StartDate", s_date);
                        cmd.Parameters.AddWithValue("@EndDate", t_date);

                        if (region != "ALL")
                        {
                            cmd.Parameters.AddWithValue("@Region", region);
                        }
                        if (category != "ALL")
                        {
                            cmd.Parameters.AddWithValue("@Category", category);
                        }
                        if (emp_no != "ALL")
                        {
                            cmd.Parameters.AddWithValue("@EmployeeNumber", emp_no);
                        }

                        using (SqlDataReader reader = await cmd.ExecuteReaderAsync())
                        {
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
                                    LtH = reader.IsDBNull(reader.GetOrdinal("LT_H")) ? (float?)null : (float)reader.GetDouble(reader.GetOrdinal("LT_H")),
                                    Category = reader["CATEGORY"] as string,
                                    ProjectName = reader["PROJECT_NAME"] as string,
                                    RequirementName = reader["REQUIREMENT_NAME"] as string,
                                    ContentName = reader["CONTENT_NAME"] as string,
                                    Remark = reader["REMARK"] as string,
                                    Lock = reader["LOCK"] is DBNull ? false : Convert.ToInt32(reader["LOCK"]) == 1,
                                    CheckType = reader["CHECK_TYPE"] is DBNull ? false : Convert.ToInt32(reader["CHECK_TYPE"]) == 1,
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
                    }
                }
            }
            catch (Exception ex)
            {
                throw ex;
            }

            return Data;
        }


        public List<User_data> Daily_Manday_Report_LockStatus(string region, string dept, string category, string s_date, string t_date)
        {

            List<User_data> Data = new List<User_data>();
            try
            {

                //string sql = "select * from MANDAY_INPUT where FILL_DATE between '"+ s_date + "' and '"+t_date+"'";


                //if (dept != null && dept.Length > 0)
                //{
                //    sql += " AND DEPARTMENT IN (" + string.Join(",", dept.Select(d => "@" + d)) + ")";
                //}

                //if (region!="ALL")
                //{
                //    sql += " AND REGION = '" + region + "'";
                //}
                //SqlConnection connection = new SqlConnection(objconfig);
                //connection.Open();
                //SqlCommand cmd = new SqlCommand(sql, connection);

                //cmd.CommandText = sql;

                //SqlDataReader reader = cmd.ExecuteReader();
                // SqlDataReader dr = cmd.ExecuteReader();
                //  string sql = "SELECT * FROM MANDAY_INPUT WHERE FILL_DATE BETWEEN '" + s_date + "' AND '" + t_date + "'";
                string sql = "SELECT[MANDAY_INPUT].[ID],[REGION],[DEPARTMENT],[EMP_NAME],[EMP_NO], " +
         "[FILL_DATE],[LT_H],[CATEGORY],PROJECT_LIST.[PROJECT_NAME],[REQUIREMENT_NAME], " +
         "[CONTENT_NAME],[MANDAY_INPUT].[REMARK],[CHECK_TYPE],[LOCK],[CREATED_DATE], " +
         "[CREATED_TIME],[CREATED_BY],[UPDATED_DATE],[UPDATED_TIME],[UPDATED_BY] " +
         "FROM [PMO_ITMANPOWER_INPUT].[dbo].[MANDAY_INPUT] " +
         "LEFT JOIN PROJECT_LIST ON MANDAY_INPUT.PROJECT_NAME = PROJECT_LIST.PROJECT_NO WHERE FILL_DATE BETWEEN '" + s_date + "' AND '" + t_date + "'";

                // Check if region is not 'ALL'
                if (region != "ALL")
                {
                    sql += " AND REGION = '" + region + "'";
                }
                if (category != "ALL")
                {
                    sql += " AND CATEGORY = @Category";
                }


                if (dept != "ALL")
                {
                     sql += " AND DEPARTMENT IN(N'" + dept + "')";
                    //string[] departments = dept.Split(','); // Splitting multiple departments
                    //StringBuilder deptBuilder = new StringBuilder();

                    //// Append 'N' prefix to each department
                    //foreach (string department in departments)
                    //{
                    //    deptBuilder.Append("N" + department + ",");
                    //}

                    //// Remove the trailing comma
                    //deptBuilder.Length--;

                    //sql += " AND DEPARTMENT IN (" + deptBuilder.ToString() + ")";
                }

                SqlConnection connection = new SqlConnection(objconfig);
                connection.Open();
                SqlCommand cmd = new SqlCommand(sql, connection);
                if (category != "ALL")
                {
                    cmd.Parameters.AddWithValue("@Category", category);
                }

                //cmd.Parameters.AddWithValue("@StartDate", s_date);
                // cmd.Parameters.AddWithValue("@EndDate", t_date);

                // Add region parameters if not 'ALL'
                //if (region != "ALL")
                //{
                //    cmd.Parameters.AddWithValue("@Region", region);
                //}
                //if (category != "ALL")
                //{
                //    cmd.Parameters.AddWithValue("@Category", category);
                //}

                //// Add parameters for each department
                //if (dept != null)
                //{

                //   cmd.Parameters.AddWithValue("@Department", dept);

                //}

                SqlDataReader reader = cmd.ExecuteReader();
                while (reader.Read())
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
                        //Lock = (reader["LOCK"] as int?) == 1 ? true : false
                        Lock = reader["LOCK"] is DBNull ? false : Convert.ToInt32(reader["LOCK"]) == 1 ? true : false,
                        CheckType = reader["CHECK_TYPE"] is DBNull ? false : Convert.ToInt32(reader["CHECK_TYPE"]) == 1 ? true : false,
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

        public List<string> Lock_Manday_input(string region, string department, string emp_No, string Category,string project_name, DateTime start_date, DateTime end_date, bool? loc)
        {
            List<string> lstUser = new List<string>();

            using (SqlConnection connection = new SqlConnection(objconfig))
            {
                string lockValue = loc.HasValue && loc.Value ? "1" : "0"; 

                string sql = "UPDATE MANDAY_INPUT SET LOCK = @LockValue WHERE FILL_DATE BETWEEN @StartDate AND @EndDate";

                // Add conditions for department and emp_Name if they are provided
                //if (!string.IsNullOrEmpty(department))
                //{
                //    sql += " AND DEPARTMENT = @Department";
                //}

                //if (!string.IsNullOrEmpty(emp_No))
                //{
                //    sql += " AND EMP_NO = @EmpNo";
                //}
                //if (!string.IsNullOrEmpty(Category))
                //{
                //    sql += " AND CATEGORY = @Category";
                //}
               

                if (region != "ALL")
                {
                    sql += " AND REGION = '" + region + "'";
                }
                if (Category != "ALL")
                {
                    sql += " AND CATEGORY = @Category";
                }

                if (department != "ALL")
                {
                    sql += " AND DEPARTMENT IN(N'" + department + "')";
                }
                if (emp_No != "ALL")
                {
                    sql += " AND EMP_NO IN('" + emp_No + "')";
                }
                if (!string.IsNullOrEmpty(project_name))
                {
                    sql += " AND PROJECT_NAME ='"+project_name+"'";
                }
                SqlCommand command = new SqlCommand(sql, connection);
                command.Parameters.AddWithValue("@LockValue", lockValue);
              //  command.Parameters.AddWithValue("@Region", region);

                
                command.Parameters.AddWithValue("@StartDate", start_date);
                command.Parameters.AddWithValue("@EndDate", end_date);


                if (Category != "ALL")
                {
                    command.Parameters.AddWithValue("@Category", Category);
                }
                // Add parameters for department and emp_Name if they are provided
                //if (!string.IsNullOrEmpty(department))
                //{
                //    command.Parameters.AddWithValue("@Department", department);
                //}

                //if (!string.IsNullOrEmpty(emp_No))
                //{
                //    command.Parameters.AddWithValue("@EmpNo", emp_No);
                //}
                //if (!string.IsNullOrEmpty(Category))
                //{
                //    command.Parameters.AddWithValue("@Category", Category);
                //}
                //if (!string.IsNullOrEmpty(Category))
                //{
                //    command.Parameters.AddWithValue("@Project_name", project_name);
                //}
                try
                {
                    connection.Open();
                    int rowsAffected = command.ExecuteNonQuery();

                    if (rowsAffected > 0)
                    {
                        lstUser.Add("Success");
                    }
                    else
                    {
                        lstUser.Add("Failed");
                    }
                }
                catch (Exception ex)
                {
                    lstUser.Add("Failed: " + ex.Message); // Add more detailed error handling as needed
                }
            }

            return lstUser;
        }

        public List<User_data> GetMissingInputEmployees(DateTime startDate, DateTime endDate, string region)
        {
            List<User_data> employees = new List<User_data>();
           // OracleConnection con = new OracleConnection(objconfig);
            SqlConnection connection = new SqlConnection(objconfig);

            connection.Open();

            string sql = @"SELECT DISTINCT IT.EMP_NO,IT.EMP_NAME ,IT.DEPARTMENT, IT.REGION, Dates.FILL_DATE
FROM IT_MEMBER IT
CROSS JOIN (
    SELECT DISTINCT FILL_DATE
    FROM MANDAY_INPUT
    WHERE FILL_DATE BETWEEN @StartDate AND @EndDate
) AS Dates
LEFT JOIN MANDAY_INPUT MI ON IT.EMP_NO = MI.EMP_NO AND IT.REGION = MI.REGION AND Dates.FILL_DATE = MI.FILL_DATE
LEFT JOIN DM_CALENDAR_S HL ON IT.REGION = HL.REGION AND Dates.FILL_DATE = HL.HOLIDAY_DATE
WHERE IT.REGION = @Region AND IT.MAN_DS=1
    AND (MI.FILL_DATE IS NULL AND HL.REGION IS NULL);";
            SqlCommand command = new SqlCommand(sql, connection);

            command.Parameters.AddWithValue("@StartDate", startDate);
            command.Parameters.AddWithValue("@EndDate", endDate);
            command.Parameters.AddWithValue("@Region", region);

            SqlDataReader reader = command.ExecuteReader();

            while (reader.Read())
            {
                employees.Add(new User_data
                {
                  //  ID = reader.GetInt32(reader.GetOrdinal("ID")),
                    Region = reader["REGION"] as string,
                    Department = reader["DEPARTMENT"] as string,
                    EmployeeName = reader["EMP_NAME"] as string,
                    EmployeeNumber = reader["EMP_NO"] as string,
                    FillDate = reader.IsDBNull(reader.GetOrdinal("FILL_DATE")) ? (DateTime?)null : reader.GetDateTime(reader.GetOrdinal("FILL_DATE")),
                });



            }

            return employees;


        }

        public List<User_data> GetMissingInputTiming(DateTime startDate, DateTime endDate, string region)
        {
            List<User_data> employees = new List<User_data>();

            SqlConnection connection = new SqlConnection(objconfig);

            connection.Open();

            string sql = @"SELECT MI.REGION, MI.DEPARTMENT, MI.EMP_NAME, MI.EMP_NO, MI.FILL_DATE, SUM(MI.LT_H) AS TOTAL_LT_H
FROM MANDAY_INPUT MI
LEFT JOIN DM_CALENDAR_S HL ON MI.REGION = HL.REGION AND MI.FILL_DATE = HL.HOLIDAY_DATE
WHERE MI.REGION = @Region
  AND HL.HOLIDAY_DATE IS NULL 
  AND MI.FILL_DATE BETWEEN @StartDate AND @EndDate
GROUP BY MI.REGION, MI.DEPARTMENT, MI.EMP_NAME, MI.EMP_NO, MI.FILL_DATE
HAVING SUM(MI.LT_H) < 8;";

//            string sql = @"SELECT MI.REGION, MI.DEPARTMENT, MI.EMP_NAME, MI.EMP_NO, MI.FILL_DATE, SUM(MI.LT_H) AS TOTAL_LT_H
//FROM MANDAY_INPUT MI
//WHERE MI.REGION = @Region   
//  AND MI.FILL_DATE BETWEEN @StartDate AND @EndDate
//GROUP BY MI.REGION, MI.DEPARTMENT, MI.EMP_NAME, MI.EMP_NO, MI.FILL_DATE
//HAVING SUM(MI.LT_H) < 8;";
            SqlCommand command = new SqlCommand(sql, connection);

            command.Parameters.AddWithValue("@StartDate", startDate);
            command.Parameters.AddWithValue("@EndDate", endDate);
            command.Parameters.AddWithValue("@Region", region);

            SqlDataReader reader = command.ExecuteReader();

            while (reader.Read())
            {
                employees.Add(new User_data
                {
                   // ID = reader.GetInt32(reader.GetOrdinal("ID")),
                    Region = reader["REGION"] as string,
                    Department = reader["DEPARTMENT"] as string,
                    EmployeeName = reader["EMP_NAME"] as string,
                    EmployeeNumber = reader["EMP_NO"] as string,
                    FillDate = reader.IsDBNull(reader.GetOrdinal("FILL_DATE")) ? (DateTime?)null : reader.GetDateTime(reader.GetOrdinal("FILL_DATE")),
                    //  LtH = reader.IsDBNull(reader.GetOrdinal("LT_H")) ? (int?)null : reader.GetInt32(reader.GetOrdinal("LT_H")),
                    LtH = reader.IsDBNull(reader.GetOrdinal("TOTAL_LT_H")) ? (float?)null : (float)reader.GetDouble(reader.GetOrdinal("TOTAL_LT_H"))


                });



            }

            return employees;


        }

    
    
        public string GetDepartmentHeadEmail(string dept)
        {
            string res = "";
            string sql = "SELECT i.EMAIL FROM [PMO_ITMANPOWER_INPUT].[dbo].[RIGHTS_LIST] r join IT_MEMBER i  on r.ACCOUNT=i.ACCOUNT where r.ASSIGNED_DEPT='"+dept+"' ";
            SqlConnection connection = new SqlConnection(objconfig);
            connection.Open();
            SqlCommand cmd = new SqlCommand(sql, connection);
            cmd.CommandText = sql;

            SqlDataReader reader = cmd.ExecuteReader();
            while (reader.Read())
            {
                res = reader["EMAIL"].ToString();
            }
            return res;
        }

        public string Send_Mail(string Email, string subject,string body)
        {

            string res = "";

            try
            {

                var smtpPort = 25;
                var smtpUsername = "IT - announcement@in.apachefootwear.com";
                var smtpPassword = "it-123456";
                var senderEmail = "IT - announcement@in.apachefootwear.com";
                var recipientEmail = Email; // Change to the recipient's email address

                string mailBody = body;
               /* var message = new MailMessage(senderEmail, recipientEmail)
                {

                    Subject = subject,
                    IsBodyHtml = true,
                    Body = mailBody
                };*/

                MailMessage mail = new MailMessage
                {
                    From = new MailAddress(senderEmail, "IT MANDAY INCOMPLETE INPUT")
                };
                mail.To.Add(recipientEmail);
                mail.Subject = subject;
                mail.Body = body;
                mail.IsBodyHtml = true;

                // Configure SMTP client and send the email
                var smtpClient = new SmtpClient()
                {
                    Host = "10.3.0.254",
                    Port = smtpPort,
                    Credentials = new NetworkCredential(smtpUsername, smtpPassword),
                    EnableSsl = true // Use SSL if required
                };
                ServicePointManager.ServerCertificateValidationCallback =
                (sender, certificate, chain, sslPolicyErrors) => true;


                smtpClient.Send(mail);
                 res = "success";
                //lblmsg.Text = "Mail Send .......";
            }
            catch (Exception ex)
            {

                // Response.Write(ex.Message);
            }

            return res;
        }

        //public List<string> Insert_Holiday_details(string region, string h_type,int?h_length, DateTime? H_date, string created_user)
        //{
        //    List<string> lstUser = new List<string>();
        //    List<ITMember> user_dept = new List<ITMember>();
        //    user_dept = GET_USER(created_user);
        //    string created_dept = user_dept[0].Department;

        //    SqlConnection connection = new SqlConnection(objconfig);
        //    connection.Open();
        //  // string sql1 = "select * from DM_CALENDAR_S where REGION='" + region + "' and HOLIDAY_TYPE='" + h_type + "' and HOLIDAY_DATE='" + H_date + "'";
        //    string sql1 = "select * from DM_CALENDAR_S where REGION='" + region + "' and HOLIDAY_DATE='" + H_date + "'";
        //    SqlCommand cmd = new SqlCommand(sql1, connection);
        //    SqlDataReader sdr = cmd.ExecuteReader();

        //    if (sdr.Read() == true)
        //    {

        //        lstUser.Add("registered");
        //    }
        //    else
        //    {
        //        sdr.Close();
        //        string sql = @"INSERT INTO DM_CALENDAR_S( REGION, HOLIDAY_TYPE,HOLIDAY_LENGTH,HOLIDAY_DATE,CREATED_DEPT,CREATED_USER,LAST_USER,LAST_DATE) 
        //                  VALUES ( @REGION, @HOLIDAY_TYPE,@HOLIDAY_LENGTH,@HOLIDAY_DATE,@CREATED_DEPT,@CREATED_USER,@LAST_USER,CONVERT(varchar, GETDATE(), 23))";

        //        using (SqlCommand command = new SqlCommand(sql, connection))
        //        {
        //            //command.Parameters.AddWithValue("@ID", Id);
        //            command.Parameters.AddWithValue("@REGION", region);
        //            command.Parameters.AddWithValue("@HOLIDAY_TYPE", h_type);
        //            command.Parameters.AddWithValue("@HOLIDAY_LENGTH", h_length);
        //            command.Parameters.AddWithValue("@HOLIDAY_DATE", H_date);
        //            command.Parameters.AddWithValue("@CREATED_DEPT", created_dept);
        //            command.Parameters.AddWithValue("@CREATED_USER", created_user);
        //            command.Parameters.AddWithValue("@LAST_USER", created_user);



        //            int rowsAffected = command.ExecuteNonQuery();
        //            connection.Close();

        //            if (rowsAffected > 0)
        //            {
        //                lstUser.Add("Success");
        //            }
        //            else
        //            {
        //                lstUser.Add("Failed");
        //            }
        //        }
        //    }

        //    return lstUser;
        //}
        public List<InsertResult> Insert_Holiday_details(string region, string h_type, int? h_length, DateTime? H_date, string created_user)
        {
            //List<string> lstUser = new List<string>();
            List<string> regionsToInsert = new List<string>();
            List<ITMember> user_dept = new List<ITMember>();
            user_dept = GET_USER(created_user);
                string created_dept = user_dept[0].Department;
            // Check if the region is "ALL"

            List<InsertResult> resultList = new List<InsertResult>();
            if (region.ToUpper() == "ALL")
            {
                // If region is "ALL", insert for all regions (APC, APH, APE, GROUP)
                regionsToInsert.Add("APC");
                regionsToInsert.Add("APH");
                regionsToInsert.Add("APE");
                regionsToInsert.Add("GROUP");
            }
            else
            {
                // If region is not "ALL", insert only for the specified region
                regionsToInsert.Add(region);
            }

            // Open connection
            using (SqlConnection connection = new SqlConnection(objconfig))
            {
                connection.Open();

                foreach (string reg in regionsToInsert)
                {
                    // Check if the holiday date already exists for the current region
                    string sqlCheck = "SELECT COUNT(*) FROM DM_CALENDAR_S WHERE REGION = @REGION AND HOLIDAY_DATE = @HOLIDAY_DATE";
                    SqlCommand cmdCheck = new SqlCommand(sqlCheck, connection);
                    cmdCheck.Parameters.AddWithValue("@REGION", reg);
                    cmdCheck.Parameters.AddWithValue("@HOLIDAY_DATE", H_date);

                    int count = (int)cmdCheck.ExecuteScalar();

                    if (count > 0)
                    {
                        // If the holiday date already exists for the region, add "registered" message
                      //  resultList.Add(" " + reg);
                        resultList.Add(new InsertResult { Result = "exist", Region = reg });
                    }
                    else
                    {
                        // If the holiday date does not exist, insert the holiday details for the region
                        string sql = @"INSERT INTO DM_CALENDAR_S(REGION, HOLIDAY_TYPE, HOLIDAY_LENGTH, HOLIDAY_DATE, CREATED_DEPT, CREATED_USER, LAST_USER, LAST_DATE) 
                               VALUES (@REGION, @HOLIDAY_TYPE, @HOLIDAY_LENGTH, @HOLIDAY_DATE, @CREATED_DEPT, @CREATED_USER, @LAST_USER, CONVERT(varchar, GETDATE(), 23))";
                        SqlCommand cmd = new SqlCommand(sql, connection);
                        cmd.Parameters.AddWithValue("@REGION", reg);
                        cmd.Parameters.AddWithValue("@HOLIDAY_TYPE", h_type);
                        cmd.Parameters.AddWithValue("@HOLIDAY_LENGTH", h_length ?? (object)DBNull.Value); // Handle nullable int
                        cmd.Parameters.AddWithValue("@HOLIDAY_DATE", H_date);
                        cmd.Parameters.AddWithValue("@CREATED_DEPT", created_dept);
                        cmd.Parameters.AddWithValue("@CREATED_USER", created_user);
                        cmd.Parameters.AddWithValue("@LAST_USER", created_user);

                        int rowsAffected = cmd.ExecuteNonQuery();

                        if (rowsAffected > 0)
                        {
                            resultList.Add(new InsertResult { Result = "Success", Region = reg });

                           
                        }
                        else
                        {
                            resultList.Add(new InsertResult { Result = "Failed", Region = reg });
                          
                        }
                    }
                }
            }

            return resultList;
        }

        public List<string> Update_Holiday_details(int? ID, string Region, string h_type, DateTime? h_date,string last_user)
        {
            List<string> lstUser = new List<string>();
           

            using (SqlConnection connection = new SqlConnection(objconfig))
            {
                
                string sql = @"UPDATE DM_CALENDAR_S SET REGION = @REGION, HOLIDAY_TYPE = @HOLIDAY_TYPE, HOLIDAY_DATE = @HOLIDAY_DATE,LAST_USER=@LAST_USER,LAST_DATE=getdate()
                 WHERE ID=@Id ";

                using (SqlCommand command = new SqlCommand(sql, connection))
                {

                    command.Parameters.AddWithValue("@REGION", Region);
                    command.Parameters.AddWithValue("@HOLIDAY_TYPE", h_type);
                    command.Parameters.AddWithValue("@Id", ID);

                    command.Parameters.AddWithValue("@HOLIDAY_DATE", h_date);
                    command.Parameters.AddWithValue("@LAST_USER", last_user);
                  

                    connection.Open();
                    int rowsAffected = command.ExecuteNonQuery();
                    connection.Close();

                    if (rowsAffected > 0)
                    {
                        lstUser.Add("Success");
                    }
                    else
                    {
                        lstUser.Add("Failed");
                    }
                }
            }

            return lstUser;
        }


        public List<string> Delete_Holiday(int? Id)
        {
            List<string> lstUser = new List<string>();


            using (SqlConnection connection = new SqlConnection(objconfig))
            {
                string sql = @"DELETE DM_CALENDAR_S WHERE ID=@Id ";

                using (SqlCommand command = new SqlCommand(sql, connection))
                {

                   // command.Parameters.AddWithValue("@FillDate", FillDate);
                  //  command.Parameters.AddWithValue("@Emp_NO", Emp_no);
                    command.Parameters.AddWithValue("@Id", Id);

                    connection.Open();
                    int rowsAffected = command.ExecuteNonQuery();
                    connection.Close();

                    if (rowsAffected > 0)
                    {
                        lstUser.Add("Success");
                    }
                    else
                    {
                        lstUser.Add("Locked");
                    }
                }
            }

            return lstUser;
        }


        public List<string> GetCompanyByRight(string account)
        {

            List<string> lsop = new List<string>();
            SqlConnection connection = new SqlConnection(objconfig);
            connection.Open();
            SqlCommand cmd = new SqlCommand();
            cmd.Connection = connection;
            cmd.CommandType = CommandType.StoredProcedure;
            cmd.CommandText = "SP_GET_REGION";
            cmd.Parameters.AddWithValue("@ACCOUNT", account);
            cmd.ExecuteNonQuery();
            SqlDataAdapter sda1 = new SqlDataAdapter(cmd);
            DataTable dt = new DataTable();
            sda1.Fill(dt);
            connection.Close();
            string Result = JsonConvert.SerializeObject(dt);

            lsop.Add(Result);
            return lsop;
        }

        public List<string> GetREGIONByRight(string account)
        {
            List<string> regions = new List<string>();

            using (SqlConnection connection = new SqlConnection(objconfig))
            {
                connection.Open();
                using (SqlCommand cmd = new SqlCommand("SP_GET_REGION", connection))
                {
                    cmd.CommandType = CommandType.StoredProcedure;
                    cmd.Parameters.AddWithValue("@ACCOUNT", account);

                    using (SqlDataReader reader = cmd.ExecuteReader())
                    {
                        while (reader.Read())
                        {
                            string region = reader["REGION"].ToString();
                            regions.Add(region);
                        }
                    }
                }
            }

            return regions;
        }
        public List<string> GetDEPTSByRight(string Account, string Assigned_region)
        {
            List<string> departments = new List<string>();

            using (SqlConnection connection = new SqlConnection(objconfig))
            {
                connection.Open();
                using (SqlCommand cmd = new SqlCommand("SP_GET_DEPARTMENTS", connection))
                {
                    cmd.CommandType = CommandType.StoredProcedure;
                    cmd.Parameters.AddWithValue("@Account", Account);
                    cmd.Parameters.AddWithValue("@Region", Assigned_region);

                    using (SqlDataReader reader = cmd.ExecuteReader())
                    {
                        while (reader.Read())
                        {
                            string department = reader["DEPARTMENT"].ToString();
                            departments.Add(department);
                        }
                    }
                }
            }

            return departments;
        }
        public List<string> GetEMPLOYEE_NUMBERRegionAndRight(string Region, string Department, string Account)
        {
            List<string> employeeNumbers = new List<string>();

            using (SqlConnection connection = new SqlConnection(objconfig))
            {
                connection.Open();
                using (SqlCommand cmd = new SqlCommand("SP_GET_EMPLOYEE_NUMBER", connection))
                {
                    cmd.CommandType = CommandType.StoredProcedure;
                    cmd.Parameters.AddWithValue("@ACCOUNT", Account);
                    cmd.Parameters.AddWithValue("@Region", Region);
                    cmd.Parameters.AddWithValue("@Department", Department);

                    using (SqlDataReader reader = cmd.ExecuteReader())
                    {
                        while (reader.Read())
                        {
                            string empNo = reader["EMP_NO"].ToString();
                            employeeNumbers.Add(empNo);
                        }
                    }
                }
            }

            return employeeNumbers;
        }

        public List<ITMember> GetEMPLOYEE_NAME_NUMBERRegionAndRight(string Region, string Department, string Account)
        {
            List<ITMember> employees = new List<ITMember>();

            using (SqlConnection connection = new SqlConnection(objconfig))
            {
                connection.Open();
                using (SqlCommand cmd = new SqlCommand("SP_GET_EMPLOYEE_NAME_NUMBER", connection))
                {
                    cmd.CommandType = CommandType.StoredProcedure;
                    cmd.Parameters.AddWithValue("@ACCOUNT", Account);
                    cmd.Parameters.AddWithValue("@Region", Region);
                    cmd.Parameters.AddWithValue("@Department", Department);

                    using (SqlDataReader reader = cmd.ExecuteReader())
                    {
                        while (reader.Read())
                        {
                            ITMember employee = new ITMember();
                            employee.EmployeeNumber = reader["EMP_NO"].ToString();
                            employee.EmployeeName = reader["EMP_NAME"].ToString();
                            employee.Region = reader["REGION"].ToString();
                            employee.Department = reader["DEPARTMENT"].ToString();
                            employees.Add(employee);
                        }
                    }
                }
            }

            return employees;
        }
        public List<string> GetDepartmentsByRight(string Account,string Assigned_region)
        {
            List<string> lsop = new List<string>();
            SqlConnection connection = new SqlConnection(objconfig);
            connection.Open();
            SqlCommand cmd = new SqlCommand();
            cmd.Connection = connection;
            cmd.CommandType = CommandType.StoredProcedure;
            cmd.CommandText = "SP_GET_DEPARTMENTS";
            cmd.Parameters.AddWithValue("@Account", Account);
            cmd.Parameters.AddWithValue("@Region", Assigned_region);
            cmd.ExecuteNonQuery();
            SqlDataAdapter sda1 = new SqlDataAdapter(cmd);
            DataTable dt = new DataTable();
            sda1.Fill(dt);
            connection.Close();
            string Result = JsonConvert.SerializeObject(dt);

            lsop.Add(Result);
            return lsop;
        }

        public List<string> GetEmpNosByRegion(string Region,string Department)
        {
            string connectionString = objconfig;

            string sql = "SELECT DISTINCT EMP_NO FROM IT_MEMBER WHERE DEPARTMENT=@Department and REGION = @Region";

            List<string> emp_barcodes = new List<string>();

            using (SqlConnection connection = new SqlConnection(connectionString))
            {
                using (SqlCommand cmd = new SqlCommand(sql, connection))
                {
                    cmd.Parameters.AddWithValue("@Region", Region);
                    cmd.Parameters.AddWithValue("@Department", Department);

                    try
                    {
                        connection.Open();
                        using (SqlDataReader reader = cmd.ExecuteReader())
                        {
                            while (reader.Read())
                            {
                                emp_barcodes.Add(reader["EMP_NO"].ToString());
                            }
                        }
                    }
                    catch (SqlException ex)
                    {
                        Console.WriteLine("Error retrieving departments: " + ex.Message);
                    }
                }
            }

            return emp_barcodes;
        }
        public List<string> GetEmpNosByRegionAndRight(string Region, string Department,string Account)
        {
            List<string> lsop = new List<string>();
            SqlConnection connection = new SqlConnection(objconfig);
            connection.Open();
            SqlCommand cmd = new SqlCommand();
            cmd.Connection = connection;
            cmd.CommandType = CommandType.StoredProcedure;
            cmd.CommandText = "SP_GET_EMPLOYEE_NUMBER";
            cmd.Parameters.AddWithValue("@ACCOUNT", Account);
            cmd.Parameters.AddWithValue("@Region", Region);
            cmd.Parameters.AddWithValue("@Department", Department);
            cmd.ExecuteNonQuery();
            SqlDataAdapter sda1 = new SqlDataAdapter(cmd);
            DataTable dt = new DataTable();
            sda1.Fill(dt);
            connection.Close();
            string Result = JsonConvert.SerializeObject(dt);

            lsop.Add(Result);
            return lsop;
        }
    }
}