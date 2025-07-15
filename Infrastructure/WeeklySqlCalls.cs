using System;
namespace MVC_TM.Infrastructure
{
    public class WeeklySqlCalls
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
        public static string SQL_WeeklyAllPackages(string packIDs)
        {
            return @"SELECT PRI.PDLID, CONT.STR_PlaceTitle as CountryNA, CONT.STR_UserID, 
                CASE 
                When CONT.STR_UserID = 595 then 'asia' 
                When CONT.STR_UserID = 182 then 'latin' 
                When CONT.STR_UserID = 243 then 'europe' 
                else '' end as deptNA,
                CONT.STR_PlaceAIID, PRI.PDL_Title , 
                Convert(money,isnull(STP.STP_Save,99999))as STP_Save, STP_NumOfNights, PRO.SPD_CountryPlaceID  
                ,STUFF((Select  ',' + STR_PlaceTitle  FROM STR_Places_Hierarchy CTY  
                WHERE (CTY.STR_Place1ParentID = CONT.STR_PlaceID OR CTY.STR_Place2ParentID = CONT.STR_PlaceID)
                AND CTY.STR_PlaceActive = 1 
                AND CTY.STR_PlaceTypeID in (25,1)
                AND CTY.STR_UserID in (243, 595, 182) 
                AND CTY.STR_PlaceAIID < 4 FOR XML PATH('')), 1, 1,'' ) as city
                , IMG.IMG_500Path_URL
				, PDL_Description
                , SPD_Description 
				, comment.Comment
				, comment.TvlDate
				, Feeds.NoOfFeed, overallscore.OverAllScore
                FROM PRD_ProductItem PRI 
                LEFT JOIN STR_SitePromotion STP ON PRI.PDLID = STP.STP_ProdItemID
				AND STP.STP_Active = 1 
                AND STP.STP_UserID in (243, 595, 182)
				AND STP.STP_StartDate <= CONVERT(VARCHAR(10), GETDATE(), 101)
                AND STP.STP_EndDate >= CONVERT(VARCHAR(10), GETDATE(), 101)
                INNER JOIN PRD_Product PRO ON PRO.SPDID = PRI.PDL_ProductID 
                INNER JOIN STR_Places_Hierarchy CONT ON (CONT.STR_PlaceID = PRO.SPD_CountryPlaceID) and STR_PlacePriority = 1
                LEFT JOIN PRD_ProductXImages PXI ON PXI.PXI_ProductID = PRI.PDL_ProductID AND PXI.PXI_Active = 1 AND PXI.PXI_Sequence = 0
                LEFT JOIN APP_Images IMG ON IMG.IMGID = PXI.PXI_ImageID AND IMG.IMG_Active = 1
				outer apply (SELECT COUNT (CF.PCCID) as NoOfFeed FROM PRD_CustomerComment CF WHERE CF.PCC_PDLID = PRI.PDLID  AND CF.PCC_Comment is not null AND LEN(cast(CF.PCC_Comment as varchar(8000))) > 15 AND CF.PCC_Active = 1 AND CF.PCC_Block = 0) as Feeds
                outer apply (SELECT round(avg(convert(decimal(12,2),pc.pcc_overallscore)),1) AS OverAllScore FROM prd_customercomment pc WHERE pc.pcc_pdlid = pri.pdlid AND pc.pcc_overallscore > 0 AND pc.pcc_detailid = 0 AND pc.pcc_active = 1 AND pc.pcc_block = 0) as overallscore				
				outer apply (SELECT top 1 pc.pcc_comment AS Comment, rh.dep_date as TvlDate FROM dbo.prd_customercomment pc
							 JOIN dbo.rsv_heading rh ON pc.pcc_bookingid = rh.id
							WHERE pc.pcc_pdlid = pri.pdlid AND pc.pcc_comment IS NOT NULL AND LEN(cast(pc.PCC_Comment as varchar(8000))) > 15 AND pc.pcc_active = 1 AND pc.pcc_block = 0 AND pc.pcc_comment not like '-----%' AND rh.dep_date > convert(Varchar(10),Getdate()-360,101)
							ORDER BY pc.pcc_ranking, rh.dep_date DESC) as comment
                WHERE PRI.PDLID in (" + packIDs + @") 
                AND CONT.STR_PlaceACtive = 1
                AND CONT.STR_NoWeb = 0
                AND CONT.STR_UserID in (243, 595, 182)
                ORDER BY STR_PlaceAIID, CountryNa , PDL_Title ASC";
        }

        public static string SQL_ThisWeekDeals(string date)
        {
            return @"
                SELECT *
                FROM MKT_TopDeals
                WHERE MKTD_StartDate = CONVERT(DATETIME, '" + date + @"', 112)
                AND MKTD_Active = 1 AND MKTD_Enabled = 1;
                ";
        }

        public static string PG_ThisWeekDeals(string date)
        {
            return @"
                SELECT *
                FROM dbo.mkt_topdeals
                WHERE mktd_startdate = TO_DATE('" + date + @"', 'YYYYMMDD')
                AND mktd_active is true
                AND mktd_enabled is true;";
        }
    }
}