import {useEffect, useState} from "react";
import * as SecureStore from "expo-secure-store";
import {ImageBackground, ScrollView, StyleSheet, Text, View} from "react-native";
import TitleApp from "@/src/components/app/TitleHeader";

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
        <View style={styles.container}>

            <ImageBackground
                source={require("../../../assets/images/full_bkg.png")}
                style={StyleSheet.absoluteFill}
                imageStyle={StyleSheet.absoluteFill}

            >
                <TitleApp text={"HOME"}/>
                <ScrollView
                    style={styles.scrollView}
                    contentContainerStyle={styles.scrollContent}
                    showsVerticalScrollIndicator={false}
                >


                    <Text style={styles.homeTitle}>{"Login effettuato!"}</Text>

                </ScrollView>
            </ImageBackground>
        </View>
    )
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#ffffff"
    },
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