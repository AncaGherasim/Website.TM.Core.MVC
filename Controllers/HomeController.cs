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
    public class HomeController : Controller
    {
        private readonly AppSettings _appSettings;
        private readonly DapperWrap _dapperWrap;
        private readonly IWebHostEnvironment _webHostEnvironment;

        public HomeController(IOptions<AppSettings> appSettings, DapperWrap dapperWrap, IWebHostEnvironment webHostEnvironment)
        {
            _appSettings = appSettings.Value;
            _dapperWrap = dapperWrap;
            _webHostEnvironment = webHostEnvironment;
        }

        [TypeFilter(typeof(CheckCacheFilter))]
        [HttpGet("/", Name = "Home_Route")]
        [HttpHead("/", Name = "Home_Route")]
        [HttpPost("/", Name = "Home_Route")]
        public async Task<IActionResult> Index()
        {
            if (HttpContext.Response.Headers.ContainsKey("_utPg"))
            {
                ViewBag._utPg = "BYO";
            }
            else
            {
                HttpContext.Response.Headers.Add("_utPg", "DFLT");
                ViewBag._utPg = "DFLT";
            }

            Models.ViewModels.HomeViewModel viewmodelHome = new Models.ViewModels.HomeViewModel();

            List<NumberofCustomerFeedbacks> overAllReviews;

            var Result1 = await _dapperWrap.GetRecords<allDestinations>(SqlCalls.SQL_AllCountryDestinationsByDepartID());
            List<allDestinations> allDestinationsList = Result1.ToList();
            viewmodelHome.TMCty.AddRange(allDestinationsList.Where(x => x.DepartNA == "ED").Take(13));
            viewmodelHome.TMCty.AddRange(allDestinationsList.Where(x => x.DepartNA == "TMAS").Take(13));
            viewmodelHome.TMCty.AddRange(allDestinationsList.Where(x => x.DepartNA == "LD").Take(13));

            var Result2 = await _dapperWrap.GetRecords<MostPopItineraries>(SqlCalls.SQL_MostPopItineraries());
            viewmodelHome.managerPop = Result2.ToList();

            var Result3 = await _dapperWrap.GetRecords<NumberofCustomerFeedbacks>(SqlCalls.SQL_Get_NumberofCustomerFeedbacks_OverAllScore());
            overAllReviews = Result3.ToList();
            viewmodelHome.NumComments = overAllReviews.First().NumComments;
            viewmodelHome.Score = overAllReviews.First().Score;

            var Result4 = await _dapperWrap.GetRecords<FeatItins>(SqlCalls.SQL_FeaturedPacksByDepartID());
            viewmodelHome.managerItineraries = Result4.ToList();

            viewmodelHome.TMSeq2 = viewmodelHome.managerItineraries.FindAll(x => x.PDL_SequenceNo == 2);
            viewmodelHome.TMEDitin = viewmodelHome.managerItineraries.FindAll(x => x.DeptNA == "ED" && x.PDL_SequenceNo != 2);
            viewmodelHome.TMLDitin = viewmodelHome.managerItineraries.FindAll(x => x.DeptNA == "LD" && x.PDL_SequenceNo != 2);
            viewmodelHome.TMASitin = viewmodelHome.managerItineraries.FindAll(x => x.DeptNA == "TMAS" && x.PDL_SequenceNo != 2);
            viewmodelHome.TMStarted.Add(viewmodelHome.TMEDitin[0]);
            viewmodelHome.TMStarted.Add(viewmodelHome.TMASitin[0]);
            viewmodelHome.TMStarted.Add(viewmodelHome.TMLDitin[0]);
            viewmodelHome.TMPop.AddRange(viewmodelHome.TMEDitin.Skip(1).Take(3));
            viewmodelHome.TMPop.AddRange(viewmodelHome.TMASitin.Skip(1).Take(3));
            viewmodelHome.TMPop.AddRange(viewmodelHome.TMLDitin.Skip(1).Take(3));
            viewmodelHome.TMDest = viewmodelHome.TMPop.Select(x => x.DeptNA).Distinct().ToList();

            var jsonHighlights = "";
            if (_webHostEnvironment.EnvironmentName == "Development")
            {
                jsonHighlights = System.IO.File.ReadAllText(_webHostEnvironment.ContentRootPath + "/highlights_dev.json");
            }
            else
            {
                jsonHighlights = System.IO.File.ReadAllText(_webHostEnvironment.ContentRootPath + "/highlights.json");
            }
            viewmodelHome.listHighlights = JsonConvert.DeserializeObject<List<Highlights>>(jsonHighlights);
            ViewBag.image = "https://pictures.tripmasters.com/siteassets/d/tmSuperHomeTopImg.jpg";
            ViewBag.PageType = "HomePage";
            ViewBag.PageTitle = "Vacation Packages | Custom Vacation Packages | Tripmasters";
            ViewBag.pageMetaDesc = "Vacation Packages Travel Deals: Tripmasters can help you create a multi-country, multi-city vacation package in Europe, Asia, or America.";
            ViewBag.pageMetaKey = "Vacations, Packages, Deals, Tours, Travel, Popular vacations, Custom, Best, Trips, Europe, Asia, Latin America";
            ViewBag.tmpagetype = "superhomepage";
            ViewBag.tmpagetypeinstance = "";
            ViewBag.tmrowid = "";
            ViewBag.tmadstatus = "";
            ViewBag.tmregion = "";
            ViewBag.tmcountry = "";
            ViewBag.tmdestination = "";

            var Result5 = await _dapperWrap.GetRecords<SpotLight>(SqlCalls.SQL_SpotLights_Home(_appSettings.ApplicationSettings.spotLight));
            viewmodelHome.TMSpot = Result5.ToList();
            
            var Result6 = await _dapperWrap.GetRecords<NoteWorthy>(SqlCalls.SQL_NoteworthyPacks(_appSettings.ApplicationSettings.noteWorthy));
            viewmodelHome.TMNoteWorthy = Result6.ToList();

            return View("Home", viewmodelHome);
        }

        public IActionResult Privacy()
        {
            return View();
        }

        [ResponseCache(Duration = 0, Location = ResponseCacheLocation.None, NoStore = true)]
        public IActionResult Error()
        {
            return View(new ErrorViewModel { RequestId = Activity.Current?.Id ?? HttpContext.TraceIdentifier });
        }
    }
}
