import GardenerClient from './GardenerClient';

export default function Page({ params }) {
  return <GardenerClient id={params?.id} />;
}
