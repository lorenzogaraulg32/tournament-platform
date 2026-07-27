import AuthText from "@/src/components/auth/AuthText";
import {StyleSheet} from "react-native";
import AuthButton from "@/src/components/auth/AuthButton";
import {router} from "expo-router";
import AuthHeader from "@/src/components/auth/AuthHeader";
import AuthContentSection from "@/src/components/auth/AuthContentSection";
import AuthContainer from "@/src/components/auth/AuthContainer";
import {useSafeAreaInsets} from "react-native-safe-area-context";


export default function WelcomeScreen() {
    const insets = useSafeAreaInsets();

    return (

        <AuthContainer

            header={
                <AuthHeader title={"JoinCup"}
                            headline={"Organizza. Partecipa. Vinci."}
                            subtitle={"Crea tornei, gestisci squadre e vivi la competizione con i tuoi amici."}
                />

            }

            content={
                <AuthContentSection style={[styles.btnContainer, {paddingBottom: Math.max(insets.bottom, 24)}]}>
                    <AuthButton variant="buttonRegister" onPress={() => {
                        router.push("/(auth)/register")
                    }}
                    >
                        <AuthText variant="buttonRegisterText" text={"Registrati"}/>
                    </AuthButton>

                    <AuthButton variant="buttonLogin" onPress={() => {
                        router.push("/(auth)/login")
                    }}>
                        <AuthText variant="buttonLoginText" text={"Accedi"}/>
                    </AuthButton>
                </AuthContentSection>
            }
        />


    )

}


const styles = StyleSheet.create({

    btnContainer: {
        width: "100%",
        gap:20
    },

})