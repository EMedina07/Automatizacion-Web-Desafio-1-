Feature: Book Search - Book Store Application
  Verifica que la plataforma permita la búsqueda de palabras clave existentes
  y la validación de palabras clave no existentes en https://demoqa.com/books.

  Background:
    Given the user is on the book store page

  @search @smoke @positive
  Scenario Outline: Búsqueda de palabra clave existente muestra resultados
    When the user searches for "<keyword>"
    Then at least one book is displayed in the results

    Examples:
      | keyword    |
      | Git        |
      | JavaScript |

  @search @negative
  Scenario: Búsqueda de palabra clave no existente no muestra resultados
    When the user searches for "Fundamentos del ISTQB"
    Then no books are found in the search results
