/**
 * Representa un producto del catálogo.
 *
 * @typedef {Object} Product
 * @property {string} id - Identificador único del producto.
 * @property {string} name - Nombre del producto.
 * @property {string} category - Categoría a la que pertenece el producto { Category - SubCategory }.
 * @property {number} price - Precio del producto.
 * @property {string} unit - Unidad de medida del producto, por ejemplo "kg".
 * @property {number} weight - Peso del producto.
 * @property {number} rating - Valoración promedio del producto.
 * @property {number} reviewsCount - Cantidad de reseñas del producto.
 * @property {string} imagePath - Ruta de la imagen del producto.
 * @property {string} desc - Descripción del producto.
 * @property {string} coockingTip - Consejo de cocción o preparación del producto.
 * @property {string[]} tags - Etiquetas asociadas al producto.
 * @property {boolean} isFeature - Indica si el producto es destacado.
 */

export const Product = {
  id: "",
  name: "",
  category: "",
  price: 0,
  unit: "kg",
  weight: 0,
  rating: 0,
  reviewsCount: 0,
  imagePath: "",
  desc: "",
  coockingTip: "",
  tags: [],
  isFeature: false,
};
