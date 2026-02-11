import './Header.css';

export function Header(): React.JSX.Element {
  return (
    <header className="header">
      <div className="header-container">
        <a href="/" className="header-logo" aria-label="TRUMPF Home">
          <span className="header-logo-text">TRUMPF</span>
        </a>
        <nav aria-label="Main navigation">
          <ul className="header-nav">
            <li><a href="#features">Solutions</a></li>
            <li><a href="#about">About</a></li>
            <li><a href="#contact">Contact</a></li>
          </ul>
        </nav>
      </div>
    </header>
  );
}
