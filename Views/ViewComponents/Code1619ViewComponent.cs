using Microsoft.AspNetCore.Mvc;

namespace MVC_TM.Views.ViewComponents
{
    public class Code1619ViewComponent : ViewComponent
    {
     public IViewComponentResult Invoke()
        {
            return View("Index");
        }
    }
}
