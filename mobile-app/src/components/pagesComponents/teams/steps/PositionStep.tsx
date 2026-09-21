import FormPositionField from "@/src/components/common/forms/components/FormPositionField";
import type { GeoLocation } from "@/src/services/common";
import type { Variant } from "@/src/constants/PaletteManager";

type PositionStepProps = {
    variant: Variant;
    value: GeoLocation | null;
    onChange: (location: GeoLocation | null) => void;
    errorMessage?: string;
};

export default function PositionStep({
                                         variant,
                                         value,
                                         onChange,
                                         errorMessage,
                                     }: PositionStepProps) {
    return (
        <FormPositionField
            variant={variant}
            value={value}
            onChange={onChange}
            errorMessage={errorMessage}
        />
    );
}