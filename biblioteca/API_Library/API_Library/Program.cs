using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.Extensions.FileProviders;
using Microsoft.IdentityModel.Tokens;
using System.Security.Claims;
using System.Text;
using System.IO;

var builder = WebApplication.CreateBuilder(args);

// 🔹 Configuración JWT
var jwtSection = builder.Configuration.GetSection("Jwt");
var key = jwtSection.GetValue<string>("Key");
var issuer = jwtSection.GetValue<string>("Issuer");
var audience = jwtSection.GetValue<string>("Audience");

// 🔹 Servicios
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// 🔹 CORS para Angular y Swagger
builder.Services.AddCors(options =>
{
  options.AddPolicy("AllowAngular",
      policy => policy
          .AllowAnyOrigin()
          .AllowAnyHeader()
          .AllowAnyMethod());
});

// 🔹 Authentication - JWT Bearer
builder.Services.AddAuthentication(options =>
{
  options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
  options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
})
.AddJwtBearer(options =>
{
  options.RequireHttpsMetadata = false;
  options.SaveToken = true;
  options.TokenValidationParameters = new TokenValidationParameters
  {
    ValidateIssuer = true,
    ValidateAudience = true,
    ValidateIssuerSigningKey = true,
    ValidIssuer = issuer,
    ValidAudience = audience,
    IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(key)),
    NameClaimType = ClaimTypes.NameIdentifier
  };
});

var app = builder.Build();

// 🔹 Swagger
if (app.Environment.IsDevelopment())
{
  app.UseSwagger();
  app.UseSwaggerUI();
}

// 🔹 CORS
app.UseCors("AllowAngular");

// 🔹 HTTPS
app.UseHttpsRedirection();

// 🔹 Servir la carpeta "images" para portadas
var imagesPath = Path.Combine(Directory.GetCurrentDirectory(), "images");
if (!Directory.Exists(imagesPath))
{
  Directory.CreateDirectory(imagesPath);
}

app.UseStaticFiles(new StaticFileOptions
{
  FileProvider = new PhysicalFileProvider(imagesPath),
  RequestPath = "/images"  // URL pública que Angular puede usar
});

// 🔹 Authentication + Authorization
app.UseAuthentication();
app.UseAuthorization();

// 🔹 Controllers
app.MapControllers();

app.Run();
