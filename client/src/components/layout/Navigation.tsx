import { FC } from 'react';
import { useLocation } from 'wouter';
import { Home, Search, User } from 'lucide-react';

export const Navigation: FC = () => {
  const [location, setLocation] = useLocation();

  const navItems = [
    { href: "/", icon: Home },
    { href: "/search", icon: Search },
    { href: "/profile", icon: User }
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-background border-t z-40">
      <nav className="flex justify-around p-4 max-w-md mx-auto">
        {navItems.map(({ href, icon: Icon }) => (
          <button
            key={href}
            onClick={() => setLocation(href)}
            className={`cursor-pointer ${location === href ? 'text-primary' : 'text-muted-foreground'}`}
          >
            <Icon className="h-6 w-6" />
          </button>
        ))}
      </nav>
    </div>
  );
};