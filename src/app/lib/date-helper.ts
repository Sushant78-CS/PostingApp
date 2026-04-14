export const formatTimeAge = (createdAt: string): string => {
  const now = new Date();
  const created = new Date(createdAt);

  const diff = now.getTime() - created.getTime();

  const minutes = Math.floor(diff / (1000 * 60));
  const hour = Math.floor(diff / (1000 * 60 * 60));

  if (minutes < 1) return "Just now";
  if (minutes < 60) {
    return `${minutes}m ago`;
  }

  if (hour < 24) {
    return `${hour}h ago`;
  }
  return `${Math.floor(hour / 24)}d ago`;
};

export const formatTimeRemaining = (expiresAt: string): string => {
  const now = new Date();
  const expires = new Date(expiresAt);

  const diff = expires.getTime() - now.getTime();

  if (diff <= 0) return "Expired";

  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  const hour = Math.floor(diff / (1000 * 60 * 60));

  if (hour > 0) {
    return `${hour}h ${minutes}m left`;
  }
  return `${minutes}m left`;
};
