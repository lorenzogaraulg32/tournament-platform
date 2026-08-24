import {loadCurrentUserId} from "@/src/services/users/authService";
import {useEffect, useState} from "react";
import ProfilePage from "@/src/components/pagesComponents/profile/ProfilePage";

export default function Index() {

    const [userId, setUserId] = useState<string>("")

    useEffect(() => {
        async function loadId() {
            setUserId(await loadCurrentUserId())
        }

        void loadId();
    }, []);

    if (!userId) {
        return null;
    }

    return (
        <ProfilePage userId={userId} teams/>
    );


}
