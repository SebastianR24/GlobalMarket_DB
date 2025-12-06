db.products.aggregate([
  {
    $project: {
      _id: 0,
      product_id: { $trim: { input: "$product_id" } }, // Limpiamos espacios en el ID
      product_name: 1,
      category: 1,
      
      // 1. Limpieza de Precios (Convertir a número)
      // Si encuentra basura, pone 0
      discounted_price: { 
        $convert: { input: "$discounted_price", to: "double", onError: 0.0, onNull: 0.0 } 
      },
      actual_price: { 
        $convert: { input: "$actual_price", to: "double", onError: 0.0, onNull: 0.0 } 
      },
      
      // 2. Limpieza de Rating (El campo problemático que tenía "|")
      rating_avg: { 
        $convert: { input: "$rating", to: "double", onError: 0.0, onNull: 0.0 } 
      },
      
      // 3. Limpieza de Conteo de Reseñas
      rating_count: { 
        $convert: { input: "$rating_count", to: "int", onError: 0, onNull: 0 } 
      },
      
      about_product: 1,
      img_link: 1
    }
  },
  // Guardamos todo en una colección nueva y limpia
  { $out: "products_final" }
]);

db.getCollection('products_limpia').aggregate(
  [
    { $match: { discounted_price: { $gt: 0 } } },
    {
      $bucket: {
        groupBy: '$discounted_price',
        boundaries: [0, 500, 1000, 1000000],
        default: 'Otros',
        output: {
          total_products: { $sum: 1 },
          avg_rating: { $avg: '$rating_avg' },
          products_list: {
            $push: '$product_name'
          }
        }
      }
    },
    {
      $project: {
        _id: 0,
        price_range: {
          $switch: {
            branches: [
              {
                case: { $eq: ['$_id', 0] },
                then: '1. Bajo (0 - 500)'
              },
              {
                case: { $eq: ['$_id', 500] },
                then: '2. Medio (500 - 1000)'
              },
              {
                case: { $eq: ['$_id', 1000] },
                then: '3. Alto (1000+)'
              }
            ],
            default: 'Desconocido'
          }
        },
        total_products: 1,
        avg_rating: {
          $round: ['$avg_rating', 2]
        },
        products_list: 1
      }
    }
  ],
  { maxTimeMS: 60000, allowDiskUse: true }
);

db.getCollection('products_limpia').aggregate(
  [
    { $match: { rating_count: { $gt: 50 } } },
    {
      $lookup: {
        from: 'reviews',
        localField: 'product_id',
        foreignField: 'product_id',
        as: 'all_reviews'
      }
    },
    {
      $addFields: {
        review_count_dinamico: {
          $size: '$all_reviews'
        },
        avg_rating: '$rating_avg'
      }
    },
    {
      $sort: { avg_rating: -1, rating_count: -1 }
    },
    { $limit: 1000 },
    {
      $project: {
        _id: 0,
        product_name: 1,
        category: 1,
        rating_avg: 1,
        num_reviews_incrustado: '$rating_count',
        num_reviews_dinamico:
          '$review_count_dinamico'
      }
    }
  ],
  { maxTimeMS: 60000, allowDiskUse: true }
);