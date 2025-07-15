using MVC_TM.Infrastructure;
using System.Collections.Generic;
using System.Text;
using System;

namespace MVC_TM.Models.ViewModels
{
    public class GeneralPurposeViewModel
    {
        private string city;
        private readonly AppSettings _appSettings;
        public List<GP_PackOnInterestPriority> listFeatured = new List<GP_PackOnInterestPriority>();
        public List<GP_PackOnInterestPriority> suggestedPackages = new List<GP_PackOnInterestPriority>();
        public Int32 allItineraries = 0;
        public List<GP_PackOnInterestPriority> otherFeatured = new List<GP_PackOnInterestPriority>();
        public Int64 packFeedCountC = 0;
        public string pageBannerText = "";
        public string pageDescriptionC = "";
        public string pageTitle = "";
        public string pageMetaDesc = "";
        public string pageMetaKey = "";
        public List<GP_PackOnInterestPriority> featPack = new List<GP_PackOnInterestPriority>();
        public List<GP_PackOnInterestPriority> featTop = new List<GP_PackOnInterestPriority>();
        public List<GP_PackOnInterestPriority> featSugg = new List<GP_PackOnInterestPriority>();
        public List<DisplayTheme> centerDisplay = new List<DisplayTheme>();
        public List<string> boxCustomFeed = new List<string>();
        public List<string> boxFeaturPacks = new List<string>();
        public List<BoxContent> bannerOnPage = new List<BoxContent>();
        public List<BoxContent> hotelAct = new List<BoxContent>();
        public List<BoxContent> isWhatExpect = new List<BoxContent>();
        public List<DisplayBox> allTopDisplay = new List<DisplayBox>();
        public List<CMScity> expectSMS = new List<CMScity>();
        public List<WeightPlace> leftCityList = new List<WeightPlace>();
        public List<WeightPlace> leftCountryCityList = new List<WeightPlace>();
        public string countryNA;
        public Int32 areaIDs;
        public Int32 areaID;
        public string areaNA;
        public Int32 countryID;
        public Int32 allTop;
        public string intNA;
        public string pageHeaderText;
        public string pagePicture;
        public List<WeightPlace> citesOnWeight = new List<WeightPlace>();
        public List<WeightPlace> citesnotOnWeight = new List<WeightPlace>();
        public List<WeightPlace> placesOnCountry = new List<WeightPlace>();
        public List<WeightPlace> citesOnCountry = new List<WeightPlace>();
        public List<WeightPlace> placesOnWeight = new List<WeightPlace>();
        public StringBuilder strPlcsIDs = new StringBuilder();
        public List<BoxContent> boxContent = new List<BoxContent>();
        public List<DisplayTheme> leftDisplay = new List<DisplayTheme>();
        public List<DisplayTheme> areaHighlightOrientation = new List<DisplayTheme>();
        public List<GP_PackOnInterestPriority> listFeatItin = new List<GP_PackOnInterestPriority>();
        public List<CMSPage> leftCMS = new List<CMSPage>();
        public List<string> arrpCombCountry = new List<string>();
        public Int32 NumComments;
        public decimal Score;
        public Int32 packFeedCountCity;
        public List<NumberofCustomerFeedbacks> listReviews = new List<NumberofCustomerFeedbacks>();
        public string pageDescriptionCity = "";
        public IEnumerable<CMScity> WhatExpect;
        public IEnumerable<GP_PackOnInterestPriority> bestPackages1;
        public IEnumerable<GP_PackOnInterestPriority> bestPackages2;
    }
}
