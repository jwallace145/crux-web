import Link from "next/link";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-primary-50 to-white">
      {/* Navigation */}
      <nav className="border-b border-secondary-200 bg-white/80 backdrop-blur-sm">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-primary-600">
                CruxProject
              </h1>
            </div>
            <div className="flex items-center gap-4">
              <Link
                href="/signin"
                className="text-secondary-700 hover:text-primary-600 transition-colors"
              >
                Sign In
              </Link>
              <Link
                href="/register"
                className="rounded-lg bg-primary-600 px-4 py-2 text-white hover:bg-primary-700 transition-colors"
              >
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="py-20 text-center">
          <h2 className="text-5xl font-bold tracking-tight text-secondary-900 sm:text-6xl">
            Track Your Climbing Journey
          </h2>
          <p className="mt-6 text-lg leading-8 text-secondary-600 max-w-2xl mx-auto">
            Join the community of climbers tracking their progress, sharing
            routes, and pushing their limits. Whether you're bouldering or sport
            climbing, CruxProject helps you reach new heights.
          </p>
          <div className="mt-10 flex items-center justify-center gap-6">
            <Link
              href="/register"
              className="rounded-lg bg-primary-600 px-8 py-3 text-lg font-semibold text-white shadow-sm hover:bg-primary-700 transition-all hover:shadow-md"
            >
              Start Climbing
            </Link>
            <Link
              href="/signin"
              className="rounded-lg border-2 border-primary-600 px-8 py-3 text-lg font-semibold text-primary-600 hover:bg-primary-50 transition-colors"
            >
              Sign In
            </Link>
          </div>
        </div>

        {/* Features Section */}
        <div className="py-20">
          <div className="grid grid-cols-1 gap-12 md:grid-cols-3">
            <div className="text-center">
              <div className="mx-auto h-12 w-12 rounded-lg bg-primary-100 flex items-center justify-center">
                <svg
                  className="h-6 w-6 text-primary-600"
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
              <h3 className="mt-6 text-xl font-semibold text-secondary-900">
                Track Progress
              </h3>
              <p className="mt-2 text-secondary-600">
                Log your climbs, track your grades, and visualize your
                improvement over time.
              </p>
            </div>

            <div className="text-center">
              <div className="mx-auto h-12 w-12 rounded-lg bg-accent-100 flex items-center justify-center">
                <svg
                  className="h-6 w-6 text-accent-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  role="img"
                  aria-label="Join community icon"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                  />
                </svg>
              </div>
              <h3 className="mt-6 text-xl font-semibold text-secondary-900">
                Join Community
              </h3>
              <p className="mt-2 text-secondary-600">
                Connect with fellow climbers, share routes, and learn from the
                community.
              </p>
            </div>

            <div className="text-center">
              <div className="mx-auto h-12 w-12 rounded-lg bg-secondary-200 flex items-center justify-center">
                <svg
                  className="h-6 w-6 text-secondary-700"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  role="img"
                  aria-label="Set goals icon"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <h3 className="mt-6 text-xl font-semibold text-secondary-900">
                Set Goals
              </h3>
              <p className="mt-2 text-secondary-600">
                Define your climbing goals and track your journey to crushing
                your project.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-secondary-200 bg-white mt-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
          <p className="text-center text-secondary-500">
            &copy; 2025 CruxProject. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
