using Dapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Data.SqlClient;

namespace API_Library.Controllers
{
  [Route("api/[controller]")]
  [ApiController]
  [Authorize] // Solo usuarios logueados pueden publicar
  public class OpinionsController : ControllerBase
  {
    private readonly string _connectionString =
        "Server=LAPTOP-69K2QF6U\\MSSQLSERVER02;Database=DbLibrary;User Id=sa;Password=12345678;TrustServerCertificate=true";

    // -----------------------------------------------------------
    // GET: api/Opinions (cualquiera puede ver opiniones)
    // -----------------------------------------------------------
    [HttpGet]
    [AllowAnonymous]
    public IActionResult GetAllOpinions()
    {
      using var connection = new SqlConnection(_connectionString);

      var sql = @"
        SELECT 
            Id AS id,
            UserName AS userName,
            Comment AS comment,
            Date AS date
        FROM Opinions
        ORDER BY Date DESC
    ";

      var list = connection.Query(sql).ToList();
      return Ok(list);
    }

    // -----------------------------------------------------------
    // POST: api/Opinions  (solo usuarios logueados)
    // -----------------------------------------------------------
    [HttpPost]
    public IActionResult AddOpinion([FromBody] OpinionDto opinion)
    {
      if (opinion == null || string.IsNullOrWhiteSpace(opinion.Comment))
        return BadRequest("Comentario inválido.");

      // Obtener UserName del JWT
      var userName =
          User.FindFirst("unique_name")?.Value ??
          User.FindFirst("name")?.Value ??
          User.FindFirst("UserName")?.Value ??
          User.FindFirst(System.Security.Claims.ClaimTypes.Name)?.Value;

      if (string.IsNullOrEmpty(userName))
        return Unauthorized("Usuario no identificado en el token.");

      using var connection = new SqlConnection(_connectionString);

      var sql = @"
                INSERT INTO Opinions (UserName, Comment, Date) 
                VALUES (@UserName, @Comment, @Date)
            ";

      var rows = connection.Execute(sql, new
      {
        UserName = userName,
        Comment = opinion.Comment,
        Date = DateTime.UtcNow // <-- SOLUCIONA EL ERROR
      });

      return rows > 0
          ? Ok(new { success = true, message = "Opinión agregada correctamente" })
          : StatusCode(500, "Error al agregar opinión");
    }

    
  }
}

