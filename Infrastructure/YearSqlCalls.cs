using System;
namespace MVC_TM.Infrastructure
{
    public class YearSqlCalls
    {
        public static string SQL_YearPlaceInfo(string placeName)
        {
            return @"SELECT STR_UserID,STRID,STR_PlaceID,STR_PlaceTitle,STR_PlaceTypeID,isNull(STR_PageTemplate,'T1') as STR_PageTemplate, STR_PlacePriority
  		                 FROM STR_Places_Hierarchy
  		                 WHERE STR_PlaceActive = 1 AND 
  		                 STR_UserID in (243, 595, 182)
  		                 And STR_NoWeb = 0 AND 
  		                 STR_ProdKindID = 0
  		                 And STR_PlaceTitle LIKE '" + placeName + @"'";
        }
        public static string SQL_YearAllPackages(string packIDs)
        {
            return @"SELECT PRI.PDLID,PRI.PDL_Title, Convert(money, isnull(STP.STP_Save, 99999)) as STP_Save 
  		                      ,CASE WHEN STP.STP_NumOfNights is null then PRI.PDL_Duration ELSE STP.STP_NumOfNights END as STP_NumOfNights
  		                      ,HRCH.STR_PlaceTitle as CityNA, PRO.SPD_CountryPlaceID, PRI.PDL_Description, CONT.STR_PlaceTitle as CountryName, img.IMG_Path_URL
  		                      ,(SELECT COUNT(CF.PCCID) FROM PRD_CustomerComment CF INNER JOIN RSV_Heading CFH with(nolock) ON CF.PCC_BookingID = CFH.ID
  		                      WHERE CF.PCC_PDLID = PRI.PDLID AND CF.PCC_Comment is not null AND LEN(cast(CF.PCC_Comment as varchar(8000))) > 15 AND CF.PCC_Active = 1 AND CF.PCC_Block = 0 AND CHARINDEX('---', CF.PCC_Comment) = 0) as NoOfFeed
  		                      ,(SELECT top 1 convert(varchar(1000), CF.PCC_Comment) FROM PRD_CustomerComment CF INNER JOIN RSV_Heading CFH with(nolock) ON CF.PCC_BookingID = CFH.ID
  		                      WHERE CF.PCC_PDLID = PRI.PDLID AND CF.PCC_Comment is not null AND LEN(cast(CF.PCC_Comment as varchar(8000))) > 15 AND CF.PCC_Active = 1 AND CF.PCC_Block = 0 AND CHARINDEX('---', CF.PCC_Comment) = 0 AND CFH.dep_date > convert(Varchar(10), Getdate() - 1095, 101) ORDER BY CF.PCC_Ranking ASC, CFH.dep_date DESC) as Comment
  		                      ,(SELECT top 1 CFH.dep_date FROM PRD_CustomerComment CF INNER JOIN RSV_Heading CFH with(nolock) ON CF.PCC_BookingID = CFH.ID
  		                      WHERE CF.PCC_PDLID = PRI.PDLID AND CF.PCC_Comment is not null AND LEN(cast(CF.PCC_Comment as varchar(8000))) > 15 AND CF.PCC_Active = 1 AND CF.PCC_Block = 0 AND CHARINDEX('---', CF.PCC_Comment) = 0 AND CFH.dep_date > convert(Varchar(10), Getdate() - 1095, 101) ORDER BY CF.PCC_Ranking ASC, CFH.dep_date DESC) as dep_date
  		 					 , overallscore.OverAllScore
  		                      FROM STR_SitePromotion STP
  		                      INNER JOIN PRD_ProductItem PRI ON PRI.PDLID = STP.STP_ProdItemID
  		                      INNER JOIN PRD_Product PRO ON PRO.SPDID = PRI.PDL_ProductID
  		                      INNER JOIN STR_Places_Hierarchy HRCH ON(HRCH.STR_PlaceID = PRO.SPD_StatePlaceID) AND(HRCH.STR_PlaceActive = 1) AND(HRCH.STR_UserID = STP.STP_UserID) AND(HRCH.STR_NoWeb = 0)
  		                      INNER JOIN STR_Places_Hierarchy CONT ON(CONT.STR_PlaceID = PRO.SPD_CountryPlaceID) AND(CONT.STR_PlaceActive = 1) AND(CONT.STR_UserID = STP.STP_UserID) AND(CONT.STR_NoWeb = 0)
  		                      LEFT JOIN PRD_ProductXImages PxImg ON PxImg.PXI_ProductID = PRI.PDL_ProductID AND(PxImg.PXI_Sequence = 0) And PxImg.PXI_Active = 1
  		                      LEFT JOIN APP_Images Img ON Img.IMGID = PxImg.PXI_ImageID
  		                      outer apply(SELECT avg(pc.pcc_overallscore) AS OverAllScore FROM prd_customercomment pc WHERE pc.pcc_pdlid = pri.pdlid AND pc.pcc_overallscore > 0 AND pc.pcc_detailid = 0 AND pc.pcc_active = 1 AND pc.pcc_block = 0) as overallscore
  		                      WHERE STP.STP_UserID = 243 AND STP.STP_Active = 1 AND STP.STP_StartDate <= CONVERT(VARCHAR(10), GETDATE(), 101) AND STP.STP_EndDate >= CONVERT(VARCHAR(10), GETDATE(), 101)
  		                      AND PRI.PDL_Active = 1 AND PRI.PDL_NoWeb = 0 AND PRO.SPD_Active = 1 AND PRO.SPD_Producttypesyscode = 34                    
  		                      AND PRI.PDLID in (" + packIDs + @")";
        }

