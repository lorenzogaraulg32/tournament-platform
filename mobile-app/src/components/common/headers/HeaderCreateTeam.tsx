import {StyleSheet, Text, View} from "react-native";
import Picture from "@/src/components/common/Picture";


export default function HeaderCreateTeam() {
    return (
        <View style={styles.header}>

            <View style={styles.headerImageContainer}>
                <Picture logoUrl={""} style={styles.logo} variant={"team"}/>
            </View>

            <View style={styles.headerTextContainer}>
                <Text style={styles.headerTitle}>
                    Crea la tua squadra
                </Text>

                <Text style={styles.headerSubtitle}>
                    Configura la squadra e preparati a
                    invitare i tuoi amici.
                </Text>
            </View>
        </View>)
}


const styles = StyleSheet.create({
    header: {
        marginTop: 30,
        flexDirection: "row",
        alignItems: "center",
        overflow: "hidden",
    },


    headerImageContainer: {
        width: 112,
        height: 112,
        overflow: "hidden",

        alignItems: "center",
        justifyContent: "center",

        borderRadius: 56,
        borderWidth: 4,
        borderColor: "#C8480A",

        backgroundColor: "#FFFFFF",
    },

    headerTextContainer: {
        flex: 1,
        marginLeft: 22,
    },

    headerTitle: {
        color: "#FFFFFF",
        fontSize: 25,
        fontWeight: "800",
    },

    headerSubtitle: {
        marginTop: 8,

        color: "rgba(255, 255, 255, 0.82)",
        fontSize: 16,
        lineHeight: 22,
    },


    logo: {
        width: "100%",
        height: "100%",
        borderRadius: 100
    },
})