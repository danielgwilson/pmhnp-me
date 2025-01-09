const HISTORY_KEY = 'pmhnp-bc-history';

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
