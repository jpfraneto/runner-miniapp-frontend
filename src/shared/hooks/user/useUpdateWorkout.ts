import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateWorkout } from "@/services/user";
import { RunningSession } from "@/shared/types/running";

export const useUpdateWorkout = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: updateWorkout,
    onSuccess: (updatedWorkout: RunningSession) => {
      // Invalidate relevant queries to refetch updated data
      queryClient.invalidateQueries({ queryKey: ['workoutHistory'] });
      queryClient.invalidateQueries({ queryKey: ['allUserWorkouts'] });
      queryClient.invalidateQueries({ queryKey: ['userWorkouts'] });
      
      // Optionally update cached data directly
      queryClient.setQueryData(['workout', updatedWorkout.id], updatedWorkout);
    },
  });
};
