import {Pressable, StyleSheet, Text, View} from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import FormLabel from "@/src/components/common/labels/formLabel";

export type RecruitmentStatus = "OPEN" | "CLOSED";

type RecruitmentStatusSectionProps = {
    value: RecruitmentStatus;
    onChange: (value: RecruitmentStatus) => void;
};

export default function Switch({value, onChange,}: RecruitmentStatusSectionProps) {
    return (
        <View style={styles.container}>

            <FormLabel
                text={"Ricerca giocatori"}
                optional={true}
                infoTitle={"Ricerca giocatori"}
                infoMessage={"Se la ricerca è aperta, la squadra sarà visibile agli utenti che cercano una squadra. Se è chiusa, sarà possibile entrare solo tramite invito."}
                labelIconName={"people-outline"}
            />
            <View
                style={styles.optionsContainer}
            >
                <Pressable
                    onPress={() => onChange("OPEN")}
                    style={({pressed}) => [
                        styles.option,
                        value === "OPEN" && styles.optionSelected,
                        pressed && styles.optionPressed,
                    ]}
                >
                    {value === "OPEN" && (
                        <Ionicons
                            name="checkmark"
                            size={20}
                            color="#FFFFFF"
                        />
                    )}

                    <Text
                        style={[
                            styles.optionText,
                            value === "OPEN" &&
                            styles.optionTextSelected,
                        ]}
                    >
                        Aperta
                    </Text>
                </Pressable>

                <Pressable
                    onPress={() => onChange("CLOSED")}
                    style={({pressed}) => [
                        styles.option,
                        value === "CLOSED" && styles.optionSelected,
                        pressed && styles.optionPressed,
                    ]}
                >
                    {value === "CLOSED" && (
                        <Ionicons
                            name="checkmark"
                            size={20}
                            color="#FFFFFF"
                        />
                    )}

                    <Text
                        style={[
                            styles.optionText,
                            value === "CLOSED" &&
                            styles.optionTextSelected,
                        ]}
                    >
                        Chiusa
                    </Text>
                </Pressable>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        width: "100%",
        marginBottom: 20,
    },

    labelContainer: {
        flexDirection: "row",
        alignItems: "center",
        gap: 10,
        marginBottom: 9,
    },

    iconContainer: {
        width: 40,
        height: 40,
        alignItems: "center",
        justifyContent: "center",
        borderRadius: 20,
        backgroundColor: "rgba(200, 72, 10, 0.12)",
    },

    label: {
        flex: 1,
        color: "#1C1C1C",
        fontSize: 17,
        fontWeight: "800",
    },

    optionsContainer: {
        height: 35,
        flexDirection: "row",


        borderRadius: 18,
        borderWidth: 1.5,
        borderColor: "#D8D8D8",
        backgroundColor: "#F5F5F5",
    },

    option: {
        flex: 1,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        gap: 7,
        borderRadius: 14,
    },

    optionSelected: {
        backgroundColor: "#C8480A",
    },

    optionPressed: {
        opacity: 0.78,
    },

    optionText: {
        color: "#6F6F6F",
        fontSize: 15,
        fontWeight: "700",
    },

    optionTextSelected: {
        color: "#FFFFFF",
    },

});