'use client';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAuthStore } from '@/lib/store';
import {
  MdDashboard, MdPeople, MdBuild, MdDescription,
  MdAddCircle, MdLogout
} from 'react-icons/md';

const navItems = [
  { label: 'Dashboard',    href: '/dashboard',         icon: <MdDashboard /> },
  { label: 'Clientes',     href: '/clientes',          icon: <MdPeople /> },
  { label: 'Serviços',     href: '/servicos',          icon: <MdBuild /> },
  { label: 'Orçamentos',   href: '/orcamentos',        icon: <MdDescription /> },
  { label: 'Novo Orçamento', href: '/orcamentos/novo', icon: <MdAddCircle /> },
];

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useAuthStore();

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  const initial = user?.name?.[0] ?? 'A';

  return (
    <aside className="sidebar">
      <div className="sidebar-logo">
        <div className="logo-icon">WS</div>
        <h2>WS Solutions</h2>
        <p>Sistema de Orçamentos</p>
      </div>

      <nav className="sidebar-nav">
        <p className="nav-group-title">Menu Principal</p>
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={`nav-item ${pathname.startsWith(item.href) ? 'active' : ''}`}
          >
            <span className="nav-icon">{item.icon}</span>
            {item.label}
          </Link>
        ))}
      </nav>

      <div className="sidebar-footer">
        <div className="sidebar-user">
          <div className="avatar">{initial}</div>
          <div className="user-info">
            <div className="user-name">{user?.name ?? 'Administrador'}</div>
            <div className="user-role">Admin</div>
          </div>
        </div>
        <button className="btn-logout" onClick={handleLogout}>
          <MdLogout /> Sair do sistema
        </button>
      </div>
    </aside>
  );
}
