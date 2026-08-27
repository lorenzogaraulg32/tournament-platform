import {StyleSheet, Text} from "react-native";
import AuthTextField from "@/src/components/pagesComponents/auth/AuthTextField";
import AuthHeader from "@/src/components/pagesComponents/auth/AuthHeader";
import AuthContainer from "@/src/components/pagesComponents/auth/AuthContainer";
import AuthContent from "@/src/components/pagesComponents/auth/AuthContent";
import {useState} from "react";
import {router} from "expo-router";
import ButtonSolid from "@/src/components/common/buttons/ButtonSolid";
import {colors} from "@/src/constants/theme";
import {normalizeApiRequestError} from "@/src/services/errorService";
import {loginUser, registerUser} from "@/src/services/users/authService";
import {saveSession} from "@/src/services/users/sessionService";

type RegisterFieldError = {
    email?: string;
    password?: string;
};

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function RegisterPage() {

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [fieldErrors, setFieldErrors] = useState<RegisterFieldError>({});
    const [apiError, setApiError] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    async function handleRegister() {
        if (isLoading) {
            return;
        }

        setApiError("");

        if (!validateRegisterForm()) {
            return
        }

        try {
            setIsLoading(true);
            const normalizedEmail = email.trim().toLowerCase();

            const response = await registerUser({
                email: normalizedEmail,
                password
            });

            if (response.message === "Utente registrato correttamente") {

                const loginResponse = await loginUser({
                    email: normalizedEmail,
                    password
                });

                await saveSession(
                    loginResponse.accessToken,
                    loginResponse.tokenType
                );

                router.replace("/(onboarding)");
            }

        } catch (error) {
            const apiError = normalizeApiRequestError(error)

            setApiError(apiError.message)

            setFieldErrors((current) => ({
                ...current,
                email:
                    apiError.errors.email?.[0] ??
                    current.email,
                password:
                    apiError.errors.password?.[0] ??
                    current.password,
            }));
        } finally {
            setIsLoading(false);
        }
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

    function validateRegisterForm(): boolean {
        const errors: RegisterFieldError = {};

        const normalizedEmail = email.trim();


        if (!normalizedEmail) {
            errors.email = "Inserisci l'email";
        } else if (!EMAIL_REGEX.test(normalizedEmail)) {
            errors.email = "Inserisci un'email valida";
        }

        const hasNumber = /\d/;

        if (!password.trim()) {
            errors.password = "Inserisci la password";
        } else if (password.length < 8) {
            errors.password = "La password deve contenere almeno 8 caratteri";
        } else if (!hasNumber.test(password)) {
            errors.password = "La password deve contenere almeno 1 numero";
        }

        setFieldErrors(errors);

        return Object.keys(errors).length === 0;
    }

    return (
        <AuthContainer
            header={
                <AuthHeader title={"JoinCup"}
                            headline={"Benvenuto"}
                            subtitle={"Registra un nuovo utente"}
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
                        autoComplete="new-password"
                        editable={!isLoading}
                    />

                    {apiError ? (
                        <Text style={styles.apiError}>{apiError}</Text>
                    ) : null}

                    <ButtonSolid
                        variant="buttonRegister"
                        textVariant={"textRegister"}
                        style={styles.registerBtn}
                        disabled={isLoading}
                        onPress={handleRegister}
                        text={isLoading
                            ? "Registrazione in corso..."
                            : "Registrati"}>
                    </ButtonSolid>


                </AuthContent>
            }
        />


    );


}


const styles = StyleSheet.create({
    inputFieldsContainer: {
        marginTop: -100,
        gap: 10,
    },

    apiError: {
        marginTop: 6,
        marginLeft: 10,
        fontSize: 14,
        lineHeight: 18,
        fontWeight: 400,
        color: colors.error,
        textAlign: "center",
    },

    registerBtn: {
        marginTop: 10,
    },
})
