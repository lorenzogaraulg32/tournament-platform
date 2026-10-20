import { View } from "react-native";
import type { Variant } from "@/src/constants/palette/PaletteManager";
import type { GeoLocation } from "@/src/services/common";
import FormPositionField from "@/src/components/common/forms/fileds/FormPositionField";

type LocationStepProps = {
    variant: Variant;
    value: GeoLocation | null;
    onChange: (value: GeoLocation | null) => void;
    errorMessage?: string;
    disabled?: boolean;
};

export default function LocationStep({
                                                variant,
                                                value,
                                                onChange,
                                                errorMessage,
                                                disabled = false,
                                            }: LocationStepProps) {
    return (
        <View pointerEvents={disabled ? "none" : "auto"}>
            <FormPositionField
                variant={variant}
                value={value}
                onChange={onChange}
                errorMessage={errorMessage}
            />
        </View>
    );
}