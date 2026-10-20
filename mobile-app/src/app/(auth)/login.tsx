import {StyleSheet, Text} from "react-native";
import AuthTextField from "@/src/components/pagesComponents/auth/AuthTextField";
import AuthHeader from "@/src/components/pagesComponents/auth/AuthHeader";
import AuthContainer from "@/src/components/pagesComponents/auth/AuthContainer";
import AuthContent from "@/src/components/pagesComponents/auth/AuthContent";
import {colors} from "@/src/constants/theme";
import {useState} from "react";
import {linkExistingAccountGoogle, loginUser} from "@/src/services/users/authService";
import {normalizeApiRequestError} from "@/src/services/errorService";
import {saveSession} from "@/src/services/users/sessionService";
import {router, useLocalSearchParams} from "expo-router";
import {GoogleOneTapSignIn, isCancelledResponse, isSuccessResponse} from "react-native-nitro-google-signin";
import ActionButton from "@/src/components/common/buttons/ActionButton";

type LoginFieldErrors = {
    email?: string;
    password?: string;
};

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function LoginPage() {

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [fieldErrors, setFieldErrors] = useState<LoginFieldErrors>({});

    const [apiError, setApiError] = useState("");
    const [isLoading, setIsLoading] = useState(false);


    const {linkGoogle} = useLocalSearchParams<{
        linkGoogle?: string;
    }>();

    const isLinkingGoogle = linkGoogle === "1";

    function validateLoginForm(): boolean {
        const errors: LoginFieldErrors = {};
        const normalizedEmail = email.trim();

        if (!normalizedEmail) {
            errors.email = "Inserisci l'email";
        } else if (!EMAIL_REGEX.test(normalizedEmail)) {
            errors.email = "Inserisci un'email valida";
        }

        if (!password.trim()) {
            errors.password = "Inserisci la password";
        }

        setFieldErrors(errors);

        return Object.keys(errors).length === 0;
    }

    function handleEmailChange(value: string) {
        setEmail(value);
        setApiError("");

        if (fieldErrors.email) {
            setFieldErrors((current) => ({
                ...current,
                email: undefined,
            }));
        }
    }

    function handlePasswordChange(value: string) {
        setPassword(value);
        setApiError("");

        if (fieldErrors.password) {
            setFieldErrors((current) => ({
                ...current,
                password: undefined,
            }));
        }
    }


    async function handleLogin() {
        if (isLoading) {
            return;
        }

        setApiError("");
        setFieldErrors({});


        if (!validateLoginForm()) {
            return
        }

        try {
            setIsLoading(true);

            const response = await loginUser({
                email: email.trim().toLowerCase(),
                password
            });

            if (isLinkingGoogle) {
                const webClientId =
                    process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID;

                if (!webClientId) {
                    throw new Error("Google Client ID non configurato");
                }

                GoogleOneTapSignIn.configure({webClientId});

                await GoogleOneTapSignIn.checkPlayServices();

                // Richiediamo una nuova conferma dell'identità Google
                const googleResponse =
                    await GoogleOneTapSignIn.presentExplicitSignIn();

                if (isCancelledResponse(googleResponse)) {
                    setApiError(
                        "Collegamento annullato. Riprova per completare."
                    );
                    return;
                }

                if (!isSuccessResponse(googleResponse)) {
                    throw new Error("Autenticazione Google non riuscita");
                }

                const {idToken} = googleResponse.data;

                if (!idToken) {
                    throw new Error("ID token Google assente");
                }

                // 3. Colleghiamo Google all'utente JoinCup autenticato
                await linkExistingAccountGoogle(
                    idToken,
                    response.accessToken,
                    response.tokenType
                );
            }

            await saveSession(response.accessToken, response.tokenType);

            router.replace("/(app)/home");

        } catch (error) {
            const apiError = normalizeApiRequestError(error,)

            setApiError(apiError.message);

            setFieldErrors({
                email: apiError.errors.email?.[0],
                password: apiError.errors.password?.[0],
            });
        } finally {
            setIsLoading(false);
        }
    }


    return (
        <AuthContainer
            header={
                <AuthHeader
                    title="JoinCup"
                    headline={
                        isLinkingGoogle
                            ? "Collega il tuo account"
                            : "Bentornato"
                    }
                    subtitle={
                        isLinkingGoogle
                            ? "Accedi con la tua password per collegare Google."
                            : "Accedi per continuare"
                    }
                />
            }
            content={
                <AuthContent style={styles.inputFieldsContainer}>
                    <AuthTextField
                        label="Email"
                        placeholder="Inserisci la tua email"
                        value={email}
                        onChangeText={handleEmailChange}
                        errorMessage={fieldErrors.email}
                        autoCapitalize="none"
                        autoCorrect={false}
                        autoComplete="email"
                        keyboardType="email-address"
                        editable={!isLoading}
                    />

                    <AuthTextField
                        label="Password"
                        placeholder="Inserisci la password"
                        value={password}
                        onChangeText={handlePasswordChange}
                        errorMessage={fieldErrors.password}
                        secureTextEntry
                        autoCapitalize="none"
                        autoCorrect={false}
                        autoComplete="current-password"
                        editable={!isLoading}
                    />

                    {apiError ? (
                        <Text style={styles.apiError}>{apiError}</Text>
                    ) : null}

                    <ActionButton
                        paletteVariant="onBoarding"
                        style={styles.loginBtn}
                        disabled={isLoading}
                        onPress={handleLogin}
                        label={isLoading ? "Accesso in corso..." : "Accedi"}>
                    </ActionButton>


                </AuthContent>
            }
        />


    );


}


const styles = StyleSheet.create({

    inputFieldsContainer: {
        gap: 8,
        marginBottom: 60,
    },

    apiError: {
        fontSize: 14,
        lineHeight: 18,
        fontWeight: 400,
        color: colors.error,
        textAlign: "center",
    },

    loginBtn: {
        marginTop: 15,
    },
})