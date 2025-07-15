using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace MVC_TM.Models.ViewModels
{
    public class ContactAgentViewModel
    {
        public List<ContactAgent> contactAgent = new List<ContactAgent>();
        public List<Tuple<string, string, string>> schedule = new List<Tuple<string, string, string>>();
        public Tuple<string, string, string> workToday = new Tuple<string, string, string>("", "", "");
    }
}
