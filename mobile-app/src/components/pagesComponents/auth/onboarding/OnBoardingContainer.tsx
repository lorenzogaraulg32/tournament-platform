import {KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, View} from "react-native";
import {StatusBar} from "expo-status-bar";
import {ReactNode} from "react";
import {ImageBackground} from "expo-image";
import FormProgressBar from "@/src/components/common/forms/FormProgressBar";


type OnBoardingProps = {
    label: string
    content: ReactNode
    step: number
}


export default function OnBoardingContainer({label, content, step}: OnBoardingProps) {
    return (
        <View
            collapsable={false}
            renderToHardwareTextureAndroid
            style={styles.container}
        >
            <ImageBackground
                source={require("../../../../../assets/images/full_bkg.png")}
                style={StyleSheet.absoluteFill}
                imageStyle={StyleSheet.absoluteFill}

            >
                <StatusBar style="light"/>

                <KeyboardAvoidingView
                    style={styles.keyboardContainer}
                    behavior={Platform.OS === "ios" ? "padding" : "height"}
                    keyboardVerticalOffset={Platform.OS === "ios" ? 20 : 0}
                >
                    <View style={styles.labelContainer}>
                        <Text style={styles.label}>{label}</Text>
                        <FormProgressBar step={step} totalSteps={5}/>
                    </View>
                    <ScrollView
                        contentContainerStyle={styles.scrollContent}
                        showsVerticalScrollIndicator={false}
                        keyboardShouldPersistTaps="handled"
                        automaticallyAdjustKeyboardInsets
                    >


                        <View style={styles.contentSlot}>
                            {content}
                        </View>
                    </ScrollView>
                </KeyboardAvoidingView>
            </ImageBackground>
        </View>
    );
}


const styles = StyleSheet.create({
    keyboardContainer: {
        flex: 1,
        paddingTop: 80,
        paddingHorizontal: 35
    },

    container: {
        flex: 1,
        paddingHorizontal: 24,
    },

    scrollContent: {
        flexGrow: 1,
    },

    contentSlot: {
        width: "100%",
        justifyContent: "flex-start",
    },

    labelContainer: {
        paddingBottom: 10,
        justifyContent: "center"
    },

    label: {
        paddingBottom: 10,
        fontSize: 28,
        fontWeight: 700,
        color: "#ffffff",
    }

});