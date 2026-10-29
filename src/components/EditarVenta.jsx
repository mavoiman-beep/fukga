import React, { useState, useEffect } from 'react';
import { api, getApiErrorMessage } from '../api';

// Función para transformar la fecha ISO a YYYY-MM-DD
const formatFechaForInput = (isoString) => {
  if (!isoString) return '';
  return String(isoString).split('T')[0];
};

function EditarVenta({ venta, onUpdate, onCancel }) {
  const [form, setForm] = useState({
    ...venta,
    fecha: formatFechaForInput(venta.fecha)
  });

  const [estudiantes, setEstudiantes] = useState([]);
  const [productos, setProductos] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    // Obtener estudiantes
    api.get('/estudiantes')
      .then(res => setEstudiantes(res.data))
      .catch(err => setError(getApiErrorMessage(err)));

    // Obtener productos
    api.get('/productos')
      .then(res => setProductos(res.data))
      .catch(err => setError(getApiErrorMessage(err)));
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleProductoChange = (e) => {
    const productoNombre = e.target.value;
    const productoEncontrado = productos.find(
      (p) => (p.nombre || p) === productoNombre
    );

    const nuevoPrecio = productoEncontrado ? (productoEncontrado.precio || 0) : 0;

    setForm({
      ...form,
      producto: productoNombre,
      precio: nuevoPrecio
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const estudiante = estudiantes.find((item) => item.nombre === form.estudiante);
    const producto = productos.find((item) => item.nombre === form.producto);

    if (!estudiante || !producto) {
      alert('Seleccione un estudiante y un producto válidos');
      return;
    }

    const ventaActualizada = {
      estudiante_id: estudiante.id,
      producto_id: producto.id,
      cantidad: form.cantidad,
      fecha: form.fecha
    };

    api.put(`/ventas/${venta.id}`, ventaActualizada)
      .then(() => {
        alert('Venta actualizada correctamente');
        onUpdate();
      })
      .catch(err => setError(getApiErrorMessage(err)));
  };

  const totalCalculado = (Number(form.cantidad) || 0) * (Number(form.precio) || 0);

  // NOTA: El return debe empezar DIRECTAMENTE con <tr>, sin ningún <div> o <form> envolvente
  return (
    <tr className="edit-row">
      {/* Estudiante */}
      <td>
        {error && <p className="form-error" role="alert">{error}</p>}
        <select 
          className="field-control"
          name="estudiante" 
          value={form.estudiante || ''} 
          onChange={handleChange}
        >
          <option value="">Seleccione estudiante</option>
          {estudiantes.map((e) => {
            const nombreEst = typeof e === 'object' ? e.nombre : e;
            return (
              <option key={e.id || nombreEst} value={nombreEst}>
                {nombreEst}
              </option>
            );
          })}
        </select>
      </td>

      {/* Producto */}
      <td>
        <select 
          className="field-control"
          name="producto" 
          value={form.producto || ''} 
          onChange={handleProductoChange}
        >
          <option value="">Seleccione producto</option>
          {productos.map((p) => {
            const nombreProd = typeof p === 'object' ? p.nombre : p;
            const precioProd = typeof p === 'object' ? p.precio : 0;
            return (
              <option key={p.id || nombreProd} value={nombreProd}>
                {nombreProd} - ${Number(precioProd).toFixed(2)}
              </option>
            );
          })}
        </select>
      </td>

      {/* Cantidad */}
      <td>
        <input 
          className="field-control"
          type="number" 
          name="cantidad" 
          min="1"
          value={form.cantidad || ''} 
          onChange={handleChange} 
        />
      </td>

      {/* Precio */}
      <td className="money">${Number(form.precio || 0).toFixed(2)}</td>

      {/* Total */}
      <td className="money">${totalCalculado.toFixed(2)}</td>

      {/* Fecha */}
      <td>
        <input 
          className="field-control"
          type="date" 
          name="fecha" 
          value={form.fecha || ''} 
          onChange={handleChange} 
        />
      </td>

      {/* Acciones */}
      <td>
        <div className="table-actions">
          <button className="primary-button" type="button" onClick={handleSubmit}>Guardar</button>
          <button className="secondary-button" type="button" onClick={onCancel}>Cancelar</button>
        </div>
      </td>
    </tr>
  );
}

export default EditarVenta;