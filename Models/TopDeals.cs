using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace MVC_TM.Models
{
    public class Region:BaseObject
    {
        public List<Package> DealPacks = new List<Package>();
    }

    public class TopDealsCountry : NameObject
    {
        public Int32 RegionId;
        public List<Package> DealPacks { get; set; }
    }

    public class Deals: PackOnInterestPriority
    {
        public decimal STP_Price { get; set; }
        public Int32 STP_NumOfNights { get; set; }
        public Int32 CountryID { get; set; }
        public Int32 STP_UserID { get; set; }
    }

    public class RegionDeals : Deals
    {
        public string str_placetitle { get; set; }
        public Int32 str_placeid { get; set; }
        public Int32 STR_UserID { get; set; }
    }

    public class PackageInfo : NameObject
    {
        public Int32 RegionId;
        public string Content { get; set; }
        public string Description { get; set; }
        public string IMG_Path_URL { get; set; }
        public string CountryName { get; set; }
        public Int32 Duration;
        public decimal Price { get; set; }
        public Int32 NoOfFeeds;
        public List<Place> Ext_Places = new List<Place>();
        public DateTime stp_startdate { get; set; }
    }

    public class Place : NameObject
    {
        public Int32 NumberOfPacks;
    }

    public class TopDealsPacks : Deals
    {
        public string Content { get; set; }
        public string Description { get; set; }
        public string Comment { get; set; }
        public DateTime dep_date { get; set; }
        public decimal OverallScore { get; set; }
        public Int32 Duration;
        public decimal Price { get; set; }
        public Int32 NoOfFeeds;
        public string IMG_500Path_URL { get; set; }
    }
    public class allCountries
    {
        public string DepartNA { get; set; }
        public Int32 CountryID { get; set; }
        public string CountryNA { get; set; }
        public Int32 CountryRK { get; set; }
    }

}
