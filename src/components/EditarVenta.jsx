import React, { useState, useEffect } from 'react';
import { api, getApiErrorMessage } from '../api';

const formatFechaForInput = (isoString) => {
  if (!isoString) return '';
  return String(isoString).split('T')[0];
};

function EditarVenta({ venta, onUpdate, onCancel }) {
  const [form, setForm] = useState({ ...venta, fecha: formatFechaForInput(venta.fecha) });
  const [estudiantes, setEstudiantes] = useState([]);
  const [productos, setProductos] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    api.get('/estudiantes').then(res => setEstudiantes(res.data)).catch(err => setError(getApiErrorMessage(err)));
    api.get('/productos').then(res => setProductos(res.data)).catch(err => setError(getApiErrorMessage(err)));
  }, []);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });
  const handleProductoChange = (e) => {
    const productoNombre = e.target.value;
    const productoEncontrado = productos.find(p => (p.nombre || p) === productoNombre);
    setForm({ ...form, producto: productoNombre, precio: productoEncontrado ? (productoEncontrado.precio || 0) : 0 });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const estudiante = estudiantes.find(item => item.nombre === form.estudiante);
    const producto = productos.find(item => item.nombre === form.producto);
    if (!estudiante || !producto) { alert('Seleccione un estudiante y un producto válidos'); return; }
    const ventaActualizada = { estudiante_id: estudiante.id, producto_id: producto.id, cantidad: form.cantidad, fecha: form.fecha };
    api.put('/ventas/' + venta.id, ventaActualizada).then(() => { alert('Venta actualizada correctamente'); onUpdate(); }).catch(err => setError(getApiErrorMessage(err)));
  };

  const totalCalculado = (Number(form.cantidad) || 0) * (Number(form.precio) || 0);
  return (
    <tr>
      <td>{error && <p role="alert">{error}</p>}<select name="estudiante" value={form.estudiante || ''} onChange={handleChange}><option value="">Seleccione estudiante</option>{estudiantes.map(e => { const nombreEst = typeof e === 'object' ? e.nombre : e; return <option key={e.id || nombreEst} value={nombreEst}>{nombreEst}</option>; })}</select></td>
      <td><select name="producto" value={form.producto || ''} onChange={handleProductoChange}><option value="">Seleccione producto</option>{productos.map(p => { const nombreProd = typeof p === 'object' ? p.nombre : p; const precioProd = typeof p === 'object' ? p.precio : 0; return <option key={p.id || nombreProd} value={nombreProd}>{nombreProd} - {'$'}{Number(precioProd).toFixed(2)}</option>; })}</select></td>
      <td><input type="number" name="cantidad" value={form.cantidad || ''} onChange={handleChange} /></td>
      <td>{'$'}{Number(form.precio || 0).toFixed(2)}</td><td>{'$'}{totalCalculado.toFixed(2)}</td>
      <td><input type="date" name="fecha" value={form.fecha || ''} onChange={handleChange} /></td>
      <td><button type="button" onClick={handleSubmit}>Actualizar Venta</button><button type="button" onClick={onCancel}>Cancelar</button></td>
    </tr>
  );
}

export default EditarVenta;
