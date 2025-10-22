import { Suspense } from 'react';
import MyGardensClient from './MyGardensClient';

export const dynamic = 'force-dynamic';

export default function Page() {
  return (
    <Suspense fallback={<div className="p-6">chargement…</div>}>
      <MyGardensClient />
    </Suspense>
  );
}
