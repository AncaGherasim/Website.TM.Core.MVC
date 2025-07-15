using Microsoft.AspNetCore.Mvc;
using MVC_TM.Infrastructure;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Options;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using MVC_TM.Models;
using System.Drawing.Imaging;
using System.Text;
using System.Web;

namespace MVC_TM.Controllers
{
    public class ChatController : Controller
    {
        private readonly AppSettings _appSettings;
        private readonly DapperWrap _dapperWrap;
        private readonly IWebHostEnvironment _hostingEnvironment;
        private readonly IHttpContextAccessor _httpContextAccessor;

        public ChatController(IOptions<AppSettings> appsettings, DapperWrap dapperWrap, IWebHostEnvironment hostingEnvironment, IHttpContextAccessor httpContextAccessor)
        {
            _appSettings = appsettings.Value;
            _dapperWrap = dapperWrap;
            _hostingEnvironment = hostingEnvironment;
            _httpContextAccessor = httpContextAccessor;
        }

        [HttpGet("/chat_message", Name = "ChatMessage_Route")]
        [HttpHead("/chat_message", Name = "ChatMessage_Route")]
        [HttpPost("/chat_message", Name = "ChatMessage_Route")]
        public IActionResult ChatMessage()
        {
            HttpContext.Response.Headers.Add("_utPg", "ChatMessage");

            if (Utilities.CheckMobileDevice() == false)
            {
                ViewBag.Mobile = 0;
            }
            else
            {
                ViewBag.Mobile = 1;
            }
            return View("ChatMessage");
        }

        [HttpGet("/chat", Name = "Chat_Route")]
        [HttpHead("/chat", Name = "Chat_Route")]
        [HttpPost("/chat", Name = "Chat_Route")]
        public IActionResult Chat()
        {
            HttpContext.Response.Headers.Add("_utPg", "ChatMessage");

            if (Utilities.CheckMobileDevice() == false)
            {
                ViewBag.Mobile = 0;
            }
            else
            {
                ViewBag.Mobile = 1;
            }
            return View("Chat");
        }
        [HttpGet("/postsurvey/{parameters?}", Name = "Post Survey")]
        [HttpHead("/postsurvey/{parameters?}", Name = "Post Survey")]
        [HttpPost("/postsurvey/{parameters?}", Name = "Post Survey")]
        public async Task<IActionResult> PostSurvey(string parameters)
        {
            
            List<BookingSurvey> checkBooking = new List<BookingSurvey>();
            Models.ViewModels.BookingsViewModel survey = new Models.ViewModels.BookingsViewModel();
            try
            {
                //string email = String.Empty;
                //Int32 bookingid = 0;
                //if (_httpContextAccessor.HttpContext.Request.Query["email"].ToString() != null && _httpContextAccessor.HttpContext.Request.Query["bookingid"].ToString() != null)
                //{
                //    email = _httpContextAccessor.HttpContext.Request.Query["email"];
                //    bookingid = int.Parse(_httpContextAccessor.HttpContext.Request.Query["bookingid"]);
                //}
                var encodedstring = Convert.FromBase64String(parameters);
                string decodedstring = Encoding.UTF8.GetString(encodedstring);
                var dict = HttpUtility.ParseQueryString(decodedstring);
                var json = System.Text.Json.JsonSerializer.Serialize(
                                    dict.AllKeys.ToDictionary(k => k, k => dict[k])
                           );
                var param = Newtonsoft.Json.JsonConvert.DeserializeObject<CheckBookingParams>(json);
                string email = param.email;
                Int32 bookingid = Int32.Parse(param.bookingId);
                
                var result1 = await _dapperWrap.GetRecords<BookingSurvey>(SqlCalls.SQL_CheckBookingSurvery(bookingid, email));
                checkBooking = result1.ToList();
                var result2 = await _dapperWrap.GetRecords<PostBookingSurvey>(SqlCalls.SQL_PostBookingSurvey(bookingid, email));
                survey.postSurvey = result2.ToList();
                if(checkBooking.Count > 0)
                {
                    if (survey.postSurvey.Count > 0)
                    {
                        ViewBag.SurveyPresent = true;
                    }
                    ViewBag.IsValid = true;
                    ViewBag.BookingId = bookingid;
                    ViewBag.Email = email;
                }
                
            }
            catch (Exception ex)
            {
                ViewBag.IsValid = false;
            }
            

            if (Utilities.CheckMobileDevice() == false)
            {
                ViewBag.Mobile = 0;
            }
            else
            {
                ViewBag.Mobile = 1;
            }
            return View("PostSurvey", survey);
        }
    }
}
