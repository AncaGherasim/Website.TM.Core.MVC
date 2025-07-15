using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace MVC_TM.Models.ViewModels
{
    public class TopDealsViewModel
    {
        public List<TopDealsPacks> featTopDeals;
        public List<TopDealsPacks> moreTMEDTopDeals = new List<TopDealsPacks>();
        public List<TopDealsPacks> moreTMASTopDeals = new List<TopDealsPacks>();
        public List<TopDealsPacks> moreTMLDTopDeals = new List<TopDealsPacks>();
        public List<allCountries> allCountry = new List<allCountries>();
    }
}
