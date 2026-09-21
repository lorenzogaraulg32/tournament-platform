import {StyleSheet, Text, View} from "react-native";
import {Sport, SPORT_LABELS} from "@/src/services/users/userConstants";
import {colors} from "@/src/constants/theme";
import type {Variant} from "@/src/constants/PaletteManager";
import FormLabel from "@/src/components/common/labels/FormLabel";
import FormSelectionButton from "@/src/components/common/forms/components/FormSelectionButton";

type SportStepProps = {
    variant: Variant;
    selectedSport?: Sport;
    errorMessage?: string;
    onChange: (sport: Sport) => void;
};

export default function SportStep({
                                      variant,
                                      selectedSport,
                                      errorMessage,
                                      onChange,
                                  }: SportStepProps) {
    return (
        <View style={styles.container}>
            <FormLabel
                text="Sport"
                labelIconName="trophy-outline"
                variant={variant}
            />

            {Object.values(Sport).map(sport => (
                <FormSelectionButton
                    key={sport}
                    label={SPORT_LABELS[sport]}
                    variant={variant}
                    selected={selectedSport === sport}
                    onPress={() => onChange(sport)}
                    accessibilityRole="radio"
                />
            ))}

            {!!errorMessage && (
                <Text style={styles.error}>{errorMessage}</Text>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        gap: 8,
    },
    error: {
        marginTop: 6,
        fontSize: 13,
        color: colors.error,
    },
});