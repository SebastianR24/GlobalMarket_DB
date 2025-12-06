
//Reporte de Ventas Mensuales por Categoría Principal - Colección: orders_simulated

[
  // 1. $sort:

  {
    $sort: {
      category: 1,
      order_date: 1
    }
  },

  // 2. $project: Limpieza de datos
  {
    $project: {
      main_category: {
        $arrayElemAt: [
          { $split: ["$category", "|"] },
          0
        ]
      },
      order_date: 1,
      total_sale: 1
    }
  },

  // 3. $group: Agrupación total
  {
    $group: {
      _id: {
        category: "$main_category",
        month: { $month: "$order_date" }
      },
      total_sales: { $sum: "$total_sale" },
      transactions: { $sum: 1 }
    }
  },

  // 4. $project: Formato final
  {
    $project: {
      _id: 0,
      category: "$_id.category",
      month: "$_id.month",
      revenue: { $round: ["$total_sales", 2] },
      sales_count: "$transactions"
    }
  }
]

//Bucket Pattern de Precios de Productos - Colección: products_limpia

[
  // Etapa 1: $match 
  {
    $match: {
      discounted_price: { $gt: 0 }
    }
  },

  // Etapa 2: $bucket 
  {
    $bucket: {
      groupBy: "$discounted_price",
      boundaries: [0, 500, 1000, 1000000],
      default: "Otros",
      output: {
        total_products: { $sum: 1 },
        avg_rating: { $avg: "$rating_avg" },

        products_list: { $push: "$product_name" }
      }
    }
  },

  // Etapa 3: $project
  {
    $project: {
      _id: 0,
      price_range: {
        $switch: {
          branches: [
    
            {
              case: { $eq: ["$_id", 0] },
              then: "1. Bajo (0 - 500)"
            },
            {
              case: { $eq: ["$_id", 500] },
              then: "2. Medio (500 - 1000)"
            },
            {
              case: { $eq: ["$_id", 1000] },
              then: "3. Alto (1000+)"
            }
          ],
          default: "Desconocido"
        }
      },
      total_products: 1,
      avg_rating: { $round: ["$avg_rating", 2] },
      products_list: 1
    }
  }
]

// Fuzzy Search de Productos - Colección: products_limpia

[
  {
    $search: {
      index: "default",
      text: {
        query: "bombo",
        path: ["product_name", "about_product"],
        fuzzy: { maxEdits: 2 }
      }
    }
  },
  {
    $project: {
      _id: 0,
      product_name: 1,
      about_product: 1,
      score: { $meta: "searchScore" }
    }
  },
  { $limit: 5 }
]

//Top Clientes/Productos con Más Reseñas - Colección: products_limpia

[
  // 1. $match:
  
  {
    $match: {
      rating_count: { $gt: 50 }
    }
  },

  // 2. $sort:
  {
    $sort: {
      rating_avg: -1,
      rating_count: -1
    }
  },

  // 3. $limit:
  
  {
    $limit: 1000
  },

  // 4. $lookup: 
 
  {
    $lookup: {
      from: "reviews",
      localField: "product_id",
      foreignField: "product_id",
      as: "all_reviews"
    }
  },

  // 5. $addFields:
  {
    $addFields: {
      review_count_dinamico: {
        $size: "$all_reviews"
      },
      
      avg_rating: "$rating_avg"
    }
  },

  // 6. $project:
  {
    $project: {
      _id: 0,
      product_name: 1,
      category: 1,
      rating_avg: 1,
      num_reviews_incrustado: "$rating_count",
      num_reviews_dinamico:
        "$review_count_dinamico"
    }
  }
]