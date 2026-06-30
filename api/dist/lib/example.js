export function formatDate(date) {
    return date.toISOString().split("T")[0];
}
export function paginate(page, limit) {
    const offset = (page - 1) * limit;
    return { offset, limit };
}
