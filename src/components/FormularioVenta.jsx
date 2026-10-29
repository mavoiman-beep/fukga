import React, { useState, useEffect } from 'react';
import { api, getApiErrorMessage } from '../api';

function FormularioVenta() {
  const [formData, setFormData] = useState({
    estudiante_id: '',
    producto_id: '',
    cantidad: '',
    fecha: ''
  });
  const [estudiantes, setEstudiantes] = useState([]);
  const [productos, setProductos] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    api.get('/estudiantes')
      .then(res => setEstudiantes(res.data))
      .catch(err => setError(getApiErrorMessage(err)));
    api.get('/productos')
      .then(res => setProductos(res.data))
      .catch(err => setError(getApiErrorMessage(err)));
  }, []);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    api.post('/ventas', formData)
      .then(res => {
        alert(typeof res.data === 'string' ? res.data : res.data.message);
        setError('');
        setFormData({ estudiante_id: '', producto_id: '', cantidad: '', fecha: '' });
      })
      .catch(err => setError(getApiErrorMessage(err)));
  };

  return (
    <>
      <div className="surface-heading">
        <div>
          <p className="surface-kicker">Pedido del día</p>
          <h2>Registrar venta</h2>
          <p className="surface-subtitle">Unos datos y queda listo.</p>
        </div>
        <span className="sales-count" aria-hidden="true">+</span>
      </div>
      {error && <p className="form-error" role="alert">{error}</p>}
      <form className="sale-form" onSubmit={handleSubmit}>
        <label className="field">
          Estudiante
          <select className="field-control" name="estudiante_id" value={formData.estudiante_id} onChange={handleChange} required>
            <option value="">Selecciona estudiante</option>
            {estudiantes.map(e => (
              <option key={e.id} value={e.id}>{e.nombre} - {e.grupo}</option>
            ))}
          </select>
        </label>
        <label className="field">
          Producto
          <select className="field-control" name="producto_id" value={formData.producto_id} onChange={handleChange} required>
            <option value="">¿Qué pidió?</option>
            {productos.map(p => (
              <option key={p.id} value={p.id}>{p.nombre} - ${p.precio}</option>
            ))}
          </select>
        </label>
        <label className="field">
          Cantidad
          <input className="field-control" type="number" name="cantidad" placeholder="Ej. 1" min="1" value={formData.cantidad} onChange={handleChange} required />
        </label>
        <label className="field">
          Fecha de venta
          <input className="field-control" type="date" name="fecha" value={formData.fecha} onChange={handleChange} required />
        </label>
        <button className="primary-button" type="submit">
          <span aria-hidden="true">＋</span> Registrar venta
        </button>
      </form>
    </>
  );
}

export default FormularioVenta;