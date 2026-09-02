import {ApiRequestError, throwApiRequestError} from "@/src/services/errorService";
import {getAuthorizationHeader, handleExpiredSession} from "@/src/services/users/sessionService";


//gestisce le richieste con token
export async function authenticatedFetch(
    url: string,
    options: RequestInit = {}
): Promise<Response> {
    const authorization =
        await getAuthorizationHeader();

    const headers = new Headers(options.headers);
    headers.set("Authorization", authorization);


    const response = await fetchWithTimeout(
        url,
        {
            ...options,
            headers,
        }
    );


    // qua la risposta è arrivata, controlliamo se è okay
    if (!response.ok) {
        const body = await readResponseBody(response);

        //gestisco il fatto che la sessione potrebbe essere scaduta/richieste senza auth
        if (response.status === 401) {
            await handleExpiredSession()
        }

        //gestisco gli altri errori che possono presentarsi, sia applicativi custom definiti nei microservizi che standard
        throwApiRequestError(
            response.status,
            body,
            "Errore durante la richiesta"
        );
    }

    return response;
}


//aggiunge il timeout al fetch
export async function fetchWithTimeout(
    url: string,
    options: RequestInit,
    timeoutMs = 10_000
): Promise<Response> {
    const controller = new AbortController();
    let didTimeout = false;

    const timeoutId = setTimeout(() => {
        didTimeout = true;
        controller.abort();
    }, timeoutMs);

    try {
        return await fetch(url, {
            ...options,
            signal: controller.signal,
        });
    } catch (error) {

        //qua lanciamo errori di timeout e di server offline/no connessione
        if (error instanceof Error) {
            console.log("Tipo:", error.name);
            console.log("Messaggio originale:", error.message);
            console.log("Stack:", error.stack);
            console.log("Cause:", error.cause);
        }
        if (didTimeout) {
            throw new ApiRequestError(
                "La richiesta sta impiegando troppo tempo. Controlla la connessione.",
                0,
                "REQUEST_TIMEOUT"
            );
        }

        throw new ApiRequestError(
            "Impossibile contattare il server. Controlla la connessione.",
            0,
            "NETWORK_ERROR"
        );
    } finally {
        clearTimeout(timeoutId);
    }
}


export async function readResponseBody(response: Response): Promise<unknown> {
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