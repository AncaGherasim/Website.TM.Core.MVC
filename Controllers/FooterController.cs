using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using MVC_TM.Infrastructure;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Options;
using MVC_TM.Models;
using System.Data;
using System.Drawing;
using System.Text.RegularExpressions;



// For more information on enabling MVC for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace MVC_TM.Controllers
{
    public class FooterController : Controller
    {
        private readonly AppSettings _appSettings;
        private readonly DapperWrap _dapperWrap;
        private readonly IWebHostEnvironment _hostingEnvironment;

        public FooterController(IOptions<AppSettings> appsettings, DapperWrap dapperWrap, IWebHostEnvironment hostingEnvironment)
        {
            _appSettings = appsettings.Value;
            _dapperWrap = dapperWrap;
            _hostingEnvironment = hostingEnvironment;
        }
        [HttpGet("/about_us", Name = "AboutUs_Route")]
        [HttpHead("/about_us", Name = "AboutUs_Route")]
        [HttpPost("/about_us", Name = "AboutUs_Route")]
        public IActionResult AboutUs()
        {
            HttpContext.Response.Headers.Add("_utPg", "AboutUs");

            if (Utilities.CheckMobileDevice() == false)
            {
                ViewBag.Mobile = 0;
            }
            else
            {
                ViewBag.Mobile = 1;
            }
            return View("AboutUs");
        }

        [HttpGet("/terms", Name = "Terms_Route")]
        [HttpHead("/terms", Name = "Terms_Route")]
        [HttpPost("/terms", Name = "Terms_Route")]
        public IActionResult Terms()
        {
            HttpContext.Response.Headers.Add("_utPg", "TERMS");
            if (Utilities.CheckMobileDevice() == false)
            {
                ViewBag.Mobile = 0;
            }
            else
            {
                ViewBag.Mobile = 1;
            }
            return View("Terms");
        }

        [HttpGet("booking_confirmation", Name = "BookingConfirmation_Route")]
        [HttpHead("booking_confirmation", Name = "BookingConfirmation_Route")]
        [HttpPost("booking_confirmation", Name = "BookingConfirmation_Route")]
        public IActionResult BookingConfirmation()
        {
            ViewBag.bookingId = "";
            ViewBag.email = "";
            if (!string.IsNullOrWhiteSpace(HttpContext.Request.Query["bk"]) || !string.IsNullOrWhiteSpace(HttpContext.Request.Query["em"]))
            {
                string bookingId = HttpContext.Request.Query["bk"];
                string email = HttpContext.Request.Query["em"];
                var emailPattern = @"^[^@\s]+@[^@\s]+\.[^@\s]+$";
                if (int.TryParse(bookingId, out int id) && Regex.IsMatch(email, emailPattern))
                {
                    ViewBag.bookingId = id;
                    ViewBag.email = email;
                }
            }
            

            if (Utilities.CheckMobileDevice() == false)
            {
                HttpContext.Response.Headers.Add("_utPg", "BOOKCONFIRM");
                ViewBag.Mobile = 0;
            }
            else
            {
                HttpContext.Response.Headers.Add("_utPg", "mobileBOOKCONFIRM");
                ViewBag.Mobile = 1;
            }
            return View("BookingConfirmation");
        }

        [HttpGet("/insurance", Name = "Insurance_Route")]
        [HttpHead("/insurance", Name = "Insurance_Route")]
        [HttpPost("/insurance", Name = "Insurance_Route")]
        public IActionResult Insurance()
        {
            if (Utilities.CheckMobileDevice() == false)
            {
                HttpContext.Response.Headers.Add("_utPg", "INSURANCE");
                ViewBag.Mobile = 0;
            }
            else
            {
                HttpContext.Response.Headers.Add("_utPg", "mobileINSURANCE");
                ViewBag.Mobile = 1;
            }

            return View("Insurance");
        }
        [HttpGet("/how_to_book_on_tripmasters", Name = "Book_Route")]
        [HttpHead("/how_to_book_on_tripmasters", Name = "Book_Route")]
        [HttpPost("/how_to_book_on_tripmasters", Name = "Book_Route")]
        public IActionResult Book()
        {
            HttpContext.Response.Headers.Add("_utPg", "HOWTO");
            if (Utilities.CheckMobileDevice() == false)
            {
                ViewBag.Mobile = 0;
            }
            else
            {
                ViewBag.Mobile = 1;
            }

            return View("How-to-book");
        }

        [HttpGet("Payments", Name = "Payments_Route")]
        [HttpHead("Payments", Name = "Payments_Route")]
        [HttpPost("Payments", Name = "Payments_Route")]
        public IActionResult Payments()
        {
            if (Utilities.CheckMobileDevice() == false)
            {
                HttpContext.Response.Headers.Add("_utPg", "PAYMENT");
                ViewBag.Mobile = 0;
            }
            else
            {
                HttpContext.Response.Headers.Add("_utPg", "mobilePAYMENT");
                ViewBag.Mobile = 1;
            }
            return View("Payments");
        }

        [HttpGet("/security-privacy", Name = "SecurityPrivacy_Route")]
        [HttpHead("/security-privacy", Name = "SecurityPrivacy_Route")]
        [HttpPost("/security-privacy", Name = "SecurityPrivacy_Route")]
        public IActionResult SecurityPrivacy()
        {
            if (Utilities.CheckMobileDevice() == false)
            {
                HttpContext.Response.Headers.Add("_utPg", "SECURITY");
                ViewBag.Mobile = 0;
            }
            else
            {
                HttpContext.Response.Headers.Add("_utPg", "mobileSECURITY");
                ViewBag.Mobile = 1;
            }

            return View("SecurityPrivacy");
        }

        [HttpGet("/visas", Name = "Visas_Route")]
        [HttpHead("/visas", Name = "Visas_Route")]
        [HttpPost("/visas", Name = "Visas_Route")]
        public IActionResult Visas()
        {
            if (Utilities.CheckMobileDevice() == false)
            {
                ViewBag.Mobile = 0;
            }
            else
            {
                ViewBag.Mobile = 1;
            }
            return View("Visas");
        }

        [HttpGet("/airline_ancillary_Fees", Name = "AirlineAncillaryFees_Route")]
        [HttpHead("/airline_ancillary_Fees", Name = "AirlineAncillaryFees_Route")]
        [HttpPost("/airline_ancillary_Fees", Name = "AirlineAncillaryFees_Route")]
        public IActionResult AirlineAncillaryFees()
        {
            if (Utilities.CheckMobileDevice() == false)
            {
                HttpContext.Response.Headers.Add("_utPg", "BAGGFEES");
                return View("AirlineAncillaryFees");
            }
            else
            {
                HttpContext.Response.Headers.Add("_utPg", "mobileBAGGFEES");
                return View("AirlineAncillaryFeesMob");
            }

        }

        [HttpGet("/frequently_asked_questions", Name = "FAQ_Route")]
        [HttpHead("/frequently_asked_questions", Name = "FAQ_Route")]
        [HttpPost("/frequently_asked_questions", Name = "FAQ_Route")]
        public IActionResult FAQ()
        {
            HttpContext.Response.Headers.Add("_utPg", "pageFAQ");
            if (Utilities.CheckMobileDevice() == false)
            {
                ViewBag.Mobile = 0;
            }
            else
            {
                ViewBag.Mobile = 1;
            }
            return View("FAQ");
        }
        [HttpGet("/contact_us", Name = "ContactUs_Route")]
        [HttpHead("/contact_us", Name = "ContactUs_Route")]
        [HttpPost("/contact_us", Name = "ContactUs_Route")]
        public IActionResult ContactUS()
        {
            if (Utilities.CheckMobileDevice() == false)
            {
                HttpContext.Response.Headers.Add("_utPg", "CONTACT");
                ViewBag.Mobile = 0;
            }
            else
            {
                HttpContext.Response.Headers.Add("_utPg", "mobileCONTACT");
                ViewBag.Mobile = 1;
            }
            return View("ContactUs");
        }
        [HttpGet("saved_itinerary", Name = "SavedItinerary_Route")]
        [HttpHead("saved_itinerary", Name = "SavedItinerary_Route")]
        [HttpPost("saved_itinerary", Name = "SavedItinerary_Route")]
        public IActionResult SavedItinerary()
        {
            if (Utilities.CheckMobileDevice() == false)
            {
                ViewBag.Mobile = 0;
            }
            else
            {
                ViewBag.Mobile = 1;
            }
            return View("SavedItinerary");
        }


        //// GET: /<controller>/


    }
}
