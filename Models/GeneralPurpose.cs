using MVC_TM.Infrastructure;
using System;
using System.Collections.Generic;
using System.Text;

namespace MVC_TM.Models
{

    public class PlacesHierarchy
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
        public string STR_PlaceMap { get; set; }
        public string STR_PlaceTitleDesc { get; set; }
    }

    public class DisplayOrder
    {
        public Int32 OrderNumber { get; set; }
        public string OrderName { get; set; }
    }
    public class DisplayTheme
    {
        public string SDP_DisplayTitle { get; set; }
        public string SDP_GroupTitleURL { get; set; }
        public string SDP_Description { get; set; }
        public Int32 SDP_Order { get; set; }
        public Int32 SDP_PlaceHierarchyID { get; set; }
        public Int32 SDP_GroupProdKindID { get; set; }
        public Int32 SDP_DisplayProdKindID { get; set; }
        public string SDP_TitleBGColor { get; set; }
    }

    public class BoxContent
    {
        public string STX_Title { get; set; }
        public string STX_URL { get; set; }
        public string STX_Description { get; set; }
        public string STX_PictureURL { get; set; }
        public Int32 STX_ProdKindID { get; set; }
        public Int32 STX_Priority { get; set; }
        public Int32 STX_PictureWidthpx { get; set; }
        public Int32 STX_PictureHeightpx { get; set; }
        public Int32 STX_CMSID { get; set; }
        public string CMS_Title { get; set; }
        public string CMS_Description { get; set; }
        public string CMS_Content { get; set; }
    }

    public class WeightPlace
    {
        public string STR_PlaceTitle { get; set; }
        public Int32 STR_PlaceID { get; set; }
        public string STR_PlaceShortInfo { get; set; }
        public Int32 STR_PlaceTypeID { get; set; }
        public Int32 SPW_Weight { get; set; }
        public Int32 STR_PlaceAIID { get; set; }
        public string Country { get; set; }
        public Int32 CountryID { get; set; }
    }

    public class DisplayBox
    {
        public string CMS_Content { get; set; }
        public Int32 STX_CMSID { get; set; }
        public string STX_Description { get; set; }
        public Int32 STX_PictureWidthpx { get; set; }
        public Int32 STX_PictureHeightpx { get; set; }
        public string STX_PictureURL { get; set; }
        public Int32 STX_Priority { get; set; }
        public Int32 STX_ProdKindID { get; set; }
        public string STX_Title { get; set; }
        public string STX_URL { get; set; }
        public string SDP_DisplayTitle { get; set; }
        public string SDP_TitleBGColor { get; set; }
    }
    public class CMScity
    {
        public string CMS_Title { get; set; }
        public string CMS_Content { get; set; }
        public string CMS_Description { get; set; }
        public Int64 CMSID { get; set; }
    }
    public class CMSPage
    {
        public Int32 CMSWID { get; set; }
        public string CMSW_Title { get; set; }
        public Int32 CMSW_Order { get; set; }
        public Int32 CMSID { get; set; }
        public string CMS_Title { get; set; }
        public string CMS_Content { get; set; }
        public Int32 CMSW_RelatedCmsID { get; set; }
        public string CMS_Description { get; set; }

    }
    public class CombineCoun
    {
        public string CouNA { get; set; }
        public Int32 CouID { get; set; }
    }

    public class CombineCountries : CombineCoun
    {
        public Int32 PlcID { get; set; }
        public string PlcNA { get; set; }
        public Int32 PlcTY { get; set; }
        public Int32 PlcRK { get; set; }
    }
    public class GP_PackOnInterestPriority
    {
        public Int32 SPPW_Weight { get; set; }
        public Int32 PDLID { get; set; }
        public string PDL_Title { get; set; }
        public Int32 PDL_Duration { get; set; }
        public Int32 PDL_SequenceNo { get; set; }
        public string PDL_Content { get; set; }
        public string PDL_Places { get; set; }
        public string PDL_Description { get; set; }
        public decimal STP_Save { get; set; }        
        public string SPD_Description { get; set; }
        public string IMG_Path_URL { get; set; }
        public string SPD_InternalComments { get; set; }
        public Int32 NoOfFeed { get; set; }
        public string CountryName { get; set; }
        public Int32 NoOfCountries { get; set; }
        public Int32 deptID { get; set; }
        public string CustComment { get; set; }
    }
}
