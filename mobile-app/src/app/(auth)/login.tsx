import {StyleSheet} from "react-native";
import AuthTextField from "@/src/components/auth/AuthTextField";
import AuthHeader from "@/src/components/auth/AuthHeader";
import AuthContainer from "@/src/components/auth/AuthContainer";
import AuthContentSection from "@/src/components/auth/AuthContentSection";
import AuthButton from "@/src/components/auth/AuthButton";
import AuthText from "@/src/components/auth/AuthText";
import {router} from "expo-router";
import {useState} from "react";
import {ApiRequestError, loginUser} from "@/src/services/authService";
import * as SecureStore from "expo-secure-store";

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


        if (!validateLoginForm()) {
            return
        }

        try {
            setIsLoading(true);
            const response = await loginUser({
                email: email.trim().toLowerCase(),
                password
            });
            await SecureStore.setItemAsync(
                "accessToken",
                response.accessToken,
            );

            await SecureStore.setItemAsync(
                "tokenType",
                response.tokenType,
            );

            router.replace("/(app)");

        } catch (error) {
            if (error instanceof ApiRequestError) {
               console.log(error.fieldErrors)
                setApiError(error.message)

                setFieldErrors((current) => ({
                    ...current,
                    email:
                        error.fieldErrors.email ??
                        current.email,
                    password:
                        error.fieldErrors.password ??
                        current.password,
                }));

                return;
            }

            setApiError(
                "Impossibile contattare il server. Riprova.",
            );
        } finally {
            setIsLoading(false);
        }
    }


    return (
        <AuthContainer
            header={
                <AuthHeader title={"JoinCup"}
                            headline={"Bentornato"}
                            subtitle={"Accedi per continuare"}
                />
            }
            content={
                <AuthContentSection style={styles.inputFieldsContainer}>
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
                        <AuthText
                            text={apiError}
                            variant="errorLabelInput"
                            style={styles.apiError}
                        />
                    ) : null}

                    <AuthButton
                        variant="buttonRegister"
                        style={styles.loginBtn}
                        disabled={isLoading}
                        onPress={handleLogin}><AuthText text={isLoading
                        ? "Accesso in corso..."
                        : "Accedi"} variant={"buttonRegisterText"}/>
                    </AuthButton>


                </AuthContentSection>
            }
        />


    );


}


const styles = StyleSheet.create({

    inputFieldsContainer: {
        marginTop: -50,
        gap: 8,
    },

    apiError: {
        marginTop: 4,
        textAlign: "center",
    },

    loginBtn: {
        marginTop: 15,
    },
})