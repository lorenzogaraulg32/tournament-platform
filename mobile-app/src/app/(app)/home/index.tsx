import {ImageBackground, ScrollView, StyleSheet, Text, View} from "react-native";
import Background from "@/src/components/common/Background";
import {colors, corners} from "@/src/constants/theme";

export default function Homepage() {


    return (

        <Background>

            <ImageBackground
                source={require("../../../../assets/images/backgrounds/greenBackground.png")}
                style={styles.titleContainer}>
                <Text style={styles.homeTitle}>{"Benvenuto in JoinCup"}</Text>
            </ImageBackground>

            <View style={styles.scrollContainer}></View>
            <ScrollView
                style={styles.scrollView}
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
            >

            </ScrollView>
        </Background>

    )
}


const styles = StyleSheet.create({

    scrollContainer: {
        borderRadius: corners.standard,
    },

    scrollView: {
        flex: 1,
        backgroundColor: "#ffffff",
    },

    titleContainer: {
        padding: 15,
        alignItems: "center",
        justifyContent: "center",
        overflow: "hidden",
        borderTopLeftRadius: corners.standard,
        borderTopRightRadius: corners.standard,
        borderWidth: 1,

        borderColor: colors.background,
        borderBottomColor: "#fff",

        backgroundColor: colors.background,
    },

    homeTitle: {
        color: "#ffffff",
        fontSize: 24,
        fontWeight: 700,
    },

    scrollContent: {
        flexGrow: 1,
    },
});