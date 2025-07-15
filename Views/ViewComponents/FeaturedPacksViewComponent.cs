using Microsoft.AspNetCore.Mvc;

namespace MVC_TM.Views.ViewComponents
{
    public class FeaturedPacksViewComponent : ViewComponent
    {
        public IViewComponentResult Invoke()
        {
            return View("Index");
        }
    }
}
