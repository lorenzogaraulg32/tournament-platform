import {KeyboardAvoidingView, Platform, ScrollView, StyleSheet, View} from "react-native";
import {StatusBar} from "expo-status-bar";
import {ReactNode} from "react";
import {ImageBackground} from "expo-image";


type AuthContainerProps = {
    header?: ReactNode,
    content?:ReactNode
}



export default function AuthContainer({header, content}: AuthContainerProps) {
    return (
        <View
            collapsable={false}
            renderToHardwareTextureAndroid
            style={styles.container}
        >
            <ImageBackground
                source={require("../../../../assets/images/full_bkg.png")}
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
                        <View style={styles.headerSlot}>
                            {header}
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
        paddingTop: 150,
        paddingBottom: 70,
        paddingHorizontal: 35
    },

    headerSlot: {
        height: 400,
        alignItems: "center",
        justifyContent: "flex-start",
    },

    contentSlot: {
        flex: 1,
        width: "100%",
        justifyContent: "flex-end",
    },

});