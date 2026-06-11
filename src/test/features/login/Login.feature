Feature: Login - Book Store Application
  Verifica el inicio de sesión exitoso y la validación de credenciales erróneas
  en la plataforma https://demoqa.com/books.

  @login @smoke @positive
  Scenario: Login exitoso con credenciales válidas
    Given the user is on the login page
    When the user logs in with credentials "valid"
    Then the user is redirected to the profile page
    And the session username is visible in the profile

  @login @negative
  Scenario: Login fallido con credenciales inválidas
    Given the user is on the login page
    When the user logs in with credentials "invalid"
    Then an invalid credentials error message is displayed
    And the user remains on the login page
