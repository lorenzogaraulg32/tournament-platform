import {TournamentCreationRequest, TournamentErrorFields} from "@/src/services/tournaments/tournamentDTO";
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
    currentStep: TournamentCreationStep;
    fieldErrors: TournamentErrorFields;
    apiError: string;
    isSubmitting: boolean;

    onChangeField: <K extends keyof TournamentCreationRequest>(
        field: K,
        value: TournamentCreationRequest[K],
    ) => void;

    onBack: () => void;
    onNext: () => Promise<void>;
}


export default function CreateTournamentPage({
                                                 tournament,
                                                 currentStep,
                                                 fieldErrors,
                                                 apiError,
                                                 isSubmitting,
                                                 onChangeField,
                                                 onBack,
                                                 onNext
                                             }: CreateTournamentPageProps) {

    function handleMinTeamsChange(value: number) {
        onChangeField("minTeams", value);

        if (tournament.maxTeams < value) {
            onChangeField("maxTeams", value);
        }
    }

    function handleMaxTeamsChange(value: number) {
        onChangeField("maxTeams", value);

        if (tournament.minTeams > value) {
            onChangeField("minTeams", value);
        }
    }


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
                                      image={tournament.logo}
                                      file={tournament.rules}
                                      onChangeImage={logo => onChangeField("logo", logo)}
                                      onChangeFile={rules => onChangeField("rules", rules)}
                                      disabled={isSubmitting}
                                      errorMessageImage={fieldErrors.logo}
                                      errorMessageFile={fieldErrors.rules}
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
                        startDate={tournament.startDate}
                        endDate={tournament.endDate}
                        onStartDateChange={startingDate => onChangeField("startDate", startingDate)}
                        onEndDateChange={endingDate => onChangeField("endDate", endingDate)}
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
                            handleMinTeamsChange(minTeams)
                        }
                        onMaxTeamsChange={maxTeams =>
                            handleMaxTeamsChange(maxTeams)
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
                btnVariant={"tournament"}
            >
                <View pointerEvents={isSubmitting ? "none" : "auto"}>
                    {renderStep()}
                </View>
            </FormContent>
        </FormLayout>
    );

}