// src/app/page.js – redireciona para /login
import { redirect } from 'next/navigation';
export default function Home() {
  redirect('/login');
}
