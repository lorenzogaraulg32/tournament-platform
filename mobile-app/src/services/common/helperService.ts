export async function readResponseBody(
    response: Response
): Promise<unknown> {
    const text = await response.text();

    if (!text.trim()) {
        return null;
    }

    try {
        return JSON.parse(text);
    } catch {
        return text;
    }
}