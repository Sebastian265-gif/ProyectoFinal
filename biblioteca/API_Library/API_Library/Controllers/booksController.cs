using Dapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Data.SqlClient;
using System.Security.Claims;

namespace API_Library.Controllers
{
  [Route("api/[controller]")]
  [ApiController]
  [Authorize]   // <--- Protege todo el controlador
  public class BooksController : ControllerBase
  {
    private readonly string _connectionString =
    "Server=LAPTOP-69K2QF6U\\MSSQLSERVER02;Database=DbLibrary;User Id=sa;Password=12345678;TrustServerCertificate=true";

    // Obtener userId desde el JWT
    private int GetUserId()
    {
      var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

      return int.Parse(userId);
    }

    // Validación si ya existe un libro con ese ID y pertenece al usuario
    private books SearchBookVal(string id, int userId)
    {
      using (var connection = new SqlConnection(_connectionString))
      {
        var sql = "SELECT * FROM books WHERE id = @Id AND user_id = @UserId";
        return connection.QuerySingleOrDefault<books>(sql, new { Id = id, UserId = userId });
      }
    }

    // CREAR LIBRO ASOCIADO AL USUARIO LOGUEADO
    [HttpPost("addBook")]
    public IActionResult AddBook([FromBody] books book)
    {
      if (book == null)
        return BadRequest("Invalid book data");

      int userId = GetUserId();

      using (var connection = new SqlConnection(_connectionString))
      {
        // Validar si el libro ya existe para ese usuario
        var exists = SearchBookVal(book.Id, userId);
        if (exists != null)
          return Conflict("Book already exists for this user!");

        var sql = "INSERT INTO books (id, tittle, author, editorial, pages, user_id) " +
                  "VALUES (@Id, @tittle, @author, @editorial, @pages, @UserId)";

        var rows = connection.Execute(sql, new
        {
          book.Id,
          book.tittle,
          book.author,
          book.editorial,
          book.pages,
          UserId = userId
        });

        return rows > 0
            ? Ok("Book registered successfully!")
            : StatusCode(500, "Error registering book");
      }
    }

    // LISTAR SOLO LIBROS DEL USUARIO LOGUEADO
    [HttpGet("listBooks")]
    public IActionResult ListBooks()
    {
      int userId = GetUserId();

      using (var connection = new SqlConnection(_connectionString))
      {
        var sql = "SELECT * FROM books WHERE user_id = @UserId";
        var list = connection.Query<books>(sql, new { UserId = userId }).ToList();

        if (!list.Any())
          return NotFound("No books found for this user.");

        return Ok(list);
      }
    }

    // LISTAR SOLO LOS IDs DEL USUARIO LOGUEADO
    [HttpGet("idBooks")]
    public IActionResult GetBooksIds()
    {
      int userId = GetUserId();

      using (var connection = new SqlConnection(_connectionString))
      {
        var sql = "SELECT id FROM books WHERE user_id = @UserId";
        var ids = connection.Query<string>(sql, new { UserId = userId }).ToList();

        if (ids == null || ids.Count == 0)
          return NotFound("No books found for this user");

        return Ok(ids);
      }
    }



    // BUSCAR LIBRO POR ID (solo si pertenece al usuario)
    [HttpGet("searchBook/{id}")]
    public IActionResult GetBookById(string id)
    {
      int userId = GetUserId();

      using (var connection = new SqlConnection(_connectionString))
      {
        var sql = "SELECT * FROM books WHERE id = @Id AND user_id = @UserId";
        var book = connection.QuerySingleOrDefault<books>(sql, new { Id = id, UserId = userId });

        if (book == null)
          return NotFound("Book not found or you don't own it.");

        return Ok(book);
      }
    }

    // EDITAR LIBRO SOLO SI EL USUARIO ES DUEÑO
    [HttpPut("updateBook/{id}")]
    public IActionResult UpdateBook(string id, [FromBody] books book)
    {
      if (book == null)
        return BadRequest("Invalid book data");

      int userId = GetUserId();

      using (var connection = new SqlConnection(_connectionString))
      {
        // Verificar si el libro pertenece al usuario
        var exists = SearchBookVal(id, userId);
        if (exists == null)
          return NotFound("Book not found or you don't own it.");

        var sql = @"UPDATE books SET 
                            tittle = @tittle, 
                            author = @author,
                            editorial = @editorial,
                            pages = @pages
                            WHERE id = @Id AND user_id = @UserId";

        var rows = connection.Execute(sql, new
        {
          Id = id,
          book.tittle,
          book.author,
          book.editorial,
          book.pages,
          UserId = userId
        });

        return rows > 0
          ? Ok(new { success = true, message = "Book updated!" })
          : StatusCode(500, new { success = false, message = "Error updating book" });
      }
    }

    // ELIMINAR LIBRO SOLO SI ES DEL USUARIO
    [HttpDelete("deleteBook/{id}")]
    public IActionResult DeleteBook(string id)
    {
      int userId = GetUserId();

      using (var connection = new SqlConnection(_connectionString))
      {
        var sql = "DELETE FROM books WHERE id = @Id AND user_id = @UserId";
        var rows = connection.Execute(sql, new { Id = id, UserId = userId });

        if (rows > 0)
          return Ok("Book deleted successfully");

        return NotFound("Book not found or you don't own it.");
      }
    }
  }
}
