import { getStoredIdToken } from "./AuthService";

const API_URL = (import.meta.env.VITE_API_URL ?? "/api").replace(/\/+$/, "");

async function request(path, options) {
  const response = await fetch(`${API_URL}${path}`, options);
  const responseText = await response.text();
  let body = null;

  if (responseText) {
    try {
      body = JSON.parse(responseText);
    } catch {
      if (response.ok) {
        throw new Error("La API devolvió una respuesta JSON inválida.");
      }
      body = responseText;
    }
  }

  if (!response.ok) {
    const message = Array.isArray(body?.message)
      ? body.message.join(", ")
      : body?.message ?? body ?? response.statusText;
    const error = new Error(
      `Error al comunicarse con la API de productos (${response.status}): ${message}`,
    );
    error.status = response.status;
    throw error;
  }

  return body;
}

/**
 * Obtiene todos los productos desde la API.
 *
 * @returns {Promise<Array>} Lista de productos.
 */
const getProducts = () => request("/products");

/**
 * Obtiene un producto por su identificador.
 *
 * @param {string} productId - Identificador del producto.
 * @returns {Promise<Object>} Producto encontrado.
 */
const getProduct = (productId) =>
  request(`/products/${encodeURIComponent(productId)}`);

/**
 * Crea un producto en la API.
 *
 * @param {Object} product - Datos del producto.
 * @returns {Promise<Object>} Producto creado.
 */
const createProduct = (product) =>
  request("/products", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(getStoredIdToken()
        ? { Authorization: `Bearer ${getStoredIdToken()}` }
        : {}),
    },
    body: JSON.stringify(product),
  });

/**
 * Actualiza un producto existente.
 *
 * @param {string} productId - Identificador del producto.
 * @param {Object} product - Datos actualizados del producto.
 * @returns {Promise<Object>} Producto actualizado.
 */
const updateProduct = (productId, product) =>
  request(`/products/${encodeURIComponent(productId)}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      ...(getStoredIdToken()
        ? { Authorization: `Bearer ${getStoredIdToken()}` }
        : {}),
    },
    body: JSON.stringify(product),
  });

/**
 * Elimina un producto.
 *
 * @param {string} productId - Identificador del producto.
 * @returns {Promise<Object>} Resultado de la eliminación.
 */
const deleteProduct = (productId) =>
  request(`/products/${encodeURIComponent(productId)}`, {
    method: "DELETE",
    headers: getStoredIdToken()
      ? { Authorization: `Bearer ${getStoredIdToken()}` }
      : {},
  });

/**
 * Confirma una compra; el backend valida el stock, lo descuenta y registra la orden.
 *
 * @param {Array<{productId: string, quantity: number}>} items - Productos y cantidades.
 * @param {string} idempotencyKey - Clave para hacer seguro el reintento de la compra.
 * @returns {Promise<Object>} Orden confirmada.
 */
const createOrder = (items, idempotencyKey) =>
  request("/orders", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ items, idempotencyKey }),
  });

export {
  createOrder,
  createProduct,
  deleteProduct,
  getProduct,
  getProducts,
  updateProduct,
};
