export const API_URL = process.env.EXPO_PUBLIC_API_URL;


/*------------- Reclutamento -------------*/
export type RecruitmentStatus = "OPEN" | "CLOSED";


/*------------- Posizione -------------*/
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


/*------------- Date -------------*/
export type LocalDateString = `${number}-${number}-${number}`;

export function isTodayOrFuture(date: LocalDateString): boolean {
    const [year, month, day] = date.split("-").map(Number);

    const selectedDate = new Date(year, month - 1, day);

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    return selectedDate >= today;
}

export function isAfter(
    endDate: LocalDateString,
    startDate: LocalDateString
): boolean {
    const [startYear, startMonth, startDay] = startDate.split("-").map(Number);
    const [endYear, endMonth, endDay] = endDate.split("-").map(Number);

    const start = new Date(startYear, startMonth - 1, startDay);
    const end = new Date(endYear, endMonth - 1, endDay);

    return end >= start;
}