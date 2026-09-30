import type {SelectedDocument, SelectedImage} from "@/src/services/fileService";
import {TournamentCreationRequest, TournamentErrorFields} from "@/src/services/tournaments/tournamentsConst";
import FormLayout from "@/src/components/common/forms/ layout/FormLayout";
import HeaderForm from "@/src/components/common/headers/HeaderForm";
import FormProgressBar from "@/src/components/common/forms/components/FormProgressBar";
import FormContent from "@/src/components/common/forms/ layout/FormContent";
import {View} from "react-native";
import NameDescRecruitmentStep from "@/src/components/common/forms/commonSteps/NameDescRecruitmentStep";
import PositionStep from "@/src/components/pagesComponents/teams/steps/PositionStep";
import LogoAndRulesStep from "@/src/components/pagesComponents/tournaments/steps/LogoAndRulesStep";
import SportAndFormatStep from "@/src/components/pagesComponents/tournaments/steps/SportAndFormatStep";
import DateStep from "@/src/components/pagesComponents/tournaments/steps/DateStep";
import NumberOfTeamsStep from "@/src/components/pagesComponents/tournaments/steps/NumberOfTeamsStep";


export type TournamentCreationStep = 0 | 1 | 2 | 3 | 4 | 5;

export const FIRST_STEP: TournamentCreationStep = 0;
export const LAST_STEP: TournamentCreationStep = 5;
export const STEPS: TournamentCreationStep[] = [0, 1, 2, 3, 4, 5];


type CreateTournamentPageProps = {
    tournament: TournamentCreationRequest;
    logo: SelectedImage | null;
    rules: SelectedDocument | null

    currentStep: TournamentCreationStep;
    fieldErrors: TournamentErrorFields;
    apiError: string;
    isSubmitting: boolean;

    onChangeField: <K extends keyof TournamentCreationRequest>(
        field: K,
        value: TournamentCreationRequest[K],
    ) => void;

    onChangeLogo: (logo: SelectedImage | null) => void;
    onChangeRules: (rules: SelectedDocument | null) => void;

    onBack: () => void;
    onNext: () => Promise<void>;
}


export default function CreateTournamentPage({
                                                 tournament,
                                                 logo,
                                                 rules,
                                                 currentStep,
                                                 fieldErrors,
                                                 apiError,
                                                 isSubmitting,
                                                 onChangeField,
                                                 onChangeLogo,
                                                 onChangeRules,
                                                 onBack,
                                                 onNext
                                             }: CreateTournamentPageProps) {


    function renderStep() {
        switch (currentStep) {
            case 0:
                return (
                    <NameDescRecruitmentStep
                        variant={"tournaments"}
                        nameValue={tournament.name}
                        descValue={tournament.description ?? ""}
                        switchValue={tournament.recruitmentStatus}
                        onChangeName={name => onChangeField("name", name)}
                        onChangeDesc={description =>
                            onChangeField("description", description)
                        }
                        onChangeSwitch={status =>
                            onChangeField("recruitmentStatus", status)
                        }
                        errorMsgName={fieldErrors.name}
                        errorMsgDesc={fieldErrors.description}
                        errorMsgRecruitment={fieldErrors.recruitmentStatus}
                        editable={!isSubmitting}
                    />
                );

            case 1:
                return (
                    <PositionStep
                        variant={"tournaments"}
                        value={tournament.location}
                        onChange={location =>
                            onChangeField("location", location)
                        }
                        errorMessage={fieldErrors.location}
                    />
                );

            case 2 :
                return (
                    <LogoAndRulesStep variant={"tournaments"}
                                      image={logo}
                                      file={rules}
                                      onChangeImage={onChangeLogo}
                                      onChangeFile={onChangeRules}
                                      onRemoveImage={() => onChangeLogo(null)}
                                      onRemoveFile={() => onChangeRules(null)}
                                      disabled={isSubmitting}
                                      errorMessageImage={fieldErrors.logo}
                                      errorMessageFile={fieldErrors.rules}
                                      localFile={rules !== null}
                                      localImage={logo !== null}


                    />
                )

            case 3 :
                return (
                    <SportAndFormatStep
                        variant={"tournaments"}
                        selectedSport={tournament.sport}
                        selectedFormat={tournament.format}
                        errorMessageFormat={fieldErrors.format}
                        errorMessageSport={fieldErrors.sport}
                        onChangeSport={sport => onChangeField("sport", sport)}
                        onChangeFormat={format => onChangeField("format", format)}
                    />
                )

            case 4 :
                return (
                    <DateStep
                        startDate={tournament.startingDate}
                        endDate={tournament.endingDate}
                        onStartDateChange={startingDate => onChangeField("startingDate", startingDate)}
                        onEndDateChange={endingDate => onChangeField("endingDate", endingDate)}
                        startDateError={fieldErrors.startingDate}
                        endDateError={fieldErrors.endingDate}
                        disabled={isSubmitting}
                    />
                )
            case 5 :
                return (
                    <NumberOfTeamsStep
                        minTeams={tournament.minTeams}
                        maxTeams={tournament.maxTeams}
                        onMinTeamsChange={minTeams =>
                            onChangeField("minTeams", minTeams)
                        }
                        onMaxTeamsChange={maxTeams =>
                            onChangeField("maxTeams", maxTeams)
                        }
                        minTeamsError={fieldErrors.minTeams}
                        maxTeamsError={fieldErrors.maxTeams}
                        disabled={isSubmitting}
                    />
                )


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
            variant="tournaments"
            header={
                <HeaderForm
                    title="Crea un torneo"
                    subtitle="Configura il torneo e invita subito le squadre ad iscriversi"
                    variant="tournaments"
                />
            }
        >
            <FormProgressBar
                step={currentStep}
                totalSteps={STEPS.length}
                variant="tournaments"
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