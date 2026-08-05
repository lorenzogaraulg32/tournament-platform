import AuthText from "@/src/components/auth/AuthText";
import {StyleSheet} from "react-native";
import ButtonSolid from "@/src/components/common/ButtonSolid";
import {router} from "expo-router";
import AuthHeader from "@/src/components/auth/AuthHeader";
import AuthContent from "@/src/components/auth/AuthContent";
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
                <AuthContent style={[styles.btnContainer, {paddingBottom: Math.max(insets.bottom, 24)}]}>
                    <ButtonSolid
                        variant="buttonRegister"
                        textVariant="textRegister"
                        onPress={() => {
                        router.push("/(auth)/register")
                    }}
                                 text={"Registrati"}>
                    </ButtonSolid>

                    <ButtonSolid
                        variant="buttonLogin"
                        textVariant="textLogin"
                        onPress={() => {
                        router.push("/(auth)/login")
                    }}
                        text={"Accedi"}>
                    </ButtonSolid>
                </AuthContent>
            }
        />


    )

}


const styles = StyleSheet.create({

    btnContainer: {
        width: "100%",
        gap: 20
    },

})