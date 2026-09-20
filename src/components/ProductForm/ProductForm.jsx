import { useState } from "react";
import { Product } from "../../domain/Product";

import "./ProductForm.css";

/**
 * Formulario para crear o editar un producto.
 *
 * Cuando recibe un producto mediante la prop `product`, el formulario
 * se inicializa con sus datos y permite modificarlos.
 * Si no recibe un producto, se inicializa con la estructura
 * predeterminada definida en `Product`.
 *
 * Al enviar el formulario, normaliza los datos y ejecuta `onSave`
 * con el producto resultante.
 *
 * La prop `onCancel` permite cancelar la operación y salir del formulario.
 *
 * @param {Object} props - Propiedades del componente.
 * @param {Product} [props.product] - Producto que se desea editar.
 * @param {(product: Product) => void} props.onSave - Callback ejecutado al guardar el producto.
 * @param {() => void} props.onCancel - Callback ejecutado al cancelar la operación.
 *
 * @returns {JSX.Element} Formulario para crear o editar un producto.
 */
function ProductForm({ product, onSave, onCancel }) {
  const [form, setForm] = useState(() => ({
    ...(product || Product),
    tags: product?.tags ? [...product.tags] : [],
  }));

  const [tagsInput, setTagsInput] = useState(
    () => product?.tags?.join(", ") || "",
  );

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target;

    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    const productToSave = {
      ...form,
      id: form.id || `prod-${Date.now()}`,
      price: Number(form.price),
      rating: Number(form.rating),
      reviewsCount: Number(form.reviewsCount),
      tags: tagsInput
        .split(",")
        .map((tag) => tag.trim())
        .filter(Boolean),
    };

    onSave(productToSave);

    if (!product) {
      setForm(Product);
      setTagsInput("");
    }
  };

  return (
    <form className="product-form" onSubmit={handleSubmit}>
      <div className="product-form-header">
        <div>
          <h2>{product ? "Editar producto" : "Nuevo producto"}</h2>
          <p>
            {product
              ? "Modifica la información del producto."
              : "Completa los datos para crear un nuevo producto."}
          </p>
        </div>
      </div>

      <div className="product-form-grid">
        <div className="form-group">
          <label htmlFor="name">Nombre *</label>
          <input
            id="name"
            name="name"
            type="text"
            value={form.name}
            onChange={handleChange}
            placeholder="Ej: Asado de Tira Premium"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="category">Categoría *</label>
          <select
            id="category"
            name="category"
            value={form.category}
            onChange={handleChange}
            required
          >
            <option value="">Seleccionar categoría</option>
            <option value="cortes">Cortes</option>
            <option value="achuras">Achuras</option>
            <option value="embutidos">Carbon</option>
            <option value="parrilla">Bebidas</option>
            <option value="parrilla">Salsas</option>
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="price">Precio *</label>
          <input
            id="price"
            name="price"
            type="number"
            min="0"
            value={form.price}
            onChange={handleChange}
            placeholder="12500"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="unit">Unidad *</label>
          <select
            id="unit"
            name="unit"
            value={form.unit}
            onChange={handleChange}
            required
          >
            <option value="kg">Kg</option>
            <option value="unidad">Unidad</option>
            <option value="pack">Pack</option>
            <option value="litro">Litro</option>
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="weight">Peso</label>
          <input
            id="weight"
            name="weight"
            type="text"
            value={form.weight}
            onChange={handleChange}
            placeholder="1 kg aprox."
          />
        </div>

        <div className="form-group">
          <label htmlFor="rating">Rating</label>
          <input
            id="rating"
            name="rating"
            type="number"
            min="0"
            max="5"
            step="0.1"
            value={form.rating}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label htmlFor="reviewsCount">Cantidad de reseñas</label>
          <input
            id="reviewsCount"
            name="reviewsCount"
            type="number"
            min="0"
            value={form.reviewsCount}
            onChange={handleChange}
          />
        </div>

        <div className="form-group form-group-full">
          <label htmlFor="image">URL de imagen *</label>
          <input
            id="image"
            name="image"
            type="url"
            value={form.image}
            onChange={handleChange}
            placeholder="https://..."
            required
          />
        </div>

        <div className="form-group form-group-full">
          <label htmlFor="description">Descripción *</label>
          <textarea
            id="description"
            name="description"
            value={form.description}
            onChange={handleChange}
            rows="4"
            placeholder="Descripción del producto..."
            required
          />
        </div>

        <div className="form-group form-group-full">
          <label htmlFor="cookingTip">Tip de cocción</label>
          <textarea
            id="cookingTip"
            name="cookingTip"
            value={form.cookingTip}
            onChange={handleChange}
            rows="3"
            placeholder="Ej: Cocinar 40 min del lado del hueso..."
          />
        </div>

        <div className="form-group form-group-full">
          <label htmlFor="tags">Tags</label>

          <input
            id="tags"
            type="text"
            value={tagsInput}
            onChange={(event) => setTagsInput(event.target.value)}
            placeholder="Más Vendido, Parrilla"
          />

          <small>Separá los tags utilizando comas.</small>
        </div>

        <div className="form-checkbox">
          <input
            id="isFeatured"
            name="isFeatured"
            type="checkbox"
            checked={form.isFeatured}
            onChange={handleChange}
          />

          <label htmlFor="isFeatured">Mostrar como producto destacado</label>
        </div>
      </div>

      <div className="product-form-actions">
        <button type="button" className="btn-secondary" onClick={onCancel}>
          Cancelar
        </button>

        <button type="submit" className="btn-primary">
          {product ? "Guardar cambios" : "Crear producto"}
        </button>
      </div>
    </form>
  );
}

export default ProductForm;
