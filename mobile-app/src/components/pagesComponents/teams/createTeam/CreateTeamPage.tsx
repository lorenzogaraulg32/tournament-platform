import {View} from "react-native";
import type {TeamCreationRequest, TeamFormErrors,} from "@/src/services/teams/teamDTO";
import PositionStep from "@/src/components/pagesComponents/teams/steps/PositionStep";
import LogoStep from "@/src/components/pagesComponents/teams/steps/LogoStep";
import SportStep from "@/src/components/pagesComponents/teams/steps/SportStep";

import FormHeader from "@/src/components/common/layout/headers/FormHeader";
import NameDescStep from "@/src/components/pagesComponents/teams/steps/NameDescStep";
import FormLayout from "@/src/components/common/layout/FormLayout";

export type TeamCreationStep = 0 | 1 | 2 | 3;

export const FIRST_STEP: TeamCreationStep = 0;
export const LAST_STEP: TeamCreationStep = 3;
export const STEPS: TeamCreationStep[] = [0, 1, 2, 3];

type CreateTeamPageProps = {
    team: TeamCreationRequest;
    currentStep: number;
    fieldErrors: TeamFormErrors;
    apiError: string;
    isSubmitting: boolean;
    onChangeField: <K extends keyof TeamCreationRequest>(
        field: K,
        value: TeamCreationRequest[K],
    ) => void;
    onBack: () => void;
    onNext: () => Promise<void>;
};

export default function CreateTeamPage({
                                           team,
                                           currentStep,
                                           fieldErrors,
                                           apiError,
                                           isSubmitting,
                                           onChangeField,
                                           onBack,
                                           onNext,
                                       }: CreateTeamPageProps) {
    function renderStep() {
        switch (currentStep) {
            case 0:
                return (
                    <NameDescStep
                        variant={"teams"}
                        nameValue={team.name}
                        descValue={team.description ?? ""}
                        switchValue={team.status}
                        onChangeName={name => onChangeField("name", name)}
                        onChangeDesc={description =>
                            onChangeField("description", description)
                        }
                        onChangeSwitch={status =>
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
                        value={team.location}
                        onChange={location =>
                            onChangeField("location", location)
                        }
                        errorMessage={fieldErrors.location}
                    />
                );

            case 2:
                return (
                    <LogoStep
                        variant={"teams"}
                        value={team.logo}
                        onChange={logo =>
                            onChangeField("logo", logo)
                        }
                        disabled={isSubmitting}
                        errorMessage={fieldErrors.logo}
                    />
                );

            case 3:
                return (
                    <SportStep
                        variant="teams"
                        selectedSport={team.sport}
                        onChange={sport =>
                            onChangeField(
                                "sport",
                                sport === team.sport ? undefined : sport,
                            )
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
                <FormHeader
                    title="Crea la tua squadra"
                    subtitle="Configura la squadra e preparati ad invitare i tuoi amici."
                    variant="teams"
                />
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