using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;
using MVC_TM.Infrastructure;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using MVC_TM.Models;

namespace MVC_TM.Controllers
{
    public class CmsController : Controller
    {
        private readonly AppSettings _appSettings;
        private readonly DapperWrap _dapperWrap;
        private readonly IHttpContextAccessor _httpContextAccessor;

        public CmsController(IOptions<AppSettings> appsettings, DapperWrap dapperWrap, IHttpContextAccessor httpContextAccessor)
        {
            _appSettings = appsettings.Value;
            _dapperWrap = dapperWrap;
            _httpContextAccessor = httpContextAccessor;

        }
        [HttpGet("{name?}/cms")]
        [HttpGet("cms/{id?}")]
        [HttpHead("{name?}/cms")]
        [HttpHead("cms/{id?}")]
        [HttpPost("{name?}/cms")]
        [HttpPost("cms/{id?}")]
        public async Task<IActionResult> Cms(string name, string id)
        {
            HttpContext.Response.Headers.Add("_utPg", "pageCMS");

            Models.ViewModels.CmsViewModel content = new Models.ViewModels.CmsViewModel();
            Int32 cmsId;
            string pageTitle = String.Empty;
            string linkName = String.Empty;
            string cmsVal = String.Empty;
            Int32 canonicalIdcms;
            content.nameCanonical = name;
         
            if (id != null)
            {
                try
                {
                    cmsId = Int32.Parse(id);
                    var result = await _dapperWrap.GetRecords<CMSContent>(SqlCalls.SQL_CMSContent(cmsId));
                    content.cms = result.ToList();
                    
                    linkName = content.cms.First().CMS_Description != null ? content.cms.First().CMS_Description : content.cms.First().CMS_Title;
                    if (linkName.Contains("-") == true)
                    {
                        var subSts = linkName.Split("-");
                        linkName = subSts[1].Trim();
                    }
                    pageTitle = linkName + " | Tripmasters"; //content.cms.First().CMS_Description + " | Tripmasters";

                }
                catch (System.IO.IOException ex)
                {
                    throw new Exception(ex.Message);
                }
                //return RedirectPermanent(_appSettings.ApplicationSettings.SiteName + "/" + content.cms.First().CMS_Description.ToLower().Replace(" ", "_") + "/cms?cms=" + id + HttpContext.Request.QueryString.Value.Replace("?", "&"));
                return RedirectPermanent(_appSettings.ApplicationSettings.SiteName + "/" + linkName.ToLower().Replace(" ", "_") + "/cms?cms=" + id + HttpContext.Request.QueryString.Value.Replace("?", "&"));
            }
            else
            {
                ////www.tripmasters.com/driving_in_bulgaria/cms 
                ////www.tripmasters.com/salzburg_-_where_to_stay/cms?cms
                ///
                pageTitle = String.Empty;
                if (_httpContextAccessor.HttpContext.Request.Query["cms"].Count > 0)
                {
                    cmsVal = _httpContextAccessor.HttpContext.Request.Query["cms"].ToString();
                    Console.WriteLine("******* cmsVal: " + cmsVal);
                    if (cmsVal != "")
                    {
                        cmsId = Int32.Parse(cmsVal);
                        canonicalIdcms = cmsId;
                        content.idCanonical = canonicalIdcms.ToString();
                        cmsVal = "none";
                        try
                        {
                            var result = await _dapperWrap.GetRecords<CMSContent>(SqlCalls.SQL_CMSContent(cmsId));
                            content.cms = result.ToList();
                         
                            pageTitle = content.cms.First().CMS_Description + " | Tripmasters";
                        }
                        catch (System.IO.IOException ex)
                        {
                            throw new Exception(ex.Message);
                        }
                    }
                    else
                    {
                        cmsVal = name.Replace("_", " ");
                    }
                }
                else
                {
                    cmsVal = name.Replace("_", " ");

                }

                if (cmsVal != "none")
                {
                    try
                    {
                        var result = await _dapperWrap.GetRecords<CMSContent>(SqlCalls.SQL_CMSContentByDesc(cmsVal));
                        content.cms = result.ToList();
                        pageTitle = content.cms.First().CMS_Description + " | Tripmasters";
                    }
                    catch (System.IO.IOException ex)
                    {
                        throw new Exception(ex.Message);
                    }
                }
            }


            if (pageTitle == "none" || pageTitle == "")
            {
                pageTitle = name + " | Tripmasters";
            }

            ViewBag.cmsFooter = 0;

            return View("Cms", content);
        }
    }
}
