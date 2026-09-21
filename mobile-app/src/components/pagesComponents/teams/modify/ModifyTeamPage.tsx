// In questa pagina
// si mostrano gli step per la modifica
// ci sono le funzioni di validazione
import {TeamDetails, TeamErrorFields, TeamUpdateRequest} from "@/src/services/teams/teamsConst";
import {SelectedImage} from "@/src/services/imagesService";
import NameAndDescStep from "@/src/components/pagesComponents/teams/steps/NameAndDescStep";
import PositionStep from "@/src/components/pagesComponents/teams/steps/PositionStep";
import LogoStep from "@/src/components/pagesComponents/teams/steps/LogoStep";
import FormLayout from "@/src/components/common/forms/ layout/FormLayout";
import HeaderForm from "@/src/components/common/headers/HeaderForm";
import FormProgressBar from "@/src/components/common/forms/components/FormProgressBar";
import FormContent from "@/src/components/common/forms/ layout/FormContent";
import {View} from "react-native";


export type TeamEditStep = 0 | 1 | 2;

export const FIRST_STEP: TeamEditStep = 0;
export const LAST_STEP: TeamEditStep = 2;

export const STEPS: TeamEditStep[] = [0, 1, 2];


type ModifyTeamPageProps = {
    oldTeam: TeamDetails;
    newTeam: TeamUpdateRequest;
    logo: SelectedImage | null;
    logoRemoved: boolean;

    currentStep: TeamEditStep;
    fieldErrors: TeamErrorFields;
    apiError: string;
    isSubmitting: boolean;

    onChangeField: <K extends keyof TeamUpdateRequest>(
        field: K,
        value: TeamUpdateRequest[K],
    ) => void;

    onChangeLogo: (logo: SelectedImage | null) => void;
    onRemoveLogo: () => void;
    onBack: () => void;
    onNext: () => Promise<void>;
};


export default function ModifyTeamPage({
                                           oldTeam,
                                           newTeam,
                                           logo,
                                           logoRemoved,
                                           currentStep,
                                           fieldErrors,
                                           apiError,
                                           isSubmitting,
                                           onChangeField,
                                           onChangeLogo,
                                           onRemoveLogo,
                                           onBack,
                                           onNext
                                       }: ModifyTeamPageProps) {

    function renderStep() {
        switch (currentStep) {
            case 0:
                return (
                    <NameAndDescStep
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
                        value={logo}
                        existingLogoSource={
                            logoRemoved ? undefined : (oldTeam.imageUrl || undefined)
                        }
                        onRemove={onRemoveLogo}
                        onChange={onChangeLogo}
                        disabled={isSubmitting}
                        errorMessage={fieldErrors.logo}
                        local={logo !== null}
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
            header={
                <HeaderForm title={"Modifica la squadra"}
                            subtitle={"Apporta dei cambiamenti alla informazioni della squadra"}
                            variant={"teams"}/>
            }
            variant={"teams"}>
            <FormProgressBar
                step={currentStep}
                totalSteps={STEPS.length}
                variant={"teams"}/>

            <FormContent
                handleBack={onBack}
                handleNext={onNext}
                isSubmitting={isSubmitting}
                step={formStep}
                apiError={apiError}>
                <View pointerEvents={isSubmitting ? "none" : "auto"}>
                    {renderStep()}
                </View>
            </FormContent>
        </FormLayout>
    );

}