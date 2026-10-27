import {useLocalSearchParams} from "expo-router";
import {AuthInfo, fetchAuthInfo, modUserAuthInfo} from "@/src/services/users/authService";
import ModifyAuthPage from "@/src/components/pagesComponents/profile/modifyAuth/ModifyAuthPage";
import {useRef, useState} from "react";
import {normalizeApiRequestError} from "@/src/services/errorService";
import {useToast} from "@/src/components/common/Toast/ToastProvider";

export default function modifyAuthScreen() {

    const params = useLocalSearchParams<{ auth: string }>()
    const [userAuthInfo, setUserAuthInfo] = useState<AuthInfo>(JSON.parse(params.auth) as AuthInfo)

    const [isLoading, setLoading] = useState<boolean>(false)
    const [error, setError] = useState<string | undefined>(undefined)
    const submissionLock = useRef(false);


    const {showToast} = useToast();

    async function changeEmail(email: string) {
        if (submissionLock.current) return;
        submissionLock.current = true;
        setError(undefined);

        try {
            setLoading(true)
            await modUserAuthInfo({
                email: email,
                newPassword: null,
                oldPassword: null
            })
            await finishUpdate("Email modificata correttamente")
        } catch (error) {
            const apiError = normalizeApiRequestError(error)
            setError(apiError.message)
        } finally {
            setLoading(false)
        }
    }

    // mi serve controllare prima se ha una password impostata oppure no.
    // se non è impostata allora quella vecchia non va richiesta
    // se c'è quella vecchia invece va richiesta e controllata backend
    async function changePassword(password: string, oldPassword: string) {
        if (submissionLock.current) return;
        submissionLock.current = true;
        setError(undefined);
        try {
            if (isLoading) {
                return;
            }
            setLoading(true)
            await modUserAuthInfo({
                email: null,
                newPassword: password,
                oldPassword: oldPassword
            })
            await finishUpdate("Password modificata correttamente")
        } catch (error) {
            const apiError = normalizeApiRequestError(error)
            setError(apiError.message)
        } finally {
            setLoading(false)
        }
    }

    async function unlinkExternalProvider() {
        /*
           comportamenti previsti:
               - Possibilità di scollegarsi dal provider esterno
               - In caso di scollegamento è necessario eseguire
                 nuovamente il login per collegare l'utente
           */
    }


    async function finishUpdate(message: string) {
        try {
            const updatedInfo = await fetchAuthInfo(userAuthInfo.id);
            setUserAuthInfo(updatedInfo);

            showToast(message, true);
        } catch {
            showToast(
                `${message}. Impossibile aggiornare i dati visualizzati.`,
                true
            );
        }
    }


    return (
        <ModifyAuthPage
            error={error}
            setError={setError}
            loading={isLoading}
            oldEmail={userAuthInfo.email}
            hasInternalPassword={userAuthInfo.hasLocalAuthentication}
            changeEmail={changeEmail}
            changePassword={changePassword}
        />
    )
}