import { Link, useNavigate } from 'react-router-dom';
import { Menu, X, ShoppingBag, User, LogOut, LayoutDashboard, Laptop, Backpack, Mail, Plane, Gift } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { useQuoteCart } from '@/contexts/QuoteCartContext';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from '@/components/ui/navigation-menu';
import { cn } from '@/lib/utils';

const productCategories = [
  { name: 'Laptop Bags', slug: 'laptop-bags', icon: Laptop, description: 'Professional bags for laptops' },
  { name: 'Backpacks', slug: 'backpacks', icon: Backpack, description: 'Ergonomic corporate backpacks' },
  { name: 'Sling / Messenger Bags', slug: 'messenger-bags', icon: Mail, description: 'Stylish messenger bags' },
  { name: 'Travel / Trolley Bags', slug: 'travel-bags', icon: Plane, description: 'Premium travel solutions' },
  { name: 'Custom / Promotional Bags', slug: 'promotional', icon: Gift, description: 'Branded promotional bags' },
];

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user, profile, isAdmin, signOut } = useAuth();
  const { totalItems } = useQuoteCart();
  const navigate = useNavigate();

  const navLinks = [
    { name: 'Home', href: '/' },
    { name: 'About', href: '/about' },
    { name: 'Contact', href: '/contact' },
  ];

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container-corporate">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-md bg-primary">
              <span className="text-lg font-bold text-primary-foreground">R</span>
            </div>
            <div className="hidden sm:block">
              <span className="text-lg font-semibold text-foreground">Rolex Enterprises</span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-6">
            <Link
              to="/"
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              Home
            </Link>
            
            {/* Products Dropdown - NavigationMenu for hover */}
            <NavigationMenu>
              <NavigationMenuList>
                <NavigationMenuItem>
                  <NavigationMenuTrigger className="bg-transparent text-sm font-medium text-muted-foreground hover:text-foreground data-[state=open]:text-foreground h-auto px-0 py-0">
                    Products
                  </NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px]">
                      <li className="col-span-2">
                        <NavigationMenuLink asChild>
                          <Link
                            to="/products"
                            className="flex items-center gap-3 select-none rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground group"
                          >
                            <div className="p-2 rounded-md bg-primary/10 transition-all duration-200 group-hover:bg-primary group-hover:scale-110">
                              <ShoppingBag className="h-5 w-5 text-primary transition-colors group-hover:text-primary-foreground" />
                            </div>
                            <div>
                              <div className="text-sm font-medium leading-none">All Products</div>
                              <p className="line-clamp-1 text-sm leading-snug text-muted-foreground mt-1">
                                Browse our complete catalog
                              </p>
                            </div>
                          </Link>
                        </NavigationMenuLink>
                      </li>
                      {productCategories.map((category) => (
                        <li key={category.slug}>
                          <NavigationMenuLink asChild>
                            <Link
                              to={`/products?category=${category.slug}`}
                              className="flex items-center gap-3 select-none rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground group"
                            >
                              <div className="p-2 rounded-md bg-primary/10 transition-all duration-200 group-hover:bg-primary group-hover:scale-110">
                                <category.icon className="h-4 w-4 text-primary transition-colors group-hover:text-primary-foreground" />
                              </div>
                              <div>
                                <div className="text-sm font-medium leading-none">{category.name}</div>
                                <p className="line-clamp-1 text-xs leading-snug text-muted-foreground mt-1">
                                  {category.description}
                                </p>
                              </div>
                            </Link>
                          </NavigationMenuLink>
                        </li>
                      ))}
                    </ul>
                  </NavigationMenuContent>
                </NavigationMenuItem>
              </NavigationMenuList>
            </NavigationMenu>

            {navLinks.slice(1).map((link) => (
              <Link
                key={link.name}
                to={link.href}
                className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
              >
                {link.name}
              </Link>
            ))}
          </nav>

          {/* Right side actions */}
          <div className="flex items-center gap-4">
            {/* Quote Cart */}
            <Link to="/quote-cart" className="relative">
              <Button variant="ghost" size="icon" className="relative">
                <ShoppingBag className="h-5 w-5" />
                {totalItems > 0 && (
                  <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-accent text-accent-foreground text-xs flex items-center justify-center font-medium">
                    {totalItems > 99 ? '99+' : totalItems}
                  </span>
                )}
              </Button>
            </Link>

            {/* User Menu */}
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <User className="h-5 w-5" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <div className="px-2 py-1.5">
                    <p className="text-sm font-medium">{profile?.name || 'User'}</p>
                    <p className="text-xs text-muted-foreground">{profile?.phone}</p>
                  </div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link to="/dashboard" className="flex items-center">
                      <LayoutDashboard className="mr-2 h-4 w-4" />
                      Dashboard
                    </Link>
                  </DropdownMenuItem>
                  {isAdmin && (
                    <DropdownMenuItem asChild>
                      <Link to="/admin" className="flex items-center">
                        <LayoutDashboard className="mr-2 h-4 w-4" />
                        Admin Panel
                      </Link>
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleSignOut}>
                    <LogOut className="mr-2 h-4 w-4" />
                    Sign Out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <div className="hidden sm:flex items-center gap-2">
                <Button variant="ghost" asChild>
                  <Link to="/login">Sign In</Link>
                </Button>
                <Button asChild>
                  <Link to="/signup">Get Started</Link>
                </Button>
              </div>
            )}

            {/* Mobile menu button */}
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t py-4">
            <nav className="flex flex-col gap-2">
              <Link
                to="/"
                className="px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted rounded-md transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                Home
              </Link>
              <div className="px-4 py-2">
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Products</p>
                <div className="flex flex-col gap-1 pl-2">
                  <Link
                    to="/products"
                    className="flex items-center gap-2 py-1.5 text-sm text-muted-foreground hover:text-foreground"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <ShoppingBag className="h-4 w-4" />
                    All Products
                  </Link>
                  {productCategories.map((category) => (
                    <Link
                      key={category.slug}
                      to={`/products?category=${category.slug}`}
                      className="flex items-center gap-2 py-1.5 text-sm text-muted-foreground hover:text-foreground"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <category.icon className="h-4 w-4" />
                      {category.name}
                    </Link>
                  ))}
                </div>
              </div>
              {navLinks.slice(1).map((link) => (
                <Link
                  key={link.name}
                  to={link.href}
                  className="px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted rounded-md transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {link.name}
                </Link>
              ))}
              {!user && (
                <>
                  <Link
                    to="/login"
                    className="px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted rounded-md transition-colors"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Sign In
                  </Link>
                  <Link
                    to="/signup"
                    className="px-4 py-2 text-sm font-medium bg-primary text-primary-foreground rounded-md text-center"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Get Started
                  </Link>
                </>
              )}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
