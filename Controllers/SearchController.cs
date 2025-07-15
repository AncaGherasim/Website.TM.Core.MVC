using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using MVC_TM.Infrastructure;
using MVC_TM.Models;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Threading.Tasks;
using Dapper;
using Newtonsoft.Json.Linq;
using System.Drawing;
using System.Text.RegularExpressions;

namespace MVC_TM.Controllers
{
    public class SearchController : Controller
    {
        private readonly AppSettings _appSettings;
        private readonly DapperWrap _dapperWrap;

        public SearchController(IOptions<AppSettings> appSettings, DapperWrap dapperWrap)
        {
            _appSettings = appSettings.Value;
            _dapperWrap = dapperWrap;
        }

        [HttpGet("/search", Name = "Search_Route")]
        [HttpHead("/search", Name = "Search_Route")]
        [HttpPost("/search", Name = "Search_Route")]
        public IActionResult Index()
        {
            HttpContext.Response.Headers.Add("_utPg", "SEARCH");

            //string q = HttpContext.Request.QueryString.Value;
            string q = HttpContext.Request.Query["q"].ToString();
            q = q.Replace("?q=", "").Replace("_", " ");
            if (q.Contains("&"))
            {
                q = q.Replace("&", "and");
            }

            Models.ViewModels.SearchViewModel viewmodelSearch = new Models.ViewModels.SearchViewModel();

            string qOptions = "&q.options={fields:['title^1', 'cities^20', 'city^1', 'country^1', 'countries^1','interests^1', 'pkgid^1','description^0.5', 'include^0.25']}";
            string awsURL = "http://search-tripmasters-ddvbbeyrdp2xmv66q4il4ihzbm.us-east-1.cloudsearch.amazonaws.com/2013-01-01/search?q=" + q + "&format=json&size=10000&return=_all_fields,_score" + qOptions;
            //string awsURL = "c:/Work/costa-rica.json"; // "e:/qqq.json";

            System.Net.WebRequest awsrequest = System.Net.WebRequest.Create(awsURL);
            System.Net.WebResponse resp = awsrequest.GetResponse();
            System.IO.Stream respStream = resp.GetResponseStream();

            var sr = new System.IO.StreamReader(respStream);
            var jsonTextReader = new JsonTextReader(sr);
            var serializer = new JsonSerializer();
            var myJObject = Newtonsoft.Json.Linq.JObject.Parse(serializer.Deserialize(jsonTextReader).ToString());

                var countries =
                    (from p in myJObject["hits"]["hit"].Children()["fields"]["countries"].Values<string>()
                     select p);
                foreach (var c in countries)
                {
                        viewmodelSearch.Countries.Add(new NameObject() { Id = -1, Name = c.ToString() });
                }

                var cities =
                    (from p in myJObject["hits"]["hit"].Children()["fields"]["cities"].Values<string>()
                     select p).ToList();
                foreach (var c in cities)
                {
                    viewmodelSearch.Cities.Add(new NameObject() { Id = -1, Name = c.ToString() });
                }

                var prices =
                    (from p in myJObject["hits"]["hit"].Children()["fields"]["price"]
                     select p).ToList();
                foreach (var c in prices)
                {
                    if (c.ToString() != "9999")
                    {
                        if (Decimal.Parse(c.ToString()) <= 999)
                        {
                            if (viewmodelSearch.Prices.Where(x => x.Value == "0_999").Count() == 0) { viewmodelSearch.Prices.Add(new Filter() { Title = "999 or less", Value = "0_999", Index = 1 }); }
                        }
                        if (Decimal.Parse(c.ToString()) >= 1000 && Decimal.Parse(c.ToString()) <= 1999)
                        {
                            if (viewmodelSearch.Prices.Where(x => x.Value == "1000_1999").Count() == 0) { viewmodelSearch.Prices.Add(new Filter() { Title = "1000 - 1999", Value = "1000_1999", Index = 2 }); }
                        }
                        if (Decimal.Parse(c.ToString()) >= 2000 && Decimal.Parse(c.ToString()) <= 2999)
                        {
                            if (viewmodelSearch.Prices.Where(x => x.Value == "2000_2999").Count() == 0) { viewmodelSearch.Prices.Add(new Filter() { Title = "2000 - 2999", Value = "2000_2999", Index = 3 }); }
                        }
                        if (Decimal.Parse(c.ToString()) >= 3000 && Decimal.Parse(c.ToString()) <= 3999)
                        {
                            if (viewmodelSearch.Prices.Where(x => x.Value == "3000_3999").Count() == 0) { viewmodelSearch.Prices.Add(new Filter() { Title = "3000 - 3999", Value = "3000_3999", Index = 4 }); }
                        }
                        if (Decimal.Parse(c.ToString()) >= 4000)
                        {
                            if (viewmodelSearch.Prices.Where(x => x.Value == "4000_MAX").Count() == 0) { viewmodelSearch.Prices.Add(new Filter() { Title = "4000 or more", Value = "4000_MAX", Index = 5 }); }
                        }
                    }
                }

                var nights =
                    (from p in myJObject["hits"]["hit"].Children()["fields"]["nights"]
                     select p).ToList();
                foreach (var c in nights)
                {
                    if (Int32.Parse(c.ToString()) >= 1 && Int32.Parse(c.ToString()) <= 7)
                    {
                        if (viewmodelSearch.StayLengths.Where(x => x.Value == "0_7").Count() == 0) { viewmodelSearch.StayLengths.Add(new Filter() { Title = "7 nights or less", Value = "0_7", Index = 1 }); }
                    }
                    if (Int32.Parse(c.ToString()) >= 8 && Int32.Parse(c.ToString()) <= 10)
                    {
                        if (viewmodelSearch.StayLengths.Where(x => x.Value == "5_10").Count() == 0) { viewmodelSearch.StayLengths.Add(new Filter() { Title = "8 to 10 nights", Value = "5_10", Index = 2 }); }
                    }
                    if (Int32.Parse(c.ToString()) >= 11 && Int32.Parse(c.ToString()) <= 14)
                    {
                        if (viewmodelSearch.StayLengths.Where(x => x.Value == "7_14").Count() == 0) { viewmodelSearch.StayLengths.Add(new Filter() { Title = "11 to 14 nights", Value = "7_14", Index = 3 }); }
                    }
                    if (Int32.Parse(c.ToString()) >= 15)
                    {
                        if (viewmodelSearch.StayLengths.Where(x => x.Value == "11_MAX").Count() == 0) { viewmodelSearch.StayLengths.Add(new Filter() { Title = "15 nights or more", Value = "11_MAX", Index = 4 }); }
                    }
                }

                var interests =  (from p in myJObject["hits"]["hit"].Children()["fields"]["interests"].Values<string>()
                     select p).ToList();
                foreach (var c in interests)
                {
                    viewmodelSearch.Interests.Add(new NameObject() { Id = -1, Name = c.ToString() });
                }

                viewmodelSearch.packages = (Newtonsoft.Json.Linq.JArray)myJObject["hits"]["hit"];
                foreach (var o in viewmodelSearch.packages)
                {
                }

                viewmodelSearch.Countries = (from c in viewmodelSearch.Countries
                                             group c by c.Name into CountryGroup
                                             select new NameObject() { Name = CountryGroup.Key, Id = CountryGroup.Count() }).OrderByDescending(x => x.Id).ToList();
                viewmodelSearch.Cities = (from c in viewmodelSearch.Cities
                                          group c by c.Name into CityGroup
                                          select new NameObject() { Name = CityGroup.Key, Id = CityGroup.Count() }).OrderByDescending(x => x.Id).ToList();
                viewmodelSearch.Interests = (from c in viewmodelSearch.Interests
                                             group c by c.Name into InterestGroup
                                             select new NameObject() { Name = InterestGroup.Key, Id = InterestGroup.Count() }).OrderByDescending(x => x.Id).ToList();

            ViewBag.q = q;


            if (Utilities.CheckMobileDevice() == false)
            {
                return View("Search", viewmodelSearch);
            }
            else
            {
                return View("SearchMob", viewmodelSearch);
            }
        }

