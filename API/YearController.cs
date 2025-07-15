using HtmlAgilityPack;
using Microsoft.AspNetCore.Http;
using MVC_TM.Infrastructure;
using MVC_TM.Models;
using System.Collections.Generic;
using System.Linq;
using System.Text.RegularExpressions;
using System.Threading.Tasks;

namespace MVC_TM.API
{
    internal class YearController
    {
        private AppSettings appSettings;
        private DapperWrap dapperWrap;
        private IHttpContextAccessor cachedDataService;
        private CachedDataService cachedDataService1;

        public YearController(AppSettings appSettings, DapperWrap dapperWrap, CachedDataService cachedDataService1)
        {
            this.appSettings = appSettings;
            this.dapperWrap = dapperWrap;
            this.cachedDataService1 = cachedDataService1;
        }

        public async Task<List<YearFaqQR>> SqlFaqCms(int? cmsId)
        {
            var listFaq = new List<YearFaqQR>();
            Regex rgxNum = new Regex(@"\d+");
            var cmsString = "";
            var rgxExp = @"class=""aCMStxtLink""";

            List<CMS_WebsiteContent> cmsContent = new List<CMS_WebsiteContent>();
            var result = await dapperWrap.GetRecords<CMS_WebsiteContent>("Select CMS_Content From CMS_WebsiteContent where CMSID = " + cmsId);
            cmsContent = result.ToList();
            try
            {
                cmsString = Regex.Replace(cmsContent[0].CMS_Content, rgxExp, "", RegexOptions.IgnoreCase);
                var htmlDoc = new HtmlDocument();
                htmlDoc.LoadHtml(cmsString);
                HtmlNode docRoot = htmlDoc.DocumentNode;
                HtmlNodeCollection aNodesColl = docRoot.SelectNodes("//a");
                if (aNodesColl != null)
                {
                    foreach (HtmlNode lnk in aNodesColl)
                    {
                        var hrefVal = lnk.GetAttributeValue("href", "");
                        var hrefTxt = lnk.InnerHtml;
                        Match rgxMtch = rgxNum.Match(hrefVal);
                        if (rgxMtch.Success)
                        {
                            cmsString = cmsString.Replace(hrefVal, "/" + hrefTxt + "/" + rgxMtch.Value.ToString() + "/cms.aspx");
                            hrefVal = "/" + hrefTxt + "/" + rgxMtch.Value.ToString() + "/cms.aspx";
                        }
                        if (!Regex.IsMatch(hrefVal, "www.tripmasters.com", RegexOptions.IgnoreCase))
                        {
                            cmsString = cmsString.Replace(hrefVal, "https://www.tripmasters.com" + hrefVal);
                            hrefVal = "https://www.tripmasters.com" + hrefVal;
                        }
                        if (lnk.Attributes["target"] == null)
                        {
                            var target = @"target=""_blank""";
                            cmsString = cmsString.Replace(@"href=""" + hrefVal + "", target + @" href=""" + hrefVal + "");
                        }
                    }
                }
                htmlDoc = null;
                var doc = new HtmlDocument();
                doc.LoadHtml(cmsString);
                var ps = doc.DocumentNode.Descendants("p");
                string que = "";
                string ans = "";
                int cmsC = 0;
                if (ps != null)
                {
                    foreach (var cms in ps)
                    {
                        if (cms.Attributes["class"] == null)
                        {
                            listFaq.Clear();
                            listFaq.Add(new YearFaqQR() { FaqQuestion = "none", FaqResponse = "none" });
                            break;
                        }
                        if (cms.GetAttributeValue("class", "") == "spCMSContentTitle")
                        {
                            que = cms.InnerHtml;
                            cmsC = cmsC + 1;
                        }
                        if (cms.GetAttributeValue("class", "") == "spCMSContentText")
                        {
                            ans = cms.InnerHtml;
                            cmsC = cmsC + 1;
                        }
                        if (cmsC > 0 && cmsC % 2 == 0)
                        {
                            listFaq.Add(new YearFaqQR() { FaqQuestion = que, FaqResponse = ans });
                            cmsC = 0;
                        }
                    }
                }
                doc = null;
            }
            catch (System.IO.IOException ex)
            {
                cmsString = ex.Message;
            }
            return listFaq;
        }
    }
}