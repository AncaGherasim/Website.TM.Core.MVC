using System;

namespace MVC_TM.Infrastructure
{
    public class PostgresCalls
    {
        public static string PG_MV_FooterDestinations()
        {
            return @"SELECT regionid, countryid, countryname, cityid, cityname, cityrank
                     FROM dbo.web_tm_mv_destinations
                     WHERE cityrank < 2
                     ORDER BY regionid ASC, countryname ASC, cityrank ASC";
        }
        public static string PG_MV_TopDealsPackages()
        {
            return @"SELECT * from dbo.web_tm_mv_topdealspage Order by (CASE stp_userid
            WHEN 243 THEN 1
            WHEN 595 THEN 2
            WHEN 182 THEN 3
            ELSE NULL::integer
            END), stp_userid, stp_startdate DESC";
        }
        public static string PG_Func_iMaxMind() 
        {
            return @"SELECT * FROM dbo.imaxmind_placebyip_web(@ipAdr)";
        }
        public static string PG_MV_Feedbacks()
        {
            return @"select * from dbo.web_tm_mv_feedbacks";
        }
    }
}
