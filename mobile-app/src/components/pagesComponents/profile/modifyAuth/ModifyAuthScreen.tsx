import {useLocalSearchParams} from "expo-router";
import {AuthInfo} from "@/src/services/users/authService";

export default function modifyAuthScreen() {

    const params = useLocalSearchParams<{auth: string }>()
    const userAuthInfo = JSON.parse(params.auth) as AuthInfo


    async function modUserAuthInfo(){
        /*
         comportamenti previsti:
             - Possibilità di modificare la mail
             - Possibilità di impostare/modificare la password
    */
    }

    async function unlinkExternalProvider(){
        /*
           comportamenti previsti:
               - Possibilità di scollegarsi dal provider esterno
               - In caso di scollegamento è necessario eseguire
                 nuovamente il login per collegare l'utente
           */
    }


    /*
    comportamenti previsti:
        - Possibilità di modificare la mail
        - Possibilità di impostare/modificare la password
        - Possibilità di scollegarsi dal provider esterno
    */
    return (
        <>
        </>
    )
}