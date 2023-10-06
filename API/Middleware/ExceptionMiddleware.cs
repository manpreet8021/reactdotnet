using System.Net;
using System.Text.Json;
using System.Text.Json.Serialization;
using Application.Core;

namespace API.Middleware
{
    public class ExceptionMiddleware
    {
        IHostEnvironment _env;
        ILogger<ExceptionMiddleware> _logger;
        RequestDelegate _next;
        public ExceptionMiddleware(RequestDelegate next, ILogger<ExceptionMiddleware> logger, IHostEnvironment hostEnvironment) 
        {
            _next = next;
            _logger = logger;
            _env = hostEnvironment;
        }

        public async Task InvokeAsync(HttpContext httpContext) {
            try{
                await _next(httpContext);
            } catch (Exception ex) {
                _logger.LogError(ex, ex.Message);
                httpContext.Response.ContentType = "application/json";
                httpContext.Response.StatusCode = (int)HttpStatusCode.InternalServerError;

                var response = _env.IsDevelopment() ? new AppException((int)HttpStatusCode.InternalServerError, ex.Message, ex.StackTrace?.ToString()) : 
                new AppException((int)HttpStatusCode.InternalServerError, "Internal Server Error");

                var options = new JsonSerializerOptions{PropertyNamingPolicy = JsonNamingPolicy.CamelCase};

                var json = JsonSerializer.Serialize(response, options);

                await httpContext.Response.WriteAsync(json);
            }
        }
    }
}