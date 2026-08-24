import {Pressable, StyleSheet, Text, TextInput, View} from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import {useState} from "react";
import {colors, corners} from "@/src/constants/theme";

type JoinVariant = "team" | "tournament";

type Props = {
    variant: JoinVariant;
    onJoin?: (code: string) => void;
};

const variants = {
    team: {
        title: "Unisciti ad una squadra",
        subtitle: "Inserisci il codice ricevuto dal team",
        placeholder: "Codice squadra",
        icon: "people" as const,
        accent: colors.orangeDefault,
        iconBackground: colors.orangeDefaultBK,
    },

    tournament: {
        title: "Partecipa ad un torneo",
        subtitle: "Inserisci il codice del torneo",
        placeholder: "Codice torneo",
        icon: "trophy" as const,
        accent: colors.mustardDefault,
        iconBackground: colors.mustardDefaultBK,
    },
};

export default function CodeInput({
                                          variant,
                                          onJoin
                                      }: Props) {

    const [code, setCode] = useState("");

    const config = variants[variant];

    function handleJoin() {
        const formattedCode = code.trim();

        if (!formattedCode) return;

        onJoin?.(formattedCode);
    }

    return (
        <View style={styles.container}>

            <View style={styles.header}>

                <View
                    style={[
                        styles.iconContainer,
                        {backgroundColor: config.iconBackground}
                    ]}
                >
                    <Ionicons
                        name={config.icon}
                        size={22}
                        color={config.accent}
                    />
                </View>

                <View style={styles.headerText}>

                    <Text style={styles.title}>
                        {config.title}
                    </Text>

                    <Text style={styles.subtitle}>
                        {config.subtitle}
                    </Text>

                </View>

            </View>

            <View style={styles.inputRow}>

                <TextInput
                    value={code}
                    onChangeText={setCode}
                    placeholder={config.placeholder}
                    placeholderTextColor="#8C9691"
                    autoCapitalize="characters"
                    style={styles.input}
                />

                <Pressable
                    onPress={handleJoin}
                    style={({pressed}) => [
                        styles.button,
                        {backgroundColor: config.accent},
                        pressed && styles.buttonPressed
                    ]}
                >
                    <Ionicons
                        name="arrow-forward"
                        size={20}
                        color="#ffffff"
                    />
                </Pressable>

            </View>

        </View>
    );
}

const styles = StyleSheet.create({

    container: {

        backgroundColor: "#ffffff",

        borderRadius: corners.standard,
        borderWidth: 1,
        borderColor: "#DDE9E2",

        padding: 18,

        shadowColor: "#003D22",
        shadowOpacity: 0.08,
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowRadius: 8,

        elevation: 3,
    },

    header: {
        flexDirection: "row",
        alignItems: "center",
        gap: 12,
        marginBottom: 18,
    },

    iconContainer: {
        width: 42,
        height: 42,

        borderRadius: 12,

        alignItems: "center",
        justifyContent: "center",
    },

    headerText: {
        flex: 1,
    },

    title: {
        fontSize: 19,
        fontWeight: "800",
        color: "#003D22",
    },

    subtitle: {
        marginTop: 3,
        fontSize: 13,
        color: "#69756F",
    },

    inputRow: {
        flexDirection: "row",
        gap: 10,
    },

    input: {
        flex: 1,
        height: 48,

        borderRadius: 12,
        borderWidth: 1.5,
        borderColor: "#D5DED9",

        paddingHorizontal: 15,

        backgroundColor: "#F7F9F8",

        fontSize: 16,
        fontWeight: "600",
        color: "#183A2A",
    },

    button: {
        width: 50,
        height: 48,

        borderRadius: 12,

        justifyContent: "center",
        alignItems: "center",
    },

    buttonPressed: {
        opacity: 0.75,
        transform: [{scale: 0.97}],
    },
});