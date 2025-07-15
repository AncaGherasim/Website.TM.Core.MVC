using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace MVC_TM.Models.ViewModels
{
    public class TaxByCity
    {
        public List<TaxCityInfo> taxCountries = new List<TaxCityInfo>();
        public List<TaxCityInfo> taxCities = new List<TaxCityInfo>();
        public List<TaxCityInfo> taxAllData = new List<TaxCityInfo>();
    }
}
