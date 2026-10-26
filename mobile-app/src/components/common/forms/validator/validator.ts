import {SPORT_ROLES, UserCreationRequest, UserModRequest} from "@/src/services/users/userDTO";
import {normalizeApiRequestError} from "@/src/services/errorService";
import {GeoLocation} from "@/src/services/common";
import {Media} from "@/src/services/media/mediaService";

/**
 * Racchiude gran parte del boilerPlate code relativo alla validazione. Alcune validazioni sono troppo specifiche dei componenti,
 * per questo motive sono incluse nel componente "screen" relativo all'entità da validare
 */

/*
* team, tournament name = 40 max
* username, firstname, lastname = 20 max
*
* */
export const FIELD_LIMITS = {
    longName: {
        min: 5, max: 40
    },
    shortName: {
        min: 5, max: 20,
    },
}


type UniqueNameChecker = (name: string) => Promise<void>;

export async function validateUniqueName(uniqueName: string, uniqueChecker: UniqueNameChecker): Promise<string | undefined> {

    if (!uniqueName) {
        return "Campo obbligatorio";
    }

    try {
        await uniqueChecker(uniqueName)
        return
    } catch (error) {
        const apiError = normalizeApiRequestError(error);

        if (apiError.status === 409) {
            return apiError.message;
        }

        throw error;
    }
}

export function validateNameShort(name: string): string | undefined {

    if (!name) {
        return "Campo obbligatorio";
    }

    if (name.length > FIELD_LIMITS.shortName.max) {
        return "Non può superare i " + FIELD_LIMITS.shortName.max + " caratteri";
    }


    if (name.length < FIELD_LIMITS.shortName.min) {
        return "Non può avere meno di " + FIELD_LIMITS.shortName.min + " caratteri";
    }

    return
}


export function validateNameLong(name: string): string | undefined {

    if (!name) {
        return "Campo obbligatorio";
    }

    if (name.length > FIELD_LIMITS.longName.max) {
        return "Non può superare i " + FIELD_LIMITS.longName.max + " caratteri";
    }


    if (name.length < FIELD_LIMITS.longName.min) {
        return "Non può avere meno di " + FIELD_LIMITS.longName.min + " caratteri";
    }

    return
}


export function validateDescription(description: string): string | undefined {

    if (description.length > 160) return "La descrizione non può superare i 160 caratteri"


    return
}

/**
 * La location è opzionale, ma se presente deve rispettare i vincoli
 * @param location
 */
export function validateLocation(location: GeoLocation): string | undefined {
    if (!location) {
        return;
    }

    const {label, latitude, longitude} = location;

    if (
        !label?.trim() ||
        latitude == null ||
        longitude == null ||
        latitude < -90 ||
        latitude > 90 ||
        longitude < -180 ||
        longitude > 180
    ) {
        return "La posizione selezionata non è valida";
    }

    return;
}

/**
 *
 * @param media il file da verificare
 * @param maxSize la grandezza massima in MB (es. 1 sta per 1 MB)
 */

export function validateMedia(media: Media, maxSize: number): string | undefined {

    if (media.fileSize !== undefined && media.fileSize > maxSize * 1024 * 1024) {
        return `L'immagine caricata non può superare i ${maxSize} MB`
    }
    return
}


/**
 * Questa funzione server per verificare la correttezza della combinazione sport ruolo selezionata dall'utente, ed è esclusiva dell'entità utente
 * @param userData dati dell'utente
 */
export function validateUserSportsAndRoles(userData: UserModRequest | UserCreationRequest): string | undefined {

    if (userData.sports.length === 0) {
        return "Seleziona almeno uno sport";
    }

    const everySportHasRole = userData.sports.every(
        sport =>
            userData.roles.some(
                selectedRole =>
                    selectedRole.sport === sport
            )
    );

    if (!everySportHasRole) {
        return "Seleziona un ruolo per ogni sport"
    }

    // Nessun ruolo deve appartenere a uno sport non selezionato
    // e il ruolo deve essere valido per quello sport
    const invalidRole = userData.roles.some(
        selectedRole =>
            !userData.sports.includes(selectedRole.sport) ||
            !SPORT_ROLES[selectedRole.sport]?.includes(
                selectedRole.role
            )
    );

    if (invalidRole) {
        return "Uno dei ruoli selezionati non è valido";
    }

    return
}






