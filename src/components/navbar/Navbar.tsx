"use client";

import Link from "next/link";
import { usePathname} from "next/navigation";
import Image from "next/image";
import { Menu, User, LogOut,} from "lucide-react";
import logo from "../../../public/logo.png";
import { Button } from "@/components/ui/button";
import { signOut } from "next-auth/react";
import ThemeToggle from "../theme/ThemeToggle";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetClose,
} from "@/components/ui/sheet";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useSession } from "next-auth/react";

const navLinks = [
  { name: "Home", href: "/" },
  { name: "About", href: "/about" },
  { name: "Fruits", href: "/all-fruits" },
  { name: "Vegetables", href: "/vegetables" },
  { name: "Nutrition", href: "/nutrition" },
  { name: "Contact", href: "/contact" },
];

export default function Navbar() {
  const pathname = usePathname();
  const session = useSession();
  const user = session.data?.user;
  console.log("User session:", user);

  const handleLogout = () => {
    signOut({ callbackUrl: "/" });
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 px-2">
      <div className="container flex h-16 items-center justify-between">
        {/* Logo on the left */}
        <Link href="/" className="flex items-center">
          <div className="relative ">
            <Image
              src={logo}
              alt="Nutra Mitra Logo"
              fill
              className="object-contain mix-blend-multiply w-20 h-20"
              priority
            />
          </div>
        </Link>

        {/* Navigation Links in the center */}
        <nav className="hidden md:flex items-center gap-6 mx-auto">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`text-sm font-medium transition-colors hover:text-primary ${
                pathname === link.href
                  ? "text-primary"
                  : "text-muted-foreground"
              }`}
            >
              {link.name}
            </Link>
          ))}
        </nav>

        {/* Right side elements (Theme toggle and profile) */}
        <div className="flex items-center gap-4">
          {/* Search Bar - Only show on fruits or vegetables pages */}
        

          <ThemeToggle />

          {/* Profile dropdown */}
          <div className="hidden md:flex items-center gap-2">
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm" className="gap-2">
                    <User className="h-4 w-4" />
                    <span>{user.name?.split(" ")[0]}</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>My Account</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link href="/profile">Profile</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/settings">Settings</Link>
                  </DropdownMenuItem>
                  {user.role === "admin" && (
                    <DropdownMenuItem asChild>
                      <Link href="/admin-panel">Admin Panel</Link>
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={handleLogout}
                    className="text-red-500"
                  >
                    <LogOut className="h-4 w-4 mr-2" />
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <>
                <Button variant="outline" size="sm" asChild>
                  <Link href="/login">Log In</Link>
                </Button>
                <Button size="sm" asChild>
                  <Link href="/signup">Sign Up</Link>
                </Button>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <Sheet>
            <SheetTrigger asChild className="md:hidden">
              <Button variant="ghost" size="icon" className="h-9 w-9">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[80%] sm:w-[350px]">
              <div className="flex flex-col h-full">
                <div className="px-4 py-6">
                  <Link
                    href="/"
                    className="flex items-center gap-2 mb-8"
                    passHref
                  >
                    <div className="relative h-8 w-8">
                      <Image
                        src="/logo.png"
                        alt="Nutra Mitra Logo"
                        fill
                        className="object-contain"
                        priority
                      />
                    </div>
                    <span className="font-bold">Nutra Mitra</span>
                  </Link>
                  
                  <nav className="flex flex-col gap-4">
                    {navLinks.map((link) => (
                      <SheetClose asChild key={link.href}>
                        <Link
                          href={link.href}
                          className={`text-sm font-medium transition-colors hover:text-primary ${
                            pathname === link.href
                              ? "text-primary"
                              : "text-muted-foreground"
                          }`}
                        >
                          {link.name}
                        </Link>
                      </SheetClose>
                    ))}
                  </nav>
                </div>
                <div className="mt-auto px-4 py-6 border-t">
                  {user ? (
                    <div className="space-y-3">
                      <div className="flex items-center gap-2 mb-4">
                        <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center">
                          <User className="h-5 w-5 text-green-600" />
                        </div>
                        <div>
                          <p className="font-medium">{user.name}</p>
                          <p className="text-sm text-muted-foreground">
                            {user.email}
                          </p>
                        </div>
                      </div>
                      <SheetClose asChild>
                        <Button variant="outline" className="w-full" asChild>
                          <Link href="/profile">Profile</Link>
                        </Button>
                      </SheetClose>
                      {user.role === "admin" && (
                        <SheetClose asChild>
                          <Button className="w-full" asChild>
                            <Link href="/admin-panel">Admin Panel</Link>
                          </Button>
                        </SheetClose>
                      )}
                      <Button
                        variant="destructive"
                        className="w-full"
                        onClick={handleLogout}
                      >
                        <LogOut className="h-4 w-4 mr-2" />
                        Logout
                      </Button>
                    </div>
                  ) : (
                    <div className="flex flex-col gap-3">
                      <SheetClose asChild>
                        <Button variant="outline" className="w-full" asChild>
                          <Link href="/login">Log In</Link>
                        </Button>
                      </SheetClose>
                      <SheetClose asChild>
                        <Button className="w-full" asChild>
                          <Link href="/signup">Sign Up</Link>
                        </Button>
                      </SheetClose>
                    </div>
                  )}
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}