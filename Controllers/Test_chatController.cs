using Microsoft.AspNetCore.Mvc;
using MVC_TM.Infrastructure;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Options;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace MVC_TM.Controllers
{
    public class Test_chatController : Controller
    {
        private readonly AppSettings _appSettings;
        private readonly DapperWrap _dapperWrap;
        private readonly IWebHostEnvironment _hostingEnvironment;

        public Test_chatController(IOptions<AppSettings> appsettings, DapperWrap dapperWrap, IWebHostEnvironment hostingEnvironment)
        {
            _appSettings = appsettings.Value;
            _dapperWrap = dapperWrap;
            _hostingEnvironment = hostingEnvironment;
        }

        [HttpGet("/test_chat_message", Name = "Test_chatMessage_Route")]
        public IActionResult Test_chatMessage()
        {
            HttpContext.Response.Headers.Add("_utPg", "Test_chatMessage");

            if (Utilities.CheckMobileDevice() == false)
            {
                ViewBag.Mobile = 0;
            }
            else
            {
                ViewBag.Mobile = 1;
            }
            return View("Test_chatMessage");
        }

        [HttpGet("/test_chat", Name = "Test_chat_Route")]
        public IActionResult Test_chat()
        {
            HttpContext.Response.Headers.Add("_utPg", "Test_chat");

            if (Utilities.CheckMobileDevice() == false)
            {
                ViewBag.Mobile = 0;
            }
            else
            {
                ViewBag.Mobile = 1;
            }
            return View("Test_chat");
        }
    }
}
