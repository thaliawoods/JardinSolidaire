import GardenerClient from './GardenerClient';

export default async function Page({ params }) {
  const { id } = await params;
  return <GardenerClient id={id} />;
}
