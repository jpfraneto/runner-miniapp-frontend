// Dependencies
import React, {
  useState,
  useCallback,
  useRef,
  useEffect,
  useMemo,
  useContext,
} from "react";
import Typography from "../Typography";
import { useWorkoutHistory } from "@/shared/hooks/user/useWorkoutHistory";
import { useAllUserWorkouts } from "@/shared/hooks/user/useAllUserWorkouts";
import { RunningSession } from "@/shared/types/running";
import RunningSessionComponent from "../RunningSession";
import UserProfile from "../UserProfile";
import styles from "./WorkoutFeed.module.scss";

// SDK
import { useUpdateWorkout } from "@/shared/hooks/user/useUpdateWorkout";
import { AuthContext } from "@/shared/providers/AppProvider";

type FeedTab = "ALL" | "YOU";

const WorkoutFeed: React.FC = () => {
  const [activeTab, setActiveTab] = useState<FeedTab>("ALL");
  const [allPage, setAllPage] = useState(1);
  const [userPage, setUserPage] = useState(1);
  const [allWorkoutsList, setAllWorkoutsList] = useState<RunningSession[]>([]);
  const [userWorkoutsList, setUserWorkoutsList] = useState<RunningSession[]>(
    []
  );
  const containerRef = useRef<HTMLDivElement>(null);
  const { miniappContext } = useContext(AuthContext);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editingWorkout, setEditingWorkout] = useState<RunningSession | null>(
    null
  );
  const [selectedUserId, setSelectedUserId] = useState<number | null>(null);
  const updateWorkoutMutation = useUpdateWorkout();

  // Fetch paginated data
  const {
    data: communityWorkouts,
    isLoading: allLoading,
    error: allError,
  } = useAllUserWorkouts({
    page: allPage,
    limit: 30,
  });

  const {
    data: userWorkouts,
    isLoading: userLoading,
    error: userError,
  } = useWorkoutHistory({
    page: userPage,
    limit: 20,
  });

  // Debug logs - Enhanced
  useEffect(() => {
    console.log("=== WORKOUT FEED DEBUG ===");
    console.log("Active tab:", activeTab);

    if (activeTab === "YOU") {
      console.log("YOU TAB DEBUG:");
      console.log("- userWorkouts:", userWorkouts);
      console.log("- userWorkouts?.workouts:", userWorkouts?.workouts);
      console.log(
        "- userWorkouts?.workouts length:",
        userWorkouts?.workouts?.length
      );
      console.log("- userLoading:", userLoading);
      console.log("- userError:", userError);
      console.log("- userWorkoutsList length:", userWorkoutsList.length);
    }

    if (activeTab === "ALL") {
      console.log("ALL TAB DEBUG:");
      console.log("- communityWorkouts:", communityWorkouts);
      console.log(
        "- communityWorkouts?.workouts:",
        communityWorkouts?.workouts
      );
      console.log("- allWorkoutsList length:", allWorkoutsList.length);
    }

    console.log("========================");
  }, [
    activeTab,
    userWorkouts,
    communityWorkouts,
    userWorkoutsList,
    allWorkoutsList,
    userLoading,
    userError,
  ]);

  // Memoized values for current tab
  const currentData = useMemo(() => {
    if (activeTab === "ALL") {
      return {
        isLoading: allLoading,
        error: allError,
        workouts: allWorkoutsList,
        hasNext: communityWorkouts?.pagination?.hasNext || false,
      };
    } else {
      return {
        isLoading: userLoading,
        error: userError,
        workouts: userWorkoutsList,
        hasNext: userWorkouts?.pagination?.hasNext || false,
      };
    }
  }, [
    activeTab,
    allLoading,
    allError,
    allWorkoutsList,
    communityWorkouts,
    userLoading,
    userError,
    userWorkoutsList,
    userWorkouts,
  ]);

  // Handle tab change - reset page and clear list for the new tab
  const handleTabChange = useCallback(
    (tab: FeedTab) => {
      if (tab === activeTab) return;

      setActiveTab(tab);

      if (tab === "ALL") {
        setAllPage(1);
        setAllWorkoutsList([]);
      } else {
        setUserPage(1);
        setUserWorkoutsList([]);
      }
    },
    [activeTab]
  );

  // Update ALL workouts list when community data changes
  useEffect(() => {
    if (activeTab === "ALL" && communityWorkouts?.workouts) {
      setAllWorkoutsList((prevList) => {
        if (allPage === 1) {
          // First page - replace entire list
          return communityWorkouts.workouts;
        } else {
          // Subsequent pages - append new workouts
          const existingIds = new Set(
            prevList.map((w: RunningSession) => w.id)
          );
          const newWorkouts = communityWorkouts.workouts.filter(
            (w: RunningSession) => !existingIds.has(w.id)
          );
          return [...prevList, ...newWorkouts];
        }
      });
    }
  }, [communityWorkouts, allPage, activeTab]);

  // Update USER workouts list when user data changes
  useEffect(() => {
    if (activeTab === "YOU" && userWorkouts?.workouts) {
      setUserWorkoutsList((prevList) => {
        if (userPage === 1) {
          // First page - replace entire list
          return userWorkouts.workouts;
        } else {
          // Subsequent pages - append new workouts
          const existingIds = new Set(prevList.map((w) => w.id));
          const newWorkouts = userWorkouts.workouts.filter(
            (w) => !existingIds.has(w.id)
          );
          return [...prevList, ...newWorkouts];
        }
      });
    }
  }, [userWorkouts, userPage, activeTab]);

  // Infinite scroll handler
  const handleScroll = useCallback(() => {
    if (!containerRef.current || currentData.isLoading || !currentData.hasNext)
      return;

    const { scrollTop, scrollHeight, clientHeight } = containerRef.current;
    const isNearBottom = scrollTop + clientHeight >= scrollHeight - 100;

    if (isNearBottom) {
      if (activeTab === "ALL") {
        setAllPage((prev) => prev + 1);
      } else {
        setUserPage((prev) => prev + 1);
      }
    }
  }, [activeTab, currentData.isLoading, currentData.hasNext]);

  useEffect(() => {
    const container = containerRef.current;
    if (container) {
      container.addEventListener("scroll", handleScroll);
      return () => container.removeEventListener("scroll", handleScroll);
    }
  }, [handleScroll]);


  // Edit button handler
  const handleEdit = (workout: RunningSession) => {
    console.log("Edit button clicked for workout:", workout.id);
    setEditingWorkout(workout);
    setEditModalOpen(true);
    // Don't redirect to cast view when editing - just open the modal
  };

  // User profile navigation handler
  const handleUserClick = (userId: number) => {
    setSelectedUserId(userId);
  };

  // Back to feed handler
  const handleBackToFeed = () => {
    setSelectedUserId(null);
  };

  // Modal close handler
  const handleCloseModal = () => {
    setEditModalOpen(false);
    setEditingWorkout(null);
  };

  // Modal submit handler
  const handleEditSubmit = (updated: Partial<RunningSession>) => {
    if (!editingWorkout) return;
    updateWorkoutMutation.mutate(
      { id: editingWorkout.id as string, ...updated },
      {
        onSuccess: (updatedWorkout) => {
          handleCloseModal();

          // Update local state with the updated workout
          if (activeTab === "ALL") {
            setAllWorkoutsList((prevList) =>
              prevList.map((workout) =>
                workout.id === updatedWorkout.id ? updatedWorkout : workout
              )
            );
          } else {
            setUserWorkoutsList((prevList) =>
              prevList.map((workout) =>
                workout.id === updatedWorkout.id ? updatedWorkout : workout
              )
            );
          }
        },
        onError: (error) => {
          console.error("Failed to update workout:", error);
          // You might want to show an error message to the user here
        },
      }
    );
  };

  // If user profile is selected, show profile instead of feed
  if (selectedUserId) {
    return (
      <UserProfile
        userId={selectedUserId}
        onBack={handleBackToFeed}
        onEdit={handleEdit}
      />
    );
  }

  return (
    <div className={styles.feedContainer} ref={containerRef}>
      <div className={styles.tabContainer}>
        <button
          className={`${styles.tab} ${
            activeTab === "ALL" ? styles.active : ""
          }`}
          onClick={() => handleTabChange("ALL")}
        >
          <Typography variant="druk" weight="wide" size={14}>
            ALL
          </Typography>
        </button>
        <button
          className={`${styles.tab} ${
            activeTab === "YOU" ? styles.active : ""
          }`}
          onClick={() => handleTabChange("YOU")}
        >
          <Typography variant="druk" weight="wide" size={14}>
            YOU
          </Typography>
        </button>
      </div>

      {/* Loading state for initial load */}
      {currentData.isLoading && currentData.workouts.length === 0 && (
        <div className={styles.loadingInitial}>
          <div className={styles.loadingSpinner} />
          <Typography variant="geist" size={14} className={styles.loadingText}>
            Loading workouts...
          </Typography>
        </div>
      )}

      {/* Error state */}
      {currentData.error && (
        <div className={styles.errorState}>
          <Typography variant="geist" size={14} className={styles.errorText}>
            Failed to load workouts. Please try again.
          </Typography>
        </div>
      )}

      {/* Empty state */}
      {!currentData.isLoading &&
        !currentData.error &&
        currentData.workouts.length === 0 && (
          <div className={styles.emptyState}>
            <Typography variant="geist" size={14} className={styles.emptyText}>
              {activeTab === "ALL"
                ? "No community runs yet. Be the first to upload a run!"
                : "No runs yet. Upload your first run to get started!"}
            </Typography>
          </div>
        )}

      {/* Workouts list */}
      {currentData.workouts.length > 0 && (
        <div className={styles.runsList}>
          {currentData.workouts.map((workout: RunningSession) => {
            // Check if current user is the owner of this workout
            // Use Farcaster SDK context to get current user's fid
            const currentUserFid = miniappContext?.user?.fid;
            const isOwner =
              currentUserFid &&
              (workout.user?.fid === currentUserFid ||
                workout.fid === currentUserFid);

            return (
              <RunningSessionComponent
                key={workout.id}
                workout={workout}
                isOwner={isOwner as boolean}
                onEdit={handleEdit}
                onUserClick={handleUserClick}
              />
            );
          })}

          {/* Loading more indicator */}
          {currentData.isLoading && currentData.workouts.length > 0 && (
            <div className={styles.loadingMore}>
              <div className={styles.loadingSpinner} />
              <Typography
                variant="geist"
                size={12}
                className={styles.loadingText}
              >
                Loading more runs...
              </Typography>
            </div>
          )}
        </div>
      )}
      {/* Fullscreen Edit Modal */}
      {editModalOpen && editingWorkout && (
        <div className={styles.editModalOverlay}>
          <div className={styles.editModalContent}>
            <button className={styles.closeModal} onClick={handleCloseModal}>
              ×
            </button>
            <div className={styles.modalTitle}>Edit Workout</div>
            <EditWorkoutForm
              workout={editingWorkout}
              onSubmit={handleEditSubmit}
              onCancel={handleCloseModal}
              isLoading={updateWorkoutMutation.isPending}
            />
          </div>
        </div>
      )}
    </div>
  );
};

