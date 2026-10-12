import {ActivityRequest, ActivityResponse, EntityType} from "@/src/services/activities/ActivityDTO";
import {authenticatedFetch} from "@/src/services/fetchService";
import {API_URL} from "@/src/services/common";
import {normalizeApiRequestError, printApiRequestError} from "@/src/services/errorService";


export async function postActivity(request: ActivityRequest) {


    const response = await authenticatedFetch(
        API_URL + "/activities",
        {
            method: "POST",
            headers: {
                Accept: "application/json",
            },
            body: JSON.stringify(request)
        }
    )

    if (!response.ok) {
        //al momento le perdite dati in questo contesto sono consentite,
        //se una richiesta di questo tipo fallisce non è un problema
        const apiError = normalizeApiRequestError(response);
        printApiRequestError(apiError)
    }
}


export async function fetchActivities(
    entityId: string,
    entityType: EntityType,
    page: number = 0,
    size: number = 20
): Promise<ActivityResponse[]> {

    const params = new URLSearchParams({
        entityId,
        entityType,
        page: page.toPrecision(),
        size: size.toString()
    })

    const response = await authenticatedFetch(
        API_URL + "/activities?" + params.toString(),
        {
            method: "GET",
            headers: {
                Accept: "application/json"
            }
        }
    )

    return await response.json() as ActivityResponse[]


}