const API_URL = "/data/products.json";

/**
 * Obtiene todos los productos.
 *
 * @returns {Promise<Array>} Lista de productos.
 */
const getProducts = () => {
  return fetch(API_URL).then((response) => {
    if (!response.ok) {
      throw new Error("No se pudieron cargar los productos");
    }

    return response.json();
  });
};

/**
 * Obtiene un producto por su identificador.
 *
 * @param {string} productId - Identificador del producto.
 * @returns {Promise<Object>} Producto encontrado.
 */
const getProduct = (productId) => {
  return getProducts().then((products) => {
    const product = products.find((product) => product.id === productId);

    if (!product) {
      throw new Error("Producto no encontrado");
    }

    return product;
  });
};

export { getProduct, getProducts };

