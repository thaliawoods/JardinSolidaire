import GardenerClient from './GardenerClient';

export default function Page({ params }) {
  console.log('SERVER params:', params);
  return <GardenerClient id={params?.id} />;
}