        public static string SQL_YearCMSByplaceID(string placeId)
        {
            return @"  SELECT Xcms.CMSW_Title, Xcms.CMSW_Order, Xcms.CMSW_RelatedCmsID, isnull(CSM.CMS_Description,'none') as CMS_Description
  		                  FROM STR_WebHierarchyXCMS Xcms
  		                  INNER JOIN STR_Places_Hierarchy plcH ON plcH.STR_PlaceID = " + placeId + @" AND STR_PlaceActive = 1 AND STR_UserID = 243
  		                  INNER JOIN CMS_WebsiteContent CSM ON Csm.CMSID = Xcms.CMSW_RelatedCmsID
  		                  AND CSM.CMS_Active = 1
  		                  WHERE 
  		                  Xcms.CMSW_Active = 1
  		                  AND Xcms.CMSW_WebHierarchyID = plcH.STRID 
  		                  AND Xcms.CMSW_MasterContentID = 0 
  		                  ORDER BY Xcms.CMSW_Order ASC";
        }

        public static string SQL_YearCommentOverall()
        {
            return @"SELECT count(*) as NumComments,avg(cast(PCC_OverallScore as decimal)) as Score from PRD_CustomerComment 
  		                 WHERE PCC_OverallScore > 0 AND PCC_DetailID = 0 AND PCC_Active = 1 AND PCC_Block = 0";
        }

        public static string SQL_YearCountryComment(string placeId)
        {
            return @"Select PLCO.STR_PlaceTitle as Name, PLCO.STR_PlaceID as Id, count(CF.PCCID) As NoOfFeedbacks
  		                From STR_Places_Hierarchy PLCO 
  		                inner join PRD_PlaceXProductItem pXp on pXp.CXZ_ChildPlaceID = PLCO.STR_PlaceID and pXp.CXZ_Active = 1 
  		                inner join PRD_ProductItem pri ON pXp.CXZ_ProductItem = pri.PDLID and pri.PDL_NoWeb = 0 and pri.PDL_Active = 1 
  		                inner join PRD_CustomerComment CF on pri.PDLID = CF.PCC_PDLID 
  		                Where PLCO.STR_PlaceID in (" + placeId + @") and PLCO.STR_UserID = 243
  		                and PLCO.STR_NoWeb = 0 and PLCO.STR_PlaceActive = 1 and PLCO.STR_PlaceTypeID = 5 and PLCO.STR_ProdKindID = 0 
  		                and datalength(CF.PCC_Comment) > 15 and CF.PCC_Active = 1 and CF.PCC_Block = 0 
  		                group by PLCO.STR_PlaceTitle, PLCO.STR_PlaceID";
        }

        public static string SQL_YearCountryDestinations(string placeId, string userId)
        {
            return @"SELECT STR_PlaceID
  		                 , STR_PlaceTitle
  		                 , STR_PlaceTypeID
  		                 , isnull(STR_PlaceAIID, '2000') as STR_PlaceAIID
  		                 , STR_Place1ParentID               
  		                 FROM STR_Places_Hierarchy
  		                 WHERE(STR_Place1ParentID = " + placeId + @")
  		                 AND(STR_PlaceActive = 1)
  		                 AND(STR_UserID = " + userId + @")
  		                 AND(STR_PlaceTypeID in (25,6))
  		                 AND(STR_NoWeb = 0)
  		                 AND(STR_PlaceTitle not like 'zz%') AND(STR_PlaceTitle not like 'zPend%')
  		 				AND (STR_PlacePriority = 1)               
  		                 ORDER BY STR_PlaceAIID ASC, STR_PlaceTypeID DESC";
        }
    }
}