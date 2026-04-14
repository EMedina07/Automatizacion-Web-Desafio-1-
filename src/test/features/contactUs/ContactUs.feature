Feature: Formulario de contacto

  @contactUs
  Scenario Outline: Enviar formulario de contacto exitosamente
    Given el usuario navega al sitio elaniin
    When navega a la seccion Contact Us
    And completa el formulario con user "<userId>"
    And hace clic en Send message
    Then el formulario se envia exitosamente

    Examples:
      | userId |
      | 1      | 