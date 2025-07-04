import Navbar from "@/components/Navbar/Navbar";
import Footer from "@/components/Footer/Footer";
import ReservationPage from "./index";


export default function Reservation() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow pt-20 pb-16">
        {/* <h1 className="text-center text-3xl font-bold">Jardins</h1> */}
        <ReservationPage/>
      </main>
      <Footer />
    </div>
  );
}
