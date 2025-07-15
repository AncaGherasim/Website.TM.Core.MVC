using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;
using MVC_TM.Infrastructure;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace MVC_TM.Controllers
{
    public class CheckBookingForReviewController : Controller
    {
        private readonly AppSettings _appSettings;
        private readonly DapperWrap _dapperWrap;

        public CheckBookingForReviewController(IOptions<AppSettings> appSettings, DapperWrap dapperWrap)
        {
            _appSettings = appSettings.Value;
            _dapperWrap = dapperWrap;
        }
        [HttpGet("CheckBookingForReview")]
        [HttpHead("CheckBookingForReview")]
        [HttpPost("CheckBookingForReview")]
        public async Task<IActionResult> Index()
        {
            if (Utilities.CheckMobileDevice() == false)
            {
                return View("CheckBookingForReview");
            }
            else
            {
                return View("CheckBookingForReviewMob");
            }
        }
    }
}
