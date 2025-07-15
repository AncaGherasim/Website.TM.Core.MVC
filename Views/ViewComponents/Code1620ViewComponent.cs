using Microsoft.AspNetCore.Mvc;

namespace MVC_TM.Views.ViewComponents
{
    public class Code1620ViewComponent : ViewComponent
    {
     public IViewComponentResult Invoke()
        {
            return View("Index");
        }
    }
}
