using Microsoft.AspNetCore.Mvc;

namespace MVC_TM.Views.ViewComponents
{
    public class Code1882ViewComponent : ViewComponent
    {
     public IViewComponentResult Invoke()
        {
            return View("Index");
        }
    }
}
