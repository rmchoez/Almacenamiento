export const CartSchema = {
    title: "cart schema",
    version: 0,
    description: "Schema for cart details from API",
    type: "object",
    primaryKey: 'uuid', // La clave primaria será `id`, ya que es única para cada carrito
    properties: {
      uuid: {
        type: "string", // ID único del carrito
        maxLength: 100, // <- the primary key must have set maxLength
        minimum: 1,
      },
      userId: { 
        type: "number", // ID del usuario que posee el carrito
        minimum: 1,
      },
      products: {
        type: "array", // Lista de productos dentro del carrito
        items: {
          type: "object",
          properties: {
            id: { type: "number" }, // ID del producto
            title: { type: "string" }, // Nombre del producto
            price: { type: "number" }, // Precio del producto
            quantity: { type: "number" }, // Cantidad del producto en el carrito
            total: { type: "number" }, // Precio del producto
            discountPercentage: { type: "number" }, // descuento porcentaje del producto
            discountedTotal: { type: "number" }, // descuento en el Precio del producto
          },
          required: ["id", "name", "price", "quantity","total"], // Campos obligatorios por producto
        },
      },
      total: {
        type: "number", // Total de la compra, calculado a partir de los productos
        minimum: 0, // El total debe ser siempre positivo o cero
      },
      totalProducts: {
        type: "number", // Total de productos en el carrito
        minimum: 0, // El total debe ser siempre positivo o cero
      },
      totalQuantity: {
        type: "number", // Total unidades de cada producto de la compra, calculado a partir de los productos
        minimum: 0, // El total debe ser siempre positivo o cero
      },
      discountedTotal: {
        type: "number", // Total de desceunto en la compra
        minimum: 0, // El total debe ser siempre positivo o cero
      },
    },
    required: ["uuid", "userId", "products", "total"], // Campos requeridos
  };
  