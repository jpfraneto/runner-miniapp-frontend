import React, { useState } from "react";
import styles from "./GoalSetting.module.scss";

interface GoalSettingProps {
  onGoalSet: (goal: string, goalType: "preset" | "custom") => void;
}

const PRESET_GOALS = [
  { value: "5k", label: "5K Run", description: "Complete a 5 kilometer run" },
  {
    value: "10k",
    label: "10K Run",
    description: "Complete a 10 kilometer run",
  },
  {
    value: "21k",
    label: "Half Marathon",
    description: "Complete a 21 kilometer run",
  },
  {
    value: "42k",
    label: "Full Marathon",
    description: "Complete a 42 kilometer run",
  },
];

const GoalSetting: React.FC<GoalSettingProps> = ({ onGoalSet }) => {
  const [selectedGoal, setSelectedGoal] = useState<string>("");
  const [customGoal, setCustomGoal] = useState<string>("");
  const [goalType, setGoalType] = useState<"preset" | "custom">("preset");

  const handleGoalSelection = (goal: string) => {
    setSelectedGoal(goal);
    setGoalType("preset");
    setCustomGoal("");
  };

  const handleCustomGoalChange = (
    e: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    setCustomGoal(e.target.value);
    setGoalType("custom");
    setSelectedGoal("");
  };

  const handleSubmit = () => {
    const goal = goalType === "preset" ? selectedGoal : customGoal;
    if (goal.trim()) {
      onGoalSet(goal, goalType);
    }
  };

  const isSubmitDisabled =
    goalType === "preset" ? !selectedGoal : !customGoal.trim();

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>Set Your Running Goal</h1>
        <p className={styles.subtitle}>
          Choose a goal to work towards and we'll create a personalized training
          plan for you
        </p>
      </div>

      <div className={styles.goalOptions}>
        <h2 className={styles.sectionTitle}>Next Race</h2>
        <div className={styles.presetGoals}>
          {PRESET_GOALS.map((goal) => (
            <button
              key={goal.value}
              className={`${styles.goalButton} ${
                selectedGoal === goal.value ? styles.selected : ""
              }`}
              onClick={() => handleGoalSelection(goal.value)}
            >
              <div className={styles.goalIcon}>🏃‍♂️</div>
              <div className={styles.goalInfo}>
                <div className={styles.goalLabel}>{goal.label}</div>
                <div className={styles.goalDescription}>{goal.description}</div>
              </div>
            </button>
          ))}
        </div>
      </div>

      <div className={styles.customGoalSection}>
        <h2 className={styles.sectionTitle}>Or Set a Custom Goal</h2>
        <textarea
          className={styles.customGoalInput}
          placeholder="Describe your custom running goal... (e.g., 'Run for 30 minutes without stopping', 'Complete a trail run in the mountains', 'Improve my 5K time to under 25 minutes')"
          value={customGoal}
          onChange={handleCustomGoalChange}
          rows={4}
        />
      </div>

      <div className={styles.actionSection}>
        <button
          className={`${styles.submitButton} ${
            isSubmitDisabled ? styles.disabled : ""
          }`}
          onClick={handleSubmit}
          disabled={isSubmitDisabled}
        >
          Create My Training Plan
        </button>
      </div>
    </div>
  );
};

export default GoalSetting;
