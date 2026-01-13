export function getDaysUntilWedding(dateString?: string): string {
  if (!dateString) return "TBD";

  const weddingDate = new Date(dateString);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  weddingDate.setHours(0, 0, 0, 0);

  const diffTime = weddingDate.getTime() - today.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays < 0) return `${Math.abs(diffDays)} days ago`;
  if (diffDays === 0) return "Today!";
  if (diffDays === 1) return "Tomorrow";
  return `${diffDays} days`;
}

export function getWeddingStatus(dateString?: string): string {
  if (!dateString) return "Pending";

  const weddingDate = new Date(dateString);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  weddingDate.setHours(0, 0, 0, 0);

  if (weddingDate.getTime() < today.getTime()) return "Completed";
  if (weddingDate.getTime() === today.getTime()) return "Today";
  return "Upcoming";
}

export function isUpcoming(dateString?: string): boolean {
  if (!dateString) return false;

  const weddingDate = new Date(dateString);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  weddingDate.setHours(0, 0, 0, 0);

  return weddingDate.getTime() >= today.getTime();
}