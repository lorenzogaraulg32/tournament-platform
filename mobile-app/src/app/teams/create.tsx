import {ActivityIndicator, Pressable, StyleSheet, Text, View,} from "react-native";
import Container from "@/src/components/app/teams/createTeam/Container";
import Switch from "@/src/components/app/teams/createTeam/Switch";
import Fields from "@/src/components/app/teams/createTeam/Fields";
import PositionField, {TeamLocation,} from "@/src/components/app/teams/createTeam/PositionField";
import {createTeam, RecruitmentStatus, TeamLogoUpload,} from "@/src/services/teams/teamCreationService";
import {useState} from "react";
import {router} from "expo-router";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import LogoField from "@/src/components/app/teams/createTeam/LogoField";

export default function CreateTeamPage() {
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");

    const [status, setStatus] =
        useState<RecruitmentStatus>("CLOSED");

    const [location, setLocation] =
        useState<TeamLocation | null>(null);

    const [logo, setLogo] =
        useState<TeamLogoUpload | null>(null);

    const [nameError, setNameError] =
        useState<string | undefined>();

    const [locationError, setLocationError] =
        useState<string | undefined>();

    const [logoError, setLogoError] =
        useState<string | undefined>();

    const [submitError, setSubmitError] =
        useState<string | null>(null);

    const [isSubmitting, setIsSubmitting] =
        useState(false);

    function validateForm(): boolean {
        let isValid = true;

        setNameError(undefined);
        setLocationError(undefined);
        setLogoError(undefined)
        setSubmitError(null);

        const trimmedName = name.trim();

        if (trimmedName.length < 5 || trimmedName.length > 20) {
            setNameError(
                "Il nome deve avere tra 5 e 20 caratteri"
            );
            isValid = false;
        }

        if (!location) {
            setLocationError(
                "Seleziona la posizione della squadra"
            );
            isValid = false;
        }

        if (logo) {
            if (
                logo.fileSize !== undefined &&
                logo.fileSize > 2 * 1024 * 1024
            ) {
                setLogoError(
                    "Il logo non può superare i 2 MB"
                );
                isValid = false;
            }
        }

        return isValid;
    }

    async function handleCreateTeam() {
        if (!validateForm() || !location) {
            return;
        }

        try {
            setIsSubmitting(true);

            const response = await createTeam({
                    name: name.trim(),
                    description:
                        description.trim() || undefined,
                    status,
                    location: {
                        label: location.label,
                        latitude: location.latitude,
                        longitude: location.longitude,
                    },
                },
                logo
            );

            router.replace(`/teams/${response.id}`);
        } catch (error) {
            setSubmitError(
                error instanceof Error
                    ? error.message
                    : "Errore durante la creazione"
            );
            console.error(error)
        } finally {
            setIsSubmitting(false);
        }
    }

    return (
        <Container>
            <View style={styles.formContainer}>

                <Fields
                    label="Nome squadra"
                    labelIconName="shield-outline"
                    placeholder="Es. FC Bar Ci Siamo"
                    value={name}
                    onChangeText={setName}
                    errorMessage={nameError}
                    maxLength={20}
                    minLength={5}
                    editable={!isSubmitting}
                />

                <Fields
                    label="Descrizione"
                    optional
                    labelIconName="chatbubble-ellipses-outline"
                    placeholder="Racconta qualcosa della tua squadra..."
                    value={description}
                    onChangeText={setDescription}
                    multiline
                    maxLength={160}
                    textAlignVertical="top"
                    editable={!isSubmitting}
                    inputStyle={{
                        minHeight: 120,
                    }}
                />

                <Switch
                    value={status}
                    onChange={setStatus}
                />

                <PositionField
                    value={location}
                    onChange={(newLocation) => {
                        setLocation(newLocation);

                        if (newLocation) {
                            setLocationError(undefined);
                        }
                    }}
                    errorMessage={locationError}
                    variant={"createTeam"}/>

                <LogoField
                    variant={"createTeam"}
                    value={logo}
                    onChange={(newLogo) => {
                        setLogo(newLogo);
                        setLogoError(undefined);
                    }}
                    disabled={isSubmitting}
                    errorMessage={logoError}
                />

                {submitError && (
                    <Text style={styles.submitError}>
                        {submitError}
                    </Text>
                )}

                <Pressable
                    onPress={() => void handleCreateTeam()}
                    disabled={isSubmitting}
                    style={({pressed}) => [
                        styles.submitButton,
                        pressed && styles.submitButtonPressed,
                        isSubmitting &&
                        styles.submitButtonDisabled,
                    ]}
                >
                    {isSubmitting ? (
                        <ActivityIndicator color="#FFFFFF"/>
                    ) : (
                        <>
                            <FontAwesome6
                                name="plus"
                                size={19}
                                color="#FFFFFF"
                            />

                            <Text style={styles.submitButtonText}>
                                Crea squadra
                            </Text>
                        </>
                    )}
                </Pressable>
            </View>
        </Container>
    );
}

const styles = StyleSheet.create({
    formContainer: {
        flex: 1,
        minHeight: 320,
        marginTop: -25,
        paddingHorizontal: 20,
        paddingTop: 16,
        paddingBottom: 20,
        borderRadius: 24,
        backgroundColor: "#FFFFFF",
        shadowColor: "#000000",
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowOpacity: 0.12,
        shadowRadius: 7,
        elevation: 5,
    },

    submitError: {
        marginBottom: 10,
        color: "#B42318",
        fontSize: 14,
        textAlign: "center",
    },

    submitButton: {
        minHeight: 54,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        gap: 10,
        borderRadius: 18,
        backgroundColor: "#C8480A",
    },

    submitButtonPressed: {
        opacity: 0.8,
    },

    submitButtonDisabled: {
        opacity: 0.6,
    },

    submitButtonText: {
        color: "#FFFFFF",
        fontSize: 17,
        fontWeight: "800",
    },
});