import {useEffect, useState} from "react";
import * as SecureStore from "expo-secure-store";
import {ScrollView, StyleSheet, Text} from "react-native";
import TitleApp from "@/src/components/app/TitleHeader";
import Background from "@/src/components/common/Background";

export default function Homepage() {

    const title = "Login riuscito!"

    const [accessToken, setAccessToken] = useState<string | null>(null)

    const loadToken = async () => {
        const accessToken = await SecureStore.getItemAsync("accessToken")
        setAccessToken(accessToken)
    }

    useEffect(() => {
        loadToken()
    }, [])

    return (

        <Background header={<TitleApp text={"Home"}/>}>

            <ScrollView
                style={styles.scrollView}
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
            >
                <Text style={styles.homeTitle}>{"Login effettuato!"}</Text>

            </ScrollView>
        </Background>

    )
}


const styles = StyleSheet.create({
    scrollView: {
        flex: 1,

    },

    homeTitle: {
        color: "#ffffff"
    },

    scrollContent: {
        flexGrow: 1,
        paddingHorizontal: 15,
        paddingVertical: 25
    },
});