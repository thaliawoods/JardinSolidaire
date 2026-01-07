import { Suspense } from 'react';
import NewBookingClient from './NewBookingClient';

export default function NewBookingPage() {
  return (
    <Suspense fallback={null}>
      <NewBookingClient />
    </Suspense>
  );
}
