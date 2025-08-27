using System;
using System.Collections.Generic;
using System.Linq;
using Microsoft.AspNetCore.Mvc;
using MVC_TM.Models;
using MVC_TM.Infrastructure;
using Microsoft.Extensions.Options;
using Dapper;
using HtmlAgilityPack;
using System.Data;
using System.Data.SqlClient;
using System.Text.RegularExpressions;
using System.Text;
using System.Xml;
using System.Threading.Tasks;
using System.Net;
using Microsoft.AspNetCore.Http;
using System.IO;
using Amazon.Lambda;
using Amazon.Lambda.Model;
using Amazon;
using Newtonsoft.Json;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Xml.Linq;
using System.Text.Json.Nodes;
using Mysqlx;
using System.Dynamic;
using Microsoft.Extensions.Primitives;
using Newtonsoft.Json.Linq;
using Microsoft.Extensions.Logging;

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace MVC_TM.API
{
    [Route("Api")]
    [ApiController]
    public class PackagesController : ControllerBase
    {
        private readonly AppSettings _appSettings;
        private readonly DapperWrap _dapperWrap;
        private readonly IHttpContextAccessor _httpContextAccessor;
        private readonly CachedDataService _cachedDataService;
        private readonly ILogger<PackagesController> _logger;

        public PackagesController(IOptions<AppSettings> appSettings, DapperWrap dapperWrap, IHttpContextAccessor httpContextAccessor, CachedDataService cachedDataService, ILogger<PackagesController> logger)
        {
            _appSettings = appSettings.Value;
            _dapperWrap = dapperWrap;
            _httpContextAccessor = httpContextAccessor;
            _cachedDataService = cachedDataService;
            _logger = logger;
        }

        [HttpPost("Packages/getDataRelPacks")]
        public async Task<string> sqlRelPackByPackID([FromBody] FaqQR packsite)
        {
            string webS = "";
            string siteLike = "";
            string siteID = "";
            switch (packsite.FaqResponse)
            {
                case "ED":
                    webS = "TMED";
                    siteLike = _appSettings.ApplicationSettings.TMED_intCom;
                    siteID = _appSettings.ApplicationSettings.TMED_userID;
                    break;
                case "LD":
                    webS = "TMLD";
                    siteLike = _appSettings.ApplicationSettings.TMLD_intCom;
                    siteID = _appSettings.ApplicationSettings.TMLD_userID;
                    break;
                default:
                    webS = "TMAS";
                    siteLike = _appSettings.ApplicationSettings.TMAS_intCom;
                    siteID = _appSettings.ApplicationSettings.TMAS_userID;
                    break;
            }
            List<RelPackByPackID> dvRel;
            var result = await _dapperWrap.GetRecords<RelPackByPackID>(SqlCalls.SQL_RelPackByPackID(packsite.FaqQuestion, siteLike, siteID));
            dvRel = result.ToList();
            
            StringBuilder strRel = new StringBuilder();
            for (Int32 r = 0; r < dvRel.Count; r++)
            {
                if (r > 0)
                {
                    strRel.Append("@");
                }
                strRel.Append(dvRel[r].PlaceTitle + "|" + dvRel[r].NoOfPacks.ToString() + "|" + dvRel[r].str_placetypeid.ToString() + "|" + dvRel[r].PlaceId.ToString());
            }
            return Newtonsoft.Json.JsonConvert.SerializeObject(strRel);
        }

        [HttpGet("Packages/depCity")]
        public async Task<IEnumerable<DepCity>> DepCity()
        {
            await _cachedDataService.LoadDepCitiesIfNecessary();
            return _cachedDataService.depCitiesCache;
        }

        [HttpGet("Packages/priorCity")]
        public async Task<IEnumerable<PriorCity>> PriorCity()
        {
            await _cachedDataService.LoadPriorCitiesIfNecessary();
            return _cachedDataService.priorCitiesCache;
        }

        [HttpPost("Packages/webservTransportationOption")]
        public async Task<dynamic> webservGetTransportationOption([FromBody] string stringForm)
        {
            string wAir;
            string cabTY;
            string dateD;
            string depID;
            string depNA;
            string webSite;
            List<string> ctyNA = new List<string>();
            List<string> ctyID = new List<string>();
            string q = stringForm;
            string[] qParts = q.Split("&");
            foreach (var qPart in qParts)
            {
                string[] qPar = qPart.Split("=");
                if (Regex.IsMatch(qPar[0], "qWair", RegexOptions.IgnoreCase))
                {
                    wAir = qPar[1];
                }
                if (Regex.IsMatch(qPar[0], "qLeaveNA", RegexOptions.IgnoreCase))
                {
                    depNA = qPar[1];
                }
                if (Regex.IsMatch(qPar[0], "qLeaveID", RegexOptions.IgnoreCase))
                {
                    depID = qPar[1];
                }
                if (Regex.IsMatch(qPar[0], "qReturnNA", RegexOptions.IgnoreCase))
                {
                    depNA = qPar[1];
                }
                if (Regex.IsMatch(qPar[0], "qReturnID", RegexOptions.IgnoreCase))
                {
                    depID = qPar[1];
                }
                if (Regex.IsMatch(qPar[0], "xCabin", RegexOptions.IgnoreCase))
                {
                    cabTY = qPar[1];
                }
                if (Regex.IsMatch(qPar[0], "qArrDate", RegexOptions.IgnoreCase))
                {
                    dateD = qPar[1].Replace(".", "/");
                }
                if (Regex.IsMatch(qPar[0], "goingID", RegexOptions.IgnoreCase))
                {
                    webSite = qPar[1];
                }
                if (Regex.IsMatch(qPar[0], "qNACity", RegexOptions.IgnoreCase))
                {
                    ctyNA.Add(qPar[1]);
                }
                if (Regex.IsMatch(qPar[0], "qIDCity", RegexOptions.IgnoreCase))
                {
                    ctyID.Add(qPar[1]);
                }
            }
            //string SiteUserId = _appSettings.ApplicationSettings.userID;
            //StringBuilder strQCities = new StringBuilder();
            //strQCities.Append("<CALENDAR_TRANSPORTATIONOPTION_Q>");
            //strQCities.Append("<Version>2</Version>");
            //strQCities.Append("<UserID>243,595,182</UserID>");
            //strQCities.Append("<Cities>");
            //for (Int32 i = 0; i <= ctyNA.Count - 1; i++)
            //{
            //    if (ctyNA[i].IndexOf("(") > 0)
            //    {
            //        Int32 strEnd = ctyNA[i].IndexOf("(");
            //        ctyNA[i] = ctyNA[i].Substring(0, strEnd);
            //    }
            //    strQCities.Append("<City>");
            //    strQCities.Append("<No>" + (i + 1).ToString() + "</No>");
            //    strQCities.Append("<PlaceID>" + ctyID[i] + "</PlaceID>");
            //    strQCities.Append("<PlaceName>" + ctyNA[i].Trim() + "</PlaceName>");
            //    Int32 ii = i + 1;
            //    if (ii <= ctyNA.Count - 1)
            //    {
            //        strQCities.Append("<PlaceToID>" + ctyID[ii] + "</PlaceToID>");
            //    }
            //    else
            //    {
            //        strQCities.Append("<PlaceToID>-1</PlaceToID>");
            //    }
            //    strQCities.Append("</City>");
            //}
            //strQCities.Append("</Cities>");
            //strQCities.Append("</CALENDAR_TRANSPORTATIONOPTION_Q>");

            TransportationOptionQ transportationOptionQ = new TransportationOptionQ();
            CalendarTransportationOptionQ calendarTransportationOptionQ = new CalendarTransportationOptionQ();
            calendarTransportationOptionQ.Cities = new List<CityTO>();
            calendarTransportationOptionQ.Version = 2;
            calendarTransportationOptionQ.UserID = "243,595,182";
            for (Int32 i = 0; i <= ctyNA.Count - 1; i++)
            {
                if (ctyNA[i].IndexOf("(") > 0)
                {
                    Int32 strEnd = ctyNA[i].IndexOf("(");
                    ctyNA[i] = ctyNA[i].Substring(0, strEnd);
                }
                CityTO cityTO = new CityTO();
                cityTO.No = (i + 1).ToString();
                cityTO.PlaceID = int.Parse(ctyID[i]);
                cityTO.PlaceName = ctyNA[i].Trim();
                Int32 ii = i + 1;
                if (ii <= ctyNA.Count - 1)
                {
                    cityTO.PlaceToID = int.Parse(ctyID[ii]);
                    //strQCities.Append("<PlaceToID>" + ctyID[ii] + "</PlaceToID>");
                }
                else
                {
                    cityTO.PlaceToID = -1;
                    //strQCities.Append("<PlaceToID>-1</PlaceToID>");
                }
                calendarTransportationOptionQ.Cities.Add(cityTO);
            }

            transportationOptionQ.CalendarTransportationOptionQ = calendarTransportationOptionQ;
            var result = new object();
            using (var httpClient = new HttpClient())
            {
                httpClient.DefaultRequestHeaders.Accept.Add(new MediaTypeWithQualityHeaderValue("application/json"));
                var url = "https://2l6nhqi7od.execute-api.us-east-1.amazonaws.com/live/web/calendar";
                //var url = "https://efidyc44j7.execute-api.us-east-1.amazonaws.com/beta/calendar"; //DEV
                var data = new StringContent(JsonConvert.SerializeObject(transportationOptionQ), Encoding.UTF8, "application/json");
                var responseMessage = await httpClient.PostAsync(url, data);
                result = await responseMessage.Content.ReadAsStringAsync();
            }
            //***************************
            //SEND REQUEST TO WEB SERVICE 
            //***************************
            //string webApi = "localhost";
            //string sQuery;
            //string sResult;
            //XmlDocument qCTYS = new XmlDocument();
            //qCTYS.LoadXml(strQCities.ToString());
            //strQCities = null;
            //sQuery = qCTYS.InnerXml;
            //qCTYS = null;
            //sResult = Utilities.SiteAPI_SendAndReceive(sQuery, "tournet", webApi);
            //XmlDocument doc = new XmlDocument();
            //doc.LoadXml(sResult);

            //string strJson = Newtonsoft.Json.JsonConvert.SerializeXmlNode(doc);
            return result;
        }

        [HttpPost("Packages/webservComponentList")]
        [SuppressModelStateInvalidFilter]
        public async Task<IActionResult> webservGetComponentList([FromBody] ExpandoObject queryString)
        {
            var dict = queryString as IDictionary<string, object>;
            if (dict == null || dict.Count == 0)
            {
                var rawBody = HttpContext.Items["RawRequestBody"] as string ?? "";
                string clientIp = ClientInfo.GetClientIp(HttpContext);
                _logger.LogInformation($"****** Site: TM | ClientIP: {clientIp} | Wrong payload {rawBody} for webservComponentList 400 BadRequest");
                return BadRequest();
            }
            var dataDictionary = queryString as IDictionary<string, object>;
            List<string> cityS = new List<string>();
            List<string> cityE = new List<string>();
            List<string> city1 = new List<string>();
            List<string> city2 = new List<string>();
            List<string> city3 = new List<string>();
            List<string> city4 = new List<string>();
            List<string> city5 = new List<string>();
            List<string> city6 = new List<string>();
            List<string> city7 = new List<string>();
            List<string> city8 = new List<string>();
            List<string> city9 = new List<string>();
            List<string> city10 = new List<string>();
            List<string> city11 = new List<string>();
            List<string> city12 = new List<string>();
            List<List<string>> citylist = new List<List<string>>();
            List<string> cities = new List<string>();
            //string[] Qparts = Q.Split("&");
            string sysID = "";
            string cty = "";
            string idLeavingFrom = "";
            string idReturningTo = "";
            string wAir = "False";
            if (dataDictionary.TryGetValue("xgoingID", out var qvalue))
            {
                sysID = $"{qvalue}";
            }
            if (dataDictionary.TryGetValue("xidLeavingFrom", out qvalue))
            {
                idLeavingFrom = $"{qvalue}";
            }
            if (dataDictionary.TryGetValue("xaddFlight", out qvalue))
            {
                wAir = $"{qvalue}";
            }

            foreach (var kvp in queryString)
            {
                try
                {
                    if (kvp.Key.Contains("CityS")) cityS.Add(kvp.Value?.ToString() ?? string.Empty);
                    if (kvp.Key.Contains("City1")) city1.Add(kvp.Value?.ToString() ?? string.Empty);
                    if (kvp.Key.Contains("City2")) city2.Add(kvp.Value?.ToString() ?? string.Empty);
                    if (kvp.Key.Contains("City3")) city3.Add(kvp.Value?.ToString() ?? string.Empty);
                    if (kvp.Key.Contains("City4")) city4.Add(kvp.Value?.ToString() ?? string.Empty);
                    if (kvp.Key.Contains("City5")) city5.Add(kvp.Value?.ToString() ?? string.Empty);
                    if (kvp.Key.Contains("City6")) city6.Add(kvp.Value?.ToString() ?? string.Empty);
                    if (kvp.Key.Contains("City7")) city7.Add(kvp.Value?.ToString() ?? string.Empty);
                    if (kvp.Key.Contains("City8")) city8.Add(kvp.Value?.ToString() ?? string.Empty);
                    if (kvp.Key.Contains("City9")) city9.Add(kvp.Value?.ToString() ?? string.Empty);
                    if (kvp.Key.Contains("City10")) city10.Add(kvp.Value?.ToString() ?? string.Empty);
                    if (kvp.Key.Contains("City11")) city11.Add(kvp.Value?.ToString() ?? string.Empty);
                    if (kvp.Key.Contains("City12")) city12.Add(kvp.Value?.ToString() ?? string.Empty);
                    if (kvp.Key.Contains("CityE")) cityE.Add(kvp.Value?.ToString() ?? string.Empty);
                }
                catch (Exception ex)
                {
                    throw new Exception("webservComponentList first try message: " + ex.Message + ", queryString: " + queryString);
                }
            }

            if (cityS.Count > 0) citylist.Add(cityS);
            if (city1.Count > 0) citylist.Add(city1);
            if (city2.Count > 0) citylist.Add(city2);
            if (city3.Count > 0) citylist.Add(city3);
            if (city4.Count > 0) citylist.Add(city4);
            if (city5.Count > 0) citylist.Add(city5);
            if (city6.Count > 0) citylist.Add(city6);
            if (city7.Count > 0) citylist.Add(city7);
            if (city8.Count > 0) citylist.Add(city8);
            if (city9.Count > 0) citylist.Add(city9);
            if (city10.Count > 0) citylist.Add(city10);
            if (city11.Count > 0) citylist.Add(city11);
            if (city12.Count > 0) citylist.Add(city12);
            if (cityE.Count > 0) citylist.Add(cityE);
            // ***************************************
            // BUILD XML TO COMPONENT LIST WEB SERVICE 
            // ***************************************
            Int32 isCarCount = 0;
            string xmlBPC_Q = "";
            string xmlBPC_Q2 = "";
            string qResult = "";
            Int32 totCities = citylist.Count - 1;
            string lastCity;
            try
            {
                lastCity = citylist[totCities][0].ToString();
            }
            catch (Exception ex)
            {
                throw new Exception("webservComponentList second try message: " + ex.Message + ", queryString: " + queryString);
            }

            BuildPackageComponentListQ jsonBPC_Q = new BuildPackageComponentListQ();
            CalendarBuildPackageComponentListQ calendarBuildPackageComponentQ = new CalendarBuildPackageComponentListQ();
            if (wAir == "True")
            {
                calendarBuildPackageComponentQ.DepCityID = int.Parse(idLeavingFrom);
            }

            // ***************************************
            // CITIES PARAMETERS
            // ***************************************
            calendarBuildPackageComponentQ.Cities = new List<CityPC>();

            xmlBPC_Q = xmlBPC_Q + "<Cities>";
            foreach (var ctys in citylist)
            {
                try
                {
                    CityPC city = new CityPC();
                    city.CityComponents = new List<CityComponent>();
                    city.No = ctys[0];
                    city.PlaceID = int.Parse(ctys[2]);
                    city.PlaceName = ctys[1];
                    city.NoOfNight = int.Parse(ctys[4]);
                    if (Int32.Parse(ctys[4]) > 0)
                    {
                        CityComponent component = new CityComponent();
                        component.ProductType = "H";
                        component.ProductFreeField1 = "";
                        component.ProductNotes = "";
                        component.ProductItemID = "";
                        component.Transportation = 0;
                        city.CityComponents.Add(component);
                    }
                    if (ctys.Count() - 1 > 5)
                    {
                        CityComponent component = new CityComponent();
                        if (ctys[5].ToString() != "")
                        {
                            string Nts = "";
                            string isCar = "";
                            string typeNA = "";
                            switch (ctys[5].ToString())
                            {
                                case "TIC":
                                    typeNA = "T";
                                    Nts = "Train";
                                    break;
                                case "TBA":
                                    typeNA = "C";
                                    Nts = "Car";
                                    break;
                                case "P2P":
                                    typeNA = "T";
                                    Nts = "Air";
                                    break;
                                case "OWN":
                                    typeNA = "W";
                                    Nts = "On your Own";
                                    break;
                                case "GI":
                                    typeNA = "G";
                                    Nts = "Ground";
                                    break;
                            }
                            switch (ctys[5].ToString())
                            {
                                case "TIC":
                                case "P2P":
                                case "GI":
                                case "OWN":

                                    component.ProductType = typeNA;
                                    component.ProductFreeField1 = ctys[5];
                                    component.ProductNotes = Nts;
                                    component.ProductItemID = "0";
                                    component.Transportation = 1;
                                    component.OverNight = int.Parse(ctys[7]);
                                    isCarCount = 0;
                                    isCar = "";
                                    break;
                                case "TBA":
                                    if (isCarCount >= 1 && String.Compare(isCar, ctys[0].ToString()) <= 0)
                                    {
                                        if (isCar == ctys[0].ToString())
                                        {
                                            isCarCount = 0;
                                        }
                                    }
                                    isCarCount += 1;
                                    if (isCarCount == 1)
                                    {
                                        component.ProductType = ctys[6];
                                        component.ProductFreeField1 = ctys[5];
                                        component.ProductNotes = Nts;
                                        component.ProductItemID = "0";
                                        component.Transportation = 1;
                                        component.OverNight = int.Parse(ctys[7]);
                                        component.CarPickUpCityNo = ctys[0];
                                        component.CarPickUpDay = ctys[9];
                                        component.CarDropOffCityNo = ctys[12];
                                        component.CarDropOffDay = ctys[11];
                                        isCar = ctys[11].ToString();
                                    }
                                    break;
                            }
                            city.CityComponents.Add(component);
                        }
                        else
                        {
                            component.ProductType = ctys[6];
                            component.ProductFreeField1 = "";
                            component.ProductNotes = "On your Own";
                            component.ProductItemID = "0";
                            component.Transportation = 1;
                            component.OverNight = int.Parse(ctys[7]);
                            isCarCount = 0;
                        }
                    }
                    calendarBuildPackageComponentQ.Cities.Add(city);
                }
                catch (Exception ex)
                {
                    throw new Exception("webservComponentList third try message: " + ex.Message + ", queryString: " + queryString);
                }
            }
            jsonBPC_Q.CalendarBuildPackageComponentListQ = calendarBuildPackageComponentQ;

            var result = new object();
            using (var httpClient = new HttpClient())
            {
                httpClient.DefaultRequestHeaders.Accept.Add(new MediaTypeWithQualityHeaderValue("application/json"));
                var url = "https://2l6nhqi7od.execute-api.us-east-1.amazonaws.com/live/web/calendar";
                //var url = "https://efidyc44j7.execute-api.us-east-1.amazonaws.com/beta/calendar"; //DEV
                var data = new StringContent(JsonConvert.SerializeObject(jsonBPC_Q), Encoding.UTF8, "application/json");
                var responseMessage = await httpClient.PostAsync(url, data);
                result = await responseMessage.Content.ReadAsStringAsync();

            }
            XNode node = JsonConvert.DeserializeXNode(result.ToString(), "PackageComponentList");
            string systemID = "", ByStayNite = "", GetNextDay = "", AirVendorAPI = "", AirP2PVendorAPI = "", CarVendorAPI = "", SSVendorAPI = "", TransferVendorAPI = "", TICVendorAPI = "", BookURL = "", GIVendorAPI = "";

            switch (sysID)
            {
                case "TMLD":
                    systemID = _appSettings.ApplicationSettings.TMLD_SystemID;
                    ByStayNite = _appSettings.ApplicationSettings.TMLD_ByStayNite;
                    GetNextDay = _appSettings.ApplicationSettings.TMLD_GetNextDay;
                    AirVendorAPI = _appSettings.ApplicationSettings.TMLD_AirVendorAPI;
                    AirP2PVendorAPI = _appSettings.ApplicationSettings.TMLD_AirP2PVendorAPI;
                    CarVendorAPI = _appSettings.ApplicationSettings.TMLD_CarVendorAPI;
                    SSVendorAPI = _appSettings.ApplicationSettings.TMLD_SSVendorAPI;
                    TransferVendorAPI = _appSettings.ApplicationSettings.TMLD_TransferVendorAPI;
                    TICVendorAPI = _appSettings.ApplicationSettings.TMLD_TICVendorAPI;
                    BookURL = _appSettings.ApplicationSettings.TMLD_BookURL;
                    GIVendorAPI = _appSettings.ApplicationSettings.TMLD_GIVendorAPI;
                    break;
                case "TMED":
                    systemID = _appSettings.ApplicationSettings.TMED_SystemID;
                    ByStayNite = _appSettings.ApplicationSettings.TMED_ByStayNite;
                    GetNextDay = _appSettings.ApplicationSettings.TMED_GetNextDay;
                    AirVendorAPI = _appSettings.ApplicationSettings.TMED_AirVendorAPI;
                    AirP2PVendorAPI = _appSettings.ApplicationSettings.TMED_AirP2PVendorAPI;
                    CarVendorAPI = _appSettings.ApplicationSettings.TMED_CarVendorAPI;
                    SSVendorAPI = _appSettings.ApplicationSettings.TMED_SSVendorAPI;
                    TransferVendorAPI = _appSettings.ApplicationSettings.TMED_TransferVendorAPI;
                    TICVendorAPI = _appSettings.ApplicationSettings.TMED_TICVendorAPI;
                    BookURL = _appSettings.ApplicationSettings.TMED_BookURL;
                    GIVendorAPI = _appSettings.ApplicationSettings.TMED_GIVendorAPI;
                    break;
                case "TMAS":
                    systemID = _appSettings.ApplicationSettings.TMAS_SystemID;
                    ByStayNite = _appSettings.ApplicationSettings.TMAS_ByStayNite;
                    GetNextDay = _appSettings.ApplicationSettings.TMAS_GetNextDay;
                    AirVendorAPI = _appSettings.ApplicationSettings.TMAS_AirVendorAPI;
                    AirP2PVendorAPI = _appSettings.ApplicationSettings.TMAS_AirP2PVendorAPI;
                    CarVendorAPI = _appSettings.ApplicationSettings.TMAS_CarVendorAPI;
                    SSVendorAPI = _appSettings.ApplicationSettings.TMAS_SSVendorAPI;
                    TransferVendorAPI = _appSettings.ApplicationSettings.TMAS_TransferVendorAPI;
                    TICVendorAPI = _appSettings.ApplicationSettings.TMAS_TICVendorAPI;
                    BookURL = _appSettings.ApplicationSettings.TMAS_BookURL;
                    GIVendorAPI = _appSettings.ApplicationSettings.TMAS_GIVendorAPI;
                    break;
            }
            string contenido = "";
            string rResult = "";
            Int32 webServiceR = 0;
            try
            {
                contenido = Utilities.StringToGzipString(node.ToString());
                webServiceR = 1;
                rResult = contenido + "@|@" + webServiceR + "@|@" + systemID + "@|@" + ByStayNite + "@|@" + GetNextDay + "@|@" + AirVendorAPI + "@|@" + AirP2PVendorAPI + "@|@" + CarVendorAPI + "@|@" + SSVendorAPI + "@|@" + TransferVendorAPI + "@|@" + TICVendorAPI + "@|@" + lastCity + "@|@" + BookURL + "@|@" + GIVendorAPI;

            }
            catch (System.IO.IOException e)
            {
                rResult = Utilities.GZipStringToString(contenido);
                contenido = "Error";
                rResult = contenido + "@|@" + webServiceR + "@|@" + systemID + "@|@" + ByStayNite + "@|@" + GetNextDay + "@|@" + AirVendorAPI + "@|@" + AirP2PVendorAPI + "@|@" + CarVendorAPI + "@|@" + SSVendorAPI + "@|@" + TransferVendorAPI + "@|@" + TICVendorAPI + "@|@" + lastCity + "@|@" + BookURL + "@|@" + GIVendorAPI;
            }

            return Ok(Newtonsoft.Json.JsonConvert.SerializeObject(rResult));
        }

        [HttpPost("HeaderRecentlyViewed")]
        public async Task<string> HeaderShowRecently([FromBody] PlaceObject userID)
        {
            if (String.IsNullOrEmpty(userID.Id))
            {
                return null;
            }
            string vProds = "";

            IEnumerable<LastVisits> visits = _dapperWrap.MySqlGetRecords<LastVisits>(SqlCalls.MySQL_HeaderRecentlyViewed(userID.Id));
            foreach (var v in visits)
            {
                vProds = vProds + "," + v.UTS_ProductItemID.ToString();
            }

            if (vProds != "")
            {
                List<VisitedPacks> lastVisitedPacks = new List<VisitedPacks>();
                var Result = await _dapperWrap.GetRecords<VisitedPacks>(SqlCalls.SQL_HeaderRecentlyViewed(vProds.Substring(1, vProds.Length - 1)));
                lastVisitedPacks = Result.ToList();
                List<recentlyVisitedPackage> recentlyViewed = visits.Join(lastVisitedPacks, b => b.UTS_ProductItemID, d => d.PDLID, (b, d) =>
                     new recentlyVisitedPackage
                     {
                         UTS_ProductItemID = b.UTS_ProductItemID,
                         UTS_URL = b.UTS_URL,
                         UTS_Date = b.UTS_Date,
                         UTS_Site = b.UTS_Site.ToUpper(),
                         PDLID = d.PDLID,
                         PDL_Title = d.PDL_Title,
                         IMG_Path_URL = d.IMG_Path_URL,
                         STR_PlaceTitle = d.STR_PlaceTitle ?? ""
                     }).ToList();

                return Newtonsoft.Json.JsonConvert.SerializeObject(recentlyViewed);
            }
            else
            {
                return null;
            }
        }

        [HttpPost("RecentlyViewed")]
        public async Task<string> ShowRecently([FromBody] NameObject visitor)
        {
            if (String.IsNullOrEmpty(visitor.Name))
            {
                return null;
            }
            string vProds = "";

            IEnumerable<LastVisits> visits = _dapperWrap.MySqlGetRecords<LastVisits>(SqlCalls.MySQL_RecentlyViewed(visitor.Name));
            foreach (var v in visits)
            {
                vProds = vProds + "," + v.UTS_ProductItemID.ToString();
            }

            if (vProds != "")
            {
                List<VisitedPacks> lastVisitedPacks = new List<VisitedPacks>();
                var Result = await _dapperWrap.GetRecords<VisitedPacks>(SqlCalls.SQL_VisitedPackagesDescription(vProds.Substring(1, vProds.Length - 1)));
                lastVisitedPacks = Result.ToList();
                List<recentlyVisitedPackage> recentlyViewed = visits.Join(lastVisitedPacks, b => b.UTS_ProductItemID, d => d.PDLID, (b, d) =>
                     new recentlyVisitedPackage
                     {
                         UTS_ProductItemID = b.UTS_ProductItemID,
                         UTS_URL = b.UTS_URL,
                         UTS_Date = b.UTS_Date,
                         UTS_Site = b.UTS_Site.ToUpper(),
                         PDLID = d.PDLID,
                         PDL_Title = d.PDL_Title,
                         STP_Save = d.STP_Save,
                         IMG_Path_URL = d.IMG_Path_URL,
                         fromPlace = d.fromPlace,
                         PDL_Content = d.PDL_Content,
                         feedbacks = d.feedbacks,
                         STR_PlaceTitle = d.STR_PlaceTitle ?? ""
                     }).ToList();

                return Newtonsoft.Json.JsonConvert.SerializeObject(recentlyViewed);
            }
            else
            {
                return null;
            }
        }

        [HttpGet("FooterDestinations")]
        public async Task<string> GetFooterDestinations()
        {
            await _cachedDataService.LoadDestinationsIfNecessary();
            return _cachedDataService.destinationsCache;
        }

        [HttpGet("DestinationCities")]
        public async Task<string> GetDestinationCities()
        {
            var Result = await _dapperWrap.GetRecords<ExploreDest>(SqlCalls.SQL_AllDestinos(true));
            List<ExploreDest> destinationCities = Result.ToList();
            StringBuilder strRel = new StringBuilder();
            for (Int32 r = 0; r < destinationCities.Count; r++)
            {
                if (r > 0)
                {
                    strRel.Append("@");
                }
                strRel.Append(destinationCities[r].CouID.ToString() + "|" + destinationCities[r].CouNA + "|" + destinationCities[r].CtyID.ToString() + "|" + destinationCities[r].CtyNA + "|" + destinationCities[r].Ranking.ToString() + "|" + destinationCities[r].RegionID);
            }
            return strRel.ToString();
        }

        [HttpPost("getDataReviewFirst")]
        public async Task<string> getDataReviewFirst()
        {
            List<ReviewFirst> reviewList = new List<ReviewFirst>();
            var result = await _dapperWrap.GetRecords<ReviewFirst>(SqlCalls.SQL_ReviewFirst());
            reviewList = result.ToList();
            
            return Newtonsoft.Json.JsonConvert.SerializeObject(reviewList);
        }

        [HttpPost("getDataReviewPage")]
        public async Task<string> getDataReviewPage([FromBody] string revID)
        {
            List<ReviewPage> reviewList = new List<ReviewPage>();
            var result = await _dapperWrap.GetRecords<ReviewPage>(SqlCalls.SQL_ReviewPage(revID));
            reviewList = result.ToList();
            
            return Newtonsoft.Json.JsonConvert.SerializeObject(reviewList);
        }

        [HttpPost("amzCloud_Suggestions")]
        public async Task<IEnumerable<string>> Get_AWS_Suggestions([FromBody] PlaceObject q)
        {
            List<string> suggs = new List<string>();
            Int32 hasCityOrCountryElements = 0;

            try
            {
                string awsURL1 = "http://search-tripmasters-ddvbbeyrdp2xmv66q4il4ihzbm.us-east-1.cloudsearch.amazonaws.com/2013-01-01/suggest?q=" + q.Id + "&format=xml&suggester=tmsuggester";
                string awsURL2 = "http://search-tripmasters-ddvbbeyrdp2xmv66q4il4ihzbm.us-east-1.cloudsearch.amazonaws.com/2013-01-01/suggest?q=" + q.Id + "&format=xml&suggester=tmsugg_city&size=2";
                string awsURL3 = "http://search-tripmasters-ddvbbeyrdp2xmv66q4il4ihzbm.us-east-1.cloudsearch.amazonaws.com/2013-01-01/suggest?q=" + q.Id + "&format=xml&suggester=tmsugg_country&size=1";

                List<System.Net.WebRequest> rqsts = new List<System.Net.WebRequest>();
                rqsts.Add(System.Net.WebRequest.Create(awsURL1));
                rqsts.Add(System.Net.WebRequest.Create(awsURL2));
                rqsts.Add(System.Net.WebRequest.Create(awsURL3));

                Int32 index = 0;
                foreach (var x in rqsts)
                {
                    System.Net.WebResponse resp = x.GetResponse();
                    System.IO.Stream respStream = resp.GetResponseStream();
                    System.Xml.XmlDocument xmlToDoc = new XmlDocument();
                    System.Xml.XmlNodeList xmlSuggests;
                    List<string> suggsP = new List<string>();
                    string addedText = "";
                    xmlToDoc.Load(respStream);
                    xmlSuggests = xmlToDoc.SelectNodes("//item");
                    foreach (System.Xml.XmlNode n in xmlSuggests)
                    {
                        string suggestion = n.SelectSingleNode("./@suggestion").Value;

                        switch (index)
                        {
                            case 0:
                                string packId = n.SelectSingleNode("./@id").Value;
                                addedText = "##P##" + packId;
                                break;
                            case 1:
                                addedText = "##inCt";
                                break;
                            case 2:
                                addedText = "##inCo";
                                break;
                        }
                        suggsP.Add(suggestion + addedText);
                    }
                    if (suggsP.Count > 0)
                    {
                        if (index > 0)
                        {
                            suggsP.ForEach(y => suggs.Insert(0, y));
                        }
                        else
                        {
                            string packsIds = string.Join(",", suggsP.Select(y => y.Substring(y.LastIndexOf("##pk") + 4)));

                            List<PackageCountry> pkgs = new List<PackageCountry>();
                            var result = await _dapperWrap.GetRecords<PackageCountry>(SqlCalls.SQL_PackageCountry(packsIds));
                            pkgs = result.ToList();

                            for (Int32 i = 0; i <= suggsP.Count - 1; i++)
                            {
                                string id = suggsP[i].Substring(suggsP[i].IndexOf("##pk") + 4).Trim();
                                string suggText = suggsP[i].Substring(0, suggsP[i].IndexOf("##")).Trim().Replace(" ", "_").Replace("&", "and");
                                List<PackageCountry> pkg = pkgs.Where(p => p.Id.ToString() == id).ToList();
                                if (pkg.Count > 0)
                                {
                                    suggsP[i] = suggsP[i] + "##www.tripmasters.com/" + pkg[0].Region + "/" + pkg[0].coun.Replace(" ", "_").ToLower() + "/" + suggText + "/package-" + id;
                                }
                            }
                            suggs.AddRange(suggsP);
                        }
                    }
                    index++;
                }

                if (suggs.Count > 0 && hasCityOrCountryElements > 0)
                {
                    string f = suggs.FirstOrDefault(x => x.Contains("##inC"));
                    string hh = f ?? "";
                    if (hh != "")
                    {
                        suggs.Insert(suggs.IndexOf(f), "-##Sp");
                    }
                }
            }
            catch (System.IO.IOException ex)
            {
                suggs.Insert(0, "Error: " + ex.Message);
                _logger.LogError($"****** Site: TM | Error-amzCloud_Suggestions IOException message: " + ex.Message + ", q.Id: " + q.Id);
            }

            return suggs;
        }

        [HttpPost("CountryPlaces")]
        public async Task<string> GetCountryPlaces([FromBody] string countryId)
        {
            List<CountryPlaces> countryList = new List<CountryPlaces>();
            var result = await _dapperWrap.GetRecords<CountryPlaces>(SqlCalls.SQL_CountryPlacesOnly(countryId));
            countryList = result.ToList();
            
            return Newtonsoft.Json.JsonConvert.SerializeObject(countryList);
        }
        [HttpPost("CheckBooking")]
        public bool CheckBooking([FromBody] CheckBookingParams book)
        {
            List<BookingTest> booking = new List<BookingTest>();
            try
            {
                var result1 = _dapperWrap.GetRecords<BookingTest>(SqlCalls.SQL_BookingTest(int.Parse(book.bookingId), book.email));
                booking = result1.Result.ToList();
                if (booking.Count > 0)
                {
                    return true;
                }
            }
            catch (System.IO.IOException ex)
            {
                //return ex.Message;
            }

            return false;
        }
        [HttpPost("CheckStatus")]
        public async Task<string> CheckStatus([FromBody] CheckStatus status)
        {
            //List<ContactAgent> agent = new List<ContactAgent>();
            //var result1 = await _dapperWrap.GetRecords<ContactAgent>(SqlCalls.SQL_ContactAgent(status.email, status.id));
            //agent = result1.ToList();

            List<AwsCredentials> awsCredentials = new List<AwsCredentials>();
            var responseMessage = string.Empty;
            string rResult = string.Empty;

            var sqlGetAWSCredentials = _appSettings.AWSConnection.AwsCredentialsQuery;
            var t0 = _dapperWrap.GetRecords<AwsCredentials>(sqlGetAWSCredentials);
            awsCredentials = t0.Result.ToList();
            var payload = new
            {
                parameters = new { UserId = status.id, Command = "get_current_user_data_agent" }
            };
            using (AmazonLambdaClient client = new AmazonLambdaClient(awsCredentials.First().AWSK_AccessKey, awsCredentials.First().AWSK_SecretKey, RegionEndpoint.USEast1))
            {
                InvokeRequest ir = new InvokeRequest
                {
                    FunctionName = @"arn:aws:lambda:" + _appSettings.AWSConnection.AwsRegionId + @":function:TM_AWSConnect_CCP_Instance",
                    InvocationType = InvocationType.RequestResponse,
                    Payload = Newtonsoft.Json.JsonConvert.SerializeObject(payload)
                };
                try
                {
                    InvokeResponse response = client.InvokeAsync(ir).Result;
                    if (String.IsNullOrEmpty(response.FunctionError))
                    {
                        using (response.Payload)
                        {
                            var sr = new StreamReader(response.Payload);
                            JsonReader reader = new JsonTextReader(sr);

                            var serilizer = new JsonSerializer();
                            JObject op = serilizer.Deserialize<JObject>(reader);
                            dynamic obj = JsonConvert.DeserializeObject<ExpandoObject>(op.ToString());
                            var bodyJson = obj.body.ToString();
                            List<dynamic> bodyList = JsonConvert.DeserializeObject<List<dynamic>>(bodyJson);

                            dynamic rsp = bodyList.FirstOrDefault(x => x.User.Username == status.email);

                            var responsePayload = new Object();
                            if (rsp != null)
                            {
                                responsePayload = new { statusCode = 200, agentStatus = rsp.Status.StatusName, activeVoice = rsp.AvailableSlotsByChannel.VOICE, activeChat = rsp.AvailableSlotsByChannel.CHAT };
                            }else
                            {
                                responsePayload = new { statusCode = 200, agentStatus = "Offline" };
                            }

                            responseMessage = JsonConvert.SerializeObject(responsePayload);
                        }
                    }
                    else
                    {
                        rResult = "Error" + response.FunctionError;
                        throw new Exception(response.FunctionError + " throwed exception");
                    }
                }
                catch (Exception ex)
                {
                    rResult = "Catched error from Check Status Agent = " + ex.Message;
                    responseMessage = rResult;
                }
            }
            return responseMessage;
        }
        [HttpPost("GetChtInfo")]
        public async Task<IEnumerable<ContactAgent>> GetChtInfo([FromBody] string email)
        {
            List<ContactAgent> agent = new List<ContactAgent>();
            var result1 = await _dapperWrap.GetRecords<ContactAgent>(SqlCalls.SQL_GetChatAgent(email));
            agent = result1.ToList();
            return agent;
        }

        [HttpPost("CallCustomer")]
        public async Task<string> CallCustomer([FromBody] CallCustomer customer)
        {
            string returnResult = "";
            Regex emailRegex = new Regex("^[_a-z0-9-]+(.[a-z0-9-]+)@[a-z0-9-]+(.[a-z0-9-]+)*(.[a-z]{2,4})$");
            Regex phoneRegex = new Regex(@"\d+");
            var matchEmail = emailRegex.Match(customer.email);
            var matchPhone = phoneRegex.Match(customer.phone);
            var header = HttpContext.Request.Headers["Cookie"];
            string ck = Utilities.getBetween(header, "ut2=", "&_utReset");
            //string utValues;
            string[] utValues = ck.Split("&");
            string AWSOutBoundCall = _appSettings.EmailSetting.AwsOutboundCall;

            if (matchEmail.Success && matchPhone.Success)
            {
                var client = new HttpClient();
                var postBody = new
                {
                    TMUser = customer.email.ToString(),
                    DestinationPhoneNumber = $"+1{customer.phone}"
                };

                var json = JsonConvert.SerializeObject(postBody);
                var content = new StringContent(json, Encoding.UTF8, "application/json");

                content.Headers.Add("x-utvisitorid", utValues[0].Split("=")[1]);
                content.Headers.Add("x-register", "Unitraqv2");
                content.Headers.Add("x-utpagetype", "AgentCall");
                content.Headers.Add("x-utlogid", utValues[2].Split("=")[1]);
                content.Headers.Add("x-phone", customer.phone);
                content.Headers.Add("x-name", customer.name);
                content.Headers.Add("x-email", customer.email);

                var response = await client.PostAsync(AWSOutBoundCall, content);
                var result = await response.Content.ReadAsStringAsync();
                returnResult = result;
            }
            return returnResult;
        }

        [HttpPost("SendMessageChat")]
        public string SendMessageChat([FromBody] ChatMessage message)
        {
            List<AwsCredentials> aws = new List<AwsCredentials>();
            string rResult = String.Empty;
            var responseMessage = String.Empty;
            var js = new
            {
                Name = message.name,
                Email = message.email,
                Message = message.message,
                BookingId = message.bookingId,
                Register = "Tournet"
            };

            var sqlGetAWSCredentials = _appSettings.AWSConnection.AwsCredentialsQuery;
            var t0 = _dapperWrap.GetRecords<AwsCredentials>(sqlGetAWSCredentials);
            aws = t0.Result.ToList();

            using (AmazonLambdaClient client = new AmazonLambdaClient(aws.First().AWSK_AccessKey, aws.First().AWSK_SecretKey, RegionEndpoint.USEast1))
            {
                InvokeRequest ir = new InvokeRequest
                {
                    FunctionName = @"arn:aws:lambda:" + _appSettings.AWSConnection.AwsRegionId + @":function:TM_WS_ChatMessageV2",
                    InvocationType = InvocationType.RequestResponse,
                    Payload = Newtonsoft.Json.JsonConvert.SerializeObject(js)
                };
                try
                {
                    InvokeResponse response = client.InvokeAsync(ir).Result;
                    if (String.IsNullOrEmpty(response.FunctionError))
                    {
                        using (response.Payload)
                        {
                            var sr = new StreamReader(response.Payload);
                            JsonReader reader = new JsonTextReader(sr);

                            var serilizer = new JsonSerializer();
                            var op = serilizer.Deserialize(reader);
                            responseMessage = JsonConvert.SerializeObject(op);
                        }
                    }
                    else
                    {
                        rResult = "Error" + response.FunctionError;
                        throw new Exception(response.FunctionError + " throwed exception");
                    }
                }
                catch (Exception ex)
                {
                    rResult = "Catched error from sendMessageCht = " + ex.Message;
                    responseMessage = rResult;
                }
            }
            return responseMessage;
        }
        [HttpPost("PostSurvey")]
        [SuppressModelStateInvalidFilter]
        public string PostSurvey([FromBody] Survey survey)
        {
            //var dict = survey as IDictionary<string, object>;
            if (survey == null)
            {
                var rawBody = HttpContext.Items["RawRequestBody"] as string ?? "";
                string clientIp = ClientInfo.GetClientIp(HttpContext); 
                _logger.LogInformation($"****** Site: TM | ClientIP: {clientIp} | Wrong payload {rawBody} for PostSurvey 400 BadRequest");
                return null;
            }
            string resolve = survey.resolve;
            string firstTime = survey.firstTime;
            if (resolve != "null") { resolve = Convert.ToInt32(Convert.ToBoolean(survey.resolve)).ToString(); }
            if (firstTime != "null") { firstTime = Convert.ToInt32(Convert.ToBoolean(survey.firstTime)).ToString(); }
            List<AwsCredentials> aws = new List<AwsCredentials>();
            var responseMessage = String.Empty;
            string rResult = String.Empty;

            var sqlGetAWSCredentials = _appSettings.AWSConnection.AwsCredentialsQuery;
            var t0 = _dapperWrap.GetRecords<AwsCredentials>(sqlGetAWSCredentials);
            aws = t0.Result.ToList();

            using (AmazonLambdaClient client = new AmazonLambdaClient(aws.First().AWSK_AccessKey, aws.First().AWSK_SecretKey, RegionEndpoint.USEast1))
            {
                var tag = new
                {
                    Tag = new
                    {
                        TagsId = 1701,
                        AuthorId = 735,
                        AuthorMsg = "Chat feedback",
                        Type = "Tag",
                        TagRowId = 0,
                        TagUrgency = 2,
                        TagNoOfDayForDueDate = 0,
                        Register = "Tournet",
                        ContactId = survey.contactId,
                        Proficiency = survey.proficiency,
                        Politeness = survey.politeness,
                        Resolve = resolve,
                        FirstTime = firstTime,
                        Rating = survey.rating,
                        Comments = survey.comments,
                        SendTranscript = survey.transcript,
                        IgnoreDuplicate = true
                    }
                };
                var serializeTag = Newtonsoft.Json.JsonConvert.SerializeObject(tag);
                InvokeRequest ir = new InvokeRequest
                {
                    FunctionName = @"arn:aws:lambda:" + _appSettings.AWSConnection.AwsRegionId + @":function:TM_OPF_OpenTagCreateMessage",
                    InvocationType = InvocationType.RequestResponse,
                    Payload = serializeTag
                };
                try
                {
                    InvokeResponse response = client.InvokeAsync(ir).Result;
                    if (String.IsNullOrEmpty(response.FunctionError))
                    {
                        using (response.Payload)
                        {
                            var sr = new StreamReader(response.Payload);
                            JsonReader reader = new JsonTextReader(sr);

                            var serilizer = new JsonSerializer();
                            var op = serilizer.Deserialize(reader);
                            responseMessage = JsonConvert.SerializeObject(op);
                        }
                    }
                    else
                    {
                        rResult = "Error" + response.FunctionError;
                        throw new Exception(response.FunctionError + " throwed exception");
                    }
                }
                catch (Exception ex)
                {
                    rResult = "Catched error from openTagCreateMessage = " + ex.Message;
                    responseMessage = rResult;
                }
            }

            return Newtonsoft.Json.JsonConvert.SerializeObject(responseMessage);
        }

        [HttpPost("PostBookingSurvey")]
        public string PostSurvey([FromBody] PostSurvey survey)
        {
            List<AwsCredentials> aws = new List<AwsCredentials>();
            string rResult = String.Empty;
            var responseMessage = String.Empty;
            Models.ViewModels.BookingsViewModel surveyModel = new Models.ViewModels.BookingsViewModel();
            var result = _dapperWrap.GetRecords<PostBookingSurvey>(SqlCalls.SQL_PostBookingSurvey(survey.BookingId, survey.EmailAddress));
            surveyModel.postSurvey = result.Result.ToList();

            if (surveyModel.postSurvey.Count == 0)
            {
                var surveyData = new
                {
                    BookingId = survey.BookingId,
                    EmailAddress = survey.EmailAddress,
                    FindEverything = Convert.ToInt32(survey.FindEverything),
                    EasyWebsite = Convert.ToInt32(survey.EasyWebsite),
                    DidYouContactUs = Convert.ToInt32(survey.DidYouContactUs),
                    ExperienceScore = survey.ExperienceScore,
                    Comments = survey.Comments,
                    Register = "Tournet"
                };

                var sqlGetAWSCredentials = _appSettings.AWSConnection.AwsCredentialsQuery;
                var t0 = _dapperWrap.GetRecords<AwsCredentials>(sqlGetAWSCredentials);
                aws = t0.Result.ToList();

                using (AmazonLambdaClient client = new AmazonLambdaClient(aws.First().AWSK_AccessKey, aws.First().AWSK_SecretKey, RegionEndpoint.USEast1))
                {
                    InvokeRequest ir = new InvokeRequest
                    {
                        FunctionName = @"arn:aws:lambda:" + _appSettings.AWSConnection.AwsRegionId + @":function:TM_Web_PostBookingSurvey",
                        InvocationType = InvocationType.RequestResponse,
                        Payload = Newtonsoft.Json.JsonConvert.SerializeObject(surveyData)
                    };
                    try
                    {
                        InvokeResponse response = client.InvokeAsync(ir).Result;
                        if (String.IsNullOrEmpty(response.FunctionError))
                        {
                            using (response.Payload)
                            {
                                var sr = new StreamReader(response.Payload);
                                JsonReader reader = new JsonTextReader(sr);

                                var serilizer = new JsonSerializer();
                                var op = serilizer.Deserialize(reader);
                                responseMessage = JsonConvert.SerializeObject(op);
                            }
                        }
                        else
                        {
                            rResult = "Error" + response.FunctionError;
                            throw new Exception(response.FunctionError + " throwed exception");
                        }
                    }
                    catch (Exception ex)
                    {
                        rResult = "Catched error from PostBookingSurvey = " + ex.Message;
                        responseMessage = rResult;
                    }
                }
            }
            else
            {
                var jsonResp = new
                {
                    statusCode = 201,
                    responseMessage = surveyModel.postSurvey,
                    bodyMessage = "The post survey form is already saved"
                };
                responseMessage = JsonConvert.SerializeObject(jsonResp);
            }

            return responseMessage;

        }

        [HttpPost("getDataBookingDeptID")]
        public async Task<dynamic> GetsqlBookingDeptID([FromBody] CheckBookingParams manageBooking)
        {
            var returnMessage = new object();
            try
            {
                StringBuilder dID = new StringBuilder();
                List<NameObject> dvD = new List<NameObject>();
                var result = await _dapperWrap.GetRecords<NameObject>(SqlCalls.SQL_DeptIdByBookId(manageBooking.bookingId));
                dvD = result.ToList();
                
                if (dvD.Count > 0)
                {
                    string[] txt1 = dvD.FirstOrDefault().Name.Split('|');
                    if (manageBooking.email.ToLower().Trim() == txt1[0].ToLower().Trim())
                    {
                        for (Int32 dp = 0; dp <= dvD.Count - 1; dp++)
                        {
                            dID.Append(dvD[dp].Id);
                        }
                    }
                    else
                    {
                        throw new Exception();
                    }

                }
                returnMessage = new { StatusCode = 200, Message = "Success", Dept = Int32.Parse(dID.ToString()) };

                return returnMessage;
            }
            catch (Exception ex)
            {
                returnMessage = new { StatusCode = 500, message = "The email provided did not match with the email from the booking id!" };
                return returnMessage;
            }


        }

        [HttpPost("VisitHistoryXunitraq")] ///WS_Library.asmx/MySQLgetVisitHistoryXunitraq
        public string VisitHistoryXunitraq([FromBody] NameObject userID)
        {
            if (string.IsNullOrEmpty(userID.Name))
            {
                return null;
            }
            string vProds = "";
            IEnumerable<BaseObject> Ids = _dapperWrap.MySqlGetRecords<BaseObject>(SqlCalls.MySQL_Visitor_NoOfVisits(userID.Name));
            return Newtonsoft.Json.JsonConvert.SerializeObject(Ids);
        }

        [HttpPost("MarketingSubscriber")]
        public async Task<string> GetMrktEmail([FromBody] MrkSubscription mrkSubscriptionParams)
        {
            string mrkResult = String.Empty;
            var lambdaResult = new MarketingSubscriptionResponse();
            try
            {
                //The proc value is for defining that procedure to use: 1 = Add, 2 = Update, 3 = Get
                List<AwsCredentials> aws = new List<AwsCredentials>();
                var mrkMessage = String.Empty;
                var sqlGetAWSCredentials = _appSettings.AWSConnection.AwsCredentialsQuery;
                var result = await _dapperWrap.GetRecords<AwsCredentials>(sqlGetAWSCredentials);
                aws = result.ToList();

                using (AmazonLambdaClient client = new AmazonLambdaClient(aws.First().AWSK_AccessKey, aws.First().AWSK_SecretKey, RegionEndpoint.USEast1))
                {
                    string payload = @"{""email"": """ + mrkSubscriptionParams.email + @""", ""ED"": """ + mrkSubscriptionParams.ED + @""", ""TM"": """ + mrkSubscriptionParams.TM + @""", ""proc"": """ + mrkSubscriptionParams.proc + @""", ""options"": """ + mrkSubscriptionParams.options + @"""}";
                    InvokeRequest ir = new InvokeRequest
                    {
                        FunctionName = @"arn:aws:lambda:" + _appSettings.AWSConnection.AwsRegionId + @":function:TM_WS_MktEmailSubscriptionV2",
                        InvocationType = InvocationType.RequestResponse,
                        Payload = payload
                    };

                    try
                    {
                        InvokeResponse response = client.InvokeAsync(ir).Result;
                        if (String.IsNullOrEmpty(response.FunctionError))
                        {
                            using (response.Payload)
                            {
                                var sr = new StreamReader(response.Payload);
                                JsonReader reader = new JsonTextReader(sr);
                                var serilizer = new JsonSerializer();
                                lambdaResult = serilizer.Deserialize<MarketingSubscriptionResponse>(reader);
                            }
                        }
                        else
                        {
                            mrkMessage = "Error" + response.FunctionError;
                            throw new Exception(response.FunctionError + " TM_WS_MktEmailSubscription");
                        }
                    }
                    catch (Exception ex)
                    {
                        mrkMessage = ex.Message;
                        _logger.LogError($"****** Site: TM | Error-MarketingSubscriber catched error : " + ex.Message);
                        return mrkMessage;
                    }
                }

                //mrkResult = mrkMessage;
                if (lambdaResult.statusCode == 200)
                {
                    return Newtonsoft.Json.JsonConvert.SerializeObject(lambdaResult);
                }
                else
                {
                    throw new Exception("MarketingSubscriber return 500: ");
                }
            }
            catch (Exception ex)
            {
                mrkResult = ex.Message;
                _logger.LogError($"****** Site: TM | Error-MarketingSubscriber catched error : " + ex.Message);
                return mrkResult;
            }
        }

        [HttpPost("Emailtous")]
        public string Emailtous([FromBody] string emailinfo)
        {
            string userReason = "";
            string userBKN = "";
            string userNA = "";
            string userEmail = "";
            string userTel = "";
            string userMsg = "";
            string q = emailinfo;
            string[] qParts = q.Split("&");
            foreach (var qPart in qParts)
            {
                string[] qPar = qPart.Split("=");
                if (Regex.IsMatch(qPar[0], "frmReason", RegexOptions.IgnoreCase))
                {
                    userReason = qPar[1];
                }
                if (Regex.IsMatch(qPar[0], "frmBKN", RegexOptions.IgnoreCase))
                {
                    userBKN = qPar[1];
                }
                if (Regex.IsMatch(qPar[0], "frmFullName", RegexOptions.IgnoreCase))
                {
                    userNA = qPar[1];
                }
                if (Regex.IsMatch(qPar[0], "frmEmail", RegexOptions.IgnoreCase))
                {
                    userEmail = qPar[1];
                }
                if (Regex.IsMatch(qPar[0], "frmMsg", RegexOptions.IgnoreCase))
                {
                    userMsg = JsonConvert.ToString(qPar[1]);
                    userMsg = userMsg.Substring(1, userMsg.Length - 2);
                }
            }
            string sendTo = "contact@tripmasters.com";

            string userMotivation = userReason switch
            {
                "NoBooking" => "I don’t have a booking",
                "WithBooking" => "I have a booking",
                "WithTrip" => "I completed a trip",
                _ => throw new NotImplementedException(),
            };

            //sendTo = "afataciune@tripmasters.com";
            string emailSent = "";
            List<AwsCredentials> aws = new();

            var sqlGetAWSCredentials = _appSettings.AWSConnection.AwsCredentialsQuery;
            var t0 = _dapperWrap.GetRecords<AwsCredentials>(sqlGetAWSCredentials);
            aws = t0.Result.ToList();

            using (AmazonLambdaClient client = new AmazonLambdaClient(aws.First().AWSK_AccessKey, aws.First().AWSK_SecretKey, RegionEndpoint.USEast1))
            {
                string Subject = "TM - Contact Us";
                string MessageBody = "";
                if (userBKN != "")
                {
                    MessageBody = "Booking Number: " + userBKN + "<br/><br/>";
                }
                MessageBody = MessageBody + "Reason: " + userMotivation + "<br/><br/>" +
                                        "Full Name: " + userNA + "<br/><br/>" +
                                        "Email: " + userEmail + "<br/><br/>" +
                                        "Message:" + userMsg;
                string payload = @"{""sendTo"": """ + sendTo + @""", ""userMsg"": """ + MessageBody + @"""}";
                InvokeRequest ir = new InvokeRequest
                {
                    FunctionName = @"arn:aws:lambda:" + _appSettings.AWSConnection.AwsRegionId + @":function:Lambda_TM_Web_Emailtous",
                    InvocationType = InvocationType.RequestResponse,
                    Payload = payload
                };

                try
                {
                    InvokeResponse response = client.InvokeAsync(ir).Result;
                    if (String.IsNullOrEmpty(response.FunctionError))
                    {
                        using (response.Payload)
                        {
                            var sr = new StreamReader(response.Payload);
                            JsonReader reader = new JsonTextReader(sr);
                            emailSent = "True";
                        }
                    }
                    else
                    {
                        throw new Exception(response.FunctionError + " Lambda_TM_Web_Emailtous");
                    }
                }
                catch (Exception ex)
                {
                    emailSent = "False: " + ex.Message;
                }
            }

            string strJson = Newtonsoft.Json.JsonConvert.SerializeObject(emailSent);
            return strJson;
        }

        [HttpPost("GetAllTaxes")]
        public async Task<string> GetAllTaxe()
        {
            List<TaxCityInfo> citytaxList = new List<TaxCityInfo>();
            var result = await _dapperWrap.GetRecords<TaxCityInfo>(SqlCalls.SQL_TaxCityInfo());
            citytaxList = result.ToList();
            
            return Newtonsoft.Json.JsonConvert.SerializeObject(citytaxList);
        }

        [HttpPost("GetAirlineFeeList")]
        public object GetAirlineFeeList()
        {
            ServicePointManager.Expect100Continue = true;
            ServicePointManager.SecurityProtocol = SecurityProtocolType.Tls | SecurityProtocolType.Tls11 | SecurityProtocolType.Tls12;
            var objClient = new WebClient();
            const string strURL = "https://bags.amadeus.com/";
            byte[] pageHTML;
            pageHTML = objClient.DownloadData(strURL);
            objClient.Dispose();
            var objUTF8 = new UTF8Encoding();
            string stringHTML = objUTF8.GetString(pageHTML);
            HtmlDocument doc = new HtmlDocument();
            doc.LoadHtml(stringHTML);
            var element = doc.GetElementbyId("ddlAirline");

            return Newtonsoft.Json.JsonConvert.SerializeObject(element.InnerHtml);
        }
        [HttpPost("GetReview")]
        public string GetReview([FromBody] GetReview review)
        {
            StringBuilder xml_Q = new StringBuilder();
            xml_Q.Append("<WEB_OPRCustomerFeedbackSET_Q>");
            xml_Q.Append("<BookingID>" + review.userBooking + "</BookingID>");
            xml_Q.Append("<EmailAddress>" + review.userEmail + "</EmailAddress>");
            xml_Q.Append("<CustomerReview>");
            xml_Q.Append("<SatisfactionRate>" + review.userRate + "</SatisfactionRate>");
            xml_Q.Append("<IntentionToReturn>");
            if (review.userUsing == "0")
            {
                xml_Q.Append("false");
            }
            else
            {
                xml_Q.Append("true");
            }
            xml_Q.Append("</IntentionToReturn>");
            xml_Q.Append("<CustomerComment><![CDATA[" + review.userReview + "]]></CustomerComment>");
            xml_Q.Append("<CustomerServiceRating>" + review.serviceScore + "</CustomerServiceRating>");
            xml_Q.Append("<WebsiteBookingRating>" + review.sitebpScore + "</WebsiteBookingRating>");
            xml_Q.Append("<FlightsRating>" + review.flightScore + "</FlightsRating>");
            xml_Q.Append("<HotelsRating>" + review.hotelScore + "</HotelsRating>");
            xml_Q.Append("<TransfersRating>" + review.transferScore + "</TransfersRating>");
            xml_Q.Append("<ActivitiesRating>" + review.ssScore + "</ActivitiesRating>");
            xml_Q.Append("<CarRentalsRating>" + review.carrentalScore + "</CarRentalsRating>");
            xml_Q.Append("<TrainsRating>" + review.trainScore + "</TrainsRating>");
            xml_Q.Append("<FerriesRating>" + review.ferryScore + "</FerriesRating>");
            xml_Q.Append("</CustomerReview>");
            xml_Q.Append("</WEB_OPRCustomerFeedbackSET_Q>");
            XmlDocument xmlDocQ = new XmlDocument();
            string query = String.Empty;
            try
            {
                xmlDocQ.LoadXml(xml_Q.ToString());
                query = xmlDocQ.InnerXml;

                string domaiName = _appSettings.ApplicationSettings.domainName;
                string register = _appSettings.ApplicationSettings.register;

                string qResult = Utilities.ConnectorSendAndReceive(register, query, domaiName);
                XmlDocument xmlDocR = new XmlDocument();
                xmlDocR.LoadXml(qResult);

                XmlNodeList resp = xmlDocR.GetElementsByTagName("WEB_OPRCustomerFeedbackSET_R");
                string result = resp[0].SelectSingleNode("Result").InnerText;
                return result;
            }
            catch (System.IO.IOException ex)
            {
                return ex.Message;
            }
            //return null;
        }
        [HttpPost("HeaderMostPop")]
        public async Task<string> GetHeaderMostPop()
        {

            List<MostPop> dv = new List<MostPop>();
            var result = await _dapperWrap.GetRecords<MostPop>(SqlCalls.SQL_HeaderMostPopItineraries());
            dv = result.ToList();
            
            return Newtonsoft.Json.JsonConvert.SerializeObject(dv);
        }

        [HttpPost("MostPop")]
        public async Task<string> GetMostPop()
        {

            List<MostPop> dv = new List<MostPop>();
            var result = await _dapperWrap.GetRecords<MostPop>(SqlCalls.SQL_MostPopItineraries());
            dv = result.ToList();
            
            return Newtonsoft.Json.JsonConvert.SerializeObject(dv);


        }

        [HttpPost("ErrorEmailtous")]
        public string SendErrorEmailtous([FromBody] ErrorMessage emailinfo)
        {
            string sendTo = "agherasim@tripmasters.com";
            string cc = "ancagherasim1115@gmail.com";
            string emailSent = "";
            List<AwsCredentials> aws = new();

            var sqlGetAWSCredentials = _appSettings.AWSConnection.AwsCredentialsQuery;
            var t0 = _dapperWrap.GetRecords<AwsCredentials>(sqlGetAWSCredentials);
            aws = t0.Result.ToList();

            using (AmazonLambdaClient client = new AmazonLambdaClient(aws.First().AWSK_AccessKey, aws.First().AWSK_SecretKey, RegionEndpoint.USEast1))
            {
                string Subject = "TM 500 error";
                string MessageBody = "Route of exception: " + emailinfo.routeOfException_ + " <br> Status code: " + emailinfo.statusCode_ + " <br> " +
                    " Error message: " + emailinfo.errorMessage_ + " <br> " +
                    " Stack trace: " + emailinfo.stackTrace_;
                string payload = @"{""sendTo"": """ + sendTo + @""", ""userMsg"": """ + MessageBody + @""", ""cc"": """ + cc + @""", ""subject"":""" + Subject + @""" }";
                InvokeRequest ir = new InvokeRequest
                {
                    FunctionName = @"arn:aws:lambda:" + _appSettings.AWSConnection.AwsRegionId + @":function:Lambda_TM_Web_Emailtous",
                    InvocationType = InvocationType.RequestResponse,
                    Payload = payload
                };

                try
                {
                    InvokeResponse response = client.InvokeAsync(ir).Result;
                    if (String.IsNullOrEmpty(response.FunctionError))
                    {
                        using (response.Payload)
                        {
                            var sr = new StreamReader(response.Payload);
                            JsonReader reader = new JsonTextReader(sr);
                            emailSent = "True";
                        }
                    }
                    else
                    {
                        throw new Exception(response.FunctionError + " Lambda_TM_Web_Emailtous");
                    }
                }
                catch (Exception ex)
                {
                    emailSent = "False: " + ex.Message;
                }
            }

            string strJson = Newtonsoft.Json.JsonConvert.SerializeObject(emailSent);
            return strJson;
        }

        [HttpPost("HomeTownAirport")]
        public async Task<string> GeHomeTownAirport()
        {
            var awaitedHomeTown = await Utilities.HomeTownAirport();
            return Newtonsoft.Json.JsonConvert.SerializeObject(awaitedHomeTown.ToString());
        }

        [HttpGet("WebAnnouncement")]
        public async Task<string> GetWebAnnouncement()
        {
            //string response = string.Empty;
            //List<WebAnnouncement> webAnnouncements = new List<WebAnnouncement>();
            //var result = await _dapperWrap.GetRecords<WebAnnouncement>(SqlCalls.SQL_WebAnnounce());
            //webAnnouncements = result.ToList();
            //if (webAnnouncements.Count > 0)
            //{
            //    response = webAnnouncements.First().WEBA_Msg;
            //}

            //return response;
            await _cachedDataService.LoadWebAnnouncementIfNecessary();
            return _cachedDataService.webAnnouncementsCache;
        }

        [HttpPost("errorcalendarlogs")]
        public IActionResult LogErrorCalendar([FromBody] CalendarError logErrorRequest)
        {
            if (logErrorRequest == null)
            {
                _logger.LogError($"****** Site: TM | Error-BYO-Calendar logErrorRequest object is null");
            }
            else
            {
                _logger.LogError($"****** Site: TM | Error-BYO-Calendar message: {logErrorRequest.Message}");
                _logger.LogError($"****** Site: TM | Error-BYO-Calendar cities: {logErrorRequest.Cities}");
            }
            return Ok();
        }

        [HttpGet("Top3FeedbackByCounId/{counID}")]
        public async Task<IEnumerable<dynamic>> GetTop3FeedbackByCounId(int counID)
        {
            await _cachedDataService.LoadFeedbacksIfNecessary();
            int totalRows = _cachedDataService.feedbacksCache.Count(f => f.CountryID == counID);
            var filteredFeedbacks = _cachedDataService.feedbacksCache.Where(f => f.CountryID == counID && f.pcc_overallscore >= 4 && !f.PCC_Comment.StartsWith("---"))
                .OrderByDescending(f => f.dep_date);
            var topResults = filteredFeedbacks
                .Take(3)
                .Select(f => new
                {
                    f.PCC_Comment,
                    f.pcc_overallscore,
                    f.dep_date,
                    Total_Rows = totalRows
                });
            return topResults;
        }
    }
}

