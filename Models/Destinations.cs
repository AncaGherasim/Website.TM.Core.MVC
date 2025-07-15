using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace MVC_TM.Models
{
    public class Destination
    {
        public Int32 RegionId { get; set; }
        public Int32 CountryId { get; set; }
        public string CountryName { get; set; }
        public Int32 CityId { get; set; }
        public string CityName { get; set; }
        public string CityInfo { get; set; }
        public Int32 Ranking { get; set; }
        public Int32 CityRank { get; set; }
        public string CountryInfo { get; set; }
        public Int32 CitiesTotal { get; set; }
    }

    public class Countryd:NameObject
    {
        public Int32 RegionId { get; set; }
        public Int32 Rank { get; set; }
        public List<Cityd> Cities { get; set; }
        public string Info { get; set; }
        public Int32 Total { get; set; }
    }

    public class Cityd : NameObject
    {
        public Int32 Rank { get; set; }
        public string CtyInfo { get; set; }
        public Int32 Total { get; set; }
    }

    public class CountryComparer : IEqualityComparer<Countryd>
    {
        public bool Equals(Countryd x, Countryd y)
        {
            return x.Id == y.Id;
        }

        public Int32 GetHashCode(Countryd x)
        {
            return x.Id.GetHashCode();
        }
    }

    public class CityInfo : NameObject
    {
        public string CityInfo_ { get; set; }
        public string CityDept { get; set; }
    }


}
