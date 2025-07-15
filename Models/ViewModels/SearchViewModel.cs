using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace MVC_TM.Models.ViewModels
{
    public class SearchViewModel
    {
        public List<NameObject> Countries = new List<NameObject>();
        public List<NameObject> Cities = new List<NameObject>();
        public List<NameObject> Interests = new List<NameObject>();
        public List<Filter> Prices = new List<Filter>();
        public List<Filter> StayLengths = new List<Filter>();
        public System.Xml.XmlNodeList xmlPackIds;
        public Newtonsoft.Json.Linq.JArray packages;
    }
}
