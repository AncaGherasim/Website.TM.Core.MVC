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
using MVC_TM.Models.ViewModels;

namespace MVC_TM.Controllers
{
    public class TopDealsController : Controller
    {
        private readonly AppSettings _appSettings;
        private readonly DapperWrap _dapperWrap;
        private readonly AWSParameterStoreService _awsParameterStoreService;

        public TopDealsController(IOptions<AppSettings> appSettings, DapperWrap dapperWrap, AWSParameterStoreService awsParameterStoreService)
        {
            _appSettings = appSettings.Value;
            _dapperWrap = dapperWrap;
            _awsParameterStoreService = awsParameterStoreService;
        }

        [TypeFilter(typeof(CheckCacheFilter))]
        [AcceptVerbs("GET", "HEAD", "POST")]
        [Route("/top_deals/{sitename?}", Name = "TopDeals_Route")]
     
        public async Task<IActionResult> Index(string sitename = null)
        {
            HttpContext.Response.Headers.Add("_utPg", "TOPDLS");
            Models.ViewModels.TopDealsViewModel viewmodelTopDeals = new Models.ViewModels.TopDealsViewModel();

            ViewBag.PageType = "TopDealsPage";
            ViewBag.PageTitle = "Top Deals Vacation Packages | Tripmasters";
            ViewBag.pageMetaDesc = "Top Deals Vacation Packages. Specials to Europe, Asia, and Latin America destinations. Custom Multi-City Vacation Packages. Build your own Hawaii Island hopping, or Costa Rica Vacations Packages";
            ViewBag.pageMetaKey = "Vacations, Packages, Deals, Tours, Travel, Holidays, Popular, Custom, Best, Trips, Visit, Europe, Asia, Latin America";
            ViewBag.tmpagetype = "topdeals";
            ViewBag.tmpagetypeinstance = "";
            ViewBag.tmrowid = "";
            ViewBag.tmadstatus = "";
            ViewBag.tmregion = "";
            ViewBag.tmcountry = "";
            ViewBag.tmdestination = "";

            var result1 = await _dapperWrap.pgSQLGetRecordsAsync<TopDealsPacks>(PostgresCalls.PG_MV_TopDealsPackages());
            List<TopDealsPacks> listAllTopDeals = result1.Where(item => !string.IsNullOrEmpty(item.Comment)).ToList();

            viewmodelTopDeals.featTopDeals = result1.ToList().GroupBy(p => p.STP_UserID).Select(g => g.First()).ToList();

            viewmodelTopDeals.moreTMEDTopDeals = listAllTopDeals.FindAll(x => x.STP_UserID == 243).Skip(1).Take(10).ToList();
            viewmodelTopDeals.moreTMASTopDeals = listAllTopDeals.FindAll(x => x.STP_UserID == 595).Skip(1).Take(10).ToList();
            viewmodelTopDeals.moreTMLDTopDeals = listAllTopDeals.FindAll(x => x.STP_UserID == 182).Skip(1).Take(10).ToList();

            var result2 = await _dapperWrap.GetRecords<allCountries>(SqlCalls.SQL_AllCountryDestinationsByDepartID());
            viewmodelTopDeals.allCountry = result2.OrderBy(x => x.CountryNA).ToList();

            return View("TopDeals", viewmodelTopDeals);
        }

        [HttpPost("TopDealsPackageInfo")]
        public async Task<IActionResult> TopDealsPackageInfo([FromBody] SSData sSData)
        {
            string packId = sSData.SSFilter;
            string regionId = sSData.Ids;
            List<PackageInfo> pks = new List<PackageInfo>();
            var result1 = await _dapperWrap.GetRecords<PackageInfo>(SqlCalls.SQL_PackageCustomInformation(packId));
            pks = result1.ToList();
            PackageInfo pack = new PackageInfo();

            if (pks.Count > 0)
            {
                pack = pks[0];
            }

            var result2 = await _dapperWrap.GetRecords<Place>(SqlCalls.SQL_PackageRelatedDestinations(packId, regionId));
            List<Place> pls = result2.ToList();
            pack.Ext_Places = pls;

            return View("TopDealsPackageInfo", pack); ;
        }

        [TypeFilter(typeof(CheckCacheFilter))]
        [AcceptVerbs("GET", "HEAD", "POST")]
        [Route("{startDate}/weekly-top-deals", Name = "W_TopDeals_Route")]
        public async Task<IActionResult> WeekTopDealAsync(string startDate)
        {    
            WeeklyViewModels Weekly_PageModel = new WeeklyViewModels();
            
            var Result1 = await _dapperWrap.pgSQLGetRecordsAsync<WeekByDate>(WeeklySqlCalls.PG_ThisWeekDeals(startDate));
            if (!Result1.Any())
            {
                return Redirect("/top_deals");
            }
            var wk_packs = Result1.ToList();
            var firstWk = wk_packs.FirstOrDefault();

            ViewBag.wk_startdate = "";
            ViewBag.wk_enddate = "";
            ViewBag.wk_campaign = "";
            ViewBag.wk_headline = "";

            if (firstWk?.mktd_enddate < DateTime.Today)
            {
                return Redirect("/top_deals");
            }

            if (firstWk != null)
            {
                ViewBag.wk_startdate = firstWk.mktd_startdate?.ToString("MMM dd") ?? "";
                ViewBag.wk_enddate = firstWk.mktd_enddate?.ToString("MMM dd") ?? "";
                ViewBag.wk_campaign = firstWk.mkt_campaigncode ?? "";
                ViewBag.wk_headline = firstWk.mktd_headline ?? "";
            }
           
            var wk_ids = new List<int>();
            foreach (var wk in wk_packs)
            {
                for (int i = 1; i <= 20; i++)
                {
                    var prop = wk.GetType().GetProperty($"mktd_package{i}");
                    if (prop != null)
                    {
                        var strValue = prop.GetValue(wk) as string;
                        if (!string.IsNullOrWhiteSpace(strValue) && int.TryParse(strValue, out int intValue) && intValue != 0)
                        {
                            wk_ids.Add(intValue);
                        }
                    }
                }
            }
                   
            var wk_id_string = string.Join(",", wk_ids.Distinct());

            if (!string.IsNullOrWhiteSpace(wk_id_string))
            {
                var Result5 = await _dapperWrap.GetRecords<WeeklyPackages>(WeeklySqlCalls.SQL_WeeklyAllPackages(wk_id_string));

                var idOrder = wk_ids.Select((id, index) => new { id, index })
                                    .ToDictionary(x => x.id, x => x.index);

                Weekly_PageModel.WeeklyPacks = Result5
                    .OrderBy(p => idOrder.TryGetValue(p.PDLID, out var idx) ? idx : int.MaxValue)
                    .ToList();
            }

            ViewBag.StartDay = startDate;
            return View("WeeklyTopDeals", Weekly_PageModel);
        }

    }
}
