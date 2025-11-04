"use client";

import {
  Dialog,
  DialogBackdrop,
  DialogPanel,
  DialogTitle,
} from "@headlessui/react";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { type FormEvent, useState } from "react";
import type { ClimbType, CreateClimbRequest } from "@/types/climb";

interface AddClimbModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (climbData: CreateClimbRequest) => Promise<void>;
}

export default function AddClimbModal({
  isOpen,
  onClose,
  onSubmit,
}: AddClimbModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Form state
  const [climbType, setClimbType] = useState<ClimbType>("indoor");
  const [climbDate, setClimbDate] = useState(
    new Date().toISOString().split("T")[0],
  );
  const [grade, setGrade] = useState("");
  const [style, setStyle] = useState("");
  const [completed, setCompleted] = useState(false);
  const [attempts, setAttempts] = useState(1);
  const [falls, setFalls] = useState(0);
  const [rating, setRating] = useState<number | undefined>(undefined);
  const [notes, setNotes] = useState("");

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      // Convert date to RFC3339 timestamp
      const dateTime = new Date(`${climbDate}T12:00:00Z`).toISOString();

      const climbData: CreateClimbRequest = {
        climb_type: climbType,
        climb_date: dateTime,
        grade,
        style: style || undefined,
        completed,
        attempts,
        falls,
        rating: rating || undefined,
        notes: notes || undefined,
      };

      await onSubmit(climbData);

      // Reset form
      setClimbType("indoor");
      setClimbDate(new Date().toISOString().split("T")[0]);
      setGrade("");
      setStyle("");
      setCompleted(false);
      setAttempts(1);
      setFalls(0);
      setRating(undefined);
      setNotes("");

      onClose();
    } catch (err) {
      setError(
        err && typeof err === "object" && "message" in err
          ? (err.message as string)
          : "Failed to add climb",
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
            className="relative transform overflow-hidden rounded-xl bg-white text-left shadow-xl transition-all data-closed:translate-y-4 data-closed:opacity-0 data-enter:duration-300 data-enter:ease-out data-leave:duration-200 data-leave:ease-in sm:my-8 sm:w-full sm:max-w-lg data-closed:sm:translate-y-0 data-closed:sm:scale-95"
          >
            <div className="bg-white px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
              <div className="flex items-center justify-between mb-4">
                <DialogTitle
                  as="h3"
                  className="text-xl font-semibold text-gray-900"
                >
                  Log a Climb
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

              <form onSubmit={handleSubmit} className="space-y-4">
                {error && (
                  <div className="rounded-lg bg-red-50 border border-red-200 p-3">
                    <p className="text-sm text-red-700">{error}</p>
                  </div>
                )}

                {/* Climb Type */}
                <div>
                  <label
                    htmlFor="climbType"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Type
                  </label>
                  <select
                    id="climbType"
                    value={climbType}
                    onChange={(e) => setClimbType(e.target.value as ClimbType)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                  >
                    <option value="indoor">Indoor</option>
                    <option value="outdoor">Outdoor</option>
                  </select>
                </div>

                {/* Date */}
                <div>
                  <label
                    htmlFor="climbDate"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Date
                  </label>
                  <input
                    id="climbDate"
                    type="date"
                    value={climbDate}
                    onChange={(e) => setClimbDate(e.target.value)}
                    max={new Date().toISOString().split("T")[0]}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                  />
                </div>

                {/* Grade */}
                <div>
                  <label
                    htmlFor="grade"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Grade
                  </label>
                  <input
                    id="grade"
                    type="text"
                    value={grade}
                    onChange={(e) => setGrade(e.target.value)}
                    placeholder="e.g., 5.10a, V4"
                    maxLength={20}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 placeholder:text-gray-400"
                  />
                </div>

                {/* Style */}
                <div>
                  <label
                    htmlFor="style"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Style (optional)
                  </label>
                  <input
                    id="style"
                    type="text"
                    value={style}
                    onChange={(e) => setStyle(e.target.value)}
                    placeholder="e.g., redpoint, flash, onsight"
                    maxLength={50}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 placeholder:text-gray-400"
                  />
                </div>

                {/* Completed Checkbox */}
                <div className="flex items-center">
                  <input
                    id="completed"
                    type="checkbox"
                    checked={completed}
                    onChange={(e) => setCompleted(e.target.checked)}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label
                    htmlFor="completed"
                    className="ml-2 block text-sm text-gray-700"
                  >
                    Completed (sent)
                  </label>
                </div>

                {/* Attempts and Falls */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label
                      htmlFor="attempts"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Attempts
                    </label>
                    <input
                      id="attempts"
                      type="number"
                      min="1"
                      value={attempts}
                      onChange={(e) =>
                        setAttempts(Number.parseInt(e.target.value, 10))
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="falls"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Falls
                    </label>
                    <input
                      id="falls"
                      type="number"
                      min="0"
                      value={falls}
                      onChange={(e) =>
                        setFalls(Number.parseInt(e.target.value, 10))
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                    />
                  </div>
                </div>

                {/* Rating */}
                <div>
                  <label
                    htmlFor="rating"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Rating (optional)
                  </label>
                  <select
                    id="rating"
                    value={rating ?? ""}
                    onChange={(e) =>
                      setRating(
                        e.target.value
                          ? Number.parseInt(e.target.value, 10)
                          : undefined,
                      )
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                  >
                    <option value="">No rating</option>
                    <option value="1">1 - Poor</option>
                    <option value="2">2 - Fair</option>
                    <option value="3">3 - Good</option>
                    <option value="4">4 - Very Good</option>
                    <option value="5">5 - Excellent</option>
                  </select>
                </div>

                {/* Notes */}
                <div>
                  <label
                    htmlFor="notes"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Notes (optional)
                  </label>
                  <textarea
                    id="notes"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Any notes about the climb..."
                    maxLength={1000}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 placeholder:text-gray-400"
                  />
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
                    {isSubmitting ? "Adding..." : "Add Climb"}
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
