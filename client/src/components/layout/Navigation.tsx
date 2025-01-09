import { FC } from 'react';
import { useLocation, Link } from 'wouter';
import { Home, Search, User } from 'lucide-react';

export const Navigation: FC = () => {
  const [location] = useLocation();

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-background border-t">
      <nav className="flex justify-around p-4">
        <Link href="/">
          <a className={`${location === '/' ? 'text-primary' : 'text-muted-foreground'}`}>
            <Home className="h-6 w-6" />
          </a>
        </Link>
        <Link href="/search">
          <a className={`${location === '/search' ? 'text-primary' : 'text-muted-foreground'}`}>
            <Search className="h-6 w-6" />
          </a>
        </Link>
        <Link href="/profile">
          <a className={`${location === '/profile' ? 'text-primary' : 'text-muted-foreground'}`}>
            <User className="h-6 w-6" />
          </a>
        </Link>
      </nav>
    </div>
  );
};
