using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace MVC_TM.Models.ViewModels
{
    public class RecentlyViewedViewModel
    {
        public List<LastVisits> visits = new List<LastVisits>();
        public List<VisitedPacks> lastVisitedPacks = new List<VisitedPacks>();
    }
}
