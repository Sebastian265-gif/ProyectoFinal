using Dapper;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Data.SqlClient;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using System;
using System.Data;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using API_Library;

namespace API_Library.Controllers
{
  [Route("api/[controller]")]
  [ApiController]
  
  public class UsersController : ControllerBase
  {
    private readonly string _connectionString = "Server=LAPTOP-69K2QF6U\\MSSQLSERVER02;Database=DbLibrary;User Id=sa;Password=12345678;TrustServerCertificate=true";
    private readonly IConfiguration _config;

    public UsersController(IConfiguration config)
    {
      _config = config;
    }

    [HttpPost("login")]
    public IActionResult Login([FromBody] LoginRequest loginData)
    {
      if (loginData == null) return BadRequest("Invalid user data.");
      if (string.IsNullOrWhiteSpace(loginData.Username) || string.IsNullOrWhiteSpace(loginData.Password))
        return BadRequest(new { success = false, message = "Username and password are required." });

      using (var connection = new SqlConnection(_connectionString))
      {
        connection.Open();
        // Nota: en producción usa contraseñas hasheadas y compara hashes
        var sql = "SELECT * FROM Users WHERE Username = @Username AND Password = @Password";
        var result = connection.QuerySingleOrDefault<Users>(sql, new { loginData.Username, loginData.Password });

        if (result == null)
          return Unauthorized(new { success = false, Message = "Invalid credentials." });

        // Generar JWT
        var jwtConfig = _config.GetSection("Jwt");
        var key = jwtConfig.GetValue<string>("Key");
        var issuer = jwtConfig.GetValue<string>("Issuer");
        var audience = jwtConfig.GetValue<string>("Audience");
        var expires = jwtConfig.GetValue<int>("ExpireMinutes");

        var claims = new[]
        {
                    new Claim(ClaimTypes.Name, result.Username ?? string.Empty),
                    new Claim(ClaimTypes.NameIdentifier, result.Id.ToString()), // userId aquí
                };

        var securityKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(key));
        var credentials = new SigningCredentials(securityKey, SecurityAlgorithms.HmacSha256);

        var token = new JwtSecurityToken(
            issuer: issuer,
            audience: audience,
            claims: claims,
            expires: DateTime.UtcNow.AddMinutes(expires),
            signingCredentials: credentials
        );

        var tokenString = new JwtSecurityTokenHandler().WriteToken(token);

        return Ok(new
        {
          success = true,
          token = tokenString,
          username = result.Username,
          userId = result.Id
        });
      }
    }

    [HttpPost("register")]
    public IActionResult Register([FromBody] Users user)
    {
      if (user == null)
        return BadRequest("Invalid user data.");

      using (var connection = new SqlConnection(_connectionString))
      {
        connection.Open();
        // Revisa que no exista el username
        var exists = connection.QuerySingleOrDefault<int?>(
            "SELECT 1 FROM Users WHERE Username = @Username", new { user.Username });
        if (exists != null)
          return Conflict("Username already exists");

        // En producción: hashear password antes de guardar
        var sql = @"
            INSERT INTO Users (Username, Password, Nombre, Apellido, FechaNacimiento, Genero)
            VALUES (@Username, @Password, @Nombre, @Apellido, @FechaNacimiento, @Genero)
        ";
        var rows = connection.Execute(sql, new
        {
          user.Username,
          user.Password,
          user.Nombre,
          user.Apellido,
          FechaNacimiento = user.FechaNacimiento,
          user.Genero

        });

        return rows > 0
          ? Ok(new { message = "User registered successfully."})
          : StatusCode(500, "Error registering user.");
      }
    }
  }

  // Modelo auxiliar si no lo tienes
  
}
