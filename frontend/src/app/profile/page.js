// app/profile/page.js
import { redirect } from 'next/navigation';
export default function ProfileRedirect() {
  redirect('/dashboard');
}
