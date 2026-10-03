import FormSpinnerField from "@/src/components/common/forms/components/FormSpinnerField";

type NumberOfTeamsStepProps = {
    minTeams: number;
    maxTeams: number;

    minTeamsError?: string;
    maxTeamsError?: string;

    onMinTeamsChange: (value: number) => void;
    onMaxTeamsChange: (value: number) => void;

    disabled?: boolean;
};

export default function NumberOfTeamsStep({
                                              minTeams,
                                              maxTeams,
                                              minTeamsError,
                                              maxTeamsError,
                                              onMinTeamsChange,
                                              onMaxTeamsChange,
                                              disabled = false,
                                          }: NumberOfTeamsStepProps) {

    return (
        <>
            <FormSpinnerField
                variant="tournaments"
                label="Numero minimo di squadre"
                value={minTeams}
                onChange={onMinTeamsChange}
                min={2}
                errorMessage={minTeamsError}
                disabled={disabled}
                labelIconName="people-outline"
            />

            <FormSpinnerField
                variant="tournaments"
                label="Numero massimo di squadre"
                value={maxTeams}
                onChange={onMaxTeamsChange}
                min={2}
                errorMessage={maxTeamsError}
                disabled={disabled}
                labelIconName="people-outline"
            />
        </>
    );
}