import {KeyboardAvoidingView, Platform, Pressable, ScrollView, StyleSheet, View} from "react-native";
import PageLayout from "@/src/components/common/PageLayout";
import {ReactNode} from "react";
import HeaderContainer from "@/src/components/common/headers/HeaderContainer";
import HeaderCreateTeam from "@/src/components/pagesComponents/teams/createTeam/HeaderCreateTeam";
import Ionicons from "@expo/vector-icons/Ionicons";
import {router} from "expo-router";

type CreateTeamContainerProps = {
    children: ReactNode
}


export default function CreateTeamContainer({children}: CreateTeamContainerProps) {



    return (
        <PageLayout header={
            <HeaderContainer variant={"orange"}>
                <HeaderCreateTeam/>
            </HeaderContainer>
        }>
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


                        {children}
                    </ScrollView>
                </KeyboardAvoidingView>
            </View>
        </PageLayout>)
}


const styles = StyleSheet.create({
    container: {
        flex: 1
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




    closeButtonPressed: {
        opacity: 0.7,
        transform: [
            {
                scale: 0.94,
            },
        ],
    },


})