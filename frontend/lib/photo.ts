export function resolvePhotoUrl(photoUrl?: string | null): string | null {
    if (!photoUrl) return null;

    // If already absolute
    if (photoUrl.startsWith("http")) {
        return photoUrl;
    }

    const API_BASE =
        process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

    return `${API_BASE}${photoUrl}`;
}
