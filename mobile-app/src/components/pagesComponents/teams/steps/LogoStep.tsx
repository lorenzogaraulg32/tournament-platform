import FormImageField from "@/src/components/common/forms/components/FormImageField";
import type { SelectedImage } from "@/src/services/imagesService";
import type { Variant } from "@/src/constants/PaletteManager";

type LogoStepProps = {
    variant: Variant;
    value: SelectedImage | null;
    existingLogoSource?: string;
    onChange: (logo: SelectedImage | null) => void;
    onRemove?: () => void;
    disabled: boolean;
    errorMessage?: string;
    local?: boolean;
};

export default function LogoStep({
                                     variant,
                                     value,
                                     existingLogoSource,
                                     onChange,
                                     onRemove,
                                     disabled,
                                     errorMessage,
                                     local,
                                 }: LogoStepProps) {
    return (
        <FormImageField
            variant={variant}
            value={value}
            existingLogoSource={existingLogoSource}
            onChange={onChange}
            onRemove={onRemove}
            disabled={disabled}
            errorMessage={errorMessage}
            local={local}
        />
    );
}