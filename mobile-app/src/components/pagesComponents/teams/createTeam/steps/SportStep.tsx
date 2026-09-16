import {Sport, SPORT_LABELS,} from "@/src/services/users/userConstants";
import {Pressable, StyleSheet, Text, View} from "react-native";
import {colors} from "@/src/constants/theme";
import FormLabel from "@/src/components/common/labels/FormLabel";

type SportStepProps = {
    onChange: (sport: Sport) => void;
    selectedSport?: Sport;
    errorMessage?: string;
};

export default function SportStep({
                                      onChange,
                                      errorMessage,
                                      selectedSport,
                                  }: SportStepProps) {


    return (
        <View style={styles.optionsContainer}>

            <FormLabel
                text={"Sport"}
                optional={false}
                labelIconName={"trophy-outline"}/>


            {Object.values(Sport).map(sport => {
                const selected = selectedSport === sport

                return (
                    <Pressable
                        key={sport}
                        style={[
                            styles.option,
                            selected &&
                            styles.optionSelected,
                        ]}
                        onPress={() => {
                            onChange(sport)
                        }}
                    >
                        <Text
                            style={[
                                styles.optionText,
                                selected &&
                                styles.optionTextSelected,
                            ]}
                        >
                            {SPORT_LABELS[sport]}
                        </Text>
                    </Pressable>
                );
            })}
            {errorMessage && (
                <Text style={styles.fieldError}>
                    {errorMessage}
                </Text>
            )}
        </View>

    );
}


export const styles = StyleSheet.create({


    optionsContainer: {
        gap: 8,
    },

    option: {
        minHeight: 48,
        paddingHorizontal: 16,
        justifyContent: "center",
        borderRadius: 14,
        borderWidth: 1,
        backgroundColor: "#FFFFFF",
        borderColor: "#C8480A",
    },

    optionSelected: {
        backgroundColor: colors.orangeDefaultBK,
        borderColor: colors.orangeDefault,

    },

    optionText: {
        color: "rgba(30,30,30,0.8)",
        fontSize: 15,
        fontWeight: 500
    },

    optionTextSelected: {
        color: colors.orangeDefault,
        fontSize: 15,
    },

    fieldError: {
        marginTop: 6,
        fontSize: 13,
        color: colors.error,
    },

});
