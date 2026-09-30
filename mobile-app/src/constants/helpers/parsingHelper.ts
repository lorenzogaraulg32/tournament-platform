import {LocalDateString} from "@/src/services/common";

export function parseDateForPicker(value: string | null): Date {
    if (!value) {
        return new Date(2000, 0, 1);
    }

    const [year, month, day] =
        value.split("-").map(Number);

    return new Date(
        year,
        month - 1,
        day
    );
}


export function formatDateForBackend(date: Date): LocalDateString {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}` as LocalDateString;
}