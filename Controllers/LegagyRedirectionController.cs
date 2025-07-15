using System.Text.RegularExpressions;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;
using MVC_TM.Infrastructure;

namespace MVC_TM.Controllers
{

    public class LegacyRedirectionController : Controller
    {
        private readonly IOptions<AppSettings> _appSettings;
        private readonly DapperWrap _dapperWrap;

        public LegacyRedirectionController(IOptions<AppSettings> appsettings, DapperWrap dapperWrap)
        {
            _appSettings = appsettings;
            _dapperWrap = dapperWrap;
        }

        [HttpGet("{urlpath1}.aspx", Name = "Aspx1")]
        [HttpHead("{urlpath1}.aspx", Name = "Aspx1")]
        [HttpPost("{urlpath1}.aspx", Name = "Aspx1")]
        public IActionResult FancyUrlRedirect1(string urlpath1)
        {
            var newUrl = "";
            switch (true)
            {
                case bool _ when Regex.IsMatch(urlpath1, @"About_Us", RegexOptions.IgnoreCase):
                    return RedirectPermanent(_appSettings.Value.ApplicationSettings.SiteName + "/" + urlpath1.ToLower().Replace(" ", "_") + Request.QueryString);
                case bool _ when Regex.IsMatch(urlpath1, @"Terms", RegexOptions.IgnoreCase):
                    return RedirectPermanent(_appSettings.Value.ApplicationSettings.SiteName + "/" + urlpath1.ToLower().Replace(" ", "_") + Request.QueryString);
                case bool _ when Regex.IsMatch(urlpath1, @"Security-Privacy", RegexOptions.IgnoreCase):
                    return RedirectPermanent(_appSettings.Value.ApplicationSettings.SiteName + "/" + urlpath1.ToLower().Replace(" ", "_") + Request.QueryString);
                case bool _ when Regex.IsMatch(urlpath1, @"FAQ", RegexOptions.IgnoreCase):
                    return RedirectPermanent(_appSettings.Value.ApplicationSettings.SiteName + "/frequently_asked_questions" + Request.QueryString);
                case bool _ when Regex.IsMatch(urlpath1, @"Insurance", RegexOptions.IgnoreCase):
                    return RedirectPermanent(_appSettings.Value.ApplicationSettings.SiteName + "/insurance" + Request.QueryString);
                case bool _ when Regex.IsMatch(urlpath1, @"How_To_Book_On_Tripmasters", RegexOptions.IgnoreCase):
                    return RedirectPermanent(_appSettings.Value.ApplicationSettings.SiteName + "/" + urlpath1.ToLower().Replace(" ", "_") + Request.QueryString);
                case bool _ when Regex.IsMatch(urlpath1, @"TopDeal", RegexOptions.IgnoreCase):
                    return RedirectPermanent(_appSettings.Value.ApplicationSettings.SiteName + "/top_deals" + Request.QueryString);
                case bool _ when Regex.IsMatch(urlpath1, @"Chat_Message", RegexOptions.IgnoreCase):
                    return RedirectPermanent(_appSettings.Value.ApplicationSettings.SiteName + "/" + urlpath1.ToLower().Replace(" ", "_") + Request.QueryString);
                case bool _ when Regex.IsMatch(urlpath1, @"Chat", RegexOptions.IgnoreCase):
                    return RedirectPermanent(_appSettings.Value.ApplicationSettings.SiteName + "/" + urlpath1.ToLower().Replace(" ", "_") + Request.QueryString);
                case bool _ when Regex.IsMatch(urlpath1, @"ManageSubscription", RegexOptions.IgnoreCase):
                    return RedirectPermanent(_appSettings.Value.ApplicationSettings.SiteName + "/manage_subscription" + Request.QueryString);
                case bool _ when Regex.IsMatch(urlpath1, @"CheckBookingForReview", RegexOptions.IgnoreCase):
                    return RedirectPermanent(_appSettings.Value.ApplicationSettings.SiteName + "/checkbookingforreview" + Request.QueryString);
                case bool _ when Regex.IsMatch(urlpath1, @"Customer_Review", RegexOptions.IgnoreCase):
                    return RedirectPermanent(_appSettings.Value.ApplicationSettings.SiteName + "customer-review" + Request.QueryString);
                case bool _ when Regex.IsMatch(urlpath1, @"Review", RegexOptions.IgnoreCase):
                    return RedirectPermanent(_appSettings.Value.ApplicationSettings.SiteName + "/review" + Request.QueryString);
                case bool _ when Regex.IsMatch(urlpath1, @"Search", RegexOptions.IgnoreCase):
                    return RedirectPermanent(_appSettings.Value.ApplicationSettings.SiteName + "/search" + Request.QueryString);
                case bool _ when Regex.IsMatch(urlpath1, @"Recently_Viewed", RegexOptions.IgnoreCase):
                    return RedirectPermanent(_appSettings.Value.ApplicationSettings.SiteName + "/recently_viewed" + Request.QueryString);
                case bool _ when Regex.IsMatch(urlpath1, @"Destinations", RegexOptions.IgnoreCase):
                    return RedirectPermanent(_appSettings.Value.ApplicationSettings.SiteName + "/destinations" + Request.QueryString);
                case bool _ when Regex.IsMatch(urlpath1, @"Booking_Confirmation", RegexOptions.IgnoreCase):
                    return RedirectPermanent(_appSettings.Value.ApplicationSettings.SiteName + "/booking_confirmation" + Request.QueryString);
                case bool _ when Regex.IsMatch(urlpath1, @"SavedItinerary", RegexOptions.IgnoreCase):
                    return RedirectPermanent(_appSettings.Value.ApplicationSettings.SiteName + "/saved_itinerary" + Request.QueryString);
                case bool _ when Regex.IsMatch(urlpath1, @"Advanced_Build_Your_Own_Vacation", RegexOptions.IgnoreCase):
                    return RedirectPermanent(_appSettings.Value.ApplicationSettings.SiteName + "/advanced_build_your_own_vacation" + Request.QueryString);
                case bool _ when Regex.IsMatch(urlpath1, @"Build_Your_Own_Vacation", RegexOptions.IgnoreCase):
                    return RedirectPermanent(_appSettings.Value.ApplicationSettings.SiteName + "/build_your_own_vacation" + Request.QueryString);
                case bool _ when Regex.IsMatch(urlpath1, @"Payments", RegexOptions.IgnoreCase):
                    return RedirectPermanent(_appSettings.Value.ApplicationSettings.SiteName + "/payments" + Request.QueryString);
                case bool _ when Regex.IsMatch(urlpath1, @"AirlineAncillaryFees", RegexOptions.IgnoreCase):
                    return RedirectPermanent(_appSettings.Value.ApplicationSettings.SiteName + "/airline_ancillary_fees" + Request.QueryString);
                case bool _ when Regex.IsMatch(urlpath1, @"Contact_us", RegexOptions.IgnoreCase):
                    return RedirectPermanent(_appSettings.Value.ApplicationSettings.SiteName + "/contact_us" + Request.QueryString);
                case bool _ when Regex.IsMatch(urlpath1, @"Book_Car", RegexOptions.IgnoreCase):
                    return RedirectPermanent(_appSettings.Value.ApplicationSettings.SiteName + "/book/car/" + urlpath1.Substring(urlpath1.IndexOf("Car_") + 4) + Request.QueryString);
                case bool _ when Regex.IsMatch(urlpath1, @"City_Tax", RegexOptions.IgnoreCase):
                    return RedirectPermanent(_appSettings.Value.ApplicationSettings.SiteName + "/city_tax" + Request.QueryString);
                case bool _ when Regex.IsMatch(urlpath1, @"ContactAgent", RegexOptions.IgnoreCase):
                    return RedirectPermanent(_appSettings.Value.ApplicationSettings.SiteName + "/contact-agent" + Request.QueryString);
                default:
                    newUrl = "/";
                    return Redirect(newUrl);

            }
        }

        [HttpGet("/{urlpath1}/{urlpath2}/cms.aspx", Name = "Aspx2")]
        [HttpHead("/{urlpath1}/{urlpath2}/cms.aspx", Name = "Aspx2")]
        [HttpPost("/{urlpath1}/{urlpath2}/cms.aspx", Name = "Aspx2")]
        public IActionResult FancyUrlRedirect2(string urlpath1, string urlpath2)
        {
            return RedirectPermanent(_appSettings.Value.ApplicationSettings.SiteName + "/" + urlpath1.ToLower() + "/cms?cms=" + urlpath2 + "&" + Request.QueryString.Value.Replace("?CMS&", ""));
        }
        [HttpGet("/cms/{urlpath1}/Web_Content.aspx", Name = "Aspx3")]
        [HttpHead("/cms/{urlpath1}/Web_Content.aspx", Name = "Aspx3")]
        [HttpPost("/cms/{urlpath1}/Web_Content.aspx", Name = "Aspx3")]
        public IActionResult FancyUrlRedirect3(string urlpath1)
        {

            return RedirectPermanent(_appSettings.Value.ApplicationSettings.SiteName + "/cms/" + urlpath1 + Request.QueryString.Value.ToLower().Replace("cms&", ""));
        }
    }
}