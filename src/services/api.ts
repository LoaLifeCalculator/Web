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
      [key: string]: Character[];
    };
  };
  resources: Resource[];
  [key: string]: any;
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

export interface ExpeditionResponse {
  success: boolean;
  message: string;
  data?: {
    expeditions: {
      [key: string]: Character[];
    };
  };
}

export const api = {
  getResourcePrices: async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/resource`);
      
      // 응답 데이터 검증
      if (!response.data) {
        throw new Error('서버 응답이 올바르지 않습니다.');
      }

      // 데이터 형식 검증
      if (!Array.isArray(response.data)) {
        throw new Error('리소스 데이터 형식이 올바르지 않습니다.');
      }

      // 필수 필드 검증
      const isValidResource = (resource: any): resource is Resource => {
        return (
          typeof resource === 'object' &&
          typeof resource.item === 'string' &&
          typeof resource.avgPrice === 'number' &&
          resource.avgPrice >= 0 &&
          typeof resource.id === 'number'
        );
      };

      const validResources = response.data.filter(isValidResource);
      
      if (validResources.length === 0) {
        throw new Error('유효한 리소스 데이터가 없습니다.');
      }

      return validResources;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.response) {
          // 서버가 응답을 반환했지만 오류 상태 코드
          throw new Error(`서버 오류: ${error.response.status} - ${error.response.data?.message || '알 수 없는 오류'}`);
        } else if (error.request) {
          // 요청은 보냈지만 응답을 받지 못함
          throw new Error('서버에 연결할 수 없습니다. 네트워크 연결을 확인해주세요.');
        } else {
          // 요청 설정 중 오류 발생
          throw new Error(`요청 오류: ${error.message}`);
        }
      }
      // 기타 오류
      throw new Error('리소스 가격을 불러오는 중 오류가 발생했습니다.');
    }
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

// 원정대 캐릭터 정보 갱신
export const renewExpeditionCharacters = async (name: string): Promise<{ expeditions: { [key: string]: Character[] } }> => {
  try {
    const response = await axios.get(`${API_BASE_URL}/renewal`, {
      params: { name },
      headers: {
        'Content-Type': 'application/json',
      },
    });

    return response.data;
  } catch (error) {
    console.error('원정대 캐릭터 정보 갱신 중 오류 발생:', error);
    throw error;
  }
};
