import { useMicroStudio } from '../hooks/useMicroStudio';
import type { Achievement } from '../types/microstudio-api';

export default function Achievements() {
  const { achievements } = useMicroStudio();

  return (
    <div>
      <h1>Achievements</h1>
      <ul>
        {achievements &&
          achievements.map((achievement: Achievement) => (
            <li key={achievement.id}>{achievement.info.name}</li>
          ))}
      </ul>
    </div>
  );
}
