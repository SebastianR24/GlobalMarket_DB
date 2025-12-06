# 🛒 GlobalMarket
> **Proyecto N° 1 - Sistemas de Bases de Datos II** > Migración, optimización y
  análisis de datos de Amazon Sales Dataset utilizando MongoDB Atlas.

## 👤Integrantes 
Adrian Reina, Eldry Valderrey, Sebastian Rodriguez

## 📋 Descripción del Proyecto
Este repositorio contiene la solución técnica para la migración de la base de datos de "GlobalMarket". El proyecto implementa un modelo de datos documental optimizado para lecturas rápidas, validación de esquemas JSON, pipelines de agregación complejos para inteligencia de negocios y búsqueda avanzada con Atlas Search.

**Dataset utilizado:** Amazon Sales Dataset (Modificado y limpiado).

## 🛠️ Requisitos Previos
Para ejecutar este proyecto, necesitas:

1.  **MongoDB Atlas Account:** Un clúster M0 (Free Tier) activo.
2.  **MongoDB Compass:** Para la importación visual de datos y pruebas.
3.  **MongoDB Shell (`mongosh`):** Para ejecutar los scripts de validación y consultas (opcional, también se puede hacer desde Compass).

## 🚀 Guía de Instalación y Despliegue (Cómo levantar el proyecto)

# 1. Conexión al Clúster.
Abre MongoDB Compass y utiliza tu cadena de conexión (Connection String).
* Nota: Asegúrate de tener los permisos de red (IP Access List) configurados en Atlas si tienes problemas de conexión.


# 2. Importación de Datos (data/).
Los datos crudos se encuentran en la carpeta data del repositorio.
* En Compass, crea una base de datos llamada GlobalMarket_DB (o el nombre de tu preferencia).
* Crea una colección llamada ventas (u otro nombre descriptivo).
* Entra a la colección y haz clic en el botón Add Data > Import JSON or CSV.
* Selecciona el archivo .csv ubicado en la carpeta data.
* Importante: Asegúrate de verificar los tipos de datos en la previsualización (ej. que los precios sean Double/Int y no String) antes de finalizar la importación.


# 3. Aplicar Validación de Esquema (src/validation.js).
Para asegurar la integridad de los datos, aplicamos reglas de validación definidas en el código.
* Abre el archivo src/validation.js con un editor de texto.
* Copia el objeto JSON que contiene las reglas $jsonSchema.
* En MongoDB Compass, ve a la pestaña Validation.
* Pega el código en el editor y haz clic en Save.
  * Esto marcará en rojo cualquier documento que no cumpla con las reglas definidas.


# 4. Ejecución de Pipelines de Agregación (src/pipeline.js)
Para realizar análisis complejos (agrupaciones, sumas, promedios) definidos en el proyecto:
* Abre el archivo src/pipeline.js.
* Copia el array de etapas (stages) de la agregación (ej. [ { $match: ... }, { $group: ... } ]).
* En Compass, ve a la pestaña Aggregations.
* Pega las etapas en el constructor de pipelines.
 * Compass te mostrará una vista previa de los datos en tiempo real paso por paso.


# 5. Consultas Específicas (src/queries.js)
Para búsquedas rápidas definidas en el proyecto:
* Abre el archivo src/queries.js.
* Identifica el objeto de filtro (ej. { "campo": "valor" }).
* En Compass, ve a la pestaña Documents.
* Pega el objeto en la barra de Filter (parte superior) y haz clic en Find.
