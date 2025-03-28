import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow pt-20 pb-16">
        <h1>Bienvenue sur JardinSolidaire</h1>
        <p>Ceci est la page d&apos;accueil de votre site.</p>
      </main>
      <Footer />
    </div>
  );
}
