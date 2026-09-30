import { useState } from "react";
import ProductForm from "../../components/ProductForm/ProductForm";
import ProductTable from "../../components/ProductTable/ProductTable";

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

  const handleNew = () => {
    setEditingProduct(null);
    setShowForm(true);
  };

  const handleEdit = (product) => {
    setEditingProduct(product);
    setShowForm(true);
  };

  const handleSave = (product) => {
    console.log("Guardar:", product);

    setShowForm(false);
    setEditingProduct(null);
  };

  const handleDelete = (id) => {
    console.log("Eliminar:", id);
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
          onNew={handleNew}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      )}
    </div>
  );
}

export default ProductAdminPage;
