using MVC_TM.Models;
using System;
using System.Collections.Generic;

namespace MVC_TM.Models.ViewModels
{
    public class YearsViewModels
    {
        public string Id { get; set; }
        public List<Id1PageTitle> id1PageTitle = new List<Id1PageTitle>();
        public List<Id2Banner> id2Banner = new List<Id2Banner>();
        public List<Id3SuggestPacks> id3SuggestPacks = new List<Id3SuggestPacks>();
        public List<PackageIDsInfo> allPacksInfo = new List<PackageIDsInfo>();
        public List<Id4Calendar> id4Calendar = new List<Id4Calendar>();
        public List<Id5CountryDest> id5Destinations = new List<Id5CountryDest>();
        public List<Id6Activities> id6Activities = new List<Id6Activities>();
        public List<TodoItem> ListOfToDo = new List<TodoItem>();
        public List<Id7Beyonds> id7Beyonds = new List<Id7Beyonds>();
        public List<YearFaqQR> EachFaqList = new List<YearFaqQR>();
        public List<YearCMScountry> ListCMS = new List<YearCMScountry>();
        public List<YearPlacesHierarchy> ListPlacesHierarchy = new List<YearPlacesHierarchy>();
        public List<YearCountryDestinos> ListOfCities = new List<YearCountryDestinos>();
        public List<YearCountryDestinos> ListOfRegions = new List<YearCountryDestinos>();
        public Int64 YearCountryFeedbacks = 0;
        public Decimal Score = 0;
    }
}