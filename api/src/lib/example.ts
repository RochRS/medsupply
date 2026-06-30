export function formatDate(date: Date): string {
  return date.toISOString().split("T")[0];
}

export function paginate(page: number, limit: number) {
  const offset = (page - 1) * limit;
  return { offset, limit };
}
