using System;
namespace MVC_TM.Infrastructure
{
    public class GpSqlCalls
    {
        public static string SQL_GP_Vacations_Places_Hierarchy_Priority(string PlaceTitle)
        {
            return @"SELECT STR_UserID,STRID,STR_PlaceID,STR_PlaceTitle,STR_PlaceTypeID,STR_PageTemplate, STR_PlacePriority, STR_PlaceMap, STR_PlaceTitleDesc, STR_PlaceShortInfo
                FROM STR_Places_Hierarchy
                WHERE STR_PlaceActive = 1 AND 
                STR_UserID in (255)
                And STR_NoWeb = 1 
                And STR_PlaceTitle LIKE 'GP " + PlaceTitle + "'";
        }

        public static string SQL_GP_Place_Info(string objId)
        {
            return @"SELECT SEO_PageTitle, SEO_MetaDescription, SEO_MetaKeyword, SEO_HeaderText
                         FROM STR_Places_Hierarchy 
                         LEFT JOIN  MKT_WebSEO ON SEO_STRID = STRID
                         AND SEO_Active = 1
                         WHERE STR_UserID in (255)
                         AND STR_PlaceActive = 1 
                         AND STR_NoWeb = 1 
                         AND STRID IN (" + objId + @")";
        }
        public static string SQL_GP_PackOnInterestPriorityList(string plcIDs, string intIDs)
        {
            return @"SELECT PXW.SPPW_Weight
                 , PRI.PDLID
                 , PRI.PDL_Title
                 , PRI.PDL_Duration
                 , PRI.PDL_SequenceNo
                 , PRI.PDL_Content
                 , PRI.PDL_Description
                 , isnull(STPR.STP_Save, 9999) STP_Save
                 , PRO.SPD_Description
                 , IMG.IMG_500Path_URL as IMG_Path_URL
                 ,(SELECT top 1 isnull(CF.PCC_Comment, 'none') as CustComment
                  FROM PRD_CustomerComment CF 
                  INNER JOIN RSV_Heading CFH with (nolock) ON CF.PCC_BookingID = CFH.ID
                  WHERE CF.PCC_PDLID = PRI.PDLID 
                  AND CF.PCC_Comment is not null
                  AND LEN(cast(CF.PCC_Comment as varchar(8000))) > 15
                  AND CF.PCC_Active = 1 
                  AND CF.PCC_Block = 0) as CustComment             
                 , isnull((select top 1 [STR_PlaceTitle] from [dbo].[STR_Places_Hierarchy] ph where ph.[STR_PlaceID] = pro.[SPD_CountryPlaceID] and ph.[STR_NoWeb]=0 and ph.[STR_PlaceActive]=1 and ph.STR_UserID in (243, 595, 182)),'none') as CountryName
				 , isnull((select top 1 [STR_userID] From STR_Places_Hierarchy pp where pp.STR_PlaceID = pro.SPD_CountryPlaceID and pp.STR_NoWeb = 0 and pp.STR_placeActive = 1 and pp.STR_UserID in (243, 595, 182)),000) as deptID                 
                 FROM STR_PlacesXPackageWeight PXW
                  INNER JOIN PRD_ProductItem PRI ON PRI.PDLID = PXW.SPPW_PackageID 
                  AND PRI.PDL_Active = 1 and pri.PDL_NoWeb = 0 
                  INNER JOIN PRD_Product PRO ON PRO.SPDID = PRI.PDL_ProductID
                  AND PRO.SPD_Active = 1
                  LEFT JOIN STR_SitePromotion STPR ON STPR.STP_ProdItemID = PXW.SPPW_PackageID
                  AND STPR.STP_Active = 1 
                  AND STPR.STP_StartDate <= Convert(VARCHAR(10), GETDATE(), 101) 
                  AND STPR.STP_EndDate >= CONVERT(VARCHAR(10), GETDATE(), 101)
                  Left JOIN PRD_ProductXImages Pic ON Pic.PXI_ProductID = PRI.PDL_ProductID and Pic.PXI_Active = 1 AND Pic.PXI_Sequence = 0
                  Left JOIN APP_Images IMG ON IMG.IMGID = Pic.PXI_ImageID
                  WHERE PXW.SPPW_Active = 1 AND IMG.IMG_Active = 1 
                  AND PXW.SPPW_ParentPlace = " + plcIDs + @" 
                  AND PXW.SPPW_MasterContentID = " + intIDs + @" 
                  ORDER BY PXW.SPPW_Weight";
        }

