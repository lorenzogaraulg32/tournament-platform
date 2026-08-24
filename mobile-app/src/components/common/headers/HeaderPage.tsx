import {StyleSheet, Text, View} from "react-native";


type HeaderPageProps = {
    label: string;
    title: string;
    subtitle: string;
};


/**
 * Header delle pagine principali dell'app

 * @param label
 * @param title
 * @param subtitle
 * @constructor
 */
export default function HeaderPage({
                                            label,
                                            title,
                                            subtitle
                                        }: HeaderPageProps) {

    return (
        <View>

            <Text style={styles.label}>
                {label}
            </Text>

            <Text style={styles.title}>
                {title}
            </Text>

            <Text style={styles.subtitle}>
                {subtitle}
            </Text>

        </View>
    );
}


const styles = StyleSheet.create({
    label: {
        color: "rgba(255,255,255,0.78)",
        fontSize: 14,
        fontWeight: "600",

        marginBottom: 4,
    },

    title: {
        color: "#FFFFFF",
        fontSize: 30,
        fontWeight: "800",
    },

    subtitle: {
        color: "rgba(255,255,255,0.90)",
        fontSize: 14,
        lineHeight: 20,

        marginTop: 6,
    },

});