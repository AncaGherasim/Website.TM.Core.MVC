using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using MVC_TM.Infrastructure;
using MVC_TM.Models;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Threading.Tasks;

namespace MVC_TM.Controllers
{
    public class BuildYourOwnVacationController : Controller
    {
        private readonly AppSettings _appSettings;
        private readonly DapperWrap _dapperWrap;

        public BuildYourOwnVacationController(IOptions<AppSettings> appSettings, DapperWrap dapperWrap)
        {
            _appSettings = appSettings.Value;
            _dapperWrap = dapperWrap;
        }

        [HttpGet("/build_your_own_vacation", Name = "Build_Your_Own_Vacation_Route")]
        [HttpGet("/advanced_build_your_own_vacation", Name = "Advanced_Build_Your_Own_Vacation_Route")]
        [HttpHead("/build_your_own_vacation", Name = "Build_Your_Own_Vacation_Route")]
        [HttpHead("/advanced_build_your_own_vacation", Name = "Advanced_Build_Your_Own_Vacation_Route")]
        [HttpPost("/build_your_own_vacation", Name = "Build_Your_Own_Vacation_Route")]
        [HttpPost("/advanced_build_your_own_vacation", Name = "Advanced_Build_Your_Own_Vacation_Route")]
        public async Task<IActionResult> Index()
        {
            HttpContext.Response.Headers.Add("_utPg", "GenericBYO");

            Models.ViewModels.HomeViewModel viewmodelHome = new Models.ViewModels.HomeViewModel();

            ViewBag.PageType = "BYOPage";
            ViewBag.PageTitle = "Design your own vacation packages | Tripmasters";
            ViewBag.pageMetaDesc = "Design vacation packages on your own. Select world destinations and build your dream desired vacation. Custom vacation packages, easy book it, easy traveling.";
            ViewBag.pageMetaKey = "Design, Build, Your Own, Vacation, Vacations, Packages, Travel, Custom";

            List<NumberofCustomerFeedbacks> overAllReviews;
            var Result3 = await _dapperWrap.GetRecords<NumberofCustomerFeedbacks>(SqlCalls.SQL_Get_NumberofCustomerFeedbacks_OverAllScore());
            overAllReviews = Result3.ToList();
            viewmodelHome.NumComments = overAllReviews.First().NumComments;
            viewmodelHome.Score = overAllReviews.First().Score;

            if (Utilities.CheckMobileDevice() == false)
            {
                if (ControllerContext.ActionDescriptor.AttributeRouteInfo.Name.ToLower() == "build_your_own_vacation_route")
                {
                    return View("GenericBYO", viewmodelHome);
                }
                else
                {
                    return View("GenericBYOAdvanced", viewmodelHome);
                }

            }
            else
            {
                return View("GenericBYOMob", viewmodelHome);
            }
        }
    }
}
