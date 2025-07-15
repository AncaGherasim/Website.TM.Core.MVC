using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace MVC_TM.Models.ViewModels
{
    public class CmsViewModel
    {
        public List<CMSContent> cms = new List<CMSContent>();
        public string nameCanonical = "";
        public string idCanonical ="";
    }
}
