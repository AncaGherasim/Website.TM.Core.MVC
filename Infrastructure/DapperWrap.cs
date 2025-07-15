using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.Extensions.Options;
using Dapper;
using System.Data.SqlClient;
using System.Collections;
using MySql.Data.MySqlClient;
using Amazon.SimpleSystemsManagement.Model;
using Amazon.SimpleSystemsManagement;
using System.Text.Json.Nodes;
using Npgsql;
using Microsoft.Extensions.Hosting;
using System.Data;

namespace MVC_TM.Infrastructure
{
    public class DapperWrap
    {
        private readonly AppSettings _appSettings;
        private readonly AWSParameterStoreService _awsParameterStoreService;
        private static IAmazonSimpleSystemsManagement _ssmClient;

        public DapperWrap(IOptions<AppSettings> appSettings, AWSParameterStoreService awsParameterStoreService, IAmazonSimpleSystemsManagement ssmClient)
        {
            _appSettings = appSettings.Value;
            _awsParameterStoreService = awsParameterStoreService;
            _ssmClient = ssmClient;
        }

        public async Task<IEnumerable<T>> GetRecords<T>(string sql, object parameters = null, bool IssqlVisitsConnStr = false)
        {
            IEnumerable<T> records = default(IEnumerable<T>);
            string connectionString = _awsParameterStoreService.SqlConnectionString;
            if (string.IsNullOrWhiteSpace(connectionString)) {
                var response = GetAWSParameterStoreValues("/WEB/Tournet/SqlConn", 5);
                var parameterStore = JsonObject.Parse(response.Result);
                var host = parameterStore["Host"];
                var database = parameterStore["Database"];
                var user = parameterStore["Username"];
                var password = parameterStore["Password"];
                var maxPool = parameterStore["MaxPool"];
                _awsParameterStoreService.SqlConnectionString = $"SERVER={host};DATABASE={database};UID={user};PWD={password};Max Pool Size={maxPool};TrustServerCertificate=True";
                connectionString = _awsParameterStoreService.SqlConnectionString;
            }
            using (SqlConnection connection = new SqlConnection(connectionString))
            {
                //connection.StatisticsEnabled = true; ---use Serilog 

                Int32 NoTimes = 1;
                Int32 ConnectionTested = 0;
                while (ConnectionTested == 0)
                {
                    try
                    {
                        await connection.OpenAsync(); //not mandatory, QueryAsync opens connection if it is closed
                    }
                    catch
                    {
                    }
                    finally
                    {
                        if (connection.State != System.Data.ConnectionState.Open)
                        {
                            if (NoTimes < 5)
                            {
                                NoTimes++;
                            }
                            else
                            {
                                ConnectionTested = 1;
                            }
                        }
                        else
                        {
                            ConnectionTested = 1;
                        }
                    }
                }


                Int32 CounterOfDeadLockTries = 0;
                bool TryToFill = true;
                Int32 NoOfLoops = 0;

                while (TryToFill)
                {
                    NoOfLoops++;
                    if (NoOfLoops > 5) //protect against endless loop
                    {
                        break;
                    }

                    try
                    {
                        records = await connection.QueryAsync<T>(sql, parameters);
                        TryToFill = false;
                    }
                    catch (SqlException sqlException)
                    {
                        if (sqlException.Number == 1205 || sqlException.Number == 1204 || sqlException.Number == 1222)
                        {
                            CounterOfDeadLockTries = CounterOfDeadLockTries + 1;
                            if (CounterOfDeadLockTries < 3)
                            {
                                TryToFill = true;
                            }
                            else
                            {
                                Console.WriteLine("TM-Error-SqlLock-GetRecordsAsync01: " + typeof(T).Name + " SqlExceptionNo: " + sqlException.Number + " Message: " + sqlException.Message);
                                if (sqlException.InnerException != null)
                                {
                                    Console.WriteLine(sqlException.InnerException.Message);
                                }
                                TryToFill = false;
                                throw AddAdditionalInfoToException(sqlException, "Error: GetRecords: " + typeof(T).Name, sql, parameters);
                            }
                        }
                        else
                        {
                            Console.WriteLine("TM-Error-SqlLock-GetRecordsAsync02: " + typeof(T).Name + " Message: " + sqlException.Message);
                            if (sqlException.InnerException != null)
                            {
                                Console.WriteLine(sqlException.InnerException.Message);
                            }
                            TryToFill = false;
                            throw AddAdditionalInfoToException(sqlException, "Error: GetRecords: " + typeof(T).Name, sql, parameters);
                        }
                    }
                    catch (Exception originalException)
                    {
                        Console.WriteLine("TM-Error-Sql-Dapper01: " + originalException.Message);
                        if (originalException.InnerException != null)
                        {
                            Console.WriteLine(originalException.InnerException.Message);
                        }
                        TryToFill = false;
                        throw AddAdditionalInfoToException(originalException, "Error: GetRecords: " + typeof(T).Name, sql, parameters);
                    }

                }

                //var stats = connection.RetrieveStatistics();
                //LogInfo("GetRecords: " + typeof(T).Name, stats, sql, parameters);
            }

            return records;
        }

