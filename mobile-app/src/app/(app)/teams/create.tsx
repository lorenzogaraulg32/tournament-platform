import {StyleSheet, Text, View,} from "react-native";
import {useState} from "react";
import {router} from "expo-router";

import Switch from "@/src/components/app/teams/createTeam/Switch";
import Fields from "@/src/components/app/teams/createTeam/Fields";
import PositionField from "@/src/components/app/teams/createTeam/PositionField";
import LogoField from "@/src/components/app/teams/createTeam/LogoField";
import CreateTeamPage from "@/src/components/app/teams/createTeam/CreateTeamPage";

import {createTeam, TeamCreationRequest, TeamLogoUpload,} from "@/src/services/teams/teamCreationService";
import ButtonSolid from "@/src/components/common/buttons/ButtonSolid";

type TeamCreationStep = 0 | 1 | 2;

const FIRST_STEP: TeamCreationStep = 0;
const LAST_STEP: TeamCreationStep = 2;

const STEPS: TeamCreationStep[] = [0, 1, 2];

export default function CreateTeam() {
    const [currentStep, setCurrentStep] =
        useState<TeamCreationStep>(FIRST_STEP);

    const [teamData, setTeamData] =
        useState<TeamCreationRequest>({
            name: "",
            description: "",
            status: "CLOSED",
            location: undefined,
        });

    const [logo, setLogo] =
        useState<TeamLogoUpload | null>(null);

    const [stepError, setStepError] =
        useState<string | undefined>();

    const [submitError, setSubmitError] =
        useState<string | null>(null);

    const [isSubmitting, setIsSubmitting] =
        useState(false);

    function updateTeamData<
        K extends keyof TeamCreationRequest
    >(
        field: K,
        value: TeamCreationRequest[K],
    ) {
        setTeamData((previousData) => ({
            ...previousData,
            [field]: value,
        }));

        setStepError(undefined);
        setSubmitError(null);
    }

    function validateNameAndDescription(): boolean {
        const trimmedName = teamData.name.trim();
        const trimmedDescription =
            teamData.description?.trim() ?? "";

        if (
            trimmedName.length < 5 ||
            trimmedName.length > 20
        ) {
            setStepError(
                "Il nome deve avere tra 5 e 20 caratteri",
            );
            return false;
        }

        if (trimmedDescription.length > 160) {
            setStepError(
                "La descrizione non può superare i 160 caratteri",
            );
            return false;
        }

        return true;
    }


    function validateLocation(): boolean {
        const location = teamData.location;

        // Nessuna posizione: consentito
        if (!location) {
            return true;
        }

        // Posizione presente ma non valida
        if (
            !location.label?.trim() ||
            !Number.isFinite(location.latitude) ||
            !Number.isFinite(location.longitude)
        ) {
            setStepError(
                "La posizione selezionata non è valida",
            );
            return false;
        }

        return true;
    }


    function validateLogo(): boolean {
        if (
            logo?.fileSize !== undefined &&
            logo.fileSize > 2 * 1024 * 1024
        ) {
            setStepError(
                "Il logo non può superare i 2 MB",
            );
            return false;
        }

        return true;
    }

    function validateStep(
        step: TeamCreationStep,
    ): boolean {
        setStepError(undefined);

        switch (step) {
            case 0:
                return validateNameAndDescription();

            case 1:
                return validateLocation();

            case 2:
                return validateLogo();
        }
    }

    function validateForm(): boolean {
        for (const step of STEPS) {
            if (!validateStep(step)) {
                setCurrentStep(step);
                return false;
            }
        }

        return true;
    }

    function handleBack() {
        if (
            currentStep === FIRST_STEP ||
            isSubmitting
        ) {
            return;
        }

        setStepError(undefined);
        setSubmitError(null);

        setCurrentStep(
            (currentStep - 1) as TeamCreationStep,
        );
    }

    async function handleNext() {
        if (isSubmitting) {
            return;
        }

        setSubmitError(null);

        if (!validateStep(currentStep)) {
            return;
        }

        if (currentStep === LAST_STEP) {
            await handleCreateTeam();
            return;
        }

        setCurrentStep(
            (currentStep + 1) as TeamCreationStep,
        );
    }

    async function handleCreateTeam() {
        if (!validateForm()) {
            return;
        }

        const selectedLocation = teamData.location;

        if (!selectedLocation) {
            return;
        }

        const trimmedDescription =
            teamData.description?.trim();

        try {
            setIsSubmitting(true);
            setSubmitError(null);

            const response = await createTeam(
                {
                    name: teamData.name.trim(),
                    description:
                        trimmedDescription || undefined,
                    status: teamData.status,
                    location: {
                        label: selectedLocation.label,
                        latitude:
                        selectedLocation.latitude,
                        longitude:
                        selectedLocation.longitude,
                    },
                },
                logo,
            );

            router.replace(`/teams/${response.id}`);
        } catch (caughtError) {
            setSubmitError(
                caughtError instanceof Error
                    ? caughtError.message
                    : "Errore durante la creazione",
            );

            console.error(caughtError);
        } finally {
            setIsSubmitting(false);
        }
    }

    function renderStep() {
        switch (currentStep) {
            case 0:
                return (
                    <View style={styles.stepContainer}>
                        <Fields
                            label="Nome squadra"
                            labelIconName="shield-outline"
                            placeholder="Es. FC Bar Ci Siamo"
                            value={teamData.name}
                            onChangeText={(name) =>
                                updateTeamData(
                                    "name",
                                    name,
                                )
                            }
                            maxLength={20}
                            minLength={5}
                            editable={!isSubmitting}
                        />

                        <Fields
                            label="Descrizione"
                            optional
                            labelIconName="chatbubble-ellipses-outline"
                            placeholder="Racconta qualcosa della tua squadra..."
                            value={
                                teamData.description ?? ""
                            }
                            onChangeText={(description) =>
                                updateTeamData(
                                    "description",
                                    description,
                                )
                            }
                            multiline
                            maxLength={160}
                            textAlignVertical="top"
                            editable={!isSubmitting}
                            inputStyle={{
                                minHeight: 120,
                            }}
                        />

                        <Switch
                            value={teamData.status}
                            onChange={(status) =>
                                updateTeamData(
                                    "status",
                                    status,
                                )
                            }
                        />

                        {stepError && (
                            <Text
                                style={styles.stepError}
                            >
                                {stepError}
                            </Text>
                        )}
                    </View>
                );

            case 1:
                return (
                    <View style={styles.stepContainer}>
                        <PositionField
                            value={teamData.location ?? null}
                            onChange={(newLocation) =>
                                updateTeamData(
                                    "location",
                                    newLocation ?? undefined,
                                )
                            }
                            errorMessage={stepError}
                            variant="createTeam"
                        />
                    </View>
                );

            case 2:
                return (
                    <View style={styles.stepContainer}>
                        <LogoField
                            variant="createTeam"
                            value={logo}
                            onChange={(newLogo) => {
                                setLogo(newLogo);
                                setStepError(undefined);
                                setSubmitError(null);
                            }}
                            disabled={isSubmitting}
                            errorMessage={stepError}
                        />
                    </View>
                );
        }
    }

    return (
        <CreateTeamPage>
            <View style={styles.formContainer}>
                {renderStep()}

                {submitError && (
                    <Text style={styles.submitError}>
                        {submitError}
                    </Text>
                )}

                <View style={styles.btnContainer}>
                    {currentStep > FIRST_STEP && (
                        <ButtonSolid
                            style={styles.btn}
                            onPress={handleBack}
                            disabled={isSubmitting}
                            variant="buttonLogin"
                            textVariant="textLogin"
                            text="Indietro"
                        />
                    )}

                    <ButtonSolid
                        style={styles.btn}
                        variant="buttonRegister"
                        textVariant="textRegister"
                        onPress={() => void handleNext()}
                        disabled={isSubmitting}
                        text={
                            currentStep === LAST_STEP
                                ? "Crea"
                                : "Avanti"
                        }
                    />
                </View>
            </View>
        </CreateTeamPage>
    );
}

const styles = StyleSheet.create({
    formContainer: {
        flex: 1,
    },

    stepContainer: {
        flex: 1,
    },

    stepError: {
        marginTop: 12,
        color: "#B42318",
        fontSize: 14,
        textAlign: "center",
    },

    submitError: {
        marginBottom: 10,
        color: "#B42318",
        fontSize: 14,
        textAlign: "center",
    },

    btnContainer: {
        width: "100%",
        flexDirection: "row",
        alignItems: "stretch",
        gap: 12,
        marginTop: 20,
    },

    btn: {
        flex: 1,
        minWidth: 0,
    },
});