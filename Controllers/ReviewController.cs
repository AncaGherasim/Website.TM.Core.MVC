using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;
using Microsoft.AspNetCore.Http;
using MVC_TM.Infrastructure;
using MVC_TM.Models;
using System;
using System.Linq;
using System.Net;
using System.Collections.Generic;
using System.Threading.Tasks;


namespace MVC_TM.Controllers
{
    public class ReviewController : Controller
    {
        private readonly AppSettings _appSettings;
        private readonly DapperWrap _dapperWrap;
        private readonly IHttpContextAccessor _httpContextAccessor;
        private readonly AWSParameterStoreService _awsParameterStoreService;

        public ReviewController(IOptions<AppSettings> appSettings, DapperWrap dapperWrap, IHttpContextAccessor httpContextAccessor, AWSParameterStoreService awsParameterStoreService)
        {
            _appSettings = appSettings.Value;
            _dapperWrap = dapperWrap;
            _httpContextAccessor = httpContextAccessor;
            _awsParameterStoreService = awsParameterStoreService;
        }

        [HttpGet("/review", Name = "Review_Route")]
        [HttpHead("/review", Name = "Review_Route")]
        [HttpPost("/review", Name = "Review_Route")]
        [HttpGet("/reviews", Name = "Reviews_Route")]
        [HttpHead("/reviews", Name = "Reviews_Route")]
        [HttpPost("/reviews", Name = "Reviews_Route")]
        public async Task<IActionResult> Index()
        {
            HttpContext.Response.Headers.Add("_utPg", "REVIEW");
            if (Utilities.CheckMobileDevice() == false)
            {
                return await Desktop();
            }
            else
            {
                return await Mobile();
            }
        }