        public async Task<IEnumerable<T>> MySqlGetRecordsAsync<T>(string sql, object parameters = null, bool IssqlVisitsConnStr = false)
        {
            IEnumerable<T> records = default(IEnumerable<T>);
            //string sqlConns = _appSettings.ConnectionStrings.ProAurora;
            string connectionString = _awsParameterStoreService.MySqlConnectionString;
            if (string.IsNullOrWhiteSpace(connectionString))
            {
                var response = GetAWSParameterStoreValues("/WEB/Tournet/AuroraConn", 5);
                var parameterStore = JsonObject.Parse(response.Result);
                var host = parameterStore["Host"];
                var database = parameterStore["Database"];
                var user = parameterStore["Username"];
                var password = parameterStore["Password"];
                var maxPool = parameterStore["MaxPool"];
                _awsParameterStoreService.MySqlConnectionString = $"SERVER={host};DATABASE={database};UID={user};PWD={password};Max Pool Size={maxPool};Allow User Variables=True";
                connectionString = _awsParameterStoreService.MySqlConnectionString;
            }
            using (MySqlConnection dbMySqlConn = new MySqlConnection(connectionString))
            {
                Int32 NoTimes = 1;
                Int32 ConnectionTested = 0;
                while (ConnectionTested == 0)
                {
                    try
                    {
                        await dbMySqlConn.OpenAsync();
                    }
                    catch
                    {
                    }
                    finally
                    {
                        if (dbMySqlConn.State != System.Data.ConnectionState.Open)
                        {
                            if (NoTimes < 5)
                            {
                                NoTimes++;
                            }
                            else
                            {
                                ConnectionTested = 1;
                            }
                        }
                        else
                        {
                            ConnectionTested = 1;
                        }
                    }
                }


                Int32 CounterOfDeadLockTries = 0;
                bool TryToFill = true;
                Int32 NoOfLoops = 0;
                while (TryToFill)
                {
                    NoOfLoops++;
                    if (NoOfLoops > 5) //protect against endless loop
                    {
                        break;
                    }
                    try
                    {
                        records = await dbMySqlConn.QueryAsync<T>(sql, parameters);
                        TryToFill = false;
                    }
                    catch (MySqlException sqlException)
                    {
                        if (sqlException.Number == 1205 || sqlException.Number == 1204 || sqlException.Number == 1222)
                        {
                            CounterOfDeadLockTries = CounterOfDeadLockTries + 1;
                            if (CounterOfDeadLockTries < 3)
                            {
                                TryToFill = true;
                            }
                            else
                            {
                                TryToFill = false;
                                Console.WriteLine("TM-Error-MySqlLock-GetRecordsAsync01: " + typeof(T).Name + " MySqlExceptionNo: " + sqlException.Number + " Message: " + sqlException.Message);
                                if (sqlException.InnerException != null)
                                {
                                    Console.WriteLine(sqlException.InnerException.Message);
                                }
                                throw AddAdditionalInfoToException(sqlException, "Error: GetRecords: " + typeof(T).Name, sql, parameters);
                            }
                        }
                        else
                        {
                            TryToFill = false;
                            Console.WriteLine("TM-Error-MySqlLock-GetRecordsAsync02: " + typeof(T).Name + " Message: " + sqlException.Message);
                            if (sqlException.InnerException != null)
                            {
                                Console.WriteLine(sqlException.InnerException.Message);
                            }
                            throw AddAdditionalInfoToException(sqlException, "Error: GetRecords: " + typeof(T).Name, sql, parameters);
                        }
                    }
                    catch (Exception originalException)
                    {
                        Console.WriteLine("TM-Error-MySql-Dapper01: " + originalException.Message);
                        if (originalException.InnerException != null)
                        {
                            Console.WriteLine(originalException.InnerException.Message);
                        }
                        TryToFill = false;
                        throw AddAdditionalInfoToException(originalException, "Error: GetRecords: " + typeof(T).Name, sql, parameters);

                    }
                }
            }

            return records;
        }

