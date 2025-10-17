import Navbar from '@/components/Navbar/Navbar';
import Footer from '@/components/Footer/Footer';
import GardensList from './index'; 

export default function GardensPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-grow pt-20 pb-16">
        <GardensList />
      </main>
    </div>
  );
}
