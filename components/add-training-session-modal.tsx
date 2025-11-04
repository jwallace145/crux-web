"use client";

import {
  Dialog,
  DialogBackdrop,
  DialogPanel,
  DialogTitle,
} from "@headlessui/react";
import { PlusIcon, TrashIcon, XMarkIcon } from "@heroicons/react/24/outline";
import { type FormEvent, useState } from "react";
import { useGyms } from "@/hooks/use-gyms";
import type {
  BoulderRequest,
  CreateTrainingSessionRequest,
  RopeClimbRequest,
} from "@/types/training";

interface AddTrainingSessionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (sessionData: CreateTrainingSessionRequest) => Promise<void>;
}

export default function AddTrainingSessionModal({
  isOpen,
  onClose,
  onSubmit,
}: AddTrainingSessionModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { gyms, isLoading: isLoadingGyms } = useGyms();

  // Form state
  const [gymId, setGymId] = useState<number | undefined>(undefined);
  const [sessionDate, setSessionDate] = useState(
    new Date().toISOString().split("T")[0],
  );
  const [description, setDescription] = useState("");

  // Boulders state
  const [boulders, setBoulders] = useState<BoulderRequest[]>([]);

  // Rope climbs state
  const [ropeClimbs, setRopeClimbs] = useState<RopeClimbRequest[]>([]);

  const addBoulder = () => {
    setBoulders([
      ...boulders,
      { grade: "", outcome: "Fell", color_tag: "", notes: "" },
    ]);
  };

  const removeBoulder = (index: number) => {
    setBoulders(boulders.filter((_, i) => i !== index));
  };

  const updateBoulder = (
    index: number,
    field: keyof BoulderRequest,
    value: string,
  ) => {
    const updated = [...boulders];
    updated[index] = { ...updated[index], [field]: value };
    setBoulders(updated);
  };

  const addRopeClimb = () => {
    setRopeClimbs([
      ...ropeClimbs,
      { climb_type: "TR", grade: "", outcome: "Fell", notes: "" },
    ]);
  };

  const removeRopeClimb = (index: number) => {
    setRopeClimbs(ropeClimbs.filter((_, i) => i !== index));
  };

  const updateRopeClimb = (
    index: number,
    field: keyof RopeClimbRequest,
    value: string,
  ) => {
    const updated = [...ropeClimbs];
    updated[index] = { ...updated[index], [field]: value };
    setRopeClimbs(updated);
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      if (!gymId) {
        throw new Error("Please select a gym");
      }

      // Convert date to RFC3339 timestamp
      const dateTime = new Date(`${sessionDate}T12:00:00Z`).toISOString();

      // Filter out empty boulders and rope climbs
      const validBoulders = boulders.filter((b) => b.grade.trim() !== "");
      const validRopeClimbs = ropeClimbs.filter((r) => r.grade.trim() !== "");

      const sessionData: CreateTrainingSessionRequest = {
        gym_id: gymId,
        session_date: dateTime,
        description: description || undefined,
        boulders: validBoulders.length > 0 ? validBoulders : undefined,
        rope_climbs: validRopeClimbs.length > 0 ? validRopeClimbs : undefined,
      };

      await onSubmit(sessionData);

      // Reset form
      setGymId(undefined);
      setSessionDate(new Date().toISOString().split("T")[0]);
      setDescription("");
      setBoulders([]);
      setRopeClimbs([]);

      onClose();
    } catch (err) {
      setError(
        err && typeof err === "object" && "message" in err
          ? (err.message as string)
          : "Failed to add training session",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onClose={onClose} className="relative z-50">
      <DialogBackdrop
        transition
        className="fixed inset-0 bg-gray-500/75 transition-opacity data-closed:opacity-0 data-enter:duration-300 data-enter:ease-out data-leave:duration-200 data-leave:ease-in"
      />

      <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
        <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
          <DialogPanel
            transition
            className="relative transform overflow-hidden rounded-xl bg-white text-left shadow-xl transition-all data-closed:translate-y-4 data-closed:opacity-0 data-enter:duration-300 data-enter:ease-out data-leave:duration-200 data-leave:ease-in sm:my-8 sm:w-full sm:max-w-3xl data-closed:sm:translate-y-0 data-closed:sm:scale-95"
          >
            <div className="bg-white px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
              <div className="flex items-center justify-between mb-4">
                <DialogTitle
                  as="h3"
                  className="text-xl font-semibold text-gray-900"
                >
                  Log Training Session
                </DialogTitle>
                <button
                  type="button"
                  onClick={onClose}
                  className="rounded-md text-gray-400 hover:text-gray-500"
                >
                  <span className="sr-only">Close</span>
                  <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                {error && (
                  <div className="rounded-lg bg-red-50 border border-red-200 p-3">
                    <p className="text-sm text-red-700">{error}</p>
                  </div>
                )}

                {/* Basic Info Section */}
                <div className="space-y-4">
                  <h4 className="text-sm font-semibold text-gray-900">
                    Session Details
                  </h4>

                  {/* Gym */}
                  <div>
                    <label
                      htmlFor="gym"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Gym
                    </label>
                    <select
                      id="gym"
                      value={gymId ?? ""}
                      onChange={(e) =>
                        setGymId(
                          e.target.value
                            ? Number.parseInt(e.target.value, 10)
                            : undefined,
                        )
                      }
                      required
                      disabled={isLoadingGyms}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                    >
                      <option value="">
                        {isLoadingGyms ? "Loading gyms..." : "Select a gym"}
                      </option>
                      {gyms.map((gym) => (
                        <option key={gym.id} value={gym.id}>
                          {gym.name} {gym.city ? `- ${gym.city}` : ""}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Date */}
                  <div>
                    <label
                      htmlFor="sessionDate"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Date
                    </label>
                    <input
                      id="sessionDate"
                      type="date"
                      value={sessionDate}
                      onChange={(e) => setSessionDate(e.target.value)}
                      max={new Date().toISOString().split("T")[0]}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                    />
                  </div>

                  {/* Description */}
                  <div>
                    <label
                      htmlFor="description"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Description (optional)
                    </label>
                    <textarea
                      id="description"
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      placeholder="How did the session go?"
                      maxLength={1000}
                      rows={2}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 placeholder:text-gray-400"
                    />
                  </div>
                </div>

                {/* Boulders Section */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-semibold text-gray-900">
                      Boulders
                    </h4>
                    <button
                      type="button"
                      onClick={addBoulder}
                      className="flex items-center gap-1 px-3 py-1.5 text-sm bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors"
                    >
                      <PlusIcon className="h-4 w-4" />
                      Add Boulder
                    </button>
                  </div>

                  {boulders.length === 0 ? (
                    <p className="text-sm text-gray-500 italic">
                      No boulders added yet
                    </p>
                  ) : (
                    <div className="space-y-3">
                      {boulders.map((boulder, index) => {
                        const boulderIdPrefix = `boulder-${Date.now()}-${index}`;
                        return (
                          <div
                            key={boulderIdPrefix}
                            className="p-4 border border-gray-200 rounded-lg bg-gray-50 space-y-3"
                          >
                            <div className="flex items-center justify-between">
                              <span className="text-sm font-medium text-gray-700">
                                Boulder {index + 1}
                              </span>
                              <button
                                type="button"
                                onClick={() => removeBoulder(index)}
                                className="text-red-600 hover:text-red-700"
                              >
                                <TrashIcon className="h-4 w-4" />
                              </button>
                            </div>
                            <div className="grid grid-cols-2 gap-3">
                              <div>
                                <label
                                  htmlFor={`${boulderIdPrefix}-grade`}
                                  className="block text-xs font-medium text-gray-600 mb-1"
                                >
                                  Grade
                                </label>
                                <input
                                  id={`${boulderIdPrefix}-grade`}
                                  type="text"
                                  value={boulder.grade}
                                  onChange={(e) =>
                                    updateBoulder(
                                      index,
                                      "grade",
                                      e.target.value,
                                    )
                                  }
                                  placeholder="e.g., V5"
                                  maxLength={20}
                                  className="w-full px-2 py-1.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                                />
                              </div>
                              <div>
                                <label
                                  htmlFor={`${boulderIdPrefix}-color`}
                                  className="block text-xs font-medium text-gray-600 mb-1"
                                >
                                  Color Tag
                                </label>
                                <input
                                  id={`${boulderIdPrefix}-color`}
                                  type="text"
                                  value={boulder.color_tag || ""}
                                  onChange={(e) =>
                                    updateBoulder(
                                      index,
                                      "color_tag",
                                      e.target.value,
                                    )
                                  }
                                  placeholder="e.g., Blue"
                                  maxLength={50}
                                  className="w-full px-2 py-1.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                                />
                              </div>
                            </div>
                            <div>
                              <label
                                htmlFor={`${boulderIdPrefix}-outcome`}
                                className="block text-xs font-medium text-gray-600 mb-1"
                              >
                                Outcome
                              </label>
                              <select
                                id={`${boulderIdPrefix}-outcome`}
                                value={boulder.outcome}
                                onChange={(e) =>
                                  updateBoulder(
                                    index,
                                    "outcome",
                                    e.target.value,
                                  )
                                }
                                className="w-full px-2 py-1.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                              >
                                <option value="Fell">Fell</option>
                                <option value="Flash">Flash</option>
                                <option value="Onsite">Onsite</option>
                                <option value="Redpoint">Redpoint</option>
                              </select>
                            </div>
                            <div>
                              <label
                                htmlFor={`${boulderIdPrefix}-notes`}
                                className="block text-xs font-medium text-gray-600 mb-1"
                              >
                                Notes
                              </label>
                              <input
                                id={`${boulderIdPrefix}-notes`}
                                type="text"
                                value={boulder.notes || ""}
                                onChange={(e) =>
                                  updateBoulder(index, "notes", e.target.value)
                                }
                                placeholder="Any notes..."
                                maxLength={1000}
                                className="w-full px-2 py-1.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                              />
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>

                {/* Rope Climbs Section */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-semibold text-gray-900">
                      Rope Climbs
                    </h4>
                    <button
                      type="button"
                      onClick={addRopeClimb}
                      className="flex items-center gap-1 px-3 py-1.5 text-sm bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors"
                    >
                      <PlusIcon className="h-4 w-4" />
                      Add Rope Climb
                    </button>
                  </div>

                  {ropeClimbs.length === 0 ? (
                    <p className="text-sm text-gray-500 italic">
                      No rope climbs added yet
                    </p>
                  ) : (
                    <div className="space-y-3">
                      {ropeClimbs.map((climb, index) => {
                        const ropeIdPrefix = `rope-${Date.now()}-${index}`;
                        return (
                          <div
                            key={ropeIdPrefix}
                            className="p-4 border border-gray-200 rounded-lg bg-gray-50 space-y-3"
                          >
                            <div className="flex items-center justify-between">
                              <span className="text-sm font-medium text-gray-700">
                                Rope Climb {index + 1}
                              </span>
                              <button
                                type="button"
                                onClick={() => removeRopeClimb(index)}
                                className="text-red-600 hover:text-red-700"
                              >
                                <TrashIcon className="h-4 w-4" />
                              </button>
                            </div>
                            <div className="grid grid-cols-2 gap-3">
                              <div>
                                <label
                                  htmlFor={`${ropeIdPrefix}-type`}
                                  className="block text-xs font-medium text-gray-600 mb-1"
                                >
                                  Type
                                </label>
                                <select
                                  id={`${ropeIdPrefix}-type`}
                                  value={climb.climb_type}
                                  onChange={(e) =>
                                    updateRopeClimb(
                                      index,
                                      "climb_type",
                                      e.target.value,
                                    )
                                  }
                                  className="w-full px-2 py-1.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                                >
                                  <option value="TR">Top Rope</option>
                                  <option value="Lead">Lead</option>
                                </select>
                              </div>
                              <div>
                                <label
                                  htmlFor={`${ropeIdPrefix}-grade`}
                                  className="block text-xs font-medium text-gray-600 mb-1"
                                >
                                  Grade
                                </label>
                                <input
                                  id={`${ropeIdPrefix}-grade`}
                                  type="text"
                                  value={climb.grade}
                                  onChange={(e) =>
                                    updateRopeClimb(
                                      index,
                                      "grade",
                                      e.target.value,
                                    )
                                  }
                                  placeholder="e.g., 5.11a"
                                  maxLength={20}
                                  className="w-full px-2 py-1.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                                />
                              </div>
                            </div>
                            <div>
                              <label
                                htmlFor={`${ropeIdPrefix}-outcome`}
                                className="block text-xs font-medium text-gray-600 mb-1"
                              >
                                Outcome
                              </label>
                              <select
                                id={`${ropeIdPrefix}-outcome`}
                                value={climb.outcome}
                                onChange={(e) =>
                                  updateRopeClimb(
                                    index,
                                    "outcome",
                                    e.target.value,
                                  )
                                }
                                className="w-full px-2 py-1.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                              >
                                <option value="Fell">Fell</option>
                                <option value="Hung">Hung</option>
                                <option value="Flash">Flash</option>
                                <option value="Onsite">Onsite</option>
                                <option value="Redpoint">Redpoint</option>
                              </select>
                            </div>
                            <div>
                              <label
                                htmlFor={`${ropeIdPrefix}-notes`}
                                className="block text-xs font-medium text-gray-600 mb-1"
                              >
                                Notes
                              </label>
                              <input
                                id={`${ropeIdPrefix}-notes`}
                                type="text"
                                value={climb.notes || ""}
                                onChange={(e) =>
                                  updateRopeClimb(
                                    index,
                                    "notes",
                                    e.target.value,
                                  )
                                }
                                placeholder="Any notes..."
                                maxLength={1000}
                                className="w-full px-2 py-1.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                              />
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>

                {/* Submit Button */}
                <div className="mt-6 flex gap-3">
                  <button
                    type="button"
                    onClick={onClose}
                    disabled={isSubmitting}
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? "Saving..." : "Save Session"}
                  </button>
                </div>
              </form>
            </div>
          </DialogPanel>
        </div>
      </div>
    </Dialog>
  );
}
