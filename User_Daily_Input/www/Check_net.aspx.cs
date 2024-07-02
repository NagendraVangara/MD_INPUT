using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;

namespace User_Daily_Input.www
{
    public partial class Check_net : System.Web.UI.Page
    {
        protected void Page_Load(object sender, EventArgs e)
        {
            string createdIp = string.Empty;
            if (!IsPostBack)
            {
                //string hostName = Dns.GetHostName();
                //IPHostEntry hostEntry = Dns.GetHostEntry(hostName);
                //foreach (IPAddress ip in hostEntry.AddressList)
                //{
                //    if (ip.AddressFamily == AddressFamily.InterNetwork)
                //    {
                //        createdIp = ip.ToString();
                //        break;
                //    }
                //}
                if (HttpContext.Current.Request.ServerVariables["HTTP_VIA"] != null)
                {
                    createdIp = HttpContext.Current.Request.ServerVariables["HTTP_X_FORWARDED_FOR"].ToString();
                }
                else
                {
                    createdIp = HttpContext.Current.Request.ServerVariables["REMOTE_ADDR"].ToString();
                }
                //GET_IP = createdIp.ToString();

                Response.Write(createdIp);
                Response.End();
            }
        }
    }
}