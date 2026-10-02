import FormImageField from "@/src/components/common/forms/components/FormImageField";
import type {Media} from "@/src/services/mediaService";
import type { Variant } from "@/src/constants/PaletteManager";

type LogoStepProps = {
    variant: Variant;
    value: Media | null;
    onChange: (logo: Media | null) => void;
    disabled: boolean;
    errorMessage?: string;
};

export default function LogoStep({
                                     variant,
                                     value,
                                     onChange,
                                     disabled,
                                     errorMessage,
                                 }: LogoStepProps) {
    return (
        <FormImageField
            variant={variant}
            value={value}
            onChange={onChange}
            disabled={disabled}
            errorMessage={errorMessage}
        />
    );
}