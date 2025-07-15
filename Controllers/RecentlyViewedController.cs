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
using Dapper;
using System.Text.Encodings.Web;

namespace MVC_TM.Controllers
{
    public class RecentlyViewedController : Controller
    {
        private readonly AppSettings _appSettings;
        private readonly DapperWrap _dapperWrap;

        public RecentlyViewedController(IOptions<AppSettings> appSettings, DapperWrap dapperWrap)
        {
            _appSettings = appSettings.Value;
            _dapperWrap = dapperWrap;
        }

        [HttpGet("/recently_viewed", Name = "RecentlyViewed_Route")]
        [HttpHead("/recently_viewed", Name = "RecentlyViewed_Route")]
        [HttpPost("/recently_viewed", Name = "RecentlyViewed_Route")]
        public async Task<IActionResult> Index()
        {
            HttpContext.Response.Headers.Add("_utPg", "RECVIEW");

            Models.ViewModels.RecentlyViewedViewModel viewmodelRecentlyViewed = new Models.ViewModels.RecentlyViewedViewModel();

            ViewBag.PageTitle = "Recently Viewed page";

            string userVisitID = "NA";
            //if (Request.Cookies["ut2"] != null)
            //{
            //    string[] utcookie = Request.Cookies["ut2"].Split("&");
            //    for (Int32 i = 0; i < utcookie.Length; i++)
            //    {
            //        if (utcookie[i].Contains("_utvId="))
            //        {
            //            string[] _utvIdcookie = utcookie[i].Split("=");
            //            userVisitID = HtmlEncoder.Default.Encode(_utvIdcookie[1]);
            //        }
            //    }
            //}

            //if (userVisitID != "NA")
            //{
            //    var Result1 = await _dapperWrap.MySqlGetRecordsAsync<LastVisits>(SqlCalls.MySQL_RecentlyViewed(userVisitID), null, true);
            //    viewmodelRecentlyViewed.visits = Result1.ToList();

            //    string vProds = "";
            //    if (viewmodelRecentlyViewed.visits.Count > 0)
            //    {
            //        foreach (var v in viewmodelRecentlyViewed.visits)
            //        {
            //            vProds = vProds + "," + v.UTS_ProductItemID.ToString();
            //        }
            //        if (vProds != "")
            //        {
            //            var Result2 = await _dapperWrap.GetRecords<VisitedPacks>(SqlCalls.SQL_VisitedPackagesDescription(vProds.Substring(1, vProds.Length - 1)));
            //            viewmodelRecentlyViewed.lastVisitedPacks = Result2.ToList();
            //        }
            //    }
            //}

            ViewBag.userVisitID = userVisitID;

            if (Utilities.CheckMobileDevice() == false)
            {
                return View("RecentlyViewed", viewmodelRecentlyViewed);
            }
            else
            {
                return View("RecentlyViewedMob", viewmodelRecentlyViewed);
            }
        }

    }
}
