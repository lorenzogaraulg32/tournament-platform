import {SPORT_ROLES} from "@/src/services/users/userConstants";
import {UserOnBoardingInfo} from "@/src/services/users/userService";
import {SelectedImage} from "@/src/services/users/imagesService";

// Location opzionale, ma se presente deve essere valida
export function validateUserLocation(
    userData: UserOnBoardingInfo
): string {
    if (!userData.location) {
        return "";
    }

    const {label, latitude, longitude} = userData.location;

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

    return "";
}


// Sport
// Ogni sport deve avere almeno un ruolo
export function validateUserSportsAndRoles(userData: UserOnBoardingInfo): string {

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
        return "Seleziona almeno un ruolo per ogni sport"
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

    return ""
}

export function validateBirthDate(userData: UserOnBoardingInfo): string {
    if (!userData.birthDate) {
        return "La data di nascita è obbligatoria";
    } else {
        const birthDate = new Date(userData.birthDate);

        if (
            Number.isNaN(birthDate.getTime()) ||
            birthDate >= new Date()
        ) {
            return "La data di nascita non è valida";
        }
    }
    return ""
}

export function validateUsername(userData: UserOnBoardingInfo): string {
    const username = userData.username.trim()
    if (!username) {
        return "L'username è obbligatorio";
    } else if (username.length > 20) {
        return "Lo username non può superare i 20 caratteri";
    }

    return ""
}

export function validateFirstName(userData: UserOnBoardingInfo): string {

    const firstName = userData.firstName.trim()

    if (!firstName) {
        return "Il nome è obbligatorio";
    } else if (firstName.length > 20) {
        return "Il nome non può superare i 20 caratteri";
    }

    return ""
}

export function validateLastName(userData: UserOnBoardingInfo): string {

    const lastName = userData.lastName.trim()

    if (!lastName) {
        return "Il cognome è obbligatorio";
    } else if (lastName.length > 20) {
        return "Il cognome non può superare i 20 caratteri";
    }

    return ""
}

export function validateImage(logo?: SelectedImage | null): string {
    if (logo) {
        if (
            logo?.fileSize !== undefined &&
            logo.fileSize > 2 * 1024 * 1024
        ) {
            return "L'immagine caricata non può superare i 2 MB"
        }
        return ""
    }
    return ""
}
