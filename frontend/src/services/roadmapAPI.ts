const API_BASE_URL = 'http://localhost:8080/api';

export interface Topic {
  id?: number;
  name: string;
  description: string;
  difficulty: 'SIMPLE' | 'MEDIUM' | 'ADVANCED';
  positionX: number;
  positionY: number;
  orderIndex: number;
  dependsOn: number[];
  progress?: {
    status: 'NOT_STARTED' | 'IN_PROGRESS' | 'COMPLETED';
    problemsSolved: number;
    totalProblems: number;
    completionPercentage: number;
  };
}

export interface Roadmap {
  id?: number;
  name: string;
  description: string;
  groupId: string;
  createdBy: string;
  createdAt?: string;
  updatedAt?: string;
  topics: Topic[];
}

export interface ProgressUpdate {
  userId: string;
  topicId: number;
  status: 'NOT_STARTED' | 'IN_PROGRESS' | 'COMPLETED';
  problemsSolved: number;
  totalProblems: number;
}

class RoadmapAPI {
  async createRoadmap(roadmap: Omit<Roadmap, 'id' | 'createdAt' | 'updatedAt'>): Promise<Roadmap> {
    const response = await fetch(`${API_BASE_URL}/roadmaps`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(roadmap)
    });
    const result = await response.json();
    if (!result.success) throw new Error(result.message);
    return result.data;
  }

  async getRoadmapsByGroup(groupId: string, userId?: string): Promise<Roadmap[]> {
    const url = userId 
      ? `${API_BASE_URL}/roadmaps/group/${groupId}?userId=${userId}`
      : `${API_BASE_URL}/roadmaps/group/${groupId}`;
    const response = await fetch(url);
    const result = await response.json();
    if (!result.success) throw new Error(result.message);
    return result.data;
  }

  async getRoadmapById(id: number, userId?: string): Promise<Roadmap> {
    const url = userId
      ? `${API_BASE_URL}/roadmaps/${id}?userId=${userId}`
      : `${API_BASE_URL}/roadmaps/${id}`;
    const response = await fetch(url);
    const result = await response.json();
    if (!result.success) throw new Error(result.message);
    return result.data;
  }

  async updateRoadmap(id: number, roadmap: Omit<Roadmap, 'id' | 'createdAt' | 'updatedAt'>): Promise<Roadmap> {
    const response = await fetch(`${API_BASE_URL}/roadmaps/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(roadmap)
    });
    const result = await response.json();
    if (!result.success) throw new Error(result.message);
    return result.data;
  }

  async deleteRoadmap(id: number): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/roadmaps/${id}`, {
      method: 'DELETE'
    });
    const result = await response.json();
    if (!result.success) throw new Error(result.message);
  }

  async updateProgress(progress: ProgressUpdate): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/progress`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(progress)
    });
    const result = await response.json();
    if (!result.success) throw new Error(result.message);
  }

  async getUserProgress(roadmapId: number, userId: string): Promise<any[]> {
    const response = await fetch(`${API_BASE_URL}/progress/roadmap/${roadmapId}/user/${userId}`);
    const result = await response.json();
    if (!result.success) throw new Error(result.message);
    return result.data;
  }

  async getGroupProgress(groupId: string): Promise<any[]> {
    const response = await fetch(`${API_BASE_URL}/progress/group/${groupId}`);
    const result = await response.json();
    if (!result.success) throw new Error(result.message);
    return result.data;
  }

  async getGroupHeatmap(memberIds: string[]): Promise<Record<string, number>> {
    const response = await fetch(`${API_BASE_URL}/heatmap/group?memberIds=${memberIds.join(',')}`);
    const result = await response.json();
    if (!result.success) throw new Error(result.message);
    return result.data;
  }

  async updateTopicPosition(topicId: number, positionX: number, positionY: number): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/roadmaps/topics/${topicId}/position`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ positionX, positionY })
    });
    const result = await response.json();
    if (!result.success) throw new Error(result.message);
  }
}

export const roadmapAPI = new RoadmapAPI();
