db.runCommand({
  collMod: "orders_final",
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: [
        "Order ID", 
        "Order Date", 
        "Customer ID", 
        "product_id", 
        "category", 
        "Sales", 
        "Quantity"
      ],
      properties: {
        "Order ID": {
          bsonType: "string",
          description: "Debe ser el identificador único de la orden"
        },
        "Order Date": {
          bsonType: "date",
          description: "Debe ser una fecha válida (Date BSON) para permitir reportes temporales"
        },
        "Customer ID": {
          bsonType: "string",
          description: "Referencia al cliente"
        },
        "product_id": {
          bsonType: "string",
          description: "Referencia al producto (Referencing)"
        },
        "category": {
          bsonType: "string",
          description: "Categoría incrustada para optimización de lectura"
        },
        "Sales": {
          bsonType: ["double", "int"],
          minimum: 0,
          description: "El monto de venta debe ser positivo"
        },
        "Quantity": {
          bsonType: "int",
          minimum: 1,
          description: "La cantidad debe ser al menos 1"
        },
        "Profit": {
          bsonType: ["double", "int"],
          description: "El beneficio puede ser negativo (pérdida) o positivo"
        },
        "Shipping Cost": {
           bsonType: ["double", "int"],
           minimum: 0,
           description: "El costo de envío no puede ser negativo"
        },
        "Country": { bsonType: "string" },
        "City": { bsonType: "string" }
      }
    }
  },
  validationLevel: "strict", // Aplica a todas las inserciones y actualizaciones
  validationAction: "error"  // Rechaza documentos que no cumplan la regla
});

// Validación para la colección de Catálogo de Productos
db.runCommand({
  collMod: "products_limpia",
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: [
        "product_id",
        "product_name",
        "discounted_price",
        "actual_price",
        "rating_count"
      ],
      properties: {
        product_id: {
          bsonType: "string",
          description: "ID único del producto (string)"
        },
        product_name: {
          bsonType: "string",
          description: "Nombre del producto"
        },
        discounted_price: {
          bsonType: ["int", "double"],
          minimum: 0,
          description: "El precio con descuento debe ser un número >= 0."
        },
        actual_price: {
          bsonType: ["int", "double"],
          minimum: 0,
          description: "El precio original debe ser un número >= 0."
        },
        rating_count: {
          bsonType: "int",
          minimum: 0,
          description: "El conteo de reseñas debe ser un entero positivo"
        },
        // Validaciones opcionales para campos que podrían no estar en todos los documentos
        category: {
          bsonType: "string"
        },
        rating_avg: {
          bsonType: ["double", "int"],
          minimum: 0,
          maximum: 5
        }
      }
    }
  },
  validationLevel: "strict", // Aplica validación a todos los inserts y updates
  validationAction: "error"  // Bloquea cualquier operación que viole la regla
});