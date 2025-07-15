using Microsoft.AspNetCore.Mvc;

namespace MVC_TM.Views.ViewComponents
{
    public class Code2478_70ViewComponent : ViewComponent
    {
     public IViewComponentResult Invoke()
        {
            return View("Index");
        }
    }
}
