import Navbar from "@/components/Navbar/Navbar";
import Footer from "@/components/Footer/Footer";
import ListeJardins from "./index";


export default function Jardins() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow pt-20 pb-16">
        {/* <h1 className="text-center text-3xl font-bold">Jardins</h1> */}
        <ListeJardins/>
      </main>
      <Footer />
    </div>
  );
}
