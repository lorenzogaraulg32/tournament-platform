import AppText from "@/src/components/AppText";
import {StyleSheet, View} from "react-native";
import {StatusBar} from "expo-status-bar";
import {Ionicons} from "@expo/vector-icons";
import {colors} from "@/src/constants/theme";
import WelcomeBackground from "@/src/components/welcomePage/WelcomeBackground";
import AppButton from "@/src/components/AppButtons";


export default function WelcomeScreen() {
    return (
        <WelcomeBackground>
            <StatusBar style="light"/>

            <View style={styles.screen}>
                <View style={styles.content}>

                    <View style={styles.logoBox}>
                        <Ionicons name="trophy" size={54} color="#00A85A"/>
                    </View>

                    <AppText variant={"title"} style={styles.title}>JoinCup</AppText>

                    <AppText variant={"subtitle"} style={styles.subTitle}> Organizza. Partecipa. Vinci. </AppText>
                    <AppText variant={"body"} style={styles.description}>
                        Crea tornei, gestisci squadre e vivi la competizione con i tuoi amici.
                    </AppText>

                </View>
                <View style={styles.actions}>
                    <AppButton variant="register">
                        <AppText variant="buttonRegister">
                            Registrati
                        </AppText>
                    </AppButton>

                    <AppButton variant="login">
                        <AppText variant="buttonLogin">
                            Accedi
                        </AppText>
                    </AppButton>
                </View>
            </View>
        </WelcomeBackground>
    );
}


const styles = StyleSheet.create({
    screen: {
        flex: 1,
        justifyContent: "space-between",
        paddingTop: 100,
        paddingBottom: 42,
    },

    subTitle: {
        marginTop: 12,
        textAlign: "center",
        color: colors.textThird
    },

    title: {
        fontSize: 48,
        letterSpacing: -1,
        fontWeight: 800
    },

    description: {
        marginTop: 22,
        fontSize: 17,
        lineHeight: 25,
        color: colors.textSecondary,
        textAlign: "center",
        maxWidth: 310,
    },

    content: {
        alignItems: "center",
        marginTop: 100,
    },

    logoBox: {
        width: 104,
        height: 104,
        borderRadius: 32,
        backgroundColor: "#FFFFFF",
        alignItems: "center",
        justifyContent: "center",
        marginBottom: 28,

        shadowColor: "#000",
        shadowOffset: {width: 0, height: 12},
        shadowOpacity: 0.22,
        shadowRadius: 18,
        elevation: 10,
    },

    actions: {
        width: "100%",
        paddingHorizontal: 28,
        paddingBottom: 42,
        gap: 14,
    }

})