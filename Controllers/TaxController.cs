using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using MVC_TM.Infrastructure;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Options;
using MVC_TM.Models;
using System.Data;
using System.Data.SqlClient;
using Dapper;

namespace MVC_TM.Controllers
{
    public class TaxController : Controller
    {
        private readonly AppSettings _appSettings;
        private readonly DapperWrap _dapperWrap;
        private readonly IWebHostEnvironment _hostingEnvironment;

        public TaxController(IOptions<AppSettings> appsettings, DapperWrap dapperWrap, IWebHostEnvironment hostingEnvironment)
        {
            _appSettings = appsettings.Value;
            _dapperWrap = dapperWrap;
            _hostingEnvironment = hostingEnvironment;
        }
        [HttpGet("/city_tax", Name = "CityTax_Route")]
        [HttpHead("/city_tax", Name = "CityTax_Route")]
        [HttpPost("/city_tax", Name = "CityTax_Route")]

        public async Task<IActionResult> CityTaxAsync()
        {

            Models.ViewModels.TaxByCity taxModel = new Models.ViewModels.TaxByCity();

            var result1 = await _dapperWrap.GetRecords<TaxCityInfo>(SqlCalls.SQL_TaxCityInfo());
            taxModel.taxAllData = result1.ToList();
            
            var groupCountries = taxModel.taxAllData.GroupBy(tx => tx.PCTI_CountryName).Select(g => g.First()).ToList();
            taxModel.taxCountries = groupCountries.ToList();

            var groupCities = taxModel.taxAllData.OrderBy(cy => cy.STR_UserID);
            taxModel.taxCities = groupCities.ToList();

            if (Utilities.CheckMobileDevice() == false)
            {
                ViewBag.Mobile = 0;
            }
            else
            {
                ViewBag.Mobile = 1;
            }
            return View("TaxByCity", taxModel);           
        }
                
    }
}
