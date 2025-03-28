import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import HomeImage from "@/components/HomeImage";
import HomeText from "@/components/HomeText";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow pt-20 pb-16">
        <HomeImage />
        <HomeText />
      </main>
      <Footer />
    </div>
  );
}
