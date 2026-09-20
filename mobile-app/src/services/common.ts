
export const API_URL = process.env.EXPO_PUBLIC_API_URL;

export type GeoLocation = {
    label: string;
    latitude: number;
    longitude: number;
};

export function formatLocationLabel(location: string): string {

    return location
        .split(",")
        .map(part => part.trim())
        .filter(Boolean)
        .join("  ·  ");
}