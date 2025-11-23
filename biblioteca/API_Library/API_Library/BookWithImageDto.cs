using System.Text.Json.Serialization;

namespace API_Library
{
  public class BookWithImageDto
  {
    public string Id { get; set; }
    public string Tittle { get; set; }
    public string Author { get; set; }
    public string Genero { get; set; }
    public string Editorial { get; set; }
    public int Pages { get; set; }

    [JsonIgnore]
    public IFormFile? Cover { get; set; }  // Imagen del libro
  }
}
