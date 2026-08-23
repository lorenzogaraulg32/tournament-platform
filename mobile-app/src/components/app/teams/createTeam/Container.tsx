import {ImageBackground, KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, View} from "react-native";
import PageLayout from "@/src/components/common/PageLayout";
import ButtonBack from "@/src/components/common/buttons/ButtonBack";
import {ReactNode} from "react";
import Picture from "@/src/components/common/Picture";

type CreateTeamContainerProps = {
    children: ReactNode
}


export default function Container({children}: CreateTeamContainerProps) {
    return (<PageLayout>
        <View style={styles.container}>
            <KeyboardAvoidingView
                style={styles.keyboardContainer}
                behavior={Platform.OS === "ios" ? "padding" : "height"}
                keyboardVerticalOffset={Platform.OS === "ios" ? 20 : 0}
            >
                <ScrollView
                    style={styles.scrollView}
                    contentContainerStyle={styles.scrollContent}
                    showsVerticalScrollIndicator={false}
                    keyboardShouldPersistTaps="handled"
                    automaticallyAdjustKeyboardInsets
                >
                    <ImageBackground
                        source={require(
                            "../../../../../assets/images/backgrounds/orangeBackground.png"
                        )}
                        style={styles.hero}
                        imageStyle={styles.heroBackground}
                    >
                        <ButtonBack/>

                        <View style={styles.heroImageContainer}>
                            <Picture logoUrl={""} style={styles.logo} variant={"team"}/>
                        </View>

                        <View style={styles.heroTextContainer}>
                            <Text style={styles.heroTitle}>
                                Crea la tua squadra
                            </Text>

                            <Text style={styles.heroSubtitle}>
                                Configura la squadra e preparati a
                                invitare i tuoi amici.
                            </Text>
                        </View>
                    </ImageBackground>

                    {children}
                </ScrollView>
            </KeyboardAvoidingView>
        </View>
    </PageLayout>)
}


const styles = StyleSheet.create({
    container: {
        marginTop: 50,
        height: "95%"
    },

    keyboardContainer: {
        flex: 1,
    },

    scrollView: {
        flex: 1,
    },

    scrollContent: {
        flexGrow: 1,
        paddingBottom: 24,
    },

    hero: {
        minHeight: 200,
        flexDirection: "row",
        alignItems: "center",
        paddingHorizontal: 22,
        paddingVertical: 24,

        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,

        overflow: "hidden",

        shadowColor: "#000000",
        shadowOffset: {
            width: 0,
            height: 3,
        },
        shadowOpacity: 0.18,
        shadowRadius: 6,
        elevation: 5,
    },

    heroBackground: {
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
    },

    heroImageContainer: {
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

    heroTextContainer: {
        flex: 1,
        marginLeft: 22,
    },

    heroTitle: {
        color: "#FFFFFF",
        fontSize: 25,
        fontWeight: "800",
    },

    heroSubtitle: {
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