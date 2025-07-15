using Amazon.SimpleSystemsManagement;
using Amazon.SimpleSystemsManagement.Model;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.HttpOverrides;
using Microsoft.AspNetCore.Routing;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using MVC_TM.Infrastructure;
using System;
using System.Collections.Generic;
using System.Drawing;
using System.Text.Json.Nodes;
using System.Text.RegularExpressions;
using static System.Net.WebRequestMethods;
using System.IO;
using System.Text;

namespace MVC_TM
{
    public class Startup
    {
        public IConfiguration Configuration { get; }
        public IWebHostEnvironment Env { get; }
        public static IConfiguration StaticConfig { get; private set; }
        public AWSParameterStoreService AWSParameterStoreService { get; private set; }
        public Startup(IConfiguration configuration, IWebHostEnvironment env)
        {
            this.AWSParameterStoreService = new AWSParameterStoreService();
            Configuration = configuration;
            StaticConfig = configuration;
            Env = env;
            var builder = new ConfigurationBuilder()
                .SetBasePath(env.ContentRootPath)
                .AddJsonFile("appsettings.json", optional: false, reloadOnChange: true)
                .AddJsonFile($"appsettings.{env.EnvironmentName}.json", optional: true)
                .AddEnvironmentVariables();
            Configuration = builder.Build();
            Env = env;
        }

        // This method gets called by the runtime. Use this method to add services to the container.
        public void ConfigureServices(IServiceCollection services)
        {
            services.AddControllersWithViews();

            services.AddSingleton<AWSParameterStoreService>();

            services.AddAWSService<IAmazonSimpleSystemsManagement>();

            services.Configure<ForwardedHeadersOptions>(options =>
            {
                options.ForwardedHeaders = ForwardedHeaders.XForwardedFor | ForwardedHeaders.XForwardedProto;
            });

            services.AddHttpContextAccessor();

            services.AddScoped<Infrastructure.DapperWrap>();

            services.AddSingleton<CachedDataService>();

            services.Configure<AppSettings>(Configuration);

            services.Configure<AWSParameterStoreService>(Configuration);

            services.AddSession(options =>
            {
                // Set a short timeout for easy testing.
                options.IdleTimeout = TimeSpan.FromSeconds(10);
                options.Cookie.HttpOnly = true;
                // Make the session cookie essential
                options.Cookie.IsEssential = true;
            });

            services.Configure<RouteOptions>(options => options.LowercaseUrls = true);

            services.AddMemoryCache();
        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IWebHostEnvironment env, DapperWrap dapperWrap, CachedDataService cachedDataService)
        {
            var ven = Environment.GetEnvironmentVariable("ContainerMode");

            app.UseForwardedHeaders();       

            //Check if we have existing sql connection string. Get connection string from AWS Parameter Store
            Console.WriteLine("Check if we have data from AWS parameter store");
            try
            {
                if (string.IsNullOrWhiteSpace(AWSParameterStoreService.SqlConnectionString) || string.IsNullOrWhiteSpace(AWSParameterStoreService.MySqlConnectionString) || string.IsNullOrWhiteSpace(AWSParameterStoreService.PostgresConnectionString))
                {
                    int retryCount = 0;
                    bool success = false;
                    while (retryCount < 5 && !success)
                    {
                        using (var scope = app.ApplicationServices.CreateScope())
                        {
                            var ssmClient = scope.ServiceProvider.GetRequiredService<IAmazonSimpleSystemsManagement>();
                            var parameterStoreService = scope.ServiceProvider.GetRequiredService<AWSParameterStoreService>();
                            // Access Parameter Store value
                            var parameterNames = new List<string> {
                                            "/WEB/Tournet/SqlConn",
                                            "/WEB/Tournet/AuroraConn",
                                            "/WEB/Tournet/PostgresConn"
                            };
                            var request = new GetParametersRequest
                            {
                                Names = parameterNames,
                                WithDecryption = true,
                            };

                            var response = ssmClient.GetParametersAsync(request);

                            if (response != null)
                            {
                                foreach (var parameter in response.Result.Parameters)
                                {
                                    if (parameter.Name == "/WEB/Tournet/AuroraConn")
                                    {
                                        dynamic? parameterStore = JsonObject.Parse(parameter.Value);
                                        var host = parameterStore["Host"];
                                        var database = parameterStore["Database"];
                                        var user = parameterStore["Username"];
                                        var password = parameterStore["Password"];
                                        var maxPool = parameterStore["MaxPool"];
                                        parameterStoreService.MySqlConnectionString = $"SERVER={host};DATABASE={database};UID={user};PWD={password};Max Pool Size={maxPool};Allow User Variables=True";

                                    }
                                    if (parameter.Name == "/WEB/Tournet/SqlConn")
                                    {
                                        dynamic? parameterStore = JsonObject.Parse(parameter.Value);
                                        var host = parameterStore["Host"];
                                        var database = parameterStore["Database"];
                                        var user = parameterStore["Username"];
                                        var password = parameterStore["Password"];
                                        var maxPool = parameterStore["MaxPool"];
                                        parameterStoreService.SqlConnectionString = $"SERVER={host};DATABASE={database};UID={user};PWD={password};Max Pool Size={maxPool};TrustServerCertificate=True";
                                    }
                                    if (parameter.Name == "/WEB/Tournet/PostgresConn")
                                    {
                                        dynamic? parameterStore = JsonObject.Parse(parameter.Value);
                                        var host = parameterStore["Host"];
                                        var hostRo = parameterStore["HostRO"];
                                        var database = parameterStore["Database"];
                                        var user = parameterStore["Username"];
                                        var password = parameterStore["Password"];
                                        parameterStoreService.PostgresConnectionString = $"SERVER={hostRo};DATABASE={database};Username={user};Password={password}";
                                    }
                                }
                                var logResponseInfo = $"****** Site: TM | Secrets Read AWS Parameter Store | SQLParameterStore: {AWSParameterStoreService.SqlConnectionString} | MySQLParameterStore: {AWSParameterStoreService.MySqlConnectionString} | PostgresSQLParameterStore: {AWSParameterStoreService.PostgresConnectionString}";
                                Console.WriteLine(logResponseInfo);
                                success = true;
                            }
                            else
                            {
                                throw new Exception("Failed to retreive AWS parameter store values. Response is null.");
                            }
                            retryCount++;
                        }
                        if (retryCount == 5)
                        {
                            throw new Exception("Exceeded number of tries to retrieve the parameters store values");
                        }
                    }
                }
            }
            catch (Exception ex)
            {
                var logError = $"Error reading AWS Parameter Store values. | {ex.Message}";
                Console.WriteLine(logError);
                throw new Exception("Could not retrieve AWS Parameter Store values");
            }

            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
            }
            else
            {
                app.UseExceptionHandler("/Error/HandleError");
                app.UseStatusCodePagesWithReExecute("/Error/HandleError", "?statusCode={0}");  //for 404 error
                app.UseHsts();
            }

