import LogoField from "@/src/components/common/images/LogoField";
import {SelectedImage} from "@/src/services/imagesService";

type LogoStepProps = {
    value: SelectedImage | null;
    existingLogoSource?: string;
    onChange: (logo: SelectedImage | null) => void;
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
