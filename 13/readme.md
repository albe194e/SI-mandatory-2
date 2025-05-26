# GraphQL Example with .NET & Chocolatey

This guide demonstrates how to set up a minimal GraphQL server in .NET using [HotChocolate](https://chillicream.com/docs/hotchocolate/v13/) and Chocolatey for easy installation.  
You will be able to query the server using the built-in GraphQL explorer, Postman, or any frontend.

---

## Prerequisites

- Windows OS
- [Chocolatey](https://chocolatey.org/install) installed

---

## 1. Install .NET SDK with Chocolatey

Open **PowerShell as Administrator** and run:

```powershell
choco install dotnet-sdk -y
```

---

## 2. Create a New .NET Web Project

```powershell
dotnet new web -n GraphQLBooks
cd GraphQLBooks
```

---

## 3. Add HotChocolate GraphQL Package

```powershell
dotnet add package HotChocolate.AspNetCore
```

---

## 4. Define Your Schema in C#

Create a folder called `Models` and add two files: `Book.cs` and `Author.cs`.

**Models/Book.cs**
```csharp
public class Book
{
    public int Id { get; set; }
    public string Title { get; set; }
    public int? ReleaseYear { get; set; }
    public int AuthorId { get; set; }
    public Author Author { get; set; }
}
```

**Models/Author.cs**
```csharp
using System.Collections.Generic;

public class Author
{
    public int Id { get; set; }
    public string Name { get; set; }
    public List<Book> Books { get; set; }
}
```

---

## 5. Add Query and Mutation Types

**Query.cs**
```csharp
using System.Collections.Generic;
using System.Linq;

public class Query
{
    private static List<Author> authors = new()
    {
        new Author { Id = 1, Name = "J.K. Rowling" },
        new Author { Id = 2, Name = "J.R.R. Tolkien" }
    };

    private static List<Book> books = new()
    {
        new Book { Id = 1, Title = "Harry Potter", ReleaseYear = 1997, AuthorId = 1 },
        new Book { Id = 2, Title = "The Hobbit", ReleaseYear = 1937, AuthorId = 2 }
    };

    public List<Book> GetBooks() => books;
    public Book GetBook(int id) => books.FirstOrDefault(b => b.Id == id);
    public List<Author> GetAuthors() => authors;
    public Author GetAuthor(int id) => authors.FirstOrDefault(a => a.Id == id);
}
```

**Mutation.cs**
```csharp
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
```

---

## 6. Register GraphQL in `Program.cs`

Replace the contents of `Program.cs` with:

```csharp
using Microsoft.AspNetCore.Builder;
using Microsoft.Extensions.DependencyInjection;

var builder = WebApplication.CreateBuilder(args);

builder.Services
    .AddGraphQLServer()
    .AddQueryType<Query>()
    .AddMutationType<Mutation>();

var app = builder.Build();

app.MapGraphQL();

app.Run();
```

---

## 7. Run the Server

```powershell
dotnet run
```

By default, the GraphQL endpoint will be at [http://localhost:5000/graphql](http://localhost:5000/graphql).

---

## 8. Querying the Server

Open [http://localhost:5000/graphql](http://localhost:5000/graphql) in your browser for the built-in GraphQL explorer.

**Example Queries:**

```graphql
query {
  books {
    id
    title
    releaseYear
  }
}

mutation {
  createBook(authorId: 1, title: "New Book", releaseYear: 2024) {
    id
    title
  }
}
```


## References

- [HotChocolate Docs](https://chillicream.com/docs/hotchocolate/v13/)
- [GraphQL Official Site](https://graphql.org/)
- [Chocolatey](https://chocolatey.org/)

---