        public IEnumerable<T> MySqlGetRecords<T>(string sql, object parameters = null, bool IssqlVisitsConnStr = false)
        {

            IEnumerable<T> records = default(IEnumerable<T>);
            List<T> objectList = new List<T>();
            //System.Reflection.PropertyInfo pis = GetType(T).GetProperties(System.Reflection.BindingFlags.Instance);
            string connectionString = _awsParameterStoreService.MySqlConnectionString;
            if (string.IsNullOrWhiteSpace(connectionString))
            {
                var response = GetAWSParameterStoreValues("/WEB/Tournet/AuroraConn", 5);
                var parameterStore = JsonObject.Parse(response.Result);
                var host = parameterStore["Host"];
                var database = parameterStore["Database"];
                var user = parameterStore["Username"];
                var password = parameterStore["Password"];
                var maxPool = parameterStore["MaxPool"];
                _awsParameterStoreService.MySqlConnectionString = $"SERVER={host};DATABASE={database};UID={user};PWD={password};Max Pool Size={maxPool};Allow User Variables=True";
                connectionString = _awsParameterStoreService.MySqlConnectionString;
            }
            using (MySqlConnection dbMySqlConn = new MySqlConnection(connectionString))
            {
                Int32 NoTimes = 1;
                Int32 ConnectionTested = 0;
                while (ConnectionTested == 0)
                {
                    try
                    {
                        dbMySqlConn.Open();
                    }
                    catch
                    {
                    }
                    finally
                    {
                        if (dbMySqlConn.State != System.Data.ConnectionState.Open)
                        {
                            if (NoTimes < 5)
                            {
                                NoTimes++;
                            }
                            else
                            {
                                ConnectionTested = 1;
                            }
                        }
                        else
                        {
                            ConnectionTested = 1;
                        }
                    }
                }

                Int32 CounterOfDeadLockTries = 0;
                bool TryToFill = true;
                Int32 NoOfLoops = 0;
                while (TryToFill)
                {
                    NoOfLoops++;
                    if (NoOfLoops > 5) //protect against endless loop
                    {
                        break;
                    }
                    try
                    {
                        records = dbMySqlConn.Query<T>(sql, parameters);
                        TryToFill = false;
                    }
                    catch (MySqlException sqlException)
                    {
                        if (sqlException.Number == 1205 || sqlException.Number == 1204 || sqlException.Number == 1222)
                        {
                            CounterOfDeadLockTries = CounterOfDeadLockTries + 1;
                            if (CounterOfDeadLockTries < 3)
                            {
                                TryToFill = true;
                            }
                            else
                            {
                                TryToFill = false;
                                Console.WriteLine("TM-Error-MySqlLock-GetRecordsSync01: " + typeof(T).Name + " MySqlExceptionNo: " + sqlException.Number + " Message: " + sqlException.Message);
                                if (sqlException.InnerException != null)
                                {
                                    Console.WriteLine(sqlException.InnerException.Message);
                                }
                                throw AddAdditionalInfoToException(sqlException, "Error: GetRecords: " + typeof(T).Name, sql, parameters);
                            }
                        }
                        else
                        {
                            TryToFill = false;
                            Console.WriteLine("TM-Error-MySqlLock-GetRecordsSync02: " + typeof(T).Name + " Message: " + sqlException.Message);
                            if (sqlException.InnerException != null)
                            {
                                Console.WriteLine(sqlException.InnerException.Message);
                            }
                            throw AddAdditionalInfoToException(sqlException, "Error: GetRecords: " + typeof(T).Name, sql, parameters);
                        }
                    }
                    catch (Exception originalException)
                    {
                        Console.WriteLine("TM-Error-MySql-Dapper02: " + originalException.Message);
                        if (originalException.InnerException != null)
                        {
                            Console.WriteLine(originalException.InnerException.Message);
                        }
                        TryToFill = false;
                        throw AddAdditionalInfoToException(originalException, "Error: GetRecords: " + typeof(T).Name, sql, parameters);
                    }
                }
            }

            return records;
        }

        public async Task<T> GetRecord<T>(string sql, object parameters = null)
        {
            T record = default(T);

            using (SqlConnection connection = new SqlConnection(_awsParameterStoreService.SqlConnectionString))
            {
                connection.StatisticsEnabled = true;
                await connection.OpenAsync();

                try
                {
                    record = await connection.QueryFirstOrDefaultAsync<T>(sql, parameters);
                }
                catch (Exception originalException)
                {
                    throw AddAdditionalInfoToException(originalException, "Error: GetRecord: " + typeof(T).Name, sql, parameters);
                }

                var stats = connection.RetrieveStatistics();
                //LogInfo("GetRecord: " + typeof(T).Name, stats, sql, parameters);
            }

            return record;
        }

