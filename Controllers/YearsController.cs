using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;
using MVC_TM.Infrastructure;
using MVC_TM.Models;
using MVC_TM.Models.ViewModels;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text.RegularExpressions;
using System.Threading.Tasks;
using System.Xml.Linq;


namespace MVC_TM.Controllers
{
    public class YearsController : Controller
    {
        private readonly AppSettings _appSettings;
        private readonly DapperWrap _dapperWrap;
        private readonly IWebHostEnvironment _webHostEnvironment;
        private readonly CachedDataService _cachedDataService;

        public YearsController(IOptions<AppSettings> appSettings, DapperWrap dapperWrap, IWebHostEnvironment webHostEnvironment, CachedDataService cachedDataService)
        {
            _appSettings = appSettings.Value;
            _dapperWrap = dapperWrap;
            _webHostEnvironment = webHostEnvironment;
            _cachedDataService = cachedDataService;
        }

        // ***  /italy/2025_vacations
        // ***  /italy-travel-guide-2025
        [TypeFilter(typeof(CheckCacheFilter))]
        [AcceptVerbs("GET", "HEAD", "POST")]
        [Route("/{placename}-travel-guide-{year}", Name = "Years_Route")]     
        public async Task<IActionResult> IndexAsync(string placename, string year)
        {
            YearsViewModels Year_PageModel = new YearsViewModels();
            List<YearPlacesHierarchy> placesHierarchies = new List<YearPlacesHierarchy>();
            var plcHierarchy = await _dapperWrap.GetRecord<YearPlacesHierarchy>(YearSqlCalls.SQL_YearPlaceInfo(placename.Replace("-", " ")));
            if (plcHierarchy == null)
            {
                return NotFound();
            }
            placesHierarchies = new List<YearPlacesHierarchy> { plcHierarchy };
            var placeId = placesHierarchies.FirstOrDefault().STR_PlaceID.ToString();
            var placeNa = placesHierarchies.FirstOrDefault().STR_PlaceTitle.ToString();
            var userId = placesHierarchies.FirstOrDefault().STR_UserID.ToString();
            var division = userId == "243" ? "europe" : userId == "595" ? "asia" : userId == "182" ? "latin" : "";
            ViewBag.PlaceId = placeId;
            ViewBag.Placename = placeNa;
            ViewBag.Division = division;

            XDocument xmlDoc = new XDocument();

            string fileName = $"{placename}{year}.xml";
            string directoryPath = Path.Combine(this._webHostEnvironment.WebRootPath, "xml", year.ToString());
            string xmlFilePath = Path.Combine(directoryPath, fileName);

            Console.WriteLine(" **** XML-Exist: " + System.IO.File.Exists(xmlFilePath));
            Console.WriteLine(" **** XML-Path: " + xmlFilePath);

            if (System.IO.File.Exists(xmlFilePath))
            {
                // Read XML file
                xmlDoc = XDocument.Load(xmlFilePath);
            }
            else
            {
                return NotFound("XML file not found.");
            }

            // *** Section Id=1 Page Top Presentation *** //
            var id1pagepresent = xmlDoc.Descendants("section").FirstOrDefault(s => s.Attribute("id")?.Value == "1");
            if (id1pagepresent != null)
            {
                Id1PageTitle pagePresentation = new Id1PageTitle
                {
                    Note = id1pagepresent.Element("note")?.Value,
                    Title = id1pagepresent.Element("title")?.Value,
                    Description = id1pagepresent.Element("description")?.Value,
                    Picture = id1pagepresent.Element("picture")?.Value,
                    OverImageText = id1pagepresent.Element("overimagetext")?.Value
                };
                Year_PageModel.id1PageTitle.Add(pagePresentation);
            }

            // *** Section Id=2 Banner *** //
            var id2banner = xmlDoc.Descendants("section").Where(s => s.Attribute("id")?.Value == "2");
            if (id2banner != null)
            {
                foreach (var id2 in id2banner)
                {
                    Id2Banner pageBanner = new Id2Banner
                    {
                        Note = id2.Element("note")?.Value,
                        Title = id2.Element("title")?.Value
                    };
                    // Check if <plan> exists
                    if (id2.Element("plan") != null)
                    {
                        pageBanner.Plan = new PlanInfo
                        {
                            Title = id2.Element("plan")?.Element("title")?.Value,
                            Subtitle = id2.Element("plan")?.Element("subtitle")?.Value,
                            Description = id2.Element("plan")?.Element("description")?.Value
                        };
                    }
                    // Check if <customize> exists
                    if (id2.Element("customize") != null)
                    {
                        pageBanner.Customize = new CustomizeInfo
                        {
                            Title = id2.Element("customize")?.Element("title")?.Value,
                            Subtitle = id2.Element("customize")?.Element("subtitle")?.Value,
                            Description = id2.Element("customize")?.Element("description")?.Value
                        };
                    }
                    // Check if <rating> exists
                    if (id2.Element("rating") != null)
                    {
                        pageBanner.Rating = new RatingInfo
                        {
                            Title = id2.Element("rating")?.Element("title")?.Value,
                            Subtitle = id2.Element("rating")?.Element("subtitle")?.Value,
                            Description = id2.Element("rating")?.Element("description")?.Value
                        };
                    }
                    // Add the parsed object to the list
                    Year_PageModel.id2Banner.Add(pageBanner);
                }
            }

            // *** Section Id=3 Suggested Packages *** //
            var id3suggpacks = xmlDoc.Descendants("section").FirstOrDefault(s => s.Attribute("id")?.Value == "3");
            if (id3suggpacks != null)
            {
                Id3SuggestPacks suggestPacks = new Id3SuggestPacks
                {
                    Note = id3suggpacks.Element("note")?.Value,
                    Title = id3suggpacks.Element("title")?.Value,
                    Description = id3suggpacks.Element("description")?.Value,
                    PacklistIDs = id3suggpacks.Element("packlistIDs")?.Value
                };
                Year_PageModel.id3SuggestPacks.Add(suggestPacks);
            }

            // *** Section Id=4 Calendar *** //
            var id4calendar = xmlDoc.Descendants("section").FirstOrDefault(s => s.Attribute("id")?.Value == "4");
            if (id4calendar != null)
            {
                Id4Calendar byocalendar = new Id4Calendar
                {
                    Note = id4calendar.Element("note")?.Value,
                    Title = id4calendar.Element("title")?.Value,
                    Description = id4calendar.Element("description")?.Value,
                    Calendar = id4calendar.Element("calendar")?.Value
                };
                Year_PageModel.id4Calendar.Add(byocalendar);
            }

            // *** Section Id=5 Destinations *** //
            var id5destinos = xmlDoc.Descendants("section").FirstOrDefault(s => s.Attribute("id")?.Value == "5");
            if (id5destinos != null)
            {
                Id5CountryDest topdestinos = new Id5CountryDest
                {
                    Note = id5destinos.Element("note")?.Value,
                    Title = id5destinos.Element("title")?.Value,
                    Description = id5destinos.Element("description")?.Value,
                    TopCities = id5destinos.Element("topcities")?.Value,
                    TopRegions = id5destinos.Element("regions")?.Value
                };
                Year_PageModel.id5Destinations.Add(topdestinos);
            }

            // *** Section Id=6 Activities *** //
            var id6Activities = xmlDoc.Descendants("section").Where(s => s.Attribute("id")?.Value == "6");
            if (id6Activities.Any()) // Ensure there are actual elements
            {
                foreach (var id6 in id6Activities)
                {
                    Id6Activities pageActivities = new Id6Activities
                    {
                        Note = id6.Element("note")?.Value,
                        Title = id6.Element("title")?.Value,
                        Description = id6.Element("description")?.Value,
                    };
                    Year_PageModel.id6Activities.Add(pageActivities);

                    // Process the <listoftodo>
                    var id6Todolist = id6.Element("listoftodo")?.Elements("todo");
                    if (id6Todolist != null)
                    {
                        foreach (var td6 in id6Todolist)
                        {
                            TodoItem todo = new TodoItem
                            {
                                No = td6.Element("no")?.Value,
                                Name = td6.Element("todoname")?.Value,
                                Image = td6.Element("todoimage")?.Value,
                                Description = td6.Element("tododescription")?.Value,
                                Link = td6.Element("todolink")?.Value
                            };
                            Year_PageModel.ListOfToDo.Add(todo);
                        }
                    }
                }
            }

            // *** Section Id=7 Beyonds *** //
            var id7beyonds = xmlDoc.Descendants("section").FirstOrDefault(s => s.Attribute("id")?.Value == "7");
            if (id7beyonds != null)
            {
                Id7Beyonds beyonds = new Id7Beyonds
                {
                    Note = id7beyonds.Element("note")?.Value,
                    Title = id7beyonds.Element("title")?.Value,
                    Description = id7beyonds.Element("description")?.Value,
                    PackList = id7beyonds.Element("packlist")?.Value
                };
                Year_PageModel.id7Beyonds.Add(beyonds);
            }

            ViewBag.PageTitle = placeNa + " " + year + " travel guide | " + year + " vacation packages | Tripmasters";
            ViewBag.pageMetaDesc = "Build dream vacation to " + placeNa + " with the " + year + " Tripmasters travel guide";
            ViewBag.pageMetaKey = "";

            // *** Section Id=10 Page Metas *** //
            var id10TitleMetas = xmlDoc.Descendants("section").FirstOrDefault(s => s.Attribute("id")?.Value == "10");
            if (id10TitleMetas != null)
            {
                ViewBag.PageTitle = id10TitleMetas?.Element("pagetitle")?.Value;
                ViewBag.pageMetaDesc = id10TitleMetas?.Element("metadescription")?.Value;
                ViewBag.pageMetaKey = id10TitleMetas?.Element("metakeyword")?.Value;
            }

            // *** Suggested Packages *** //
            var listIDs = Year_PageModel.id3SuggestPacks
                          .Where(s => !string.IsNullOrEmpty(s.PacklistIDs))
                          .SelectMany(s => s.PacklistIDs.Split(','))
                          .Select(id => id.Trim())
                          .ToList();
            var idsString = string.Join(",", listIDs);
            // *** Beyonds Packages *** //
            var listBYs = Year_PageModel.id7Beyonds
                          .Where(s => !string.IsNullOrEmpty(s.PackList))
                          .SelectMany(s => s.PackList.Split(','))
                          .Select(id => id.Trim())
                          .ToList();
            var bysString = string.Join(",", listBYs);
            // *** Suggested + Beyonds *** //
            var allPacksIds = string.Join(",", new[] { idsString, bysString }
              .Where(s => !string.IsNullOrEmpty(s)));

            // *** Get Pack Info from Data *** //
            var listPacksInfo = await _dapperWrap.GetRecords<PackageIDsInfo>(YearSqlCalls.SQL_YearAllPackages(allPacksIds));
            if (listPacksInfo == null)
            {
                return NotFound();
            }
            Year_PageModel.allPacksInfo = listPacksInfo.ToList();

            // *** Data for Comments and FAQ's *** //
            var objectTypes = new Type[] { typeof(YearCMScountry), typeof(YearsCustomerOverall), typeof(YearCountryFeedback) };
            string queryString = YearSqlCalls.SQL_YearCMSByplaceID(placeId) + @";" +
                                  YearSqlCalls.SQL_YearCommentOverall() + @";" +
                                  YearSqlCalls.SQL_YearCountryComment(placeId);

            var resultSets = await _dapperWrap.GetMultipleRecords(queryString, 4, null, objectTypes);
            int count = 1;
            List<YearCMScountry> yListCMS = new();
            List<YearsCustomerOverall> yListOverall = new();
            List<YearCountryFeedback> yListFeedback = new();
            if (resultSets is not null)
            {
                foreach (var set in resultSets)
                {
                    switch (count)
                    {
                        case 1:
                            yListCMS = ((List<object>)set).Cast<YearCMScountry>().ToList();
                            break;
                        case 2:
                            yListOverall = ((List<object>)set).Cast<YearsCustomerOverall>().ToList();
                            break;
                        case 3:
                            yListFeedback = ((List<object>)set).Cast<YearCountryFeedback>().ToList();
                            break;
                        default:
                            break;
                    }
                    count++;
                }
            }

            // GET FAQ CMS content
            var fq = new YearFaqQR { FaqQuestion = "none", FaqResponse = "none" };
            Year_PageModel.EachFaqList.Add(fq);
            int? cmsfaqID = 0;
            foreach (var cms in yListCMS)
            {
                if (cms.CMS_Description != "none")
                {
                    if (Regex.IsMatch(cms.CMS_Description, "FAQ", RegexOptions.IgnoreCase))
                    {
                        cmsfaqID = cms.CMSW_RelatedCmsID;
                    }
                }
                else
                {
                    if (Regex.IsMatch(cms.CMSW_Title, "FAQ", RegexOptions.IgnoreCase))
                    {
                        cmsfaqID = cms.CMSW_RelatedCmsID;
                    }
                }
            }
            if (cmsfaqID > 0)
            {
                Year_PageModel.EachFaqList.Clear();
                var api = new API.YearController(_appSettings, _dapperWrap, _cachedDataService);
                Year_PageModel.EachFaqList = api.SqlFaqCms(cmsfaqID).Result.ToList();
            }

            // Country Feedback
            Int32 NumComments = 0;
            Decimal overAllAvg = 0;
            if (yListOverall.Count > 0)
            {
                NumComments = yListOverall[0].NumComments;
                Year_PageModel.Score = yListOverall[0].Score;
                overAllAvg = Decimal.Round(Year_PageModel.Score, 1);
            }
            if (yListFeedback.Count > 0)
            {
                Year_PageModel.YearCountryFeedbacks = yListFeedback[0].NoOfFeedbacks;
            }

            return View("Years", Year_PageModel);
        }
    }
}