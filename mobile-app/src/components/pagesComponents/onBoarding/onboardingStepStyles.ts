import {StyleSheet} from "react-native";
import {colors} from "@/src/constants/theme";

export const onboardingStepStyles = StyleSheet.create({
    inputFieldsContainer: {
        gap: 8,
    },

    apiError: {
        marginTop: 6,
        marginLeft: 10,
        fontSize: 14,
        lineHeight: 18,
        fontWeight: "400",
        color: colors.error,
        textAlign: "center",
    },

    sectionLabel: {
        marginTop: 14,
        marginBottom: 3,
        marginLeft: 10,
        fontSize: 16,
        lineHeight: 20,
        fontWeight: "800",
        color: "#FFFFFF",
        textAlign: "left",
    },

    optionsContainer: {
        gap: 8,
    },

    option: {
        minHeight: 48,
        paddingHorizontal: 16,
        justifyContent: "center",
        borderRadius: 14,
        borderWidth: 1,
        backgroundColor: "rgba(230,247,238,0.28)",
        borderColor: "#D0EBDD",
    },

    optionSelected: {
        backgroundColor: "#E6F7EE",
        borderColor: "#00A859",
    },

    optionText: {
        color: "#FFFFFF",
        fontSize: 15,
    },

    optionTextSelected: {
        color: "#000000",
        fontSize: 15,
    },

    rolesSection: {
        marginTop: 16,
        gap: 8,
    },

    rolesContainer: {
        flexDirection: "row",
        flexWrap: "wrap",
        gap: 8,
    },

    roleOption: {
        paddingVertical: 10,
        paddingHorizontal: 14,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: "#D0EBDD",
    },

    fieldError: {
        marginTop: 6,
        fontSize: 13,
        color: colors.error,
    },

    dateField: {
        minHeight: 52,
        justifyContent: "center",
        paddingHorizontal: 16,
        borderWidth: 1,
        borderColor: "#D0EBDD",
        borderRadius: 14,
        backgroundColor: "#FFFFFF",
    },

    dateFieldError: {
        borderColor: colors.error,
    },

    dateText: {
        fontSize: 15,
        color: "#1C1C1C",
    },

    datePlaceholder: {
        color: "#8A8A8A",
    },

    loadingContainer: {
        height: 100,
        alignItems: "center",
        justifyContent: "space-evenly",
    },

    loadingText: {
        fontWeight: "800",
        color: "#FFFFFF",
        fontSize: 16,
    },
});
