import {StyleSheet} from "react-native";
import AuthTextField from "@/src/components/auth/AuthTextField";
import AuthHeader from "@/src/components/auth/AuthHeader";
import AuthContainer from "@/src/components/auth/AuthContainer";
import AuthContentSection from "@/src/components/auth/AuthContentSection";
import {useState} from "react";
import {ApiRequestError, registerUser} from "@/src/services/authService";
import {router} from "expo-router";
import AuthText from "@/src/components/auth/AuthText";
import AuthButton from "@/src/components/auth/AuthButton";


type RegisterFieldError = {
    username?: string;
    email?: string;
    password?: string;
};

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function RegisterPage() {
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [fieldErrors, setFieldErrors] = useState<RegisterFieldError>({});

    const [apiError, setApiError] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    function validateRegisterForm(): boolean {
        const errors: RegisterFieldError = {};

        const normalizedEmail = email.trim();


        if (!normalizedEmail) {
            errors.email = "Inserisci l'email";
        } else if (!EMAIL_REGEX.test(normalizedEmail)) {
            errors.email = "Inserisci un'email valida";
        }

        const normalizedUsername = username.trim();

        if (!normalizedUsername) {
            errors.username = "Inserisci l'email";
        } else if (normalizedUsername.length < 3) {
            errors.username = "L'username deve avere minimo 3 caratteri";

        } else if (normalizedUsername.length > 30) {
            errors.username = "L'username deve avere massimo caratteri";
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

    function handleUsernameChange(value: string) {
        setUsername(value);
        setApiError("");

        if (fieldErrors.username) {
            setFieldErrors((current) => ({
                ...current,
                username: undefined,
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
            const response = await registerUser({
                email: email.trim().toLowerCase(),
                username: username.trim(),
                password
            });

            if (response.message === "Utente registrato correttamente") {
                router.replace("/login");
            }


        } catch (error) {
            if (error instanceof ApiRequestError) {
                console.log(error.fieldErrors)
                setApiError(error.message)

                setFieldErrors((current) => ({
                    ...current,
                    username:
                        error.fieldErrors.username ??
                        current.username,
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
                            headline={"Benvenuto"}
                            subtitle={"Registra un nuovo utente"}
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
                        label="Username"
                        placeholder="Inserisci l'Username"
                        value={username}
                        onChangeText={handleUsernameChange}
                        errorMessage={fieldErrors.username}
                        autoCapitalize="none"
                        autoCorrect={false}
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
                        <AuthText
                            text={apiError}
                            variant="errorLabelInput"
                            style={styles.apiError}
                        />
                    ) : null}

                    <AuthButton
                        variant="buttonRegister"
                        style={styles.registerBtn}
                        disabled={isLoading}
                        onPress={handleRegister}><AuthText text={isLoading
                        ? "Registrazione in corso..."
                        : "Registrati"} variant={"buttonRegisterText"}/>
                    </AuthButton>


                </AuthContentSection>
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
        textAlign: "center",
    },

    registerBtn: {
        marginTop: 10,
    },
})
