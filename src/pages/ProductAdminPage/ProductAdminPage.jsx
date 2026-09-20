import { useState } from "react";
import { useNavigate } from "react-router-dom";
import ProductForm from "../../components/ProductForm/ProductForm";
import ProductTable from "../../components/ProductTable/ProductTable";

/**
 * Página de administración de productos.
 *
 * Coordina las operaciones de creación, edición y eliminación
 * de productos mediante el formulario y la tabla de administración.
 *
 * Mantiene en su estado el producto seleccionado para edición
 * y proporciona los callbacks necesarios a los componentes hijos.
 *
 * @returns {JSX.Element} Página de administración de productos.
 */
function ProductAdminPage() {
  const [editingProduct, setEditingProduct] = useState(null);

  const navigate = useNavigate();

  const handleEdit = (product) => {
    setEditingProduct(product);
  };

  const handleSave = (product) => {
    console.log("Guardar:", product);
  };

  const handleDelete = (id) => {
    console.log("Eliminar:", id);
  };

  const handleCancel = () => {
    navigate("/productos");
  };

  return (
    <div className="product-admin">
      <h1>Administración de productos</h1>

      <ProductForm
        key={editingProduct?.id ?? "new"}
        product={editingProduct}
        onSave={handleSave}
        onCancel={handleCancel}
      />

      <ProductTable onEdit={handleEdit} onDelete={handleDelete} />
    </div>
  );
}

export default ProductAdminPage;
