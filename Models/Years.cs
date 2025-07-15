using System.Collections.Generic;
using System;
using Microsoft.AspNetCore.Mvc.RazorPages;
using static System.Net.WebRequestMethods;
using System.Security.Permissions;

namespace MVC_TM.Models
{

    public class Id1PageTitle
    {
        public string Note { get; set; }
        public string Title { get; set; }
        public string Description { get; set; }
        public string Picture { get; set; }
        public string OverImageText { get; set; }
    }

    public class Id2Banner
    {
        public string Note { get; set; }
        public string Title { get; set; }
        public PlanInfo Plan { get; set; }
        public CustomizeInfo Customize { get; set; }
        public RatingInfo Rating { get; set; }
    }

    public class Id3SuggestPacks
    {
        public string Note { get; set; }
        public string Title { get; set; }
        public string Description { get; set; }
        public string PacklistIDs { get; set; }
    }

    public class Id4Calendar
    {
        public string Note { get; set; }
        public string Title { get; set; }
        public string Description { get; set; }
        public string Calendar { get; set; }
    }

    public class Id5CountryDest
    {
        public string Note { get; set; }
        public string Title { get; set; }
        public string Description { get; set; }
        public string TopCities { get; set; }
        public string TopRegions { get; set; }
    }

    public class Id6Activities
    {
        public string Note { get; set; }
        public string Title { get; set; }
        public string Description { get; set; }
        public TodoItem ToDoList { get; set; }
    }

    public class Id7Beyonds
    {
        public string Note { get; set; }
        public string Title { get; set; }
        public string Description { get; set; }
        public string PackList { get; set; }
    }

    public class PlanInfo
    {
        public string Title { get; set; }
        public string Subtitle { get; set; }
        public string Description { get; set; }
    }

    public class CustomizeInfo
    {
        public string Title { get; set; }
        public string Subtitle { get; set; }
        public string Description { get; set; }
    }

    public class RatingInfo
    {
        public string Title { get; set; }
        public string Subtitle { get; set; }
        public string Description { get; set; }
    }

    public class TodoItem
    {
        public string No { get; set; }
        public string Name { get; set; }
        public string Image { get; set; }
        public string Description { get; set; }
        public string Link { get; set; }
    }

    public class BeyondItem
    {
        public string No { get; set; }
        public string Name { get; set; }
        public string Image { get; set; }
        public string Description { get; set; }
        public string Link { get; set; }
    }

    public class FaqItem
    {
        public string Question { get; set; }
        public string Answer { get; set; }
    }

    public class PackageIDsInfo
    {
        public Int32 PDLID { get; set; }
        public string PDL_Title { get; set; }
        public decimal STP_Save { get; set; }
        public Int32 STP_NumOfNights { get; set; }
        public string CityNA { get; set; }
        public Int32 SPD_CountryPlaceID { get; set; }
        public string PDL_Description { get; set; }
        public string CountryName { get; set; }
        public string IMG_Path_URL { get; set; }
        public Int32 NoOfFeed { get; set; }
        public string Comment { get; set; }
        public DateTime dep_date { get; set; }
        public Int32 OverAllScore { get; set; }
    }

    public class YearPlacesHierarchy
    {
        public Int32 STRID { get; set; }
        public Int32 STR_PlaceID { get; set; }
        public string STR_PlaceTitle { get; set; }
        public Int32 STR_PlaceTypeID { get; set; }
        public string STR_PlaceShortInfo { get; set; }
        public Int32 STR_PlaceAIID { get; set; }
        public string STR_PlaceInfo { get; set; }
        public Int32 STR_ProdKindID { get; set; }
        public string STR_PageTemplate { get; set; }
        public Int32 STR_UserID { get; set; }
        public Int32 STR_PlacePriority { get; set; }
    }

    public class YearCountryDestinos
    {
        public Int32 STR_PlaceID { get; set; }
        public string STR_PlaceTitle { get; set; }
        public Int32 STR_PlaceTypeID { get; set; }
        public Int32 STR_PlaceAIID { get; set; }
        public Int32 STR_Place1ParentID { get; set; }
    }

    public class YearCMScountry
    {
        public Int64 CMSW_Order { get; set; }
        public string CMSW_Title { get; set; }
        public Int32? CMSW_RelatedCmsID { get; set; }
        public string CMS_Description { get; set; }
    }

    public class YearsCustomerOverall
    {
        public Int32 NumComments { get; set; }
        public decimal Score { get; set; }
    }

    public class YearCountryFeedback
    {
        public Int64 NoOfFeedbacks { get; set; }
    }

    public class YearFaqQR
    {
        public string FaqQuestion { get; set; }
        public string FaqResponse { get; set; }
    }
}