using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;
using MVC_TM.Infrastructure;
using MVC_TM.Models;
using Newtonsoft.Json;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Threading.Tasks;

namespace MVC_TM.Controllers
{
    public class VacationPackagesController : Controller

    {
        private readonly AppSettings _appSettings;
        private readonly DapperWrap _dapperWrap;
        private readonly IWebHostEnvironment _webHostEnvironment;

        public VacationPackagesController(IOptions<AppSettings> appSettings, DapperWrap dapperWrap, IWebHostEnvironment webHostEnvironment)
        {
            _appSettings = appSettings.Value;
            _dapperWrap = dapperWrap;
            _webHostEnvironment = webHostEnvironment;
        }

        [TypeFilter(typeof(CheckCacheFilter))]
        [HttpGet("/vacation-packages", Name = "VacationPackages_Route")]
        [HttpHead("/vacation-packages", Name = "VacationPackages_Route")]
        [HttpPost("/vacation-packages", Name = "VacationPackages_Route")]
        public async Task<IActionResult> IndexAsync()
        {
            if (HttpContext.Response.Headers.ContainsKey("_utPg"))
            {
                ViewBag._utPg = "VACPACKS";
            }
            else
            {
                HttpContext.Response.Headers.Add("_utPg", "VACPACKS");
                ViewBag._utPg = "VACPACKS";
            }

            if (Utilities.CheckMobileDevice() == false)
            {
                ViewBag.Mobile = 0;
            }
            else
            {
                ViewBag.Mobile = 1;
            }

            ViewBag.PageType = "VacPackPage";
            ViewBag.PageTitle = "Ideas for Vacation Packages | Tripmasters";
            ViewBag.pageMetaDesc = "Vacation package ideas: find and customize vacation packages to Europe, Asia, and the Americas. Plan your next trip with Tripmasters.";
            ViewBag.pageMetaKey = "Vacations, Packages, Deals, Tours, Travel, Popular vacations, Custom, Best, Trips, Europe, Asia, Latin America";
            ViewBag.Canonical = "https://www.tripmasters.com/vacation-packages";
            ViewBag.tmpagetype = "vacationpackages";
            ViewBag.tmpagetypeinstance = "";
            ViewBag.tmrowid = "";
            ViewBag.tmadstatus = "";
            ViewBag.tmregion = "";
            ViewBag.tmcountry = "";
            ViewBag.tmdestination = "";

            var result0 = await _dapperWrap.GetRecords<VacPacks>(SqlCalls.SQL_VacationPackages());
            List<VacPacks> allPacks = new List<VacPacks>();
            allPacks = result0.ToList();

            ViewBag.PackTotal = allPacks.Count();

            Models.ViewModels.VacPacksViewModel vacPackView = new Models.ViewModels.VacPacksViewModel
            {
                vacPackTMED = allPacks.FindAll(ed => ed.DeptNA == "ED" && ed.PDL_SequenceNo != 2),
                vacPackTMLD = allPacks.FindAll(ld => ld.DeptNA == "LD" && ld.PDL_SequenceNo != 2),
                vacPackTMAS = allPacks.FindAll(ta => ta.DeptNA == "TMAS" && ta.PDL_SequenceNo != 2),
            };
            vacPackView.TMStarted.Add(vacPackView.vacPackTMED[0]);
            vacPackView.TMStarted.Add(vacPackView.vacPackTMAS[0]);
            vacPackView.TMStarted.Add(vacPackView.vacPackTMLD[0]);
            vacPackView.vacPackManager.AddRange(vacPackView.vacPackTMED.Take(2));
            vacPackView.vacPackManager.AddRange(vacPackView.vacPackTMAS.Take(2));
            vacPackView.vacPackManager.AddRange(vacPackView.vacPackTMLD.Take(2));
                        
            var result1 = await _dapperWrap.GetRecords<vacPacksNumCustFeedbacks>(SqlCalls.SQL_Get_NumberofCustomerFeedbacks_OverAllScore());
            List<vacPacksNumCustFeedbacks> overAllReviews;
            overAllReviews = result1.ToList();
            ViewBag.Score = overAllReviews.First().Score;
            ViewBag.Num = overAllReviews.First().NumComments;

            return View("VacationPackages", vacPackView);
        }
    }
}
