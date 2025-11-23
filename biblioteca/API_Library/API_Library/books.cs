namespace API_Library
{
  public class books
  {
    public string Id { get; set; }
    public string tittle { get; set; }
    public string author { get; set; }
    public string editorial { get; set; }
    public int pages { get; set; }

    public string genero { get; set; }

    public string? cover { get; set; }
    public int user_id { get; set; }

    public int? current_page { get; set; }  // ⬅️ OPCIONAL


  }
}