            app.Use(async (context, next) =>
            {
                var logResponseInfo = $"****** Site: TM | HttpStatusCode: {context.Response.StatusCode} | Request Full Path: {context.Request.Scheme}://{context.Request.Host}{context.Request.Path} | Request Referer: {context.Request.GetTypedHeaders().Referer} | Request QueryString: {context.Request.QueryString}";

                Regex reg = new Regex(@"^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}$");
                Boolean secureLH = context.Request.Host.Host.ToString().Contains("localhost");
                Boolean secureIP = reg.IsMatch(context.Request.Host.Host.ToString());
                Boolean secureURL = false;
                var urlRaw = context.Request.Path.Value;
                var fullUrl = "://" + context.Request.Host;
                string queryString = context.Request.QueryString.HasValue ? context.Request.QueryString.Value : string.Empty;
                Regex inj = new Regex(@"XOR\(|if\(|now\(|sysdate\(|sleep\(|\)XOR");
                Boolean injectSTRING = inj.IsMatch(urlRaw);
                if (injectSTRING)
                {
                    var rejectURL = "https://www.tripmasters.com/error";
                    context.Response.Redirect(rejectURL, true);
                    await context.Response.WriteAsync(injectSTRING + " | " + rejectURL);
                }

                if (secureLH == false && secureIP == false) { secureURL = true; };
                if (secureURL == true)
                {
                    if (Regex.IsMatch(fullUrl, "://tripmasters.com", RegexOptions.IgnoreCase) == true) // Regex.IsMatch(context.Request.Host.ToString(), "www.", RegexOptions.IgnoreCase) == false)
                    {
                        var wwwNewPath = "https://www." + context.Request.Host + urlRaw + queryString;
                        context.Response.Redirect(wwwNewPath, true);
                    }
                    else
                    {
                        if (context.Request.IsHttps || context.Request.Headers["X-Forwarded-Proto"] == Uri.UriSchemeHttps)
                        {
                            await next();
                            Console.WriteLine(logResponseInfo);
                        }
                        else
                        {
                            var https = "https://" + context.Request.Host + urlRaw + queryString;
                            context.Response.Redirect(https, true);
                        }
                    }
                }
                else
                {
                    await next();
                    Console.WriteLine(logResponseInfo);
                }
            });

            app.UseHttpsRedirection();

            app.UseStaticFiles();

            Utilities.Configure(app.ApplicationServices.GetRequiredService<IHttpContextAccessor>(), app.ApplicationServices.GetRequiredService<IOptions<AppSettings>>(), app.ApplicationServices.GetRequiredService<AWSParameterStoreService>(), dapperWrap);

            app.UseWhen(
                ctx =>
                {
                    var path = ctx.Request.Path.Value;
                    if (string.IsNullOrEmpty(path))
                        return false;

                    return path.AsSpan()
                               .IndexOf("/Api/", StringComparison.OrdinalIgnoreCase) >= 0;
                },
                branch =>
                {
                    branch.Use(async (ctx2, next2) =>
                    {
                        ctx2.Request.EnableBuffering();

                        string raw;
                        using (var reader = new StreamReader(
                                   ctx2.Request.Body,
                                   encoding: Encoding.UTF8,
                                   detectEncodingFromByteOrderMarks: false,
                                   bufferSize: 1024,
                                   leaveOpen: true))
                        {
                            raw = await reader.ReadToEndAsync();
                            ctx2.Request.Body.Position = 0;
                        }
                        ctx2.Items["RawRequestBody"] = raw;

                        await next2();
                    });
                }
            );
            app.UseRouting();

            app.UseSession();

            app.UseEndpoints(endpoints =>
            {
                endpoints.MapControllerRoute(
                    name: "default",
                    pattern: "{controller=Home}/{action=Index}/{id?}");
                endpoints.MapControllerRoute(
                     name: "Aspx1",
                     pattern: "{urlpath1}.aspx",
                     defaults: new { controler = "LegacyRedirection", action = "FancyUrlRedirect1" });
            });
        }
    }
}
