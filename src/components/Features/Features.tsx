import './Features.css';

interface Feature {
  title: string;
  description: string;
  icon: string;
}

const FEATURES: Feature[] = [
  {
    title: 'Laser Technology',
    description:
      'Industry-leading laser systems for cutting, welding, and ' +
      'marking across a wide range of materials and applications.',
    icon: '⚡',
  },
  {
    title: 'Machine Tools',
    description:
      'High-precision bending, punching, and cutting machines ' +
      'that deliver exceptional quality and efficiency.',
    icon: '⚙️',
  },
  {
    title: 'Smart Factory',
    description:
      'Connected manufacturing solutions that optimize your ' +
      'production with data-driven insights and automation.',
    icon: '🏭',
  },
];

export function Features(): React.JSX.Element {
  return (
    <section id="features" className="features" aria-label="Our solutions">
      <div className="features-container">
        <h2 className="features-heading">Our Solutions</h2>
        <div className="features-grid">
          {FEATURES.map((feature) => (
            <article key={feature.title} className="feature-card">
              <span className="feature-icon" aria-hidden="true">
                {feature.icon}
              </span>
              <h3 className="feature-title">{feature.title}</h3>
              <p className="feature-description">{feature.description}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
