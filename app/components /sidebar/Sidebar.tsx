import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { LayoutDashboard, Users, Settings, LogOut, ChevronLeft, ChevronRight } from 'lucide-react';
import styles from './Sidebar.module.css';
import { supabase } from 'app/pages/signup';

const navItems = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/students', label: 'Students', icon: Users },
  { href: '/settings', label: 'Settings', icon: Settings },
];

export default function Sidebar() {
  const router = useRouter();
  const [collapsed, setCollapsed] = useState(false);

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error('Logout failed:', error.message);
      return;
    }
    router.push('/login');
  };

  return (
    <aside className={`${styles.sidebar} ${collapsed ? styles.collapsed : ''}`}>
      <div>
        <div className={styles.header}>
          <div className={styles.logo}>
            {collapsed ? 'P' : 'Pathway AI'}
          </div>
          <button
            onClick={() => setCollapsed(!collapsed)}
            className={styles.toggleBtn}
            aria-label="Toggle sidebar"
          >
            {collapsed ? (
              <ChevronRight className={styles.arrow} size={16} />
            ) : (
              <ChevronLeft className={styles.arrow} size={16} />
            )}
          </button>
        </div>

        <div className={styles.profile}>
          <img
            src="/avatar.png"
            alt="Profile"
            className={styles.avatar}
          />
          {!collapsed && <div className={styles.name}>Ms. Johnson</div>}
        </div>

        <nav className={styles.nav}>
          {navItems.map(({ href, label, icon: IconComponent }) => (
            <Link
              key={href}
              href={href}
              className={`${styles.link} ${router.pathname === href ? styles.active : ''}`}
              title={collapsed ? label : undefined}
            >
              <IconComponent className={styles.icon} size={20} />
              {!collapsed && <span className={styles.label}>{label}</span>}
            </Link>
          ))}
        </nav>
      </div>

      <div className={styles.footer}>
        <button 
          onClick={handleLogout} 
          className={styles.link}
          title={collapsed ? 'Log out' : undefined}
        >
          <LogOut className={styles.icon} size={20} />
          {!collapsed && <span className={styles.label}>Log out</span>}
        </button>
      </div>
    </aside>
  );
}