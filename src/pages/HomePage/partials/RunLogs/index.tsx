// Dependencies
import React, { useState } from "react";

// StyleSheet
import styles from "./RunLogs.module.scss";

// Components
import Typography from "@/shared/components/Typography";
import Button from "@/shared/components/Button";

interface RunLogsProps {}

interface RunLog {
  id: number;
  date: string;
  distance: string;
  duration: string;
  pace: string;
  type: string;
  notes?: string;
}

const RunLogs: React.FC<RunLogsProps> = () => {
  const [showLogForm, setShowLogForm] = useState(false);

  const runLogs: RunLog[] = [
    {
      id: 1,
      date: "2024-01-15",
      distance: "5.2 km",
      duration: "28:45",
      pace: "5:32 /km",
      type: "Easy Run",
      notes: "Felt great today! Perfect weather for running.",
    },
    {
      id: 2,
      date: "2024-01-13",
      distance: "8.0 km",
      duration: "42:30",
      pace: "5:19 /km",
      type: "Long Run",
      notes: "Long run felt challenging but rewarding.",
    },
    {
      id: 3,
      date: "2024-01-11",
      distance: "3.0 km",
      duration: "15:20",
      pace: "5:07 /km",
      type: "Interval",
      notes: "Speed work - 6x500m intervals",
    },
  ];

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <Typography variant="druk" weight="wide" size={24} lineHeight={28}>
          Run History
        </Typography>
        <Button
          variant="primary"
          caption="Log New Run"
          onClick={() => setShowLogForm(true)}
          className={styles.logNewButton}
        />
      </div>

      <div className={styles.stats}>
        <div className={styles.stat}>
          <Typography variant="druk" weight="wide" size={20} lineHeight={24}>
            {runLogs.length}
          </Typography>
          <Typography
            variant="geist"
            weight="regular"
            size={12}
            lineHeight={16}
          >
            Runs This Week
          </Typography>
        </div>
        <div className={styles.stat}>
          <Typography variant="druk" weight="wide" size={20} lineHeight={24}>
            16.2 km
          </Typography>
          <Typography
            variant="geist"
            weight="regular"
            size={12}
            lineHeight={16}
          >
            Total Distance
          </Typography>
        </div>
        <div className={styles.stat}>
          <Typography variant="druk" weight="wide" size={20} lineHeight={24}>
            1:26:35
          </Typography>
          <Typography
            variant="geist"
            weight="regular"
            size={12}
            lineHeight={16}
          >
            Total Time
          </Typography>
        </div>
      </div>

      <div className={styles.logs}>
        {runLogs.map((log) => (
          <div key={log.id} className={styles.logItem}>
            <div className={styles.logHeader}>
              <Typography
                variant="druk"
                weight="wide"
                size={16}
                lineHeight={20}
              >
                {formatDate(log.date)}
              </Typography>
              <div className={styles.runType}>
                <Typography
                  variant="geist"
                  weight="medium"
                  size={12}
                  lineHeight={16}
                >
                  {log.type}
                </Typography>
              </div>
            </div>

            <div className={styles.logDetails}>
              <div className={styles.metric}>
                <Typography
                  variant="geist"
                  weight="medium"
                  size={14}
                  lineHeight={18}
                >
                  Distance
                </Typography>
                <Typography
                  variant="druk"
                  weight="wide"
                  size={16}
                  lineHeight={20}
                >
                  {log.distance}
                </Typography>
              </div>
              <div className={styles.metric}>
                <Typography
                  variant="geist"
                  weight="medium"
                  size={14}
                  lineHeight={18}
                >
                  Duration
                </Typography>
                <Typography
                  variant="druk"
                  weight="wide"
                  size={16}
                  lineHeight={20}
                >
                  {log.duration}
                </Typography>
              </div>
              <div className={styles.metric}>
                <Typography
                  variant="geist"
                  weight="medium"
                  size={14}
                  lineHeight={18}
                >
                  Pace
                </Typography>
                <Typography
                  variant="druk"
                  weight="wide"
                  size={16}
                  lineHeight={20}
                >
                  {log.pace}
                </Typography>
              </div>
            </div>

            {log.notes && (
              <div className={styles.notes}>
                <Typography
                  variant="geist"
                  weight="regular"
                  size={14}
                  lineHeight={18}
                >
                  "{log.notes}"
                </Typography>
              </div>
            )}
          </div>
        ))}
      </div>

      {showLogForm && (
        <div className={styles.logForm}>
          <Typography variant="druk" weight="wide" size={18} lineHeight={22}>
            Log Your Run
          </Typography>
          <div className={styles.formActions}>
            <Button
              variant="outline"
              caption="Cancel"
              onClick={() => setShowLogForm(false)}
            />
            <Button
              variant="primary"
              caption="Save Run"
              onClick={() => {
                console.log("Save run clicked");
                setShowLogForm(false);
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default RunLogs;
