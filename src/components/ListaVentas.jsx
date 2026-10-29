import React, { useEffect, useState } from 'react';
import { api, getApiErrorMessage } from '../api';
import EditarVenta from './EditarVenta';

function ListaVentas() {
  const [ventas, setVentas] = useState([]);
  const [ventaSeleccionada, setVentaSeleccionada] = useState(null);
  const [error, setError] = useState('');

  const cargarVentas = () => {
    api.get('/ventas')
      .then(res => {
        setVentas(res.data);
        setError('');
      })
      .catch(err => setError(getApiErrorMessage(err)));
  };

  useEffect(() => {
    cargarVentas();
  }, []);

  const eliminarVenta = (id) => {
    if (window.confirm('¿Seguro que deseas eliminar esta venta?')) {
      api.delete(`/ventas/${id}`)
        .then(res => {
          alert(typeof res.data === 'string' ? res.data : res.data.message);
          cargarVentas();
        })
        .catch(err => setError(getApiErrorMessage(err)));
    }
  };

  return (
    <>
      <div className="surface-heading">
        <div>
          <p className="surface-kicker">Lo que va saliendo</p>
          <h2>Ventas recientes</h2>
          <p className="surface-subtitle">Un vistazo a los pedidos de la cafetería.</p>
        </div>
        <span className="sales-count" aria-label={`${ventas.length} ventas`}>{ventas.length}</span>
      </div>
      {error && <p className="form-error" role="alert">{error}</p>}
      <div className="table-scroll">
      <table className="sales-table">
        <thead>
          <tr>
            <th>Estudiante</th>
            <th>Producto</th>
            <th>Cantidad</th>
            <th>Precio</th>
            <th>Total</th>
            <th>Fecha</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {ventas.length === 0 && !error && (
            <tr>
              <td className="empty-state" colSpan="7">
                <span className="empty-icon" aria-hidden="true">☕</span>
                Todavía no hay ventas. ¡Registra la primera!
              </td>
            </tr>
          )}
          {ventas.map(v => (
            ventaSeleccionada && ventaSeleccionada.id === v.id ? (
              <EditarVenta 
                key={v.id} 
                venta={ventaSeleccionada} 
                onUpdate={() => {
                  cargarVentas();
                  setVentaSeleccionada(null);
                }} 
                onCancel={() => setVentaSeleccionada(null)} 
              />
            ) : (
              <tr key={v.id}>
                <td className="student-name">{v.estudiante}</td>
                <td><span className="product-name"><span className="product-dot" aria-hidden="true" />{v.producto}</span></td>
                <td>{v.cantidad}</td>
                <td className="money">${v.precio}</td>
                <td className="money">${v.total}</td>
                <td>{String(v.fecha).split('T')[0]}</td>
                <td>
                  <div className="table-actions">
                    <button className="secondary-button" onClick={() => setVentaSeleccionada(v)}>Editar</button>
                    <button className="danger-button" onClick={() => eliminarVenta(v.id)}>Eliminar</button>
                  </div>
                </td>
              </tr>
            )
          ))}
        </tbody>
      </table>
      </div>
    </>
  );
}

export default ListaVentas;