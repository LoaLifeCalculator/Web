import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:8080';

export interface Character {
  characterName: string;
  serverName: string;
  level: number;
  className: string;
}

export interface Resource {
  item: string;
  avgPrice: number;
  id: number;
}

export interface SearchResponse {
  expeditions: {
    expeditions: {
      [server: string]: Character[];
    };
  };
  resources: Resource[];
}

export interface ContentReward {
  name: string;
  gold: number;
  details: string[];
}

export interface ContentSection {
  title: string;
  rewards: ContentReward[];
}

export const searchCharacter = async (name: string): Promise<SearchResponse> => {
  try {
    const response = await axios.get(`${API_BASE_URL}/search`, {
      params: { name }
    });
    return response.data;
  } catch (error) {
    console.error('캐릭터 검색 중 오류 발생:', error);
    throw error;
  }
};

export const getContentRewards = async (): Promise<ContentSection[]> => {
  try {
    const response = await axios.get(`${API_BASE_URL}/api/content-rewards`);
    return response.data;
  } catch (error) {
    console.error('컨텐츠 보상 정보 조회 중 오류 발생:', error);
    throw error;
  }
};

export const updateResourcePrice = async (resourceId: string, price: number): Promise<void> => {
  try {
    await axios.put(`${API_BASE_URL}/api/resources/${resourceId}/price`, { price });
  } catch (error) {
    console.error('재화 시세 업데이트 중 오류 발생:', error);
    throw error;
  }
}; 