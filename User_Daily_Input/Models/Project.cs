using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace User_Daily_Input.Models
{
    public class Project
    {
        public int ID { get; set; }
        public string PROJECT_NAME { get; set; }
        public string PROJECT_NO { get; set; }
        public string IT_PM { get; set; }
        public string IT_PM_REGION { get; set; }
        public DateTime? START_DATE { get; set; }
        public DateTime? EX_GO_LIVE_DATE { get; set; }
        public DateTime? EXIT_DATE { get; set; }
        public string STATUS { get; set; }
        public string REMARK { get; set; }
    }
}