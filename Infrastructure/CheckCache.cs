using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using MVC_TM.Infrastructure;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;
using MVC_TM.Models;
using Microsoft.AspNetCore.Mvc.Filters;
using Microsoft.AspNetCore.Mvc.ModelBinding;
using Microsoft.AspNetCore.Hosting;

namespace MVC_TM.Infrastructure
{
    public class CheckCacheFilter : IAsyncActionFilter
    {
        public readonly DapperWrap _dapperWrap;
        public readonly IWebHostEnvironment _webHostEnvironment;

        public CheckCacheFilter(DapperWrap dapperWrap, IWebHostEnvironment webHostEnvironment)
        {
            _dapperWrap = dapperWrap;
            _webHostEnvironment = webHostEnvironment;
        }

        public async Task OnActionExecutionAsync(ActionExecutingContext context, ActionExecutionDelegate next)
        {
            Int32 ValidCache = 0;
            String DesktopOrMobile = "Desktop";
            String pageURL = context.HttpContext.Request.Path;
            string pathBase = context.HttpContext.Request.PathBase;
            //pageURL = "https://webtest.tripdev.net" + pageURL;
            pageURL = "https://www.tripmasters.com" + pageURL;
            object sCachedPage = "";

            if (Utilities.CheckMobileDevice())
            {
                DesktopOrMobile = "Mobile";
            }

            if (_webHostEnvironment.EnvironmentName != "Development")
            {
                IEnumerable<NameObject> cachedHTMLPageContents = new List<NameObject>();
                try
                {
                    cachedHTMLPageContents = await _dapperWrap.MySqlGetRecordsAsync<NameObject>("Select 0 As Id, CACHE_PageContent" + DesktopOrMobile + @" As Name FROM WEB_PageCache WHERE CACHE_PageURL = '" + pageURL +
                        @"' AND CACHE_Expire > NOW() AND CACHE_RefreshStatusCode" + DesktopOrMobile + " = 200 AND CACHE_Active = 1");
                    if (cachedHTMLPageContents.Count() > 0)
                    {
                        if (cachedHTMLPageContents.First().Name != "")
                        {
                            sCachedPage = cachedHTMLPageContents.First().Name;
                        }
                    }
                }
                catch (System.IO.IOException e)
                {
                    Console.WriteLine("TM-Error-Cache-MySql01: " + e.Message);
                    sCachedPage = e;
                }
                catch (System.Exception ex)
                {

                    Console.WriteLine("TM-Error-Cache-MySql02: " + ex.Message);
                    if (ex.InnerException != null)
                    {
                        Console.WriteLine(ex.InnerException.Message);
                    }

                }

                //            Object sCachedPage = await GetAuroraCachedPage(DesktopOrMobile, pageURL);
                if (sCachedPage is String)
                {
                    if (sCachedPage.ToString() != "")
                    {
                        ValidCache = 1;
                    }
                }
                else
                {
                    if (sCachedPage is System.IO.IOException)
                    {
                        if (context.Controller is Controller controller)
                        {
                            controller.ViewData["MySQLCachedError"] = "Catched MySQL error";
                        }
                        //ViewBag._HtmlCachedPage = "Catched MySQL error";
                    }
                    else
                    {
                        if (context.Controller is Controller controller)
                        {
                            controller.ViewData["MySQLCachedError"] = "Catched MySQL error";
                            Console.WriteLine("TM-Error-Cache-MySql03: Catched MySQL error");
                        }
                        //ViewBag._HtmlCachedPage = "Unknown error";
                    }
                }
            }

            if (ValidCache == 1)
            {
                CacheModel oo = new CacheModel();
                oo.cachecontent = sCachedPage.ToString();

                context.Result = new ViewResult
                {
                    ViewName = "~/Views/CachePage/HtmlCachePage.cshtml",
                    ViewData = new Microsoft.AspNetCore.Mvc.ViewFeatures.ViewDataDictionary(new EmptyModelMetadataProvider(), new ModelStateDictionary())
                    {
                        Model = sCachedPage.ToString()
                    }
                };

            }
            else
            {
                await next();
            }

        }

    }

    public class CacheModel
    {
        public string cachecontent { get; set; }
    }
}