using MVC_TM.Models;
using System;
using System.Collections.Generic;

namespace MVC_TM.Models.ViewModels
{
    public class WeeklyViewModels
    {
        public List<WeeklyPackages> WeeklyPacks = new List<WeeklyPackages>();
    }

    public class WeeklyPackages
    {
        public Int32 PDLID { get; set; }
        public string CountryNA { get; set; }
        public Int32 STR_PlaceAIID { get; set; }
        public string PDL_Title { get; set; }
        public decimal STP_Save { get; set; }
        public Int32 STP_NumOfNights { get; set; }
        public Int32 SPD_CountryPlaceID { get; set; }
        public string city { get; set; }
        public string deptNA { get; set; }
        public string PDL_Description { get; set; }
        public string IMG_500Path_URL { get; set; }
        public string SPD_Description { get; set; }
        public string Comment { get; set; }
        public DateTime TvlDate { get; set; }
        public Int32 NoOfFeed { get; set; }
        public decimal OverallScore { get; set; }
    }
    public class WeekByDate
    {
        public int mktdid { get; set; }
        public string mktd_title { get; set; }
        public string mktd_headline { get; set; }
        public string mktd_package1 { get; set; }
        public string mktd_package1displayname { get; set; }
        public string mktd_package2 { get; set; }
        public string mktd_package2displayname { get; set; }
        public string mktd_package3 { get; set; }
        public string mktd_package3displayname { get; set; }
        public string mktd_package4 { get; set; }
        public string mktd_package4displayname { get; set; }
        public string mktd_package5 { get; set; }
        public string mktd_package5displayname { get; set; }
        public string mktd_package6 { get; set; }
        public string mktd_package6displayname { get; set; }
        public string mktd_package7 { get; set; }
        public string mktd_package7displayname { get; set; }
        public string mktd_package8 { get; set; }
        public string mktd_package8displayname { get; set; }
        public string mktd_package9 { get; set; }
        public string mktd_package9displayname { get; set; }
        public string mktd_package10 { get; set; }
        public string mktd_package10displayname { get; set; }
        public string mktd_package11 { get; set; }
        public string mktd_package11displayname { get; set; }
        public string mktd_package12 { get; set; }
        public string mktd_package12displayname { get; set; }
        public string mktd_package13 { get; set; }
        public string mktd_package13displayname { get; set; }
        public string mktd_package14 { get; set; }
        public string mktd_package14displayname { get; set; }
        public string mktd_package15 { get; set; }
        public string mktd_package15displayname { get; set; }
        public string mktd_package16 { get; set; }
        public string mktd_package16displayname { get; set; }
        public string mktd_package17 { get; set; }
        public string mktd_package17displayname { get; set; }
        public string mktd_package18 { get; set; }
        public string mktd_package18displayname { get; set; }
        public string mktd_package19 { get; set; }
        public string mktd_package19displayname { get; set; }
        public string mktd_package20 { get; set; }
        public string mktd_package20displayname { get; set; }
        public DateTime? mktd_created { get; set; }
        public string mktd_createdby { get; set; }
        public DateTime? mktd_startdate { get; set; }
        public DateTime? mktd_enddate { get; set; }
        public bool mktd_enabled { get; set; }
        public bool mktd_active { get; set; }
        public string mkt_campaigncode { get; set; }
        public string mkt_campaignhtmlfile { get; set; }
        public string mkt_subjectslogan { get; set; }
        public string mkt_reviewimage { get; set; }
    }

}