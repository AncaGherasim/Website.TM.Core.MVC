using System;
using System.Collections.Generic;

namespace MVC_TM.Models.ViewModels
{
    public class VacPacksViewModel
    {
        public List<VacPacks> vacPackManager = new List<VacPacks>();
        public List<VacPacks> vacPackTMED = new List<VacPacks>();
        public List<VacPacks> vacPackTMLD = new List<VacPacks>();
        public List<VacPacks> vacPackTMAS = new List<VacPacks>();
        public List<vacPacksNumCustFeedbacks> vacPackNumCustFeed = new List<vacPacksNumCustFeedbacks>();
        public Int32 vpNumComments;
        public decimal vpScore;
        public List<VacPacks> TMStarted = new List<VacPacks>();
    }   
}