        public async Task<IEnumerable<T>> pgSQLGetRecordsAsync<T>(string sql, int maxRetryCount = 4, object command_params = null)
        {
            int retryCount = 0;
            IEnumerable<T> records = default(IEnumerable<T>);
            string connectionString = _awsParameterStoreService.PostgresConnectionString;
            if (string.IsNullOrWhiteSpace(connectionString))
            {
                var response = GetAWSParameterStoreValues("/WEB/Tournet/PostgresConn", 5);
                var parameterStore = JsonObject.Parse(response.Result);
                var host = parameterStore["Host"];
                var hostRo = parameterStore["HostRO"];
                var database = parameterStore["Database"];
                var user = parameterStore["Username"];
                var password = parameterStore["Password"];
                var maxPool = parameterStore["MaxPool"];
                _awsParameterStoreService.PostgresConnectionString = $"SERVER={hostRo};DATABASE={database};Username={user};Password={password}";
                connectionString = _awsParameterStoreService.PostgresConnectionString;
            }
            // Retry reading from the database
            while (retryCount <= maxRetryCount)
            {
                try
                {
                    using (var connection = new NpgsqlConnection(connectionString))
                    {
                        // Open connection
                        await connection.OpenAsync();

                        // Execute the command and retrieve the result set
                        records = await connection.QueryAsync<T>(sql, command_params);

                        return records;
                    }
                }
                catch (SqlException sqlException) when (sqlException.Number == 1205 && retryCount < maxRetryCount)
                {
                    // Error code 1205 indicates a deadlock
                    retryCount++;
                    if (retryCount == maxRetryCount)
                    {
                        Console.WriteLine("TM-Error-PostgreSQLock-pgSQLGetRecordsAsync: " + "SqlExceptionNo: " + sqlException.Number + " Message: " + sqlException.Message);
                        if (sqlException.InnerException != null)
                        {
                            Console.WriteLine(sqlException.InnerException.Message);
                        }
                    }
                    await Task.Delay(100);
                }
                catch (SqlException sqlException) when (retryCount < maxRetryCount)
                {
                    // Retry for other SQL connection errors
                    retryCount++;
                    Console.WriteLine("TM-Error-PostgreSql-pgSQLGetRecordsAsync: " + "Message: " + sqlException.Message);
                    if (sqlException.InnerException != null)
                    {
                        Console.WriteLine(sqlException.InnerException.Message);
                    }
                    await Task.Delay(100);
                }
                catch (Exception ex)
                {
                    // Handle other exceptions
                    // Log or handle the exception appropriately
                    retryCount++;
                    Console.WriteLine("TM-Error-pgSQLGetRecordsAsync: " + ex.Message);
                    if (ex.InnerException != null)
                    {
                        Console.WriteLine(ex.InnerException.Message);
                    }
                }
            }
            return records;
        }

        private Exception AddAdditionalInfoToException(Exception originalException, string message, string sql, object parameters = null)
        {
            var additionalInfoException = new Exception(message, originalException);
            additionalInfoException.Data.Add("SQL", sql);
            //var props = parameters.GetType().GetProperties();
            //foreach (var prop in props)
            //{
            //    additionalInfoException.Data.Add(prop.Name, prop.GetValue(parameters));
            //}

            return additionalInfoException;
        }

        //private void LogInfo(string logPrefix, IDictionary stats, string sql, object parameters = null)
        //{
        //    long elapsedMilliseconds = (long)stats["ConnectionTime"];

        //    Serilog.Log.ForContext("SQL", sql)
        //        .ForContext("Parameters", parameters)
        //        .ForContext("ExecutionTime", stats["ExecutionTime"])
        //        .ForContext("NetworkServerTime", stats["NetworkServerTime"])
        //        .ForContext("BytesSent", stats["BytesSent"])
        //        .ForContext("BytesReceived", stats["BytesReceived"])
        //        .ForContext("SelectRows", stats["SelectRows"])
        //        .Information("{logPrefix} in {ElaspedTime:0.0000} ms", logPrefix, elapsedMilliseconds);
        //}

