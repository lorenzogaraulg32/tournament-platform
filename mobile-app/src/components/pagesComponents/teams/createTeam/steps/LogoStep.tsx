import LogoField from "@/src/components/common/images/LogoField";
import {TeamLogoUpload} from "@/src/services/teams/teamCreationService";

type LogoStepProps = {
    value: TeamLogoUpload | null;
    existingLogoSource?: string;
    onChange: (logo: TeamLogoUpload | null) => void;
    onRemove?: () => void;
    disabled: boolean;
    errorMessage?: string;
    local?: boolean
};

export default function LogoStep({
                                     value,
                                     onChange,
                                     existingLogoSource,
                                     onRemove,
                                     disabled,
                                     errorMessage,
                                     local
                                 }: LogoStepProps) {
    return (
        <LogoField
            variant="createTeam"
            value={value}
            existingLogoSource={existingLogoSource}
            onRemove={onRemove}
            onChange={onChange}
            disabled={disabled}
            errorMessage={errorMessage}
            local={local}
        />
    );
}
