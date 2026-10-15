import {Alert, StyleSheet, Text, View} from "react-native";
import ButtonSolid from "@/src/components/common/buttons/ButtonSolid";
import {router} from "expo-router";
import AuthHeader from "@/src/components/pagesComponents/auth/AuthHeader";
import AuthContent from "@/src/components/pagesComponents/auth/AuthContent";
import AuthContainer from "@/src/components/pagesComponents/auth/AuthContainer";
import {useSafeAreaInsets} from "react-native-safe-area-context";
import {GoogleOneTapSignIn, isCancelledResponse, isSuccessResponse} from "react-native-nitro-google-signin";
import {colors} from "@/src/constants/theme";
import GoogleAuthButton from "@/src/components/common/buttons/GoogleAuthButton";
import {useState} from "react";
import {authenticateWithGoogle} from "@/src/services/users/authService";
import {saveSession} from "@/src/services/users/sessionService";
import {normalizeApiRequestError, printApiRequestError} from "@/src/services/errorService";


export default function WelcomeScreen() {
    const insets = useSafeAreaInsets();

    const [googleLoading, setGoogleLoading] = useState(false);
    const [externalProviderError, setExternalProviderError] = useState("")


    const handleGoogleSignIn = async () => {
        if (googleLoading) return;

        setGoogleLoading(true);
        setExternalProviderError("")
        try {

            //1 recupero id client we google cloud
            const webClientId = process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID;

            if (!webClientId) {
                throw new Error("Google Client ID non configurato");
            }

            //2 config della libreria google
            GoogleOneTapSignIn.configure({
                webClientId,
            });

            //3 check dei google play services
            await GoogleOneTapSignIn.checkPlayServices();

            //4 procedura di login/register guidata da google
            const response =
                await GoogleOneTapSignIn.presentExplicitSignIn();

            if (isCancelledResponse(response)) {
                console.log("[GOOGLE] Autenticazione annullata");
                return;
            }

            if (!isSuccessResponse(response)) {
                console.warn("[GOOGLE] Risposta non riuscita");
                return;
            }

            const {idToken} = response.data;

            if (!idToken) {
                throw new Error("ID token Google assente");
            }

            const authResponse = await authenticateWithGoogle(idToken);

            await saveSession(
                authResponse.accessToken,
                authResponse.tokenType
            );

            router.replace("/(app)/home");

        } catch (error) {
            const apiError = normalizeApiRequestError(error)
            if (apiError.code === "AUTH_EMAIL_ALREADY_REGISTERED_EXTERNAL"
                && apiError.status === 409) {
                Alert.alert(
                    "Hai già un account JoinCup!",
                    "Esiste già un profilo associato a questa email. " +
                    "Accedi con la tua password per collegare Google al tuo account.",
                    [
                        {
                            text: "Annulla",
                            style: "cancel",
                        },
                        {
                            text: "Accedi e collega Google",
                            onPress: () => {
                                router.push({
                                    pathname: "/(auth)/login",
                                    params: {
                                        linkGoogle: "1",
                                    },
                                });
                            },
                        },
                    ]
                );

                return;
            }
            printApiRequestError(apiError);
        } finally {
            setGoogleLoading(false);
        }
    };


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
                        variant="onBoarding"
                        onPress={() => {
                            router.push("/(auth)/register")
                        }}
                        text={"Registrati"}>
                    </ButtonSolid>

                    <ButtonSolid
                        variant="standard"
                        onPress={() => {
                            router.push("/(auth)/login")
                        }}
                        text={"Accedi"}>
                    </ButtonSolid>

                    <View style={{
                        flexDirection: "row",
                        justifyContent: "space-around"
                    }}>
                        <View style={styles.separator}/>

                        <Text style={{
                            color: colors.textOffWhite
                        }}>
                            oppure
                        </Text>

                        <View style={styles.separator}/>
                    </View>

                    <GoogleAuthButton
                        onPress={handleGoogleSignIn}
                        loading={googleLoading}
                    />

                    <Text style={styles.err}>{externalProviderError}</Text>

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

    separator: {
        flex: 1,
        backgroundColor: colors.textOffWhite,
        height: 1,
        margin: 10,
    },

    err: {
        fontSize: 11,
        justifyContent: "center",
        alignItems: "center",
        color: colors.error,
        textAlign: "center",
    }

})