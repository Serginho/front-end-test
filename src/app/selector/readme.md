Esta es una primera versión de mi propuesta para esta prueba técnica. Hay ciertas cosas que me gustaría revisar, aunque por tiempo no he podido, que son:

Como he tenido que empezar con angular y Sass de cero he creado un componente reutilizando poco código, me gustaría revisar esto y usar más lo definido en Sass y los componentes select y select-item.

Además a causa de el enfoque que le he dado a la solución para la paginación me ha sido imposible la correcta animación ya que cuando se destruye una pagina se lanza una animación, y mientras esta esta ocurriendo se crea una nueva. Cuando la anterior termina ya se ha creado la nueva página por lo que el efecto queda raro. Debería haber planteado una solución en la que se guardase además de la pagina actual tambien la siguiente solo que invisible, de esta forma pordría hacer el efecto de forma más sencilla.
Dejo el codigo de la transición pero sin llamarlo desde el HTML.
