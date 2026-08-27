import {StyleSheet, Text} from "react-native";
import AuthTextField from "@/src/components/pagesComponents/auth/AuthTextField";
import AuthHeader from "@/src/components/pagesComponents/auth/AuthHeader";
import AuthContainer from "@/src/components/pagesComponents/auth/AuthContainer";
import AuthContent from "@/src/components/pagesComponents/auth/AuthContent";
import ButtonSolid from "@/src/components/common/buttons/ButtonSolid";
import {colors} from "@/src/constants/theme";
import {useState} from "react";
import {loginUser} from "@/src/services/users/authService";
import {normalizeApiRequestError} from "@/src/services/errorService";
import {saveSession} from "@/src/services/users/sessionService";

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
        setFieldErrors({});

        /*
                if (!validateLoginForm()) {
                    return
                }
        */
        try {
            setIsLoading(true);
            /*
                        const response = await loginUser({
                            email: email.trim().toLowerCase(),
                            password
                        });
            */

            const response = await loginUser({
                email: "lorenzo.garau.lg32@gmail.com",
                password: "Lombax99"
            });

            await saveSession(response.accessToken, response.tokenType);

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
                <AuthHeader title={"JoinCup"}
                            headline={"Bentornato"}
                            subtitle={"Accedi per continuare"}
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

                    <ButtonSolid
                        variant="buttonRegister"
                        textVariant={"textRegister"}
                        style={styles.loginBtn}
                        disabled={isLoading}
                        onPress={handleLogin}
                        text={isLoading ? "Accesso in corso..." : "Accedi"}>
                    </ButtonSolid>


                </AuthContent>
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
        marginTop: 6,
        marginLeft: 10,
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