        [HttpGet("customer-review")]
        public async Task<IActionResult> WriteReview()
        {

            HttpContext.Response.Headers.Add("_utPg", "CUSTOMERREVIEW");

            Models.ViewModels.CustomerReviewViewModel review = new Models.ViewModels.CustomerReviewViewModel();
            ViewBag.dvMainContainer = true;
            ViewBag.errMess = false;
            ViewBag.dvTellUs = false;
            ViewBag.topText = true;
            ViewBag.lblTop = false;
            ViewBag.ulExperienceOptions = true;
            ViewBag.dvExp = false;
            ViewBag.ulUse = true;
            ViewBag.dvUse = false;
            ViewBag.imgUse = true;
            ViewBag.revContent = true;
            ViewBag.revContentReadOnlyText = false;
            ViewBag.revContentReadOnlyVisible = false;
            ViewBag.dvUserSelect = true;
            ViewBag.dvPreSelect = false;
            ViewBag.dvLinks = false;
            ViewBag.dvStatus = false;
            review.feedReceived = false;
            //bool feedProcessed = false;
            Int32 rate = 0;
            if (!string.IsNullOrEmpty(HttpContext.Request.Query["b"]) && !string.IsNullOrEmpty(HttpContext.Request.Query["e"]) && !string.IsNullOrEmpty(HttpContext.Request.Query["r"]))
            {
                review.bookingId = Int32.Parse(HttpContext.Request.Query["b"]);
                review.email = HttpContext.Request.Query["e"];
                rate = Int32.Parse(HttpContext.Request.Query["r"]);
                if (rate < 1 && rate > 5)
                {
                    rate = 0;
                }
            }
            else
            {
                ViewBag.errMess = true;
                ViewBag.lblErr = "Some error occurred, please verify the booking number and the email address.";
                ViewBag.dvMainContainer = false;
            }
            //review.bookingId = Int32.Parse(HttpContext.Request.Query["b"]);
            //review.email = HttpContext.Request.Query["e"];
            //Int32 rate = Int32.Parse(HttpContext.Request.Query["r"]);

            review.rate = rate;
            ViewBag.opVal = rate;
            //ViewBag.opValDesc = 



            try
            {
                var result1 = await _dapperWrap.GetRecords<BookingTest>(SqlCalls.SQL_BookingTest(review.bookingId, review.email));
                review.bookingTest = result1.ToList();



                if (review.bookingTest.Count == 0)
                {
                    ViewBag.errMess = true;
                    ViewBag.dvMainContainer = false;
                    ViewBag.lblErr = "Current review is not available, please try later or contact one of our Agents.";
                    //throw new Exception("Current review is not available, please try later or contact one of our Agents.");
                }
                else
                {
                    review.clientName = review.bookingTest.First().Agency;
                }


                //review.services = new List<BookingService>();
                review.services.Add(new BookingService() { Name = "Customer service", Id = 1, Rating = "0" });
                review.services.Add(new BookingService() { Name = "Website", Id = 2, Rating = "0" });
                review.services.Add(new BookingService() { Name = "Flights", Id = 3, Rating = "0" });
                review.services.Add(new BookingService() { Name = "Hotels", Id = 4, Rating = "0" });
                review.services.Add(new BookingService() { Name = "Transfers", Id = 5, Rating = "0" });
                review.services.Add(new BookingService() { Name = "Activities", Id = 6, Rating = "0" });
                review.services.Add(new BookingService() { Name = "Car Rentals", Id = 7, Rating = "0" });
                review.services.Add(new BookingService() { Name = "Trains", Id = 8, Rating = "0" });
                review.services.Add(new BookingService() { Name = "Ferries", Id = 9, Rating = "0" });

                var result2 = await _dapperWrap.GetRecords<BookingService>(SqlCalls.SQL_BookingServices(review.bookingId));
                review.bookServices = result2.ToList();
                if (review.bookServices.Count > 0)
                {
                    if (review.bookServices.Where(x => x.Rating == "Mini Package" || x.Name == "Mini Package").Count() == 0)
                    {
                        ViewBag.dvTellUs = true;
                    }
                    for (var i = 2; i <= 8; i++)
                    {
                        if (review.bookServices.Where(x => x.Name == review.services[i].Name).Count() == 0)
                        {
                            review.srvToDelete.Add(review.services[i].Id);
                        }
                    }
                }
                for (var i = 0; i <= review.srvToDelete.Count() - 1; i++)
                {
                    review.services.Remove((BookingService)review.services.Where(x => x.Id == review.srvToDelete[i]).FirstOrDefault());
                }

                var result3 = await _dapperWrap.GetRecords<CustomerComment_Prepublished>(SqlCalls.SQL_Booking_PrePubReview(review.bookingId));
                review.bookReview = result3.ToList();
                if (review.bookReview.Count > 0)
                {
                    review.feedReceived = review.bookReview.First().FeedbackReceived;
                    review.feedProcessed = review.bookReview.First().FeedbackProcessed;
                }
                else
                {
                    ViewBag.errMess = true;
                    ViewBag.dvMainContainer = false;
                    ViewBag.lblErr = "Some error occurred, please verify the booking number and the email address.";
                    //throw new Exception("Some error occurred, please verify the booking number and the email address.");
                }
                if (review.feedReceived == true)
                {
                    ViewBag.topText = false;
                    ViewBag.lblTop = true;
                    ViewBag.ulExperienceOptions = false;
                    ViewBag.dvExp = true;

                    ViewBag.ulUse = false;
                    ViewBag.dvUse = true;

                    if (review.bookReview.First().UseUsAgain == true)
                    {
                        ViewBag.lblUse = "Yes";
                    }
                    else
                    {
                        ViewBag.imgUse = false;
                        ViewBag.lblUse = "No";
                    }

                    ViewBag.revContent = false;
                    ViewBag.revContentReadOnlyText = review.bookReview.First().CustomerComment;
                    ViewBag.revContentReadOnlyVisible = true;

                    foreach (var s in review.services)
                    {
                        switch (s.Id)
                        {
                            case 1:
                                s.Rating = review.bookReview[0].CustomerServiceScore.ToString();
                                break;
                            case 2:
                                s.Rating = review.bookReview.FirstOrDefault().WSandBPScore.ToString();
                                break;
                            case 3:
                                s.Rating = review.bookReview.FirstOrDefault().FlightsScore.ToString();
                                break;
                            case 4:
                                s.Rating = review.bookReview.FirstOrDefault().HotelsScore.ToString();
                                break;
                            case 5:
                                s.Rating = review.bookReview.FirstOrDefault().TransfersScore.ToString();
                                break;
                            case 6:
                                s.Rating = review.bookReview.FirstOrDefault().ActivitiesScore.ToString();
                                break;
                            case 7:
                                s.Rating = review.bookReview.FirstOrDefault().CarRentalScore.ToString();
                                break;
                            case 8:
                                s.Rating = review.bookReview.FirstOrDefault().TrainsScore.ToString();
                                break;
                            case 9:
                                s.Rating = review.bookReview.FirstOrDefault().FerriesScore.ToString();
                                break;
                        }
                    }
                    review.rate = review.bookReview.FirstOrDefault().OverallScore;
                    ViewBag.opVal = review.bookReview.FirstOrDefault().OverallScore.ToString();
                    ViewBag.opVal_Descr = GetRateDescription(review.bookReview.FirstOrDefault().OverallScore)[0];

                    ViewBag.dvUserSelect = false;
                    ViewBag.dvPreSelect = true;
                    ViewBag.dvLinks = true;
                    ViewBag.dvStatus = true;


                }
            }
            catch (System.IO.IOException ex)
            {
                ViewBag.errMess = true;
                ViewBag.lblErr = "Current review is not available, please try later or contact one of our Agents.";
                ViewBag.dvMainContainer = false;
                ViewBag.errException = ex.Message;
            }
            if (Utilities.CheckMobileDevice() == false)
            {
                return View("~/Views/CustomerReview/CustomerReview.cshtml", review);
            }
            else
            {
                return View("~/Views/CustomerReview/CustomerReviewMob.cshtml", review);
            }

        }

