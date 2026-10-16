import {useLocalSearchParams} from "expo-router";
import {UserInfo} from "@/src/services/users/userDTO";

export default function modifyAuthScreen() {

    const params = useLocalSearchParams<{ profile: string }>()
    const oldProfile = JSON.parse(params.profile) as UserInfo



    return (
        <>
        </>
    )
}