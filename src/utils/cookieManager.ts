import Cookies from 'js-cookie';
import type { CookieAttributes } from 'js-cookie';

const SEARCH_HISTORY_KEY = 'search_history';
const MAX_HISTORY_LENGTH = 5;

export const getSearchHistory = (): string[] => {
    const history = Cookies.get(SEARCH_HISTORY_KEY);
    return history ? JSON.parse(history) : [];
};

export const addToSearchHistory = (nickname: string): void => {
    const currentHistory = getSearchHistory();
    
    // 이미 존재하는 닉네임이면 제거 (최신 검색이 위로 오도록)
    const filteredHistory = currentHistory.filter(item => item !== nickname);
    
    // 새로운 닉네임을 맨 앞에 추가
    const newHistory = [nickname, ...filteredHistory];
    
    // 최대 5개까지만 유지
    const trimmedHistory = newHistory.slice(0, MAX_HISTORY_LENGTH);
    
    // 쿠키에 저장 (1년 유효)
    const options: CookieAttributes = { 
        expires: 365,
        path: '/'
    };
    Cookies.set(SEARCH_HISTORY_KEY, JSON.stringify(trimmedHistory), options);
};

export const removeFromSearchHistory = (nickname: string): void => {
    const history = getSearchHistory();
    const filteredHistory = history.filter(name => name !== nickname);
    
    if (filteredHistory.length > 0) {
        const options: CookieAttributes = { expires: 30 };
        Cookies.set(SEARCH_HISTORY_KEY, JSON.stringify(filteredHistory), options);
    } else {
        Cookies.remove(SEARCH_HISTORY_KEY);
    }
};

export const clearSearchHistory = (): void => {
    Cookies.remove(SEARCH_HISTORY_KEY);
}; 