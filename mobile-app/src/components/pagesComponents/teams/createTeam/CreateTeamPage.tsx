import {View} from "react-native";
import type {TeamCreationRequest, TeamErrorFields,} from "@/src/services/teams/teamsConst";
import type {SelectedImage} from "@/src/services/imagesService";

import NameAndDescStep from "@/src/components/pagesComponents/teams/steps/NameAndDescStep";
import PositionStep from "@/src/components/pagesComponents/teams/steps/PositionStep";
import LogoStep from "@/src/components/pagesComponents/teams/steps/LogoStep";
import SportStep from "@/src/components/pagesComponents/teams/steps/SportStep";

import FormLayout from "@/src/components/common/forms/ layout/FormLayout";
import FormContent from "@/src/components/common/forms/ layout/FormContent";
import HeaderForm from "@/src/components/common/headers/HeaderForm";
import FormProgressBar from "@/src/components/common/forms/components/FormProgressBar";

export type TeamCreationStep = 0 | 1 | 2 | 3;

export const FIRST_STEP: TeamCreationStep = 0;
export const LAST_STEP: TeamCreationStep = 3;
export const STEPS: TeamCreationStep[] = [0, 1, 2, 3];

type CreateTeamPageProps = {
    team: TeamCreationRequest;
    logo: SelectedImage | null;

    currentStep: TeamCreationStep;
    fieldErrors: TeamErrorFields;
    apiError: string;
    isSubmitting: boolean;

    onChangeField: <K extends keyof TeamCreationRequest>(
        field: K,
        value: TeamCreationRequest[K],
    ) => void;

    onChangeLogo: (logo: SelectedImage | null) => void;
    onBack: () => void;
    onNext: () => Promise<void>;
};

export default function CreateTeamPage({
                                           team,
                                           logo,
                                           currentStep,
                                           fieldErrors,
                                           apiError,
                                           isSubmitting,
                                           onChangeField,
                                           onChangeLogo,
                                           onBack,
                                           onNext,
                                       }: CreateTeamPageProps) {
    function renderStep() {
        switch (currentStep) {
            case 0:
                return (
                    <NameAndDescStep
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
                        value={logo}
                        onChange={onChangeLogo}
                        onRemove={() => onChangeLogo(null)}
                        disabled={isSubmitting}
                        errorMessage={fieldErrors.logo}
                        local={logo !== null}
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

    const formStep =
        currentStep === FIRST_STEP
            ? "first"
            : currentStep === LAST_STEP
                ? "last"
                : "middle";

    return (
        <FormLayout
            variant="teams"
            header={
                <HeaderForm
                    title="Crea la tua squadra"
                    subtitle="Configura la squadra e preparati ad invitare i tuoi amici."
                    variant="teams"
                />
            }
        >
            <FormProgressBar
                step={currentStep}
                totalSteps={STEPS.length}
                variant="teams"
            />

            <FormContent
                handleBack={onBack}
                handleNext={onNext}
                isSubmitting={isSubmitting}
                step={formStep}
                apiError={apiError}
            >
                <View pointerEvents={isSubmitting ? "none" : "auto"}>
                    {renderStep()}
                </View>
            </FormContent>
        </FormLayout>
    );
}