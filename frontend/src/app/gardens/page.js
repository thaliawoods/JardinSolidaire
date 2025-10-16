import Navbar from '@/components/Navbar/Navbar';
import Footer from '@/components/Footer/Footer';
import GardensList from './index'; 

export default function GardensPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow pt-20 pb-16">
        <h1 className="text-center text-3xl font-bold text-green-800">Gardens</h1>
        <GardensList />
      </main>
      <Footer />
    </div>
  );
}
