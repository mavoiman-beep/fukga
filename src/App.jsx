import React from 'react';
import ListaVentas from './components/ListaVentas';
import FormularioVenta from './components/FormularioVenta';
import './App.css';

function App() {
  return (
    <div className="app-shell">
      <header className="topbar">
        <a className="brand" href="/" aria-label="Cafecito Escolar, inicio">
          <span className="brand-mark" aria-hidden="true">☕</span>
          <span className="brand-copy">
            <strong>Cafecito</strong>
            <span>Escolar</span>
          </span>
        </a>
        <div className="topbar-note">
          <span className="open-indicator" aria-hidden="true" />
          Un espacio para compartir
        </div>
      </header>

      <main>
        <section className="welcome" aria-labelledby="welcome-title">
          <div className="welcome-copy">
            <p className="eyebrow">Nuestra cafetería</p>
            <h1 id="welcome-title">Un recreo con<br />buen sabor.</h1>
            <p className="welcome-description">
              Registra las ventas del día y mantén todo listo para el próximo descanso.
            </p>
          </div>
          <div className="welcome-cup" aria-hidden="true">☕</div>
        </section>

        <div className="dashboard-grid">
          <section className="surface sale-form-card">
            <FormularioVenta />
          </section>
          <section className="surface sales-card">
            <ListaVentas />
          </section>
        </div>
      </main>

      <footer className="footer-note">Hecho con cariño para la comunidad escolar</footer>
    </div>
  );
}

export default App;