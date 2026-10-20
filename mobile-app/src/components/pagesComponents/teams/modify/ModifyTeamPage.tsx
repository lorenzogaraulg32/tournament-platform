import {TeamDetails, TeamFormErrors, TeamUpdateRequest} from "@/src/services/teams/teamDTO";
import PositionStep from "@/src/components/pagesComponents/teams/steps/PositionStep";
import LogoStep from "@/src/components/pagesComponents/teams/steps/LogoStep";
import FormLayout from "@/src/components/common/layout/FormLayout";
import FormHeader from "@/src/components/common/layout/headers/FormHeader";
import {View} from "react-native";
import SportStep from "@/src/components/pagesComponents/teams/steps/SportStep";
import NameDescStep from "@/src/components/pagesComponents/teams/steps/NameDescStep";


export type TeamEditStep = 0 | 1 | 2 | 3;

export const FIRST_STEP: TeamEditStep = 0;
export const LAST_STEP: TeamEditStep = 3;

export const STEPS: TeamEditStep[] = [0, 1, 2, 3];


type ModifyTeamPageProps = {
    oldTeam: TeamDetails;
    newTeam: TeamUpdateRequest;
    currentStep: TeamEditStep;
    fieldErrors: TeamFormErrors;
    apiError: string;
    isSubmitting: boolean;
    onChangeField: <K extends keyof TeamUpdateRequest>(
        field: K,
        value: TeamUpdateRequest[K],
    ) => void;
    onBack: () => void;
    onNext: () => Promise<void>;
};


export default function ModifyTeamPage({
                                           oldTeam,
                                           newTeam,
                                           currentStep,
                                           fieldErrors,
                                           apiError,
                                           isSubmitting,
                                           onChangeField,
                                           onBack,
                                           onNext
                                       }: ModifyTeamPageProps) {

    function renderStep() {
        switch (currentStep) {
            case 0:
                return (
                    <NameDescStep
                        variant={"teams"}
                        nameValue={newTeam.name ?? oldTeam.name}
                        descValue={newTeam.description ?? ""}
                        switchValue={newTeam.status ?? oldTeam.status}
                        onChangeName={(name) =>
                            onChangeField("name", name)
                        }
                        onChangeDesc={(description) =>
                            onChangeField("description", description)
                        }
                        onChangeSwitch={(status) =>
                            onChangeField("status", status)
                        }
                        errorMsgName={fieldErrors.name}
                        errorMsgDesc={fieldErrors.description}
                        editable={!isSubmitting}
                    />
                );

            case 1:
                return (
                    <PositionStep
                        variant={"teams"}
                        value={newTeam.location ?? null}
                        onChange={(newLocation) =>
                            onChangeField("location", newLocation)
                        }
                        errorMessage={fieldErrors.location}
                    />
                );

            case 2:
                return (
                    <LogoStep
                        variant={"teams"}
                        value={
                            newTeam.logo === undefined
                                ? oldTeam.logo
                                : newTeam.logo
                        }
                        onChange={(newLogo) =>
                            onChangeField("logo", newLogo)
                        }
                        disabled={isSubmitting}
                        errorMessage={fieldErrors.logo}
                    />
                );
            case 3:
                return (
                    <SportStep
                        variant={"teams"}
                        selectedSport={newTeam.sport ?? oldTeam.sport}
                        onChange={(newSport) =>
                            onChangeField("sport", newSport)
                        }
                        errorMessage={fieldErrors.sport}
                    />
                );
        }
    }

    const nextLabel =
        currentStep === LAST_STEP
            ? "Termina"
            : "Continua";

    return (
        <FormLayout
            step={currentStep}
            totalSteps={STEPS.length}
            variant={"teams"}
            header={
                <FormHeader title={"Modifica la squadra"}
                            subtitle={"Apporta dei cambiamenti alla informazioni della squadra"}
                            variant={"teams"}/>
            }
            onNext={onNext}
            nextLabel={nextLabel}
            onBack={onBack}
            error={currentStep === LAST_STEP ? apiError : ""}
            loading={isSubmitting}
        >
            <View pointerEvents={isSubmitting ? "none" : "auto"}>
                {renderStep()}
            </View>
        </FormLayout>
    );

}