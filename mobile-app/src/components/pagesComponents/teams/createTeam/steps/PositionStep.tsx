import PositionField from "@/src/components/pagesComponents/teams/createTeam/PositionField";
import {TeamCreationRequest} from "@/src/services/teams/teamCreationService";

type PositionStepProps = {
    value: TeamCreationRequest["location"];
    onChange: (location: TeamCreationRequest["location"]) => void;
    errorMessage?: string;
};

export default function PositionStep({
    value,
    onChange,
    errorMessage,
}: PositionStepProps) {
    return (
        <PositionField
            value={value ?? null}
            onChange={(newLocation) =>
                onChange(newLocation ?? undefined)
            }
            errorMessage={errorMessage}
            variant="createTeam"
        />
    );
}
