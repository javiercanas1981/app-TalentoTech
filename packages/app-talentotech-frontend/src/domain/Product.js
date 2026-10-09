/**
 * Representa un producto del catálogo.
 *
 * @typedef {Object} Product
 * @property {string} id - Identificador único del producto.
 * @property {string} name - Nombre del producto.
 * @property {string} category - Categoría a la que pertenece el producto { Category - SubCategory }.
 * @property {number} price - Precio del producto.
 * @property {number} stock - Unidades disponibles del producto.
 * @property {string} unit - Unidad de medida del producto, por ejemplo "kg".
 * @property {string} weight - Descripción del peso del producto.
 * @property {number} rating - Valoración promedio del producto.
 * @property {number} reviewsCount - Cantidad de reseñas del producto.
 * @property {string} image - URL de la imagen del producto.
 * @property {string} description - Descripción del producto.
 * @property {string} cookingTip - Consejo de cocción o preparación del producto.
 * @property {string[]} tags - Etiquetas asociadas al producto.
 * @property {boolean} isFeatured - Indica si el producto es destacado.
 */

export const ProductDefaults = {
  id: "",
  name: "",
  category: "",
  price: 0,
  stock: 0,
  unit: "kg",
  weight: "",
  rating: 0,
  reviewsCount: 0,
  image: "",
  description: "",
  cookingTip: "",
  tags: [],
  isFeatured: false,
};
