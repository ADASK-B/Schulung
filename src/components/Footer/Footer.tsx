import './Footer.css';

export function Footer(): React.JSX.Element {
  const currentYear = new Date().getFullYear();

  return (
    <footer id="contact" className="footer">
      <div className="footer-container">
        <div className="footer-brand">
          <span className="footer-logo">TRUMPF</span>
          <p className="footer-tagline">
            Technology with a passion for perfection.
          </p>
        </div>
        <address className="footer-contact">
          <h3 className="footer-heading">Contact</h3>
          <p>TRUMPF GmbH + Co. KG</p>
          <p>Johann-Maus-Straße 2</p>
          <p>71254 Ditzingen, Germany</p>
        </address>
        <div className="footer-bottom">
          <p>
            &copy; {currentYear} TRUMPF. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
