export const ProductSchema = {
    title: "product schema",
    version: 0,
    description: "Schema for product details from API",
    type: "object",
    primaryKey: 'uuid', // <= the primary key is must
    properties: {
      uuid: {
        type: "string",
        maxLength: 100, // Para cumplir con las restricciones de RxDB
      },
      id: { // Campo `id` de la API sin cambios
        type: "number",
        minimum: 1,
      },
      title: { type: "string" },
      description: { type: "string" },
      category: { type: "string" },
      price: { type: "number" },
      discountPercentage: { type: "number" },
      rating: { type: "number" },
      stock: { type: "number" },
      tags: { type: "array", items: { type: "string" } },
      brand: {
        type: "string"
      },
      sku: {
        type: "string"
      },
      weight: {
        type: "number"
      },
      dimensions: {
        type: "object",
        properties: {
          width: {
            type: "number"
          },
          height: {
            type: "number"
          },
          depth: {
            type: "number"
          }
        },
        required: ["width", "height", "depth"]
      },
      warrantyInformation: {
        type: "string"
      },
      shippingInformation: {
        type: "string"
      },
      availabilityStatus: {
        type: "string"
      },
      reviews: {
        type: "array",
        items: {
          type: "object",
          properties: {
            rating: {
              type: "integer"
            },
            comment: {
              type: "string"
            },
            date: {
              type: "string",
              format: "date-time"
            },
            reviewerName: {
              type: "string"
            },
            reviewerEmail: {
              type: "string",
              format: "email"
            }
          },
          required: ["rating", "comment", "date", "reviewerName", "reviewerEmail"]
        }
      },
      returnPolicy: {
        type: "string"
      },
      minimumOrderQuantity: {
        type: "integer"
      },
      meta: {
        type: "object",
        properties: {
          createdAt: {
            type: "string",
            format: "date-time"
          },
          updatedAt: {
            type: "string",
            format: "date-time"
          },
          barcode: {
            type: "string"
          },
          qrCode: {
            type: "string"
          }
        },
        required: ["createdAt", "updatedAt", "barcode"]
      },
      thumbnail: {
        type: "string"
      },
      images: {
        type: "array",
        items: {
          type: "string"
        }
      }
    },
    required: ["id", "title", "description", "category", "price"] // Campos requeridos
  };
  