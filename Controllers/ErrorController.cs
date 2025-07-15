using System;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Diagnostics;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http.Features;
using System.IO;
using System.Net;
using System.Net.Sockets;
using Microsoft.Extensions.Logging;
using Newtonsoft.Json;
using System.Collections.Generic;
using System.Net.Http;
using MySqlX.XDevAPI;
using System.Net.Http.Headers;
using System.Text;
using System.Threading.Tasks;
using Org.BouncyCastle.Asn1.Ocsp;
using Amazon.Lambda.Model;
using Amazon.Lambda;
using MVC_TM.Infrastructure;
using System.Data.SqlClient;
using System.Data;
using System.Linq;
using Microsoft.Extensions.Options;
using MVC_TM.Infrastructure;
using MVC_TM.Models;
using Microsoft.Extensions.Primitives;

namespace MVC_TM.Controllers
{
    [Route("Error")]
    public class ErrorController : Controller
    {
        private readonly IWebHostEnvironment hostingEnvironment;
        private readonly ILogger<ErrorController> logger;
        private readonly IHttpContextAccessor httpContextAccessor;
        public ErrorController(IWebHostEnvironment _hostingEnvironment, ILogger<ErrorController> _logger, IHttpContextAccessor _httpContextAccessor)
        {
            logger = _logger;
            hostingEnvironment = _hostingEnvironment;
            httpContextAccessor = _httpContextAccessor;
        }

        [Route("HandleError")]
        public async Task<IActionResult> HandleError(int? statusCode = null)
        {
            var req = HttpContext.Request;
            var ctx = HttpContext;
            var rawBody = ctx.Items["RawRequestBody"] as string ?? "";
            var exceptionFeature = HttpContext.Features.Get<IExceptionHandlerFeature>();
            var isApi = exceptionFeature != null && exceptionFeature.Path?.Contains("/Api/", StringComparison.OrdinalIgnoreCase) == true;
            var sessionId = HttpContext.Items["SessionId"]?.ToString() ?? "NoSession";
            string clientIp;
            if (HttpContext.Request.Headers.TryGetValue("X-Forwarded-For", out var xfwd)
                && !StringValues.IsNullOrEmpty(xfwd))
            {
                clientIp = xfwd.ToString()
                               .Split(',', StringSplitOptions.RemoveEmptyEntries)[0]
                               .Trim();
            }
            else
            {
                clientIp = HttpContext.Connection.RemoteIpAddress?
                               .ToString()
                           ?? "UnknownIP";
            }

            if (exceptionFeature?.Error != null)
            {
                var origQuery = HttpContext.Items["OriginalQueryString"] as string;
                if (isApi)
                {
                    Console.WriteLine($"****** Site: TM | SessionId: {sessionId} | ClientIP: {clientIp} | Unhandled exception {exceptionFeature?.Error.Message} on {req.Method} {exceptionFeature?.Path} {origQuery ?? ""}. Payload: {rawBody ?? ""}");
                }
                else
                {
                    Console.WriteLine($"****** Site: TM | SessionId: {sessionId} | ClientIP: {clientIp} | Unhandled exception {exceptionFeature?.Error.Message} on {req.Method} {exceptionFeature?.Path} {origQuery ?? ""}. (no payload logged)");
                }
                ViewBag.ErrorType = "500 error";
                ViewBag.ErrorMessage = exceptionFeature?.Error.Message;
            }
            else
            {
                var code = statusCode ?? HttpContext.Response.StatusCode;
                var statusFeat = HttpContext.Features.Get<IStatusCodeReExecuteFeature>();
                var origPath = statusFeat?.OriginalPath;
                var origQuery = statusFeat?.OriginalQueryString;
                if (isApi)
                {
                    Console.WriteLine($"****** Site: TM | SessionId: {sessionId} | ClientIP: {clientIp} | Request {exceptionFeature?.Error.Message} returned status code {code} on {req.Method} {origPath ?? ""} {origQuery ?? ""}. Payload: {rawBody ?? ""}");
                }
                else
                {
                    Console.WriteLine($"****** Site: TM | SessionId: {sessionId} | ClientIP: {clientIp} | Request {exceptionFeature?.Error.Message} returned status code {code} on {req.Method} {origPath ?? ""} {origQuery ?? ""}.");
                }

                ViewBag.ErrorType = $"{code} error";
                ViewBag.ErrorMessage = code == 404 ? "Page not found." : "";
            }

            return View("Error");
        }
    }
}

