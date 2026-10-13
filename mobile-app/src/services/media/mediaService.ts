export type Media = {
    uri: string;
    fileName?: string;
    mimeType?: string;
    fileSize?: number;
};


export function isPdf(file: Media): boolean {
    return file.mimeType === "application/pdf"
        || (file.fileName?.toLowerCase().endsWith(".pdf") ?? false);
}



