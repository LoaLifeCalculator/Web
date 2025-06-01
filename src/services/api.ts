import axios from 'axios';
import { CharacterResponseDto, SearchResponseDto } from '../types';

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
  name: string;
  image: string;
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

export const api = {
  getResourcePrices: async () => {
    const response = await axios.get(`${API_BASE_URL}/resource`);
    return response.data;
  },
};

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
