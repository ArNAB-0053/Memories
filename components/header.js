"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useUser, SignInButton, SignedOut, UserButton } from "@clerk/nextjs";
import Logo from "./logo";

export default function Header() {
  const { isSignedIn, user } = useUser();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur px-6 md:px-8 lg:px-16 xl:px-20">
      <div className="flex items-center justify-between h-16">
        <Logo/>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center space-x-6">
          <nav className="flex items-center space-x-6">
            <Link
              href="/"
              className="text-sm font-medium text-gray-900 hover:text-gray-600 transition"
            >
              Home
            </Link>
            <Link
              href="/upload"
              className="text-sm font-medium text-gray-900 hover:text-gray-600 transition"
            >
              Upload
            </Link>
            {isSignedIn && (
              <Link
                href={`/@${user.username}`}
                className="text-sm font-medium text-gray-900 hover:text-gray-600 transition"
              >
                My Profile
              </Link>
            )}
          </nav>

          {/* UserButton / SignIn Button */}
          {isSignedIn ? (
            <UserButton afterSignOutUrl="/" />
          ) : (
            <SignedOut>
              <SignInButton afterSignInUrl="/">
                <Button variant="outline" className="rounded-full transition">
                  Sign In
                </Button>
              </SignInButton>
            </SignedOut>
          )}
        </div>

        {/* Mobile Menu (UserButton + Hamburger) */}
        <div className="flex md:hidden items-center space-x-2">
          {isSignedIn && <UserButton afterSignOutUrl="/" />}
          <button
            className="text-gray-900 hover:text-gray-600"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Navigation */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-t">
          <div className="container mx-auto px-4 py-4 flex flex-col space-y-4">
            <Link
              href="/"
              className="text-sm font-medium text-gray-900 hover:text-gray-600 transition"
              onClick={() => setMobileMenuOpen(false)}
            >
              Home
            </Link>
            <Link
              href="/upload"
              className="text-sm font-medium text-gray-900 hover:text-gray-600 transition"
              onClick={() => setMobileMenuOpen(false)}
            >
              Upload
            </Link>
            {isSignedIn && (
              <Link
                href={`/@${user.username}`}
                className="text-sm font-medium text-gray-900 hover:text-gray-600 transition"
                onClick={() => setMobileMenuOpen(false)}
              >
                My Profile
              </Link>
            )}
            {!isSignedIn && (
              <SignedOut>
                <SignInButton afterSignInUrl="/">
                  <Button
                    variant="outline"
                    className="border-gray-300 text-gray-900 hover:bg-gray-200 transition px-5 py-2 rounded-full w-full text-left"
                  >
                    Sign In
                  </Button>
                </SignInButton>
              </SignedOut>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
