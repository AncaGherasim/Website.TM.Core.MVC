using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using MVC_TM.Infrastructure;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Options;

namespace MVC_TM.Controllers
{
    public class MarketingController : Controller
    {
        private readonly AppSettings _appSettings;
        private readonly DapperWrap _dapperWrap;
        private readonly IWebHostEnvironment _hostingEnvironment;

        public MarketingController(IOptions<AppSettings> appsettings, DapperWrap dapperWrap, IWebHostEnvironment hostingEnvironment)
        {
            _appSettings = appsettings.Value;
            _dapperWrap = dapperWrap;
            _hostingEnvironment = hostingEnvironment;
        }
        [HttpGet("/manage_subscription", Name = "ManageSubscription_Route")]
        [HttpHead("/manage_subscription", Name = "ManageSubscription_Route")]
        [HttpPost("/manage_subscription", Name = "ManageSubscription_Route")]
        public IActionResult ManageSubscription()
        {
            if (Utilities.CheckMobileDevice() == false)
            {
                ViewBag.Mobile = 0;
            }
            else
            {
                ViewBag.Mobile = 1;
            }
            return View("Manage_Subscription");
        }
    }
}
