import React, { useEffect, useState } from 'react';
import { api, getApiErrorMessage } from '../api';
import EditarVenta from './EditarVenta';

function ListaVentas() {
  const [ventas, setVentas] = useState([]);
  const [ventaSeleccionada, setVentaSeleccionada] = useState(null);
  const [error, setError] = useState('');

  const cargarVentas = () => {
    api.get('/ventas').then(res => { setVentas(res.data); setError(''); }).catch(err => setError(getApiErrorMessage(err)));
  };
  useEffect(() => { cargarVentas(); }, []);

  const eliminarVenta = (id) => {
    if (window.confirm('¿Seguro que deseas eliminar esta venta?')) {
      api.delete('/ventas/' + id).then(res => { alert(typeof res.data === 'string' ? res.data : res.data.message); cargarVentas(); }).catch(err => setError(getApiErrorMessage(err)));
    }
  };

  return (
    <div>
      <h2>Ventas de la Cafetería</h2>
      {error && <p role="alert">{error}</p>}
      <table border="1">
        <thead><tr><th>Estudiante</th><th>Producto</th><th>Cantidad</th><th>Precio</th><th>Total</th><th>Fecha</th><th>Acciones</th></tr></thead>
        <tbody>
          {ventas.length === 0 && !error && <tr><td colSpan="7">No hay ventas registradas.</td></tr>}
          {ventas.map(v => ventaSeleccionada && ventaSeleccionada.id === v.id ? (
            <EditarVenta key={v.id} venta={ventaSeleccionada} onUpdate={() => { cargarVentas(); setVentaSeleccionada(null); }} onCancel={() => setVentaSeleccionada(null)} />
          ) : (
            <tr key={v.id}><td>{v.estudiante}</td><td>{v.producto}</td><td>{v.cantidad}</td><td>{'$'}{v.precio}</td><td>{'$'}{v.total}</td><td>{v.fecha}</td><td><button onClick={() => setVentaSeleccionada(v)}>Editar</button><button onClick={() => eliminarVenta(v.id)}>Eliminar</button></td></tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default ListaVentas;