        public async Task<IEnumerable<dynamic>> GetMultipleRecords(string sql, int maxRetryCount = 4, object command_params = null, params Type[] types)
        {
            int retryCount = 0;
            var resultSets = new List<IEnumerable<object>>();
            string connectionString = _awsParameterStoreService.SqlConnectionString;  // "SERVER=10.145.235.250;DATABASE=Tournet;UID=sqldata;PWD=Century2018;";
            if (string.IsNullOrWhiteSpace(connectionString))
            {
                var response = GetAWSParameterStoreValues("/WEB/Tournet/SqlConn", 5);
                var parameterStore = JsonObject.Parse(response.Result);
                var host = parameterStore["Host"];
                var database = parameterStore["Database"];
                var user = parameterStore["Username"];
                var password = parameterStore["Password"];
                var maxPool = parameterStore["MaxPool"];
                _awsParameterStoreService.SqlConnectionString = $"SERVER={host};DATABASE={database};UID={user};PWD={password};Max Pool Size={maxPool};TrustServerCertificate=True";
                connectionString = _awsParameterStoreService.SqlConnectionString;
            }
            // Retry reading from the database
            while (retryCount <= maxRetryCount)
            {
                try
                {
                    using (SqlConnection connection = new SqlConnection(connectionString))
                    {
                        // Set command timeout
                        //connection.OpenAsync();
                        var command = connection.CreateCommand();
                        command.CommandText = sql;
                        command.CommandType = CommandType.Text; // Changed to CommandType.Text for SQL query
                        command.CommandTimeout = 5;

                        // Execute the command and retrieve the result set
                        var reader = await connection.QueryMultipleAsync(sql, command_params);


                        // Read each result set and map to the specified types
                        foreach (var type in types)
                        {
                            var resultSet = reader.Read(type);
                            resultSets.Add(resultSet);
                        }

                        return resultSets;
                    }
                }
                catch (SqlException sqlException) when (sqlException.Number == 1205 && retryCount < maxRetryCount)
                {
                    // Error code 1205 indicates a deadlock
                    retryCount++;
                    if (retryCount == maxRetryCount)
                    {
                        Console.WriteLine("TM-Error-SqlLock-GetMultipleRecordsAsync: " + "SqlExceptionNo: " + sqlException.Number + " Message: " + sqlException.Message);
                        if (sqlException.InnerException != null)
                        {
                            Console.WriteLine(sqlException.InnerException.Message);
                        }
                    }
                    await Task.Delay(100);
                }
                catch (SqlException sqlException) when (retryCount < maxRetryCount)
                {
                    // Retry for other SQL connection errors
                    retryCount++;
                    Console.WriteLine("TM-Error-Sql-GetMultipleRecordsAsync: " + "Message: " + sqlException.Message);
                    if (sqlException.InnerException != null)
                    {
                        Console.WriteLine(sqlException.InnerException.Message);
                    }
                    await Task.Delay(100);
                }
                catch (Exception ex)
                {
                    // Handle other exceptions
                    // Log or handle the exception appropriately
                    //throw; // Rethrow the exception
                    retryCount++;
                    Console.WriteLine("TM-Error-Sql-GetMultipleRecordsAsync: " + ex.Message);
                    if (ex.InnerException != null)
                    {
                        Console.WriteLine(ex.InnerException.Message);
                    }
                }
            }
            return resultSets;
        }

        private static async Task<string> GetAWSParameterStoreValues(string parameterName, int maxRetries)
        {
            int retryCount = 0;
            TimeSpan delay = TimeSpan.FromMilliseconds(200); // Wait for 2 seconds between retries

            while (retryCount < maxRetries)
            {
                try
                {
                    // Attempt to retrieve the parameter
                    var request = new GetParameterRequest
                    {
                        Name = parameterName,
                        WithDecryption = true 
                    };

                    var response = await _ssmClient.GetParameterAsync(request);
                    Console.WriteLine($"****** TM - Succeeded in retrieving the parameter {parameterName} after {retryCount + 1} attempts.");
                    return response.Parameter.Value;
                }
                catch (Exception ex)
                {
                    retryCount++;

                    if (retryCount == maxRetries)
                    {
                        // Log or handle the error if max retries are reached
                        Console.WriteLine($"****** TM - Failed to retrieve the parameter '{parameterName}' after {maxRetries} attempts.");
                        Console.WriteLine(ex.Message);
                        Console.WriteLine(ex.StackTrace);
                        throw new Exception($"Failed to retrieve the parameter '{parameterName}' after {maxRetries} attempts.", ex);
                    }

                    // Optionally log the retry attempt here

                    // Wait before retrying
                    await Task.Delay(delay);
                }
            }

            // If retries fail, return null or handle it appropriately
            return null;
        }
    }
}
