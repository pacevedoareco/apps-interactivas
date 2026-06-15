import "./Footer.css";

function Footer() {
  return (
    <footer className="footer">
      <div className="footer__contenido">
        <div className="footer__bloque">
          <h3 className="footer__marca">Mercado Exclusivo</h3>
          <p className="footer__eslogan">Donde lo exclusivo encuentra dueño</p>
        </div>

        <div className="footer__bloque">
          <h4 className="footer__titulo">Envíos</h4>
          <p>Garantía Premier de Envíos. Despachos por JetPriority dentro de las 24hs de confirmada la compra.</p>
        </div>

        <div className="footer__bloque">
          <h4 className="footer__titulo">Autenticidad</h4>
          <p>Todos los productos publicados son verificados antes de su publicación.</p>
        </div>

        <div className="footer__bloque">
          <h4 className="footer__titulo">Contacto</h4>
          <p>¿Problemas con tu pedido?</p>
          <p>contacto@mercadoexclusivo.com</p>
        </div>
      </div>

      <div className="footer__linea">
        <p>© 2026 Mercado Exclusivo</p>
      </div>
    </footer>
  );
}

export default Footer;