import { Suspense } from 'react';
import BookingsClient from './BookingsClient';

export default function BookingsPage() {
  return (
    <Suspense fallback={null}>
      <BookingsClient />
    </Suspense>
  );
}
