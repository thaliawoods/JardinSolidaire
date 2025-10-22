import { Suspense } from 'react';
import EditGardenClient from './EditGardenClient';

export const dynamic = 'force-dynamic';

export default function Page() {
  return (
    <Suspense fallback={<div className="p-6">chargement…</div>}>
      <EditGardenClient />
    </Suspense>
  );
}
