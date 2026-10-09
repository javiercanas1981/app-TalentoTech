import { useState } from "react";
import ProductForm from "../../components/ProductForm/ProductForm";
import ProductTable from "../../components/ProductTable/ProductTable";
import { notificationService } from "../../services/NotificationService";
import {
  createProduct,
  deleteProduct,
  updateProduct,
} from "../../services/ProductService";

/**
 * Página de administración de productos.
 *
 * Visualiza el listado de productos y gestionar
 * las operaciones de creación, edición y eliminación.
 *
 * Muestra la tabla de productos por defecto y permite
 * cambiar al formulario para crear un nuevo producto
 * o editar uno existente.
 *
 * @returns {JSX.Element} Página de administración de productos.
 */
function ProductAdminPage() {
  const [editingProduct, setEditingProduct] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [reloadVersion, setReloadVersion] = useState(0);

  const handleNew = () => {
    setEditingProduct(null);
    setShowForm(true);
  };

  const handleEdit = (product) => {
    setEditingProduct(product);
    setShowForm(true);
  };

  const handleSave = async (product) => {
    try {
    if (editingProduct) {
      await updateProduct(editingProduct.id, product);
      notificationService.showSuccess("Producto actualizado correctamente.");
    } else {
      await createProduct(product);
      notificationService.showSuccess("Producto creado correctamente.");
    }

    setReloadVersion((version) => version + 1);
    setShowForm(false);
    setEditingProduct(null);
    } catch (error) {
    console.error("Error guardando producto:", error);
    notificationService.showError(
      `No se pudo guardar el producto. ${error.message}`,
    );
    }
  };

  const handleDelete = async (id) => {
    try {
    await deleteProduct(id);
    notificationService.showSuccess("Producto eliminado correctamente.");
    setReloadVersion((version) => version + 1);
    } catch (error) {
    console.error("Error eliminando producto:", error);
    notificationService.showError(
      `No se pudo eliminar el producto. ${error.message}`,
    );
    }
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingProduct(null);
  };

  return (
    <div className="product-admin">
      <h1>Administración de productos</h1>

      {showForm ? (
        <ProductForm
          key={editingProduct?.id ?? "new"}
          product={editingProduct}
          onSave={handleSave}
          onCancel={handleCancel}
        />
      ) : (
        <ProductTable
          key={reloadVersion}
          onNew={handleNew}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      )}
    </div>
  );
}

export default ProductAdminPage;
