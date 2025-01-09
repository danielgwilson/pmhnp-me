import { FC } from 'react';
import { useLocation, Link } from 'wouter';
import { Home, Search, User } from 'lucide-react';

export const Navigation: FC = () => {
  const [location] = useLocation();

  const navItems = [
    { href: "/", icon: Home },
    { href: "/search", icon: Search },
    { href: "/profile", icon: User }
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-background border-t">
      <nav className="flex justify-around p-4 max-w-md mx-auto">
        {navItems.map(({ href, icon: Icon }) => (
          <Link key={href} href={href}>
            <a className={`cursor-pointer ${location === href ? 'text-primary' : 'text-muted-foreground'}`}>
              <Icon className="h-6 w-6" />
            </a>
          </Link>
        ))}
      </nav>
    </div>
  );
};