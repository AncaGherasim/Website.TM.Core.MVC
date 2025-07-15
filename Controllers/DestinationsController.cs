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
    public class DestinationsController : Controller
    {
        private readonly AppSettings _appSettings;
        private readonly DapperWrap _dapperWrap;
        private readonly AWSParameterStoreService _awsParameterStoreService;

        public DestinationsController(IOptions<AppSettings> appSettings, DapperWrap dapperWrap, AWSParameterStoreService awsParameterStoreService)
        {
            _appSettings = appSettings.Value;
            _dapperWrap = dapperWrap;
            _awsParameterStoreService = awsParameterStoreService;
        }

        [TypeFilter(typeof(CheckCacheFilter))]
        [HttpGet("/destinations", Name = "Destinations_Route")]
        [HttpHead("/destinations", Name = "Destinations_Route")]
        [HttpPost("/destinations", Name = "Destinations_Route")]
        public async Task<IActionResult> Index()
        {
            Models.ViewModels.DestinationsViewModel viewModelDestinations = new Models.ViewModels.DestinationsViewModel();

            var result1 = await _dapperWrap.GetRecords<Destination>(SqlCalls.SQL_DestinationsPlusInfo());
            List<Destination> dvCous = result1.ToList();
            viewModelDestinations.countries = (from drv in dvCous select new Countryd() { Id = drv.CountryId, Name = drv.CountryName.Trim(), Info = drv.CountryInfo, RegionId = drv.RegionId, Total = drv.CitiesTotal }).Distinct(new CountryComparer()).OrderBy(x => x.Name).ToList();
            foreach (var c in viewModelDestinations.countries)
            {
                Int32 countryId_ = c.Id;
                c.Cities = (from drv in dvCous where drv.CountryId == countryId_ select new Cityd() { Id = drv.CityId, Name = drv.CityName.Trim(), CtyInfo = drv.CityInfo, Rank = drv.CityRank, Total = drv.CitiesTotal }).OrderBy(x => x.Rank).ThenBy(x => x.Name).ToList();
            }
            //List<string> lettersList = countries.Select(x => x.Name.Substring(0, 1).ToUpper()).Distinct().ToList();

            ViewBag.PageTitle = "EXPLORE OUR DESTINATIONS | Tripmasters ";
            var pageDescription = "Choose your favorite destination and start exploring our suggested vacation packages. Build your own trip online or call us toll-free.";
            var pageKeywords = "destinations in Europe, European travel guide, list of cities and countries in Europe, European vacations, destination guide, destination list";
            ViewBag.pageMetaDesc = pageDescription;
            ViewBag.pageMetaKey = pageKeywords;
            ViewBag.tmpagetype = "destinations";
            ViewBag.tmpagetypeinstance = "";
            ViewBag.tmrowid = "";
            ViewBag.tmadstatus = "";
            ViewBag.tmregion = "";
            ViewBag.tmcountry = "";
            ViewBag.tmdestination = "";

            if (Utilities.CheckMobileDevice() == false)
            {
                HttpContext.Response.Headers.Add("_utPg", "DSTI");

                //return View("Destinations", viewModelDestinations);
            }
            else
            {
                HttpContext.Response.Headers.Add("_utPg", "mobileDSTI");

                //return View("DestinationsMob", viewModelDestinations);
            }

            return View("Destinations", viewModelDestinations);
        }

        [HttpGet("/destinations/GetCityList/{id}")]
        public async Task<IEnumerable<CityInfo>> GetCityList(Int32 id)
        {
            List<CountryPlaces> countryList = new List<CountryPlaces>();
            var result = await _dapperWrap.GetRecords<CountryPlaces>(SqlCalls.SQL_CountryPlaces(id.ToString()));
            countryList = result.ToList();  
            return (from drv in countryList select new CityInfo() { Id = drv.CityID, Name = drv.CityName, CityInfo_ = drv.CityInfo, CityDept = drv.CityDept }).ToList();
        }


    }
}
