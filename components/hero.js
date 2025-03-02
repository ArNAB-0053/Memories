"use client";

import { useUser } from "@clerk/nextjs";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import MasonryGrid from "./masonry-grid";

export default function Hero() {
  const { isSignedIn, user } = useUser();

  return (
    <main className="px-6 md:px-8 lg:px-16 xl:px-20 py-8 ">
      <section className="mb-12 text-center">
        <h1 className="text-4xl md:text-5xl font-bold mb-4">Share Your World</h1>
        <p className="text-xl text-muted-foreground mb-8">
        Capture moments, cherish memories, and let your stories shine forever.
        </p>

        <div className="flex flex-wrap justify-center gap-4">
          {!isSignedIn ? (
            <>
              <Link href="/sign-in">
                <Button size="lg" variant="default">
                  Sign In
                </Button>
              </Link>
              <Link href="/sign-up">
                <Button size="lg" variant="outline">
                  Create Account
                </Button>
              </Link>
            </>
          ) : (
            <Link href={`/@${user.username}`}>
              <Button size="lg" variant="default">
                My Profile
              </Button>
            </Link>
          )}
        </div>
      </section>

      <section>
        <h2 className="text-2xl font-semibold mb-6">Discover Images</h2>
        <MasonryGrid />
      </section>
    </main>
  );
}