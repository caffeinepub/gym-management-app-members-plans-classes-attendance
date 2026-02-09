import { Outlet, useNavigate, useRouterState } from '@tanstack/react-router';
import { Dumbbell, Users, CreditCard, Calendar, Settings, LayoutDashboard } from 'lucide-react';
import LoginButton from '../auth/LoginButton';
import { useIsCallerAdmin } from '../../hooks/useCurrentUser';
import { Button } from '@/components/ui/button';
import { SiFacebook, SiX, SiInstagram } from 'react-icons/si';

export default function AppShell() {
  const navigate = useNavigate();
  const routerState = useRouterState();
  const currentPath = routerState.location.pathname;
  const { data: isAdmin } = useIsCallerAdmin();

  const navItems = [
    { path: '/', label: 'Dashboard', icon: LayoutDashboard },
    { path: '/members', label: 'Members', icon: Users },
    { path: '/plans', label: 'Plans', icon: CreditCard },
    { path: '/classes', label: 'Classes', icon: Calendar },
    { path: '/settings', label: 'Settings', icon: Settings, adminOnly: true },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <header className="sticky top-0 z-50 w-full border-b bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/60">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-8">
            <button onClick={() => navigate({ to: '/' })} className="flex items-center gap-2 font-bold text-xl">
              <Dumbbell className="h-6 w-6 text-primary" />
              <span>GymFlow</span>
            </button>
            <nav className="hidden md:flex items-center gap-1">
              {navItems.map((item) => {
                if (item.adminOnly && !isAdmin) return null;
                const Icon = item.icon;
                const isActive = currentPath === item.path;
                return (
                  <Button
                    key={item.path}
                    variant={isActive ? 'secondary' : 'ghost'}
                    onClick={() => navigate({ to: item.path })}
                    className="gap-2"
                  >
                    <Icon className="h-4 w-4" />
                    {item.label}
                  </Button>
                );
              })}
            </nav>
          </div>
          <LoginButton />
        </div>
      </header>

      <main className="flex-1 container py-8">
        <Outlet />
      </main>

      <footer className="border-t bg-card/50 py-8 mt-auto">
        <div className="container">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <div className="flex items-center gap-2 font-bold text-lg mb-3">
                <Dumbbell className="h-5 w-5 text-primary" />
                <span>GymFlow</span>
              </div>
              <p className="text-sm text-muted-foreground">
                Modern gym management made simple. Track members, classes, and attendance all in one place.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-3">Quick Links</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <button onClick={() => navigate({ to: '/' })} className="hover:text-foreground transition-colors">
                    Dashboard
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => navigate({ to: '/members' })}
                    className="hover:text-foreground transition-colors"
                  >
                    Members
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => navigate({ to: '/classes' })}
                    className="hover:text-foreground transition-colors"
                  >
                    Classes
                  </button>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-3">Connect</h3>
              <div className="flex gap-3">
                <a
                  href="#"
                  className="h-9 w-9 rounded-full bg-muted flex items-center justify-center hover:bg-muted/80 transition-colors"
                  aria-label="Facebook"
                >
                  <SiFacebook className="h-4 w-4" />
                </a>
                <a
                  href="#"
                  className="h-9 w-9 rounded-full bg-muted flex items-center justify-center hover:bg-muted/80 transition-colors"
                  aria-label="X (Twitter)"
                >
                  <SiX className="h-4 w-4" />
                </a>
                <a
                  href="#"
                  className="h-9 w-9 rounded-full bg-muted flex items-center justify-center hover:bg-muted/80 transition-colors"
                  aria-label="Instagram"
                >
                  <SiInstagram className="h-4 w-4" />
                </a>
              </div>
            </div>
          </div>
          <div className="mt-8 pt-6 border-t text-center text-sm text-muted-foreground">
            © 2026. Built with ❤️ using{' '}
            <a href="https://caffeine.ai" target="_blank" rel="noopener noreferrer" className="hover:text-foreground">
              caffeine.ai
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
