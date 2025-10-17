import Navbar from '@/components/Navbar/Navbar';
import Footer from '@/components/Footer/Footer';
import GardenersList from './index';

export default function GardenersPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-grow pt-20 pb-16">
        <h1 className="text-center text-3xl font-bold">Jardiniers</h1>
        <GardenersList />
      </main>
    </div>
  );
}