// EditWorkoutForm component with all RunningSession fields
const EditWorkoutForm: React.FC<{
  workout: RunningSession;
  onSubmit: (updated: Partial<RunningSession>) => void;
  onCancel: () => void;
  isLoading: boolean;
}> = ({ workout, onSubmit, onCancel, isLoading }) => {
  const [form, setForm] = useState<Partial<RunningSession>>({ ...workout });

  return (
    <form
      className={styles.editForm}
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit(form);
      }}
    >
      {/* Basic Workout Info */}
      <div className={styles.formSection}>
        <h3 className={styles.sectionTitle}>Basic Information</h3>

        <label>
          Comment
          <textarea
            value={form.comment || ""}
            onChange={(e) =>
              setForm((f) => ({ ...f, comment: e.target.value }))
            }
            placeholder="Add a comment about your workout..."
            rows={3}
          />
        </label>

        <div className={styles.formRow}>
          <label>
            Distance
            <input
              type="number"
              step="0.1"
              value={form.distance || ""}
              onChange={(e) =>
                setForm((f) => ({ ...f, distance: Number(e.target.value) }))
              }
              placeholder="10.5"
            />
          </label>

          <label>
            Units
            <select
              value={form.units || "km"}
              onChange={(e) =>
                setForm((f) => ({ ...f, units: e.target.value as "km" | "mi" }))
              }
            >
              <option value="km">km</option>
              <option value="mi">mi</option>
            </select>
          </label>
        </div>

        <div className={styles.formRow}>
          <label>
            Duration (minutes)
            <input
              type="number"
              step="0.1"
              value={form.duration || ""}
              onChange={(e) =>
                setForm((f) => ({ ...f, duration: Number(e.target.value) }))
              }
              placeholder="45"
            />
          </label>

          <label>
            Pace (mm:ss/unit)
            <input
              type="text"
              value={form.pace || ""}
              onChange={(e) => setForm((f) => ({ ...f, pace: e.target.value }))}
              placeholder="4:30/km"
            />
          </label>
        </div>
      </div>

      {/* Health & Performance */}
      <div className={styles.formSection}>
        <h3 className={styles.sectionTitle}>Health & Performance</h3>

        <div className={styles.formRow}>
          <label>
            Calories Burned
            <input
              type="number"
              value={form.calories || ""}
              onChange={(e) =>
                setForm((f) => ({ ...f, calories: Number(e.target.value) }))
              }
              placeholder="450"
            />
          </label>

          <label>
            Average Heart Rate
            <input
              type="number"
              value={form.avgHeartRate || ""}
              onChange={(e) =>
                setForm((f) => ({ ...f, avgHeartRate: Number(e.target.value) }))
              }
              placeholder="150"
            />
          </label>
        </div>

        <label>
          Max Heart Rate
          <input
            type="number"
            value={form.maxHeartRate || ""}
            onChange={(e) =>
              setForm((f) => ({ ...f, maxHeartRate: Number(e.target.value) }))
            }
            placeholder="180"
          />
        </label>
      </div>

      {/* Personal Best */}
      <div className={styles.formSection}>
        <h3 className={styles.sectionTitle}>Personal Best</h3>

        <div className={styles.checkboxRow}>
          <label className={styles.checkboxLabel}>
            <input
              type="checkbox"
              checked={form.isPersonalBest || false}
              onChange={(e) =>
                setForm((f) => ({ ...f, isPersonalBest: e.target.checked }))
              }
            />
            This is a personal best
          </label>
        </div>

        {form.isPersonalBest && (
          <label>
            Personal Best Type
            <input
              type="text"
              value={form.personalBestType || ""}
              onChange={(e) =>
                setForm((f) => ({ ...f, personalBestType: e.target.value }))
              }
              placeholder="Fastest 5K, Longest run, etc."
            />
          </label>
        )}
      </div>

      {/* Technical Info */}
      <div className={styles.formSection}>
        <h3 className={styles.sectionTitle}>Technical Information</h3>

        <div className={styles.formRow}>
          <label>
            Confidence Level
            <input
              type="number"
              step="0.1"
              min="0"
              max="1"
              value={form.confidence || ""}
              onChange={(e) =>
                setForm((f) => ({ ...f, confidence: Number(e.target.value) }))
              }
              placeholder="0.95"
            />
          </label>

          <label>
            Completed Date
            <input
              type="datetime-local"
              value={
                form.completedDate
                  ? new Date(form.completedDate).toISOString().slice(0, 16)
                  : ""
              }
              onChange={(e) =>
                setForm((f) => ({
                  ...f,
                  completedDate: e.target.value
                    ? new Date(e.target.value).toISOString()
                    : "",
                }))
              }
            />
          </label>
        </div>

        <div className={styles.checkboxRow}>
          <label className={styles.checkboxLabel}>
            <input
              type="checkbox"
              checked={form.isWorkoutImage || false}
              onChange={(e) =>
                setForm((f) => ({ ...f, isWorkoutImage: e.target.checked }))
              }
            />
            This data was extracted from a workout image
          </label>
        </div>

        <label>
          Cast Hash
          <input
            type="text"
            value={form.castHash || ""}
            onChange={(e) =>
              setForm((f) => ({ ...f, castHash: e.target.value }))
            }
            placeholder="Farcaster cast hash"
          />
        </label>

        <label>
          Raw Extracted Text
          <textarea
            value={form.rawText || ""}
            onChange={(e) =>
              setForm((f) => ({ ...f, rawText: e.target.value }))
            }
            placeholder="Raw text extracted from workout image..."
            rows={4}
          />
        </label>
      </div>

      <div className={styles.editFormActions}>
        <button type="button" onClick={onCancel} disabled={isLoading}>
          Cancel
        </button>
        <button type="submit" disabled={isLoading}>
          {isLoading ? "Saving..." : "Save Changes"}
        </button>
      </div>
    </form>
  );
};

export default WorkoutFeed;
