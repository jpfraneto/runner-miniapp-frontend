// Use the new WorkoutsFeed component
import WorkoutsFeed from "../WorkoutsFeed";

const WorkoutFeed: React.FC = () => {
  return <WorkoutsFeed type="recent" maxEntries={20} />;
};

export default WorkoutFeed;