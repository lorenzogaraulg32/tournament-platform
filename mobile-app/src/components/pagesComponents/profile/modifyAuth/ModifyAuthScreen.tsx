import {useLocalSearchParams} from "expo-router";
import {AuthInfo} from "@/src/services/users/authService";
import ModifyAuthPage from "@/src/components/pagesComponents/profile/modifyAuth/ModifyAuthPage";
import {useState} from "react";

export default function modifyAuthScreen() {

    const params = useLocalSearchParams<{ auth: string }>()
    const userAuthInfo = JSON.parse(params.auth) as AuthInfo

    const [isLoading, setLoading] = useState<boolean>(false)
    const [error, setError] = useState<string | undefined>(undefined)


    async function changeEmail(email: string) {
        //TODO: Collegare al backend tramite il service. la schermata è ok
        console.log("Premuto cambia email")
    }

    async function changePassword(password: string, oldPassword: string) {
        //TODO: Collegare al backend tramite il service, la schermata è ok
        console.log("Premuto cambia password")
    }

    async function unlinkExternalProvider() {
        /*
           comportamenti previsti:
               - Possibilità di scollegarsi dal provider esterno
               - In caso di scollegamento è necessario eseguire
                 nuovamente il login per collegare l'utente
           */
    }



    return (
        <ModifyAuthPage
            error={error}
            setError={setError}
            loading={isLoading}
            oldEmail={userAuthInfo.email}
            changeEmail={changeEmail}
            hasInternalPassword={userAuthInfo.hasLocalAuthentication}
            changePassword={changePassword}
        />
    )
}