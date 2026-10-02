import {StyleSheet, Text, View} from "react-native";
import {Sport, SPORT_LABELS} from "@/src/services/users/userDTO";
import {colors} from "@/src/constants/theme";
import type {Variant} from "@/src/constants/PaletteManager";
import FormLabel from "@/src/components/common/labels/FormLabel";
import FormSelectionButton from "@/src/components/common/forms/components/FormSelectionButton";
import {TournamentFormat, TournamentFormatLabels} from "@/src/services/tournaments/tournamentDTO";

type SportStepProps = {
    variant: Variant;
    selectedSport: Sport | null;
    selectedFormat: TournamentFormat | null
    errorMessageSport?: string;
    errorMessageFormat?: string;
    onChangeSport: (sport: Sport) => void;
    onChangeFormat: (format: TournamentFormat) => void;
};

export default function SportAndFormatStep({
                                      variant,
                                      selectedSport,
                                      selectedFormat,
                                      errorMessageSport,
                                      errorMessageFormat,
                                      onChangeSport,
                                      onChangeFormat
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
                    onPress={() => onChangeSport(sport)}
                    accessibilityRole="radio"
                />
            ))}

            {!!errorMessageSport && (
                <Text style={styles.error}>{errorMessageSport}</Text>
            )}


            <FormLabel
                text="Formato"
                labelIconName="layers-outline"
                variant={variant}
            />

            {Object.values(TournamentFormat).map(format => (
                <FormSelectionButton
                    key={format}
                    label={TournamentFormatLabels[format].label}
                    variant={variant}
                    selected={selectedFormat === format}
                    onPress={() => onChangeFormat(format)}
                    accessibilityRole="radio"
                />
            ))}

            {!!selectedFormat && (
                <Text style={styles.desc}>{TournamentFormatLabels[selectedFormat].desc}</Text>
            )}

            {!!errorMessageFormat && (
                <Text style={styles.error}>{errorMessageFormat}</Text>
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

    desc: {
        color: colors.labelSecondary,
        marginTop: 6,
        fontSize: 13,
    }
});