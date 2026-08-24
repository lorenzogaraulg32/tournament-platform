import {KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, View} from "react-native";
import {StatusBar} from "expo-status-bar";
import {ReactNode} from "react";
import {ImageBackground} from "expo-image";



type OnBoardingProps = {
    label?: string
    content?: ReactNode
}


export default function OnBoardingContainer({label, content}: OnBoardingProps) {
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
                    <ScrollView
                        contentContainerStyle={styles.scrollContent}
                        showsVerticalScrollIndicator={false}
                        keyboardShouldPersistTaps="handled"
                        automaticallyAdjustKeyboardInsets
                    >
                        <View style={styles.labelContainer}>
                            <Text style={styles.label}>{label}</Text>
                        </View>

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
    },

    container: {
        flex: 1,
        paddingHorizontal: 24,
    },

    scrollContent: {
        flexGrow: 1,
        paddingTop: 80,
        paddingHorizontal: 35
    },

    contentSlot: {
        width: "100%",
        justifyContent: "flex-start",
    },

    labelContainer: {
        paddingBottom: 20
    },

    label: {
        fontSize: 28,
        fontWeight: 700,
        color: "#ffffff",
    }

});