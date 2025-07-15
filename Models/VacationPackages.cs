using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace MVC_TM.Models
{
    public class VacPacks
    {
        public Int32 PDLID { get; set; }
        public string PDL_Title { get; set; }
        public string Included { get; set; }
        public Int32 PDL_SequenceNo { get; set; }
        public Int32 STP_UserID { get; set; }
        public string DeptNA { get; set; }
        public Decimal STP_Price { get; set; }
        public Decimal STP_Save { get; set; }
        public string PLC_Title { get; set; }
        public Int64 STP_NumOfNights { get; set; }
        public DateTime STP_StartTravelDate { get; set; }
        public string SPD_InternalComments { get; set; }
        public Int32 SPD_Producttypesyscode { get; set; }
        public string SPD_Description { get; set; }
        public Int32 CityID { get; set; }
        public string CityName { get; set; }
        public Int32 CountryID { get; set; }
        public string CountryName { get; set; }
        public string IMG_Path_URL { get; set; }
        public string IMG_500Path_URL { get; set; }
        public string IMG_Title { get; set; }
        public Int32 NoOfFeed { get; set; }

    }
    public class vacPacksNumCustFeedbacks
    {
        public Int32 NumComments { get; set; }
        public decimal Score { get; set; }
    }
}
