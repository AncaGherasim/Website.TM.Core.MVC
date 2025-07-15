using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;
using MVC_TM.Infrastructure;
using MVC_TM.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text.RegularExpressions;
using System.Text;
using System.Threading.Tasks;
using MVC_TM.Models.ViewModels;
using MySqlX.XDevAPI.Common;


namespace MVC_TM.Controllers
{
    public class GeneralPurposeController : Controller
    {
        private readonly AppSettings _appSettings;
        private readonly DapperWrap _dapperWrap;
        private readonly IWebHostEnvironment _webHostEnvironment;

        public GeneralPurposeController(IOptions<AppSettings> appSettings, DapperWrap dapperWrap, IWebHostEnvironment webHostEnvironment)
        {
            _appSettings = appSettings.Value;
            _dapperWrap = dapperWrap;
            _webHostEnvironment = webHostEnvironment;
        }
        [TypeFilter(typeof(CheckCacheFilter))]
        [AcceptVerbs("GET", "HEAD", "POST")]
        [Route("/vacation-ideas/{purposename}", Name = "purpose_route")]
        public async Task<IActionResult> IndexAsync(string purpose, string purposename)
        {
            List<PlacesHierarchy> placesHierarchies = new List<PlacesHierarchy>();
            GeneralPurposeViewModel GP_ThemeModel = new GeneralPurposeViewModel();
            List<DisplayTheme> managerDisplay = new List<DisplayTheme>();
            List<Place_Info> placeInfo = new List<Place_Info>();
            List<NumberofCustomerFeedbacks> overAllReviews;

            var plcHierarchy = await _dapperWrap.GetRecords<PlacesHierarchy>(GpSqlCalls.SQL_GP_Vacations_Places_Hierarchy_Priority(purposename.Replace("-", " ")));
            placesHierarchies = plcHierarchy.ToList();
            if (placesHierarchies.Count == 0)
            {
                return NotFound();
            }
            else
            {
                Int32 placeId = placesHierarchies.FirstOrDefault().STRID;
                Int32 SiteUserId = placesHierarchies.FirstOrDefault().STR_UserID;
                GP_ThemeModel.areaIDs = placesHierarchies[0].STRID;
                GP_ThemeModel.areaID = placesHierarchies[0].STR_PlaceID;
                GP_ThemeModel.intNA = placesHierarchies[0].STR_PlaceTitle;
                GP_ThemeModel.areaNA = Utilities.UppercaseFirstLetter(placesHierarchies.FirstOrDefault().STR_PlaceTitle);
                GP_ThemeModel.pagePicture = placesHierarchies[0].STR_PlaceMap;
                ViewBag.PackSecTitle = placesHierarchies[0].STR_PlaceTitleDesc;
                ViewBag.PackSecDesc = placesHierarchies[0].STR_PlaceShortInfo;
                ViewBag.PageTemplate = placesHierarchies[0].STR_PageTemplate;

                var results = await _dapperWrap.GetRecords<Place_Info>(GpSqlCalls.SQL_GP_Place_Info(GP_ThemeModel.areaIDs.ToString()));
                placeInfo = results.ToList();
                if (placeInfo[0].SEO_PageTitle != null)
                {
                    GP_ThemeModel.pageTitle = placeInfo[0].SEO_PageTitle;
                }
                else
                {
                    GP_ThemeModel.pageTitle = "Vacation Ideas to " + GP_ThemeModel.areaNA + " | Tripmasters";
                }

                if (placeInfo[0].SEO_MetaDescription != null)
                {
                    GP_ThemeModel.pageMetaDesc = placeInfo[0].SEO_MetaDescription;
                }
                else
                {
                    GP_ThemeModel.pageMetaDesc = GP_ThemeModel.areaNA + " Vacation Ideas, custom vacations to " + GP_ThemeModel.areaNA + ", best " + GP_ThemeModel.areaNA + " vacation packages. Travel to " + GP_ThemeModel.areaNA + ". " + GP_ThemeModel.areaNA + " online booking.";
                }
                GP_ThemeModel.pageMetaKey = GP_ThemeModel.areaNA + " air and hotel stays, sightseeing tours, hotel packages, deals, images, online booking, pricing, information, hotel travel, recommendations, resort, accommodations";
                GP_ThemeModel.pageBannerText = "US based|Price & Book in seconds|Discounted Air included";
                GP_ThemeModel.pageHeaderText = GP_ThemeModel.areaNA + " Vacation Packages";
                GP_ThemeModel.pageDescriptionC = GP_ThemeModel.pageMetaDesc;

                List<GP_PackOnInterestPriority> packsOnInterestPriority = new List<GP_PackOnInterestPriority>();
                var types2 = new Type[] { typeof(GP_PackOnInterestPriority), typeof(DisplayTheme), typeof(BoxContent), typeof(CMSPage) };
                string sqlQuerys = GpSqlCalls.SQL_GP_PackOnInterestPriorityList(GP_ThemeModel.areaIDs.ToString(), "0") + @";"
                    + GpSqlCalls.SQL_GP_ManagerDisplayTheme(GP_ThemeModel.areaIDs) + @";"
                    + GpSqlCalls.SQL_GP_BoxesContentArea(GP_ThemeModel.areaIDs) + @";"
                    + GpSqlCalls.SQL_GP_CMS_onGPpages("PlcH", 0, GP_ThemeModel.areaIDs) + @";";

                var resultsSets = await _dapperWrap.GetMultipleRecords(sqlQuerys, 4, null, types2);

                int count = 1;
                if (resultsSets is not null)
                {
                    foreach (var resultSet in resultsSets)
                    {
                        switch (count)
                        {
                            case 1:
                                packsOnInterestPriority = ((List<object>)resultSet).Cast<GP_PackOnInterestPriority>().ToList();
                                break;
                            case 2:
                                managerDisplay = ((List<object>)resultSet).Cast<DisplayTheme>().ToList();
                                break;
                            case 3:
                                GP_ThemeModel.boxContent = ((List<object>)resultSet).Cast<BoxContent>().ToList();
                                break;
                            case 4:
                                GP_ThemeModel.leftCMS = ((List<object>)resultSet).Cast<CMSPage>().ToList();
                                break;
                            default:
                                break;
                        }
                        count++;
                    }
                }

                GP_ThemeModel.featPack = packsOnInterestPriority.OrderBy(p => p.SPPW_Weight).ToList();
                GP_ThemeModel.featTop.AddRange(GP_ThemeModel.featPack.Take(3));
                GP_ThemeModel.featSugg.AddRange(GP_ThemeModel.featPack.Skip(3).Take(GP_ThemeModel.featPack.Count() - 3));

                for (int i = 0; i < Math.Min(3, GP_ThemeModel.featPack.Count); i++)
                {
                    GP_ThemeModel.strPlcsIDs.Append(GP_ThemeModel.featPack[i].PDLID);
                    if (i < 2 && i < GP_ThemeModel.featPack.Count - 1)
                        GP_ThemeModel.strPlcsIDs.Append(", ");
                }

                GP_ThemeModel.leftDisplay = managerDisplay.FindAll(c => c.SDP_DisplayProdKindID == 1877).ToList();
                GP_ThemeModel.centerDisplay = managerDisplay.FindAll(c => c.SDP_DisplayProdKindID == 1878).ToList();
                GP_ThemeModel.areaHighlightOrientation = GP_ThemeModel.leftDisplay.FindAll(d => d.SDP_GroupProdKindID == 1623 || d.SDP_GroupProdKindID == 1619 || d.SDP_GroupProdKindID == 1912 || d.SDP_GroupProdKindID == 1620 || d.SDP_GroupProdKindID == 2470 || d.SDP_GroupProdKindID == 2478).ToList();
                if (GP_ThemeModel.centerDisplay.Count > 0)
                {
                    List<BoxContent> topCenterOnPage = GP_ThemeModel.boxContent.FindAll(c => c.STX_ProdKindID == 1983).ToList();
                    GP_ThemeModel.allTopDisplay = topCenterOnPage.Join(GP_ThemeModel.centerDisplay, b => b.STX_ProdKindID, d => d.SDP_GroupProdKindID, (b, d) =>
                         new DisplayBox
                         {
                             CMS_Content = b.CMS_Content,
                             STX_CMSID = b.STX_CMSID,
                             STX_Description = b.STX_Description,
                             STX_PictureHeightpx = b.STX_PictureHeightpx,
                             STX_PictureURL = b.STX_PictureURL,
                             STX_PictureWidthpx = b.STX_PictureWidthpx,
                             STX_Priority = b.STX_Priority,
                             STX_ProdKindID = b.STX_ProdKindID,
                             STX_Title = b.STX_Title,
                             STX_URL = b.STX_URL,
                             SDP_DisplayTitle = d.SDP_DisplayTitle,
                             SDP_TitleBGColor = d.SDP_TitleBGColor
                         }).ToList();
                    GP_ThemeModel.allTop = GP_ThemeModel.allTopDisplay.Count();
                }

                var Result10 = await _dapperWrap.GetRecords<NumberofCustomerFeedbacks>(GpSqlCalls.SQL_GP_Get_NumberofCustomerFeedbacks_OverAllScore());
                overAllReviews = Result10.ToList();
                GP_ThemeModel.NumComments = overAllReviews.FirstOrDefault().NumComments;
                GP_ThemeModel.Score = overAllReviews.FirstOrDefault().Score;
                GP_ThemeModel.listReviews = overAllReviews.ToList();

                ViewBag.PageTitle = GP_ThemeModel.pageTitle;
                ViewBag.pageMetaDesc = GP_ThemeModel.pageMetaDesc;
                ViewBag.pageMetaKey = GP_ThemeModel.pageMetaKey;
                ViewBag.viewUsedName = "GP";
                ViewBag.tmpagetype = "generalpurpose";
                ViewBag.tmpagetypeinstance = "gp";
                ViewBag.tmrowid = "";
                ViewBag.tmadstatus = "";
                ViewBag.tmregion = "europe";
                ViewBag.tmcountry = "";
                ViewBag.tmdestination = purposename.Replace("-", " ");
                ViewBag.purposeName = purposename.Replace("-", " ");
                return View("GeneralPurpose", GP_ThemeModel);
            }
        }
    }
}