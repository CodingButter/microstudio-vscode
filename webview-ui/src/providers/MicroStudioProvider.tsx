import MicroStudioClient from '../lib/MicroStudioApi';
import { vscode } from '../utilities/vscode';
import { useEffect, useState } from 'react';
import { MicroStudioContext } from '../hooks/useMicroStudio';
import useStates from '../hooks/useStates';
import {
  type AchievementsResponse,
  type Achievement,
  type Project,
} from '../types/microstudio-api';

export const MicroStudioProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [client, setClient] = useState<MicroStudioClient | null>(null);
  const [token, setToken] = useStates<string | null>('token', null);
  const [projects, setProjects] = useState<Project[]>([]);
  const [currentProject, setCurrentProject] = useStates<Project | null>(
    'currentProject',
    null
  );
  const [achievements, setAchievements] = useState<Achievement[]>([]);

  const listProjects = async () => {
    const projects: Project[] =
      (await client?.getProjects()) || ([] as Project[]);
    setProjects(projects);
  };

  const selectProject = async (project: Project) => {
    setCurrentProject(project);
  };

  const login = async (nick: string, password: string) => {
    try {
      const _client = await MicroStudioClient.connect(nick, password);
      setClient(_client);
    } catch (e: any) {
      vscode.postMessage({ command: 'error', message: e.message });
    }
  };

  useEffect(() => {
    if (client) {
      setToken(client.getToken());
      const achievementCallback = ({ achievements }: AchievementsResponse) => {
        setAchievements(achievements);
      };
      ///@ts-expect-error Some problem with the type of callback
      client.on('achievements', achievementCallback);
    } else {
      if (token) {
        MicroStudioClient.connect('', '', token as string).then((_client) => {
          setClient(_client);
        });
      }
    }
  }, [client, token, setToken]);

  return (
    <MicroStudioContext.Provider
      value={{
        client,
        login,
        listProjects,
        selectProject,
        projects,
        currentProject,
        achievements,
      }}
    >
      {children}
    </MicroStudioContext.Provider>
  );
};
