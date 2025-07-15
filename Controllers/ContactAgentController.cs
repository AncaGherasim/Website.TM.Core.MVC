using Microsoft.AspNetCore.Mvc;
using MVC_TM.Infrastructure;
using MVC_TM.Models;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Options;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using System.Reflection;
using System.Globalization;

namespace MVC_TM.Controllers
{
    public class ContactAgentController : Controller
    {
        private readonly AppSettings _appSettings;
        private readonly DapperWrap _dapperWrap;
        private readonly IWebHostEnvironment _hostingEnvironment;
        private readonly IHttpContextAccessor _httpContextAccessor;

        public ContactAgentController(IOptions<AppSettings> appsettings, DapperWrap dapperWrap, IWebHostEnvironment hostingEnvironment, IHttpContextAccessor httpContextAccessor)
        {
            _appSettings = appsettings.Value;
            _dapperWrap = dapperWrap;
            _hostingEnvironment = hostingEnvironment;
            _httpContextAccessor = httpContextAccessor;
        }
        [HttpGet("/contact-agent", Name = "ContactAgent_Route")]
        [HttpHead("/contact-agent", Name = "ContactAgent_Route")]
        [HttpPost("/contact-agent", Name = "ContactAgent_Route")]
        public async Task<IActionResult> ChatAgent()
        {
            HttpContext.Response.Headers.Add("_utPg", "AgentCall");

            Models.ViewModels.ContactAgentViewModel agent = new Models.ViewModels.ContactAgentViewModel();
            try
            {
                string email = "";
                int id = 0;
                if (_httpContextAccessor.HttpContext.Request.Query["email"].ToString() != null && _httpContextAccessor.HttpContext.Request.Query["id"].ToString() != null)
                {
                    email = _httpContextAccessor.HttpContext.Request.Query["email"];
                    id = int.Parse(_httpContextAccessor.HttpContext.Request.Query["id"]);
                }

                string cook = _httpContextAccessor.HttpContext.Request.Cookies["ut2"];
                var result1 = await _dapperWrap.GetRecords<ContactAgent>(SqlCalls.SQL_ContactAgent(email, id));
                agent.contactAgent = result1.ToList();
                string hoursStart = "";
                string hoursEnd;
                DateTime? hours;
                DateTime dateNow;
                string dayName;
                dateNow = DateTime.Now;
                dayName = DateTime.Now.DayOfWeek.ToString();
                if (agent.contactAgent.Count > 0)
                {
                    foreach (var prop in agent.contactAgent)
                    {
                        foreach (PropertyInfo p in prop.GetType().GetProperties())
                        {
                            if (p.Name.Contains("In"))
                            {
                                hours = (DateTime?)prop.GetType().GetProperty(p.Name).GetValue(prop);
                                if (hours != null)
                                {
                                    hoursStart = hours.Value.ToString("hh:mm tt");
                                }
                                else
                                {
                                    hoursStart = "";
                                }
                                agent.schedule.Add(new Tuple<string, string, string>(p.Name.Replace("In", ""), hoursStart, null));
                            }
                            if (p.Name.Contains("Out"))
                            {
                                hours = (DateTime?)prop.GetType().GetProperty(p.Name).GetValue(prop);
                                if (hours != null)
                                {
                                    hoursEnd = hours.Value.ToString("hh:mm tt");
                                }
                                else
                                {
                                    hoursEnd = "";
                                }
                                //var t = new Tuple<string, string, string>("","","");
                                var t = agent.schedule.First(x => x.Item1 == p.Name.Replace("Out", ""));
                                agent.schedule.Remove(t);
                                agent.schedule.Add(new Tuple<string, string, string>(p.Name.Replace("Out", ""), hoursStart, hoursEnd));
                            }
                        }
                    }
                    agent.workToday = agent.schedule.First(x => x.Item1 == DateTime.Now.DayOfWeek.ToString());
                    ViewBag.IsValid = true;
                }
            }
            catch (System.IO.IOException ex)
            {
                ViewBag.IsValid = false;
            }
            

            if (Utilities.CheckMobileDevice() == false)
            {
                return View("ContactAgent", agent);
            }
            else
            {
                return View("ContactAgentMob", agent);
            }
            
        }
    }
}
