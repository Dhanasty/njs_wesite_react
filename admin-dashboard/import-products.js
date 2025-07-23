
// Data migration script - Run this to import products into admin dashboard

const products = [
  {
    "id": "product:1753102846901:ivory-chettinad-silk",
    "name": "Ivory - Chettinad Silk",
    "slug": "ivory-chettinad-silk",
    "description": "Exquisite ivory Chettinad silk saree featuring traditional handwoven patterns. This timeless piece showcases the rich heritage of Tamil Nadu's textile craftsmanship with intricate motifs and lustrous silk finish.",
    "price": 3455,
    "originalPrice": 4200,
    "category": "Chettinad Silks",
    "stockQuantity": 15,
    "inStock": true,
    "images": [
      "/images/products/chettinad1.jpg",
      "/images/products/chettinad1-detail1.jpg",
      "/images/products/chettinad1-detail2.jpg",
      "/images/products/chettinad1-detail3.jpg"
    ],
    "features": [
      "Authentic handwoven Chettinad silk",
      "Traditional Tamil Nadu craftsmanship",
      "Rich lustrous finish",
      "Intricate geometric patterns",
      "Premium quality silk threads"
    ],
    "colors": [
      {
        "name": "Ivory",
        "value": "#F5F5DC",
        "image": "/images/products/chettinad1.jpg"
      },
      {
        "name": "Golden Yellow",
        "value": "#FFD700",
        "image": "/images/products/chettinad1-yellow.jpg"
      },
      {
        "name": "Deep Red",
        "value": "#8B0000",
        "image": "/images/products/chettinad1-red.jpg"
      }
    ],
    "specifications": {
      "fabric": "Pure Chettinad Silk",
      "length": "5.5 meters + 80cm blouse piece",
      "width": "44 inches",
      "weight": "700 grams",
      "washCare": [
        "Dry clean only",
        "Store in cotton cloth",
        "Avoid direct sunlight"
      ]
    },
    "badge": "Featured",
    "createdAt": "2025-07-21T13:00:46.901Z",
    "updatedAt": "2025-07-21T13:00:46.906Z"
  },
  {
    "id": "product:1753102846906:maroon-chettinad-classic",
    "name": "Maroon Chettinad Classic",
    "slug": "maroon-chettinad-classic",
    "description": "Rich maroon Chettinad silk saree with gold zari work. Perfect for weddings and special occasions, featuring traditional checks and temple border designs.",
    "price": 4299,
    "originalPrice": 5100,
    "category": "Chettinad Silks",
    "stockQuantity": 12,
    "inStock": true,
    "images": [
      "/images/products/chettinad2.jpg",
      "/images/products/chettinad2-detail1.jpg",
      "/images/products/chettinad2-detail2.jpg"
    ],
    "features": [
      "Gold zari work",
      "Traditional check patterns",
      "Temple border design",
      "Wedding collection",
      "Handwoven excellence"
    ],
    "colors": [
      {
        "name": "Maroon",
        "value": "#800000",
        "image": "/images/products/chettinad2.jpg"
      },
      {
        "name": "Royal Blue",
        "value": "#4169E1",
        "image": "/images/products/chettinad2-blue.jpg"
      }
    ],
    "specifications": {
      "fabric": "Pure Chettinad Silk with Zari",
      "length": "5.5 meters + 80cm blouse piece",
      "width": "44 inches",
      "weight": "750 grams",
      "washCare": [
        "Dry clean only",
        "Handle zari work carefully",
        "Store flat"
      ]
    },
    "badge": "Premium",
    "createdAt": "2025-07-21T13:00:46.906Z",
    "updatedAt": "2025-07-21T13:00:46.906Z"
  },
  {
    "id": "product:1753102846906:elegant-soft-sico",
    "name": "Elegant Soft Sico",
    "slug": "elegant-soft-sico",
    "description": "Luxurious soft sico saree with contemporary designs. Perfect blend of comfort and elegance, ideal for both casual and formal occasions.",
    "price": 2499,
    "originalPrice": 3100,
    "category": "Soft Sico",
    "stockQuantity": 20,
    "inStock": true,
    "images": [
      "/images/products/softsico1.jpg",
      "/images/products/softsico1-detail1.jpg",
      "/images/products/softsico1-detail2.jpg"
    ],
    "features": [
      "Ultra-soft texture",
      "Contemporary design",
      "Versatile styling",
      "Comfortable drape",
      "Easy maintenance"
    ],
    "colors": [
      {
        "name": "Powder Blue",
        "value": "#B0E0E6",
        "image": "/images/products/softsico1.jpg"
      },
      {
        "name": "Mint Green",
        "value": "#98FB98",
        "image": "/images/products/softsico1-mint.jpg"
      },
      {
        "name": "Rose Pink",
        "value": "#FFB6C1",
        "image": "/images/products/softsico1-pink.jpg"
      }
    ],
    "specifications": {
      "fabric": "Soft Sico Silk",
      "length": "5.5 meters + 80cm blouse piece",
      "width": "44 inches",
      "weight": "500 grams",
      "washCare": [
        "Hand wash in cold water",
        "Mild detergent only",
        "Dry in shade"
      ]
    },
    "badge": "Bestseller",
    "createdAt": "2025-07-21T13:00:46.906Z",
    "updatedAt": "2025-07-21T13:00:46.906Z"
  },
  {
    "id": "product:1753102846906:floral-soft-sico",
    "name": "Floral Soft Sico",
    "slug": "floral-soft-sico",
    "description": "Beautiful floral printed soft sico saree with vibrant colors. Perfect for day events and casual gatherings.",
    "price": 2899,
    "originalPrice": 3500,
    "category": "Soft Sico",
    "stockQuantity": 18,
    "inStock": true,
    "images": [
      "/images/products/softsico2.jpg",
      "/images/products/softsico2-detail1.jpg"
    ],
    "features": [
      "Digital floral prints",
      "Vibrant color combinations",
      "Lightweight fabric",
      "Modern appeal",
      "Color-fast printing"
    ],
    "colors": [
      {
        "name": "Multi Floral",
        "value": "#FF69B4",
        "image": "/images/products/softsico2.jpg"
      }
    ],
    "specifications": {
      "fabric": "Printed Soft Sico",
      "length": "5.5 meters + 80cm blouse piece",
      "width": "44 inches",
      "weight": "450 grams",
      "washCare": [
        "Machine wash gentle",
        "Use color-safe detergent",
        "Iron on low heat"
      ]
    },
    "badge": null,
    "createdAt": "2025-07-21T13:00:46.906Z",
    "updatedAt": "2025-07-21T13:00:46.906Z"
  },
  {
    "id": "product:1753102846906:traditional-ikath",
    "name": "Traditional Ikath",
    "slug": "traditional-ikath",
    "description": "Authentic Ikath saree featuring traditional tie-dye technique. Each piece is unique with beautiful geometric patterns created through resist dyeing.",
    "price": 2365,
    "originalPrice": 2800,
    "category": "Ikath",
    "stockQuantity": 8,
    "inStock": true,
    "images": [
      "/images/products/ikath1.jpg",
      "/images/products/ikath1-detail1.jpg",
      "/images/products/ikath1-detail2.jpg"
    ],
    "features": [
      "Traditional tie-dye technique",
      "Unique geometric patterns",
      "Artisan crafted",
      "Cultural heritage",
      "Natural dyeing process"
    ],
    "colors": [
      {
        "name": "Indigo Blue",
        "value": "#4B0082",
        "image": "/images/products/ikath1.jpg"
      },
      {
        "name": "Emerald Green",
        "value": "#50C878",
        "image": "/images/products/ikath1-green.jpg"
      }
    ],
    "specifications": {
      "fabric": "Pure Cotton Ikath",
      "length": "5.5 meters + 80cm blouse piece",
      "width": "44 inches",
      "weight": "600 grams",
      "washCare": [
        "Hand wash separately",
        "Use mild detergent",
        "Dry in shade to preserve colors"
      ]
    },
    "badge": "New",
    "createdAt": "2025-07-21T13:00:46.906Z",
    "updatedAt": "2025-07-21T13:00:46.906Z"
  },
  {
    "id": "product:1753102846906:designer-ikath",
    "name": "Designer Ikath",
    "slug": "designer-ikath",
    "description": "Premium designer Ikath saree with contemporary patterns. Combines traditional tie-dye technique with modern design sensibilities.",
    "price": 4299,
    "originalPrice": 5200,
    "category": "Ikath",
    "stockQuantity": 6,
    "inStock": true,
    "images": [
      "/images/products/ikath2.jpg",
      "/images/products/ikath2-detail1.jpg",
      "/images/products/ikath2-detail2.jpg"
    ],
    "features": [
      "Designer patterns",
      "Contemporary appeal",
      "Premium quality fabric",
      "Artistic excellence",
      "Limited edition"
    ],
    "colors": [
      {
        "name": "Burgundy",
        "value": "#800020",
        "image": "/images/products/ikath2.jpg"
      },
      {
        "name": "Navy Blue",
        "value": "#000080",
        "image": "/images/products/ikath2-navy.jpg"
      }
    ],
    "specifications": {
      "fabric": "Premium Cotton Silk Ikath",
      "length": "5.5 meters + 80cm blouse piece",
      "width": "44 inches",
      "weight": "650 grams",
      "washCare": [
        "Dry clean recommended",
        "Store carefully",
        "Avoid harsh chemicals"
      ]
    },
    "badge": "Premium",
    "createdAt": "2025-07-21T13:00:46.906Z",
    "updatedAt": "2025-07-21T13:00:46.906Z"
  },
  {
    "id": "product:1753102846906:royal-chettinad-silk",
    "name": "Royal Chettinad Silk",
    "slug": "royal-chettinad-silk",
    "description": "Luxurious royal Chettinad silk saree with heavy zari work. Perfect for grand occasions and celebrations.",
    "price": 5999,
    "originalPrice": 7200,
    "category": "Chettinad Silks",
    "stockQuantity": 4,
    "inStock": true,
    "images": [
      "/images/products/chettinad3.jpg",
      "/images/products/chettinad3-detail1.jpg"
    ],
    "features": [
      "Heavy zari embellishment",
      "Royal collection",
      "Grand occasion wear",
      "Intricate craftsmanship",
      "Premium silk quality"
    ],
    "colors": [
      {
        "name": "Royal Purple",
        "value": "#7851A9",
        "image": "/images/products/chettinad3.jpg"
      }
    ],
    "specifications": {
      "fabric": "Premium Chettinad Silk with Heavy Zari",
      "length": "5.5 meters + 80cm blouse piece",
      "width": "44 inches",
      "weight": "850 grams",
      "washCare": [
        "Dry clean only",
        "Professional care recommended",
        "Store with care"
      ]
    },
    "badge": "Premium",
    "createdAt": "2025-07-21T13:00:46.906Z",
    "updatedAt": "2025-07-21T13:00:46.906Z"
  },
  {
    "id": "product:1753102846906:pastel-soft-sico",
    "name": "Pastel Soft Sico",
    "slug": "pastel-soft-sico",
    "description": "Delicate pastel soft sico saree with subtle embellishments. Perfect for daytime events and summer occasions.",
    "price": 2199,
    "originalPrice": 2700,
    "category": "Soft Sico",
    "stockQuantity": 14,
    "inStock": true,
    "images": [
      "/images/products/softsico3.jpg"
    ],
    "features": [
      "Pastel color palette",
      "Subtle embellishments",
      "Summer collection",
      "Lightweight comfort",
      "Elegant simplicity"
    ],
    "colors": [
      {
        "name": "Lavender",
        "value": "#E6E6FA",
        "image": "/images/products/softsico3.jpg"
      },
      {
        "name": "Peach",
        "value": "#FFCBA4",
        "image": "/images/products/softsico3-peach.jpg"
      }
    ],
    "specifications": {
      "fabric": "Soft Sico with Light Embellishments",
      "length": "5.5 meters + 80cm blouse piece",
      "width": "44 inches",
      "weight": "480 grams",
      "washCare": [
        "Gentle hand wash",
        "Mild detergent",
        "Air dry in shade"
      ]
    },
    "badge": null,
    "createdAt": "2025-07-21T13:00:46.906Z",
    "updatedAt": "2025-07-21T13:00:46.906Z"
  }
];

// Import into in-memory store (for server-simple.js)
function importToInMemoryStore(inMemoryStore) {
  console.log('Starting product import...');
  
  // Clear existing sample products
  inMemoryStore.products.clear();
  
  // Import all products
  products.forEach(product => {
    inMemoryStore.products.set(product.id, product);
    console.log(`Imported: ${product.name}`);
  });
  
  console.log(`Successfully imported ${products.length} products!`);
  return products.length;
}

module.exports = { products, importToInMemoryStore };
