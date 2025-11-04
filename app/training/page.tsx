"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import AddTrainingSessionModal from "@/components/add-training-session-modal";
import AuthenticatedLayout from "@/components/authenticated-layout";
import { useAuth } from "@/contexts/auth-context";
import { useTrainingSessions } from "@/hooks/use-training-sessions";
import type { CreateTrainingSessionRequest } from "@/types/training";

export default function TrainingPage() {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const [isAddSessionModalOpen, setIsAddSessionModalOpen] = useState(false);

  const {
    sessions,
    isLoading: isLoadingSessions,
    error: sessionsError,
    createSession,
  } = useTrainingSessions();

  useEffect(() => {
    // Redirect to signin if not authenticated
    if (!isLoading && !user) {
      router.push("/signin");
    }
  }, [user, isLoading, router]);

  const handleAddSession = async (
    sessionData: CreateTrainingSessionRequest,
  ) => {
    await createSession(sessionData);
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
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Training Sessions
          </h1>
          <button
            type="button"
            onClick={() => setIsAddSessionModalOpen(true)}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors"
          >
            + Log Session
          </button>
        </div>

        {/* Session List */}
        <div className="bg-white rounded-xl shadow-md border border-gray-200">
          <div className="p-6">
            {isLoadingSessions ? (
              <p className="text-gray-500 text-center py-12">Loading...</p>
            ) : sessionsError ? (
              <p className="text-red-500 text-center py-12">{sessionsError}</p>
            ) : sessions.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-500 mb-4">
                  No training sessions logged yet. Start tracking your gym
                  sessions!
                </p>
                <button
                  type="button"
                  onClick={() => setIsAddSessionModalOpen(true)}
                  className="px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors"
                >
                  Log Your First Session
                </button>
              </div>
            ) : (
              <div className="space-y-6">
                {sessions.map((session) => (
                  <div
                    key={session.id}
                    className="border border-gray-200 rounded-lg p-6 hover:bg-gray-50 transition-colors"
                  >
                    {/* Session Header */}
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="text-xl font-bold text-gray-900">
                          {session.gym?.name || "Unknown Gym"}
                        </h3>
                        <p className="text-sm text-gray-600 mt-1">
                          {new Date(session.session_date).toLocaleDateString(
                            "en-US",
                            {
                              weekday: "long",
                              year: "numeric",
                              month: "long",
                              day: "numeric",
                            },
                          )}
                        </p>
                        {session.gym?.city && (
                          <p className="text-sm text-gray-500 mt-1">
                            {session.gym.city}
                          </p>
                        )}
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-blue-600">
                          {session.total_sends}/{session.total_climbs}
                        </div>
                        <p className="text-xs text-gray-500 mt-1">Sends</p>
                      </div>
                    </div>

                    {/* Description */}
                    {session.description && (
                      <p className="text-gray-700 mb-4">
                        {session.description}
                      </p>
                    )}

                    {/* Partners */}
                    {session.partners && session.partners.length > 0 && (
                      <div className="mb-4">
                        <p className="text-sm font-medium text-gray-700 mb-2">
                          Training Partners:
                        </p>
                        <div className="flex flex-wrap gap-2">
                          {session.partners.map((partner) => (
                            <span
                              key={partner.id}
                              className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm"
                            >
                              {partner.first_name && partner.last_name
                                ? `${partner.first_name} ${partner.last_name}`
                                : partner.username}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Boulders */}
                    {session.boulders && session.boulders.length > 0 && (
                      <div className="mb-4">
                        <h4 className="text-sm font-semibold text-gray-900 mb-2">
                          Boulders ({session.boulders.length})
                        </h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                          {session.boulders.map((boulder) => (
                            <div
                              key={boulder.id}
                              className="bg-gray-50 rounded-lg p-3 border border-gray-200"
                            >
                              <div className="flex items-center justify-between mb-2">
                                <span className="font-bold text-gray-900">
                                  {boulder.grade}
                                </span>
                                <span
                                  className={`px-2 py-1 text-xs font-semibold rounded ${
                                    boulder.outcome === "Flash" ||
                                    boulder.outcome === "Onsite" ||
                                    boulder.outcome === "Redpoint"
                                      ? "bg-green-100 text-green-800"
                                      : "bg-red-100 text-red-800"
                                  }`}
                                >
                                  {boulder.outcome}
                                </span>
                              </div>
                              {boulder.color_tag && (
                                <p className="text-xs text-gray-600 mb-1">
                                  {boulder.color_tag}
                                </p>
                              )}
                              {boulder.notes && (
                                <p className="text-xs text-gray-500 italic">
                                  {boulder.notes}
                                </p>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Rope Climbs */}
                    {session.rope_climbs && session.rope_climbs.length > 0 && (
                      <div>
                        <h4 className="text-sm font-semibold text-gray-900 mb-2">
                          Rope Climbs ({session.rope_climbs.length})
                        </h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                          {session.rope_climbs.map((climb) => (
                            <div
                              key={climb.id}
                              className="bg-gray-50 rounded-lg p-3 border border-gray-200"
                            >
                              <div className="flex items-center justify-between mb-2">
                                <div className="flex items-center gap-2">
                                  <span className="font-bold text-gray-900">
                                    {climb.grade}
                                  </span>
                                  <span className="px-2 py-0.5 text-xs font-medium bg-blue-100 text-blue-800 rounded">
                                    {climb.climb_type}
                                  </span>
                                </div>
                                <span
                                  className={`px-2 py-1 text-xs font-semibold rounded ${
                                    climb.outcome === "Flash" ||
                                    climb.outcome === "Onsite" ||
                                    climb.outcome === "Redpoint"
                                      ? "bg-green-100 text-green-800"
                                      : "bg-red-100 text-red-800"
                                  }`}
                                >
                                  {climb.outcome}
                                </span>
                              </div>
                              {climb.notes && (
                                <p className="text-xs text-gray-500 italic">
                                  {climb.notes}
                                </p>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Add Session Modal */}
      <AddTrainingSessionModal
        isOpen={isAddSessionModalOpen}
        onClose={() => setIsAddSessionModalOpen(false)}
        onSubmit={handleAddSession}
      />
    </AuthenticatedLayout>
  );
}
