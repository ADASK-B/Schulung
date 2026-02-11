import './Hero.css';

export function Hero(): React.JSX.Element {
  return (
    <section className="hero" aria-label="Welcome banner">
      <div className="hero-container">
        <h1 className="hero-title">
          Shaping the Future of Manufacturing
        </h1>
        <p className="hero-subtitle">
          TRUMPF is a global technology leader in machine tools,
          laser technology, and electronics for industrial applications.
        </p>
        <a href="#features" className="hero-cta">
          Discover Our Solutions
        </a>
      </div>
    </section>
  );
}
