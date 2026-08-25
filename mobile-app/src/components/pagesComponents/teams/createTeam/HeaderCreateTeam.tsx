import {Pressable, StyleSheet, Text, View} from "react-native";
import Picture from "@/src/components/common/images/Picture";
import Ionicons from "@expo/vector-icons/Ionicons";
import {router} from "expo-router";


export default function HeaderCreateTeam() {

    function onBackPress() {
        router.back()
    }

    return (
        <View style={styles.header}>

            <Pressable
                onPress={onBackPress}
                hitSlop={16}
                style={[
                    styles.backButton,
                ]}
            >
                <Ionicons
                    name="chevron-back"
                    size={28}
                    color="#FFFFFF"
                />
            </Pressable>
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
        paddingTop: 35,
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

    backButton: {
        position: "absolute",

        top: 0,
        left: 0,
        zIndex: 10,

        width: 35,
        height: 35,

        alignItems: "center",
        justifyContent: "center",

        borderRadius: 18,

        backgroundColor: "rgba(255,255,255,0.14)",

    },


})