        public static string SQL_GP_ManagerDisplayTheme(Int32 AreaID)
        {
            return @"Select SDP_DisplayTitle
                  , isnull(SDP_GroupTitleURL,'none') as SDP_GroupTitleURL
                  , isnull(SDP_Description,'none') as SDP_Description
                  , isnull(SDP_Order,0) as SDP_Order
                  , isnull(SDP_PlaceHierarchyID,0) as SDP_PlaceHierarchyID
                  , isnull(SDP_GroupProdKindID,0) as SDP_GroupProdKindID
                  , isnull(SDP_DisplayProdKindID,0) as SDP_DisplayProdKindID
                  , isnull(SDP_TitleBGColor,'none') as SDP_TitleBGColor
                  From STR_Places_Hierarchy 
                  inner join STR_DisplayPosition on SDP_PlaceHierarchyID = STRID
                  Where   
                  STRID = " + AreaID + @" 
                  and STR_PlaceActive = 1
                  and SDP_MasterContentID = 0
                  and SDP_Active = 1                 
                  order by  SDP_DisplayProdKindID, SDP_Order ASC";
        }

        public static string SQL_GP_BoxesContentArea(Int32 AreaID)
        {
            return @"Select PLD.STX_Title
                  , isnull(PLD.STX_URL,'none') as STX_URL
                  , isnull(STX_Description,'none') as STX_Description
                  , isnull(PLD.STX_PictureURL,'none') as STX_PictureURL
                  , PLD.STX_ProdKindID
                  , PLD.STX_Priority
                  , isnull(PLD.STX_PictureHeightpx,0) as STX_PictureHeightpx
                  , isnull(PLD.STX_PictureWidthpx,0) as STX_PictureWidthpx
                  , isnull(PLD.STX_CMSID,0) as STX_CMSID
                  , isnull(CWS.CMS_Title,'none') as CMS_Title
                  , isnull(CWS.CMS_Description, 'none') as CMS_Description
                  , isnull(CWS.CMS_Content,'none') as CMS_Content
                  From STR_PlaceDescription PLD
                  LEFT JOIN CMS_WebsiteContent CWS ON CWS.CMSID = PLD.STX_CMSID
                  AND CWS.CMS_Active = 1
                  Where(STX_UserID in(255, 243))
                  AND PLD.STX_Active = 1 AND PLD.STX_MasterContentID = 0 AND PLD.STX_StrId =  " + AreaID + @" 
                  ORDER BY PLD.STX_ProdKindID, PLD.STX_Priority";
        }
        public static string SQL_GP_CMS_onGPpages(string pgTyp, Int32 intIDs, Int32 plcIDs)
        {
            string q = @"Select XCM.CMSWID
                , XCM.CMSW_Title
                , XCM.CMSW_Order
                , CWC.CMSID
                , CWC.CMS_Title
                , CWC.CMS_Content
                From STR_WebHierarchyXCMS XCM
                LEFT JOIN CMS_WebsiteContent CWC ON CWC.CMSID = XCM.CMSW_RelatedCmsID
                AND CWC.CMS_Active = 1";
            if (pgTyp == "WInt")
            {
                q = q + @" Where (XCM.CMSW_masterContentID = " + intIDs + @")";
            }
            if (pgTyp == "PlcH")
            {
                q = q + @" Where (CMSW_WebHierarchyId = " + plcIDs + @")";
            }
            q = q + @" AND XCM.CMSW_Active = 1
                ORDER BY XCM.CMSW_Order ASC";
            return q;
        }

        public static string SQL_GP_Get_NumberofCustomerFeedbacks_OverAllScore()
        {
            return @"SELECT count(*) as NumComments,avg(cast(PCC_OverallScore as decimal)) as Score from PRD_CustomerComment 
                WHERE PCC_OverallScore > 0 AND PCC_DetailID = 0 AND PCC_Active = 1 AND PCC_Block = 0";
        }
    }
}
