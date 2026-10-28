import {useLocalSearchParams} from "expo-router";
import {
    AuthInfo,
    fetchAuthInfo,
    handleLogout,
    linkWithGoogle,
    modUserAuthInfo,
    requestGoogleIdToken,
    unLinkWithGoogle
} from "@/src/services/users/authService";
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
            console.log(apiError)
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
        if (isLoading) return;

        setLoading(true);

        try {
            await unLinkWithGoogle();
            await finishUpdate("Account esterno scollegato correttamente")
        } catch (error) {
            const apiError = normalizeApiRequestError(error)
            setError(apiError.message)
        } finally {
            setLoading(false);
        }


        await handleLogout();
    }

    const linkExternalProvider = async () => {
        if (isLoading) return;

        setLoading(true);

        try {
            const idToken = await requestGoogleIdToken();

            if (!idToken) return;

            await linkWithGoogle(idToken);

            await finishUpdate("Account esterno collegato correttamente")
        } catch (error) {
            const apiError = normalizeApiRequestError(error)
            setError(apiError.message)
        } finally {
            setLoading(false);
        }
    };


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
            externalProvider={userAuthInfo.externalProvider}
            changeEmail={changeEmail}
            changePassword={changePassword}
            linkExternal={linkExternalProvider}
            unlinkExternal={unlinkExternalProvider}
        />
    )
}