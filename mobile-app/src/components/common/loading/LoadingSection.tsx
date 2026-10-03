import {ActivityIndicator, StyleProp, StyleSheet, Text, View, ViewStyle} from "react-native";


type LoadingSectionProps = {
    text: string
    style?: StyleProp<ViewStyle>;
}


export default function LoadingSection({text, style}: LoadingSectionProps) {
    return (
        <View style={[styles.loadingContainer, style]}>
            <ActivityIndicator size={"small"}/>
            <Text style={styles.loadingText}>
                {text}
            </Text>
        </View>
    );
}


const styles = StyleSheet.create({
    loadingContainer: {
        minHeight: 64,
        alignItems: "center",
        justifyContent: "center",
        gap: 8,
        paddingHorizontal: 20,
    },

    loadingText: {
        fontSize: 14,
        color: "#666666",
        textAlign: "center",
    },
})