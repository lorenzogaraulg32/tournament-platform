import {ComponentProps} from "react";
import {Image} from "expo-image";
import LogoField from "@/src/components/common/images/LogoField";
import {TeamLogoUpload} from "@/src/services/teams/teamCreationService";

type LogoStepProps = {
    value: TeamLogoUpload | null;
    existingLogoSource?: ComponentProps<typeof Image>["source"];
    onChange: (logo: TeamLogoUpload | null) => void;
    onRemove?: () => void;
    disabled: boolean;
    errorMessage?: string;
};

export default function LogoStep({
                                     value,
                                     onChange,
                                     existingLogoSource,
                                     onRemove,
                                     disabled,
                                     errorMessage,
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
        />
    );
}
