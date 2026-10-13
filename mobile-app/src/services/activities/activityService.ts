import {ActivityRequest, ActivityResponse, EntityType} from "@/src/services/activities/ActivityDTO";
import {authenticatedFetch} from "@/src/services/fetchService";
import {API_URL} from "@/src/services/common";
import {normalizeApiRequestError, printApiRequestError} from "@/src/services/errorService";


export async function postActivity(request: ActivityRequest) {

    try {
        await authenticatedFetch(
            API_URL + "/activities",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Accept": "application/json",
                },
                body: JSON.stringify(request)
            }
        )
        console.log("Attività postata correttamente")
    } catch (error) {
        const apiError = normalizeApiRequestError(error);
        printApiRequestError(apiError)
        console.log("Errore nel post attività")
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