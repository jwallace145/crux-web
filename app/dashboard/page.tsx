"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useAuth } from "@/contexts/auth-context";

export default function DashboardPage() {
  const { user, logout, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // Redirect to signin if not authenticated
    if (!isLoading && !user) {
      router.push("/signin");
    }
  }, [user, isLoading, router]);

  const handleLogout = async () => {
    await logout();
    router.push("/");
  };

  // Show loading state while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-secondary-600">Loading...</div>
      </div>
    );
  }

  // If not loading but no user, show loading while redirect happens
  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-secondary-600">Redirecting...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-primary-50 to-white">
      {/* Navigation */}
      <nav className="border-b border-secondary-200 bg-white/80 backdrop-blur-sm">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center">
              <Link href="/dashboard">
                <h1 className="text-2xl font-bold text-primary-600">
                  CruxProject
                </h1>
              </Link>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-secondary-700">
                {user.first_name
                  ? `${user.first_name} ${user.last_name || ""}`.trim()
                  : user.username || user.email}
              </span>
              <button
                type="button"
                onClick={handleLogout}
                className="rounded-lg bg-accent-600 px-4 py-2 text-white hover:bg-accent-700 transition-colors"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center">
          <h2 className="text-4xl font-bold text-secondary-900">
            Welcome to CruxProject!
          </h2>
          <p className="mt-4 text-lg text-secondary-600">
            Your climbing dashboard is coming soon.
          </p>

          {/* User Info Card */}
          <div className="mt-12 max-w-md mx-auto bg-white rounded-lg shadow-lg p-8">
            <h3 className="text-xl font-semibold text-secondary-900 mb-4">
              Your Account
            </h3>
            <div className="space-y-3 text-left">
              {(user.first_name || user.last_name) && (
                <div>
                  <span className="text-sm text-secondary-600">Name:</span>
                  <p className="text-secondary-900 font-medium">
                    {`${user.first_name || ""} ${user.last_name || ""}`.trim()}
                  </p>
                </div>
              )}
              <div>
                <span className="text-sm text-secondary-600">Username:</span>
                <p className="text-secondary-900 font-medium">
                  {user.username}
                </p>
              </div>
              <div>
                <span className="text-sm text-secondary-600">Email:</span>
                <p className="text-secondary-900 font-medium">{user.email}</p>
              </div>
              <div>
                <span className="text-sm text-secondary-600">User ID:</span>
                <p className="text-secondary-900 font-mono text-sm">
                  {user.id}
                </p>
              </div>
            </div>
          </div>

          {/* Coming Soon Features */}
          <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            <div className="bg-white rounded-lg shadow p-6">
              <div className="h-10 w-10 mx-auto rounded-lg bg-primary-100 flex items-center justify-center mb-4">
                <svg
                  className="h-5 w-5 text-primary-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  role="img"
                  aria-label="Log climbs icon"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                  />
                </svg>
              </div>
              <h4 className="font-semibold text-secondary-900">Log Climbs</h4>
              <p className="text-sm text-secondary-600 mt-2">Coming Soon</p>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <div className="h-10 w-10 mx-auto rounded-lg bg-accent-100 flex items-center justify-center mb-4">
                <svg
                  className="h-5 w-5 text-accent-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  role="img"
                  aria-label="Track progress icon"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                  />
                </svg>
              </div>
              <h4 className="font-semibold text-secondary-900">
                Track Progress
              </h4>
              <p className="text-sm text-secondary-600 mt-2">Coming Soon</p>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <div className="h-10 w-10 mx-auto rounded-lg bg-secondary-200 flex items-center justify-center mb-4">
                <svg
                  className="h-5 w-5 text-secondary-700"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  role="img"
                  aria-label="Find partners icon"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                  />
                </svg>
              </div>
              <h4 className="font-semibold text-secondary-900">
                Find Partners
              </h4>
              <p className="text-sm text-secondary-600 mt-2">Coming Soon</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
