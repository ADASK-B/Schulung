import { Header } from './components/Header/Header';
import { Hero } from './components/Hero/Hero';
import { Features } from './components/Features/Features';
import { Footer } from './components/Footer/Footer';

export function App(): React.JSX.Element {
  return (
    <>
      <Header />
      <main>
        <Hero />
        <Features />
      </main>
      <Footer />
    </>
  );
}
