Guía sobre el desarrollo del Backend actual.

La estructura se divide en módulos.

- controllers: para las funciones y lógica de negocio, todos los controladores se dividen en bloques
de try-catch.
- routes: para las rutas y middlewares
- libs: para crear middlewares y funciones auxiliares
- models: para los modelos de la Base de Datos
- app: para ejecutar las rutas y toda la lógica relacionada a SocketIo
- webSockets: (!) buscar la forma de modularizarlo e implementarlo en cada controlador
- redis: se usa con promisify para evitar código de callbacks, implementado sólo en métodos GET para:
__ publicaciones de feed, 
__ publicaciones recomendadas, 
__ publicaciones de descubrimiento (sección search), 
__ publicaciones por perfil de usuario visitado, 
__ perfil de usuario,
__ perfil de usuario por ID
- control de errores: (!) hay que mejorarlo
- cada vez que se envía datos al front se cierra la conexión a la base de datos

Se está migrando a un Backend de desarrollo con credenciales de Mercado Pago y Base de Datos totalmente independiente al de producción y pudiendo ser usado sin internet.
