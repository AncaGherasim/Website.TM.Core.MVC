using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;
using MVC_TM.Infrastructure;
using MVC_TM.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace MVC_TM.Controllers
{
    public class CarController : Controller
    {
        private readonly AppSettings _appSettings;
        private readonly DapperWrap _dapperWrap;

        public CarController(IOptions<AppSettings> appSettings, DapperWrap dapperWrap)
        {
            _appSettings = appSettings.Value;
            _dapperWrap = dapperWrap;
        }
        [HttpGet("/book/car/{carmodel}")]
        public async Task<IActionResult> Car(string carmodel)
        {
            HttpContext.Response.Headers.Add("_utPg", "CAR");

            List<BookCar> bookCar = new List<BookCar>();
            string[] car = carmodel.Substring(0, carmodel.IndexOf("_-_")).Split("_");
            var result = await _dapperWrap.GetRecords<BookCar>(SqlCalls.SQL_GetCarInfo(car[0], car[1]));
            bookCar = result.ToList();
            return View("Car", bookCar);
        }
    }
}