        public async Task<IActionResult> Desktop()
        {

            ViewBag.reviews = false;
            Models.ViewModels.ReviewViewModel viewmodelReview = new Models.ViewModels.ReviewViewModel();
            var Result1 = await _dapperWrap.GetRecords<NameObject>(SqlCalls.SQL_Get_NumberOfCustomerFeedbacks_Per_OverAllScore());
            viewmodelReview.scores = Result1.ToList();
            var path = HttpContext.Request.Path.Value;
            if (path.Contains("reviews"))
            {
                ViewBag.reviews = true;
            }
            return View("Review", viewmodelReview);
        }

        public async Task<IActionResult> Mobile()
        {
            ViewBag.reviews = false;
            Models.ViewModels.ReviewViewModel viewmodelReview = new Models.ViewModels.ReviewViewModel();
            var Result1 = await _dapperWrap.GetRecords<NameObject>(SqlCalls.SQL_Get_NumberOfCustomerFeedbacks_Per_OverAllScore());
            viewmodelReview.scores = Result1.ToList();
            var path = HttpContext.Request.Path.Value;
            if (path.Contains("reviews"))
            {
                ViewBag.reviews = true;
            }
            return View("ReviewMob", viewmodelReview);
        }

        [HttpPost("ReviewPerPage", Name = "ReviewPerPage_Route")]
        [HttpPost("ReviewsPerPage", Name = "ReviewsPerPage_Route")]
        public async Task<IActionResult> ReviewPerPage([FromBody] SSData sSData)
        {
            ViewBag.reviews = false;
            string page = sSData.SSFilter;
            string score = sSData.Ids;
            List<ReviewPageTotal> reviewsList = new List<ReviewPageTotal>();
            var result = await _dapperWrap.GetRecords<ReviewPageTotal>(SqlCalls.SQL_ReviewsPerPage(page, score));
            reviewsList = result.ToList();
            ViewBag.pageNumber = page;
            var path = HttpContext.Request.Path.Value;
            if (path.Contains("Reviews"))
            {
                ViewBag.reviews = true;
            }
            return View("ReviewPerPage", reviewsList);
        }

        public static string GetRateDescription(Int32 rate)
        {
            string[] result = { "", "" };
            switch (rate)
            {
                case 1:
                    result[0] = "Dissatisfied";
                    result[1] = "disatisfied";
                    break;
                case 2:
                    result[0] = "Somewhat Dissatisfied";
                    result[1] = "some_satisfied";
                    break;
                case 3:
                    result[0] = "Somewhat Satisfied";
                    result[1] = "satisfied";
                    break;
                case 4:
                    result[0] = "Satisfied";
                    result[1] = "satisfied";
                    break;
                case 5:
                    result[0] = "Completely Satisfied";
                    result[1] = "satisfied";
                    break;
            }

            return Newtonsoft.Json.JsonConvert.SerializeObject(result);
        }
    }
}
