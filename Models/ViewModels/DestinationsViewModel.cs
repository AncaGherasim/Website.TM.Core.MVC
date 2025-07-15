using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace MVC_TM.Models.ViewModels
{
    public class DestinationsViewModel
    {
        public List<Countryd> countries = new List<Countryd>();

        public List<cityDestinations> listcities = new List<cityDestinations>();
        public List<String> boxCtyinCon = new List<string>();
        public List<cityDestinations> listcity = new List<cityDestinations>();

        public Int32 cityID = 0;
        public string cityName = "";
        public Int32 cityType = 0;
        public string cityInfo = "";
        public string placeNA = "";
    }
}
