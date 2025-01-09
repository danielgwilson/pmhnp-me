const HISTORY_KEY = 'pmhnp-bc-history';
const MESSAGE_COUNT_KEY = 'pmhnp-bc-message-counts';
const LIKES_KEY = 'pmhnp-bc-likes';

export function addToHistory(topicId: string) {
  const history = getHistory();
  const updatedHistory = [topicId, ...history.filter(id => id !== topicId)].slice(0, 20);
  localStorage.setItem(HISTORY_KEY, JSON.stringify(updatedHistory));
}

export function getHistory(): string[] {
  try {
    const history = localStorage.getItem(HISTORY_KEY);
    return history ? JSON.parse(history) : [];
  } catch {
    return [];
  }
}

export function getMessageCount(topicId: string): number {
  try {
    const counts = localStorage.getItem(MESSAGE_COUNT_KEY);
    const parsed = counts ? JSON.parse(counts) : {};
    return parsed[topicId] || 0;
  } catch {
    return 0;
  }
}

export function incrementMessageCount(topicId: string) {
  try {
    const counts = localStorage.getItem(MESSAGE_COUNT_KEY);
    const parsed = counts ? JSON.parse(counts) : {};
    parsed[topicId] = (parsed[topicId] || 0) + 1;
    localStorage.setItem(MESSAGE_COUNT_KEY, JSON.stringify(parsed));
  } catch {
    // Silently fail if localStorage is not available
  }
}

export function getLikes(topicId: string): number {
  try {
    const likes = localStorage.getItem(LIKES_KEY);
    const parsed = likes ? JSON.parse(likes) : {};
    return parsed[topicId] || 0;
  } catch {
    return 0;
  }
}

export function toggleLike(topicId: string) {
  try {
    const likes = localStorage.getItem(LIKES_KEY);
    const parsed = likes ? JSON.parse(likes) : {};
    parsed[topicId] = (parsed[topicId] || 0) === 0 ? 1 : 0;
    localStorage.setItem(LIKES_KEY, JSON.stringify(parsed));
    return parsed[topicId];
  } catch {
    return 0;
  }
}