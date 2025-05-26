using System.Linq;

public class Mutation
{
    private static List<Book> books = Query.books;
    private static int nextId = 3;

    public Book CreateBook(int authorId, string title, int? releaseYear)
    {
        var book = new Book { Id = nextId++, AuthorId = authorId, Title = title, ReleaseYear = releaseYear };
        books.Add(book);
        return book;
    }

    public Book UpdateBook(int id, int? authorId, string title, int? releaseYear)
    {
        var book = books.FirstOrDefault(b => b.Id == id);
        if (book == null) return null;
        if (authorId.HasValue) book.AuthorId = authorId.Value;
        if (title != null) book.Title = title;
        if (releaseYear.HasValue) book.ReleaseYear = releaseYear.Value;
        return book;
    }

    public SuccessMessage DeleteBook(int id)
    {
        var book = books.FirstOrDefault(b => b.Id == id);
        if (book == null) return new SuccessMessage { Message = "Book not found" };
        books.Remove(book);
        return new SuccessMessage { Message = "Book deleted" };
    }
}

public class SuccessMessage
{
    public string Message { get; set; }
}