        [HttpPost("SearchPackages")]
        public IActionResult SearchPackages([FromBody] SearchPackages searchPackages)
        {
            Int32 pageNumber = 1;
            Int32.TryParse(searchPackages.page, out pageNumber);
            
            string site = searchPackages.site;
            
            string awsQ = searchPackages.q;
            
            string filter = searchPackages.filter;
            string priceFilter = "";
            string countriesFilter = "";
            string stayLengthFilter = "";
            string citiesFilter = "";
            string interestsFilter = "";
            string[] filterParts = filter.Split("|");
            if (filterParts.Count() == 5)
            {
                priceFilter = filterParts[0];
                stayLengthFilter = filterParts[1];
                countriesFilter = filterParts[2];
                citiesFilter = filterParts[3];
                interestsFilter = filterParts[4];
            }

            Int32 sortVal = 0;
            Int32.TryParse(searchPackages.sort, out sortVal);
            if (sortVal < 0 || sortVal > 6)
            {
                sortVal = 5;
            }

            // ----- START: Request to AWS
            string qOptions = "&q.options={fields:['title^1', 'cities^20', 'city^1', 'country^1', 'countries^1','interests^1', 'pkgid^1','description^0.5', 'include^0.25']}";
            string awsURL = "http://search-tripmasters-ddvbbeyrdp2xmv66q4il4ihzbm.us-east-1.cloudsearch.amazonaws.com/2013-01-01/search?q=" + awsQ + "&format=json&size=10000&return=_all_fields,_score" + qOptions;

            //string awsURL = "c:/Work/costa-rica.json"; // "e:/qqq.json";
            Newtonsoft.Json.Linq.JArray packages = new Newtonsoft.Json.Linq.JArray();

            System.Net.WebRequest awsrequest = System.Net.WebRequest.Create(awsURL);
            System.Net.WebResponse resp = awsrequest.GetResponse();
            System.IO.Stream respStream = resp.GetResponseStream();

            var sr = new System.IO.StreamReader(respStream);
            var jsonTextReader = new JsonTextReader(sr);
            var serializer = new JsonSerializer();
            var myJObject = Newtonsoft.Json.Linq.JObject.Parse(serializer.Deserialize(jsonTextReader).ToString());

            packages = (Newtonsoft.Json.Linq.JArray)myJObject["hits"]["hit"];

            List<xmlPackage> packs = new List<xmlPackage>();
            List<xmlPackage> packsIncomplete = new List<xmlPackage>();
            string filters = "";
            if (countriesFilter != "")
            {
                string[] countries = countriesFilter.Split("_");
                for (Int32 i = 0; i <= countries.Count() - 1; i++)
                {
                    filters = filters + countries[i];
                    if (i < countries.Count() - 1)
                    {
                        filters = filters + ",";
                    }
                }
                countriesFilter = filters;
            }

            filters = "";
            if (citiesFilter != "")
            {
                string[] cities = citiesFilter.Split("_");
                for (Int32 i = 0; i <= cities.Count() - 1; i++)
                {
                    filters = filters + cities[i];
                    if (i < cities.Count() - 1)
                    {
                        filters = filters + ",";
                    }
                }
                citiesFilter = filters;
            }

            filters = "";
            if (interestsFilter != "")
            {
                string[] interests = interestsFilter.Split("_");
                for (Int32 i = 0; i <= interests.Count() - 1; i++)
                {
                    filters = filters + interests[i];
                    if (i < interests.Count() - 1)
                    {
                        filters = filters + ",";
                    }
                }
                interestsFilter = filters;
            }

            Int32 TotalNoFiltering = 0;
            foreach (var o in packages)
            {
                xmlPackage p = new xmlPackage();

                Int32 pId = 0;
                string pkgid = (string)o["fields"]["pkgid"];
                Int32.TryParse(pkgid, out pId);
                p.Id = pId;

                p.Title = "";
                string title = (string)o["fields"]["title"];
                p.Title = title;

                p.Description = "";
                var description = (string)o["fields"]["description"];
                if (description != null)
                {
                    p.Description = description.Replace("&lt;", "<");
                    if (p.Description != "")
                    {
                        p.Description = new System.Text.RegularExpressions.Regex("<[^<>]+>").Replace(p.Description, "");
                    }
                }

                p.Include = "";
                string include = (string)o["fields"]["include"];
                if (include != null)
                {
                    p.Include = include.Replace("&lt;", "<");
                }

                Int32 pDuration = 0;
                string nights = (string)o["fields"]["nights"];
                if (nights != null)
                {
                    Int32.TryParse(nights, out pDuration);
                }
                p.Duration = pDuration;
                Int32 DurationFound = 0;
                if (stayLengthFilter != "")
                {
                    string[] stayLenghts = stayLengthFilter.Split("L");
                    for (Int32 i = 0; i <= stayLenghts.Count() - 1; i++)
                    {
                        string[] interval = stayLenghts[i].Split("_");
                        if (interval[1] != "MAX")
                        {
                            if (p.Duration >= Int32.Parse(interval[0]) && p.Duration <= Int32.Parse(interval[1]))
                            {
                                DurationFound = 1;
                            }
                        }
                        else
                        {
                            if (p.Duration >= Int32.Parse(interval[0]))
                            {
                                DurationFound = 1;
                            }
                        }
                    }
                    if (DurationFound == 0)
                    {
                        continue;
                    }
                }


                Decimal pPrice = 0;
                string price = (string)o["fields"]["price"];
                if (price != null)
                {
                    Decimal.TryParse(price, out pPrice);
                }
                p.Price = pPrice;
                Int32 PriceFound = 0;
                if (priceFilter != "")
                {
                    string[] prices = priceFilter.Split("P");
                    for (Int32 i = 0; i <= prices.Count() - 1; i++)
                    {
                        string[] interval = prices[i].Split("_");
                        if (interval[1] != "MAX")
                        {
                            if (p.Price >= Int32.Parse(interval[0]) && p.Price <= Int32.Parse(interval[1]))
                            {
                                PriceFound = 1;
                            }
                        }
                        else
                        {
                            if (p.Price >= Int32.Parse(interval[0]))
                            {
                                PriceFound = 1;
                            }
                        }
                    }
                    if (PriceFound == 0)
                    {
                        continue;
                    }
                }

                Int32 pReviews = 0;
                string review = (string)o["fields"]["review"];
                if (review != null)
                {
                    Int32.TryParse(review, out pReviews);
                }
                p.Reviews = pReviews;

                p.ImageURL = "";
                string image_url = (string)o["fields"]["image_url"];
                p.ImageURL = image_url;

                p.ProdKinds = "";
                string prodkinds = (string)o["fields"]["prodkinds"];
                p.ProdKinds = prodkinds;

                p.Country = "";
                if (o["fields"]["country"] != null)
                {
                    p.Country = o["fields"]["country"].ToString();
                }
                if (o["fields"]["countries"] != null)
                {
                    if (o["fields"]["countries"].HasValues)
                    {
                        var countries = o["fields"]["countries"].Children();
                        if (p.Country == "")
                        {
                            p.Country = countries.First().ToString();
                        }

                        if (countriesFilter != "")
                        {
                            if (countries.Count() > 0)
                            {
                                Int32 Found = 0;
                                foreach (var cc in countries)
                                {
                                    if (countriesFilter.Contains(cc.ToString()))
                                    {
                                        Found = 1;
                                    }
                                }
                                if (Found == 0)
                                {
                                    continue;
                                }
                            }
                        }
                    }
                }
                else
                {
                    if (o["fields"]["country"] != null)
                    {
                        if (countriesFilter != "")
                        {
                            if (!countriesFilter.Contains(p.Country))
                            {
                                continue;
                            }
                        }
                    }

                }


                string cCity = "";
                if (o["fields"]["cities"] != null)
                {
                    var cities = o["fields"]["cities"].Children();
                    if (cities.Count() > 0)
                    {
                        cCity = cities.First().ToString();
                    }
                    if (citiesFilter != "")
                    {
                        if (cities.Count() > 0)
                        {
                            Int32 Found = 0;
                            foreach (var cc in cities)
                            {
                                string cityValue = cc.ToString();
                                if (cityValue.Contains("(") || cityValue.Contains(")"))
                                {
                                    cityValue = Regex.Replace(cityValue, "[()]", "");
                                }
                                if (citiesFilter.Contains(cityValue))
                                {
                                    Found = 1;
                                }
                            }
                            if (Found == 0)
                            {
                                continue;
                            }
                        }
                    }
                }
                else
                {
                    if (citiesFilter != "")
                    {
                        continue;
                    }
                }


                string cInterest = "";
                if (o["fields"]["interests"] != null)
                {
                    if (o["fields"]["interests"].HasValues)
                    {
                        var interests = o["fields"]["interests"].Children();
                        if (interests.Count() > 0)
                        {
                            cInterest = interests.First().ToString();
                        }
                        if (interestsFilter != "")
                        {
                            if (interests.Count() > 0)
                            {
                                Int32 Found = 0;
                                foreach (var cc in interests)
                                {
                                    if (interestsFilter.Contains(cc.ToString()))
                                    {
                                        Found = 1;
                                    }
                                }
                                if (Found == 0)
                                {
                                    continue;
                                }
                            }
                        }
                    }
                }
                else
                {
                    if (interestsFilter != "")
                    {
                        continue;
                    }
                }

                p.DepartureAirport = "";
                string depcity = (string)o["fields"]["depcity"];
                if (depcity != null)
                {
                    p.DepartureAirport = depcity;
                }

                p.PriceHistInfo = "";
                string pricinginfo = (string)o["fields"]["pricinginfo"];
                if (pricinginfo != null)
                {
                    p.PriceHistInfo = pricinginfo;
                }

                DateTime pDepartureDate = new DateTime();
                string depdate = (string)o["fields"]["depdate"];
                if (depdate != null)
                {
                    DateTime.TryParse(depdate, out pDepartureDate);
                    p.DepartureDate = pDepartureDate;
                }

                if (o["fields"]["country"] == null || o["fields"]["countries"] == null)
                {
                    packsIncomplete.Add(p);
                    continue;
                }

                string isluxury = (string)o["fields"]["isluxury"];
                p.IsLuxury = isluxury;

                packs.Add(p);
            }
            packs.AddRange(packsIncomplete);
            TotalNoFiltering = packs.Count;
            switch (sortVal)
            {
                case 0:
                    packs = packs.OrderByDescending(x => x.Price > 0 ? 2 : 0).ThenByDescending(x => x.Reviews).ThenBy(x => x.Price == 0 ? 9999 : x.Price).ThenBy(x => x.Duration).ThenBy(x => x.Title).ToList();
                    break;
                case 1:
                    packs = packs.OrderBy(x => x.Price > 0 ? x.Duration : 9999).ThenBy(x => x.Duration).ThenByDescending(x => x.Reviews).ThenBy(x => x.Price == 0 ? 9999 : x.Price).ThenBy(x => x.Title).ToList();
                    break;
                case 2:
                    packs = packs.OrderBy(x => x.Price == 0 ? 9999 : x.Price).ThenByDescending(x => x.Reviews).ThenBy(x => x.Duration).ThenBy(x => x.Title).ToList();
                    break;
                case 3:
                    packs = packs.OrderByDescending(x => x.Price).ThenByDescending(x => x.Reviews).ThenBy(x => x.Duration).ThenBy(x => x.Title).ToList();
                    break;
                case 4:
                    packs = packs.OrderBy(x => x.Price > 0 ? x.Title : "ZZZZ").ThenBy(x => x.Title).ThenByDescending(x => x.Reviews).ThenBy(x => x.Price).ThenBy(x => x.Duration).ToList();
                    break;
                case 6:
                    packs = packs.OrderByDescending(x => x.IsLuxury).ThenByDescending(x => x.Price > 0 ? 2 : 0).ThenByDescending(x => x.Reviews).ThenBy(x => x.Price).ThenBy(x => x.Duration).ThenBy(x => x.Title).ToList();
                    break;
            }

            packs = packs.Skip((pageNumber - 1) * 10).Take(10).ToList();

            ViewBag.xmlPacksCount = TotalNoFiltering;
            ViewBag.pageNumber = pageNumber;
            if (Utilities.CheckMobileDevice() == false)
            {
                return View("SearchPackages", packs);
            }
            else
            {
                return View("SearchPackagesMob", packs);
            }

        }

    }
}
