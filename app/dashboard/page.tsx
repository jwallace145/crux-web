"use client";

import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import AddClimbModal from "@/components/add-climb-modal";
import AuthenticatedLayout from "@/components/authenticated-layout";
import { useAuth } from "@/contexts/auth-context";
import { useClimbs } from "@/hooks/use-climbs";

export default function DashboardPage() {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const [isAddClimbModalOpen, setIsAddClimbModalOpen] = useState(false);

  const userId = user?.id ? Number.parseInt(user.id, 10) : undefined;
  const {
    climbs,
    isLoading: isLoadingClimbs,
    error: climbsError,
    createClimb,
  } = useClimbs(userId);

  useEffect(() => {
    // Redirect to signin if not authenticated
    if (!isLoading && !user) {
      router.push("/signin");
    }
  }, [user, isLoading, router]);

  // Calculate stats from climbs
  const stats = useMemo(() => {
    const totalClimbs = climbs.length;
    const completedClimbs = climbs.filter((c) => c.completed).length;

    // Find hardest grade (for now just show the first completed climb's grade)
    const hardestGrade = climbs.find((c) => c.completed)?.grade || "Not yet";

    // Calculate active days (unique dates)
    const uniqueDates = new Set(
      climbs.map((c) => new Date(c.climb_date).toDateString()),
    );
    const activeDays = uniqueDates.size;

    return {
      totalClimbs,
      completedClimbs,
      hardestGrade,
      activeDays,
    };
  }, [climbs]);

  const handleAddClimb = async (
    climbData: import("@/types/climb").CreateClimbRequest,
  ) => {
    await createClimb(climbData);
  };

  // Show loading state while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-gray-600">Loading...</div>
      </div>
    );
  }

  // If not loading but no user, show loading while redirect happens
  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-gray-600">Redirecting...</div>
      </div>
    );
  }

  return (
    <AuthenticatedLayout>
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Dashboard</h1>

        {/* Welcome Section */}
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl shadow-lg p-8 mb-8">
          <h2 className="text-2xl font-bold text-white mb-2">
            Welcome back, {user.first_name || user.username}!
          </h2>
          <p className="text-blue-100 text-lg">
            Track your climbing progress, log routes, and achieve your goals.
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-md border border-gray-200 p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">
                  Total Climbs
                </p>
                <p className="text-4xl font-bold text-gray-900">
                  {isLoadingClimbs ? "..." : stats.totalClimbs}
                </p>
              </div>
              <div className="h-14 w-14 rounded-xl bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center shadow-md">
                <svg
                  className="h-7 w-7 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  role="img"
                  aria-label="Total climbs icon"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                  />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-md border border-gray-200 p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">
                  Hardest Grade
                </p>
                <p className="text-4xl font-bold text-gray-900">
                  {isLoadingClimbs ? "..." : stats.hardestGrade}
                </p>
              </div>
              <div className="h-14 w-14 rounded-xl bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center shadow-md">
                <svg
                  className="h-7 w-7 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  role="img"
                  aria-label="Hardest grade icon"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
                  />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-md border border-gray-200 p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">
                  Active Days
                </p>
                <p className="text-4xl font-bold text-gray-900">
                  {isLoadingClimbs ? "..." : stats.activeDays}
                </p>
              </div>
              <div className="h-14 w-14 rounded-xl bg-gradient-to-br from-purple-400 to-purple-600 flex items-center justify-center shadow-md">
                <svg
                  className="h-7 w-7 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  role="img"
                  aria-label="Active days icon"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-xl shadow-md border border-gray-200">
          <div className="p-6 border-b border-gray-200 flex items-center justify-between">
            <h3 className="text-xl font-semibold text-gray-900">
              Recent Activity
            </h3>
            <button
              type="button"
              onClick={() => setIsAddClimbModalOpen(true)}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors"
            >
              + Add Climb
            </button>
          </div>
          <div className="p-6">
            {isLoadingClimbs ? (
              <p className="text-gray-500 text-center py-12">Loading...</p>
            ) : climbsError ? (
              <p className="text-red-500 text-center py-12">{climbsError}</p>
            ) : climbs.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-500 mb-4">
                  No climbs logged yet. Start tracking your progress!
                </p>
                <button
                  type="button"
                  onClick={() => setIsAddClimbModalOpen(true)}
                  className="px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors"
                >
                  Log Your First Climb
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {climbs.slice(0, 5).map((climb) => (
                  <div
                    key={climb.id}
                    className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-3">
                        <span
                          className={`px-2 py-1 text-xs font-semibold rounded ${
                            climb.climb_type === "outdoor"
                              ? "bg-green-100 text-green-800"
                              : "bg-blue-100 text-blue-800"
                          }`}
                        >
                          {climb.climb_type}
                        </span>
                        <span className="text-lg font-bold text-gray-900">
                          {climb.grade}
                        </span>
                        {climb.completed && (
                          <span className="text-green-600 text-sm">✓ Sent</span>
                        )}
                      </div>
                      <p className="text-sm text-gray-600 mt-1">
                        {new Date(climb.climb_date).toLocaleDateString()} •{" "}
                        {climb.attempts} attempt
                        {climb.attempts !== 1 ? "s" : ""}
                        {climb.style && ` • ${climb.style}`}
                      </p>
                      {climb.notes && (
                        <p className="text-sm text-gray-500 mt-1 italic">
                          {climb.notes}
                        </p>
                      )}
                    </div>
                    {climb.rating && (
                      <div className="flex items-center gap-1 ml-4">
                        {Array.from({ length: climb.rating }).map((_, i) => (
                          <svg
                            key={`${climb.id}-star-${i}`}
                            className="h-4 w-4 text-yellow-400"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                            role="img"
                            aria-label="Rating star"
                          >
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Add Climb Modal */}
      <AddClimbModal
        isOpen={isAddClimbModalOpen}
        onClose={() => setIsAddClimbModalOpen(false)}
        onSubmit={handleAddClimb}
      />
    </AuthenticatedLayout>
  );
}
