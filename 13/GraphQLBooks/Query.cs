using System.Collections.Generic;
using System.Linq;

public class Query
{
    private static List<Author> authors = new()
    {
        new Author { Id = 1, Name = "J.K. Rowling" },
        new Author { Id = 2, Name = "J.R.R. Tolkien" }
    };

    public static List<Book> books = new()
    {
        new Book { Id = 1, Title = "Harry Potter", ReleaseYear = 1997, AuthorId = 1 },
        new Book { Id = 2, Title = "The Hobbit", ReleaseYear = 1937, AuthorId = 2 }
    };

    public List<Book> GetBooks() => books;
    public Book GetBook(int id) => books.FirstOrDefault(b => b.Id == id);
    public List<Author> GetAuthors() => authors;
    public Author GetAuthor(int id) => authors.FirstOrDefault(a => a.Id == id);
}