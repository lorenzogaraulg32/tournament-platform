import LogoField from "@/src/components/common/images/LogoField";
import {TeamLogoUpload} from "@/src/services/teams/teamCreationService";

type LogoStepProps = {
    value: TeamLogoUpload | null;
    onChange: (logo: TeamLogoUpload | null) => void;
    disabled: boolean;
    errorMessage?: string;
};

export default function LogoStep({
    value,
    onChange,
    disabled,
    errorMessage,
}: LogoStepProps) {
    return (
        <LogoField
            variant="createTeam"
            value={value}
            onChange={onChange}
            disabled={disabled}
            errorMessage={errorMessage}
        />
    );
}
