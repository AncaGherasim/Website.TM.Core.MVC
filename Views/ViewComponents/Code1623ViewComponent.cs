using Microsoft.AspNetCore.Mvc;

namespace MVC_TM.Views.ViewComponents
{
    public class Code1623ViewComponent : ViewComponent
    {
     public IViewComponentResult Invoke()
        {
            return View("Index");
        }
    }
}
