using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using MVC_TM.Infrastructure;
using Microsoft.Extensions.Configuration;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Options;
using MVC_TM.Models;
using MVC_TM.Models.ViewModels;
using System.Xml;
using System.Text;
using Dapper;
using System.Data;
using System.Data.SqlClient;

namespace MVC_TM.Views.ViewComponents
{
    public class UC_TM_ResponsiveCalendarViewComponent : ViewComponent
    {
        public IViewComponentResult Invoke()
        {
            return View("Index");
        }

    }
}
