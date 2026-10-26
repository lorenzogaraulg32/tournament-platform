import {KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, View} from "react-native";
import React, {ReactNode} from "react";
import {Variant} from "@/src/constants/palette/PaletteManager";
import FormStepNavigation from "@/src/components/common/forms/FormStepNavigation";
import FormProgressBar from "@/src/components/common/forms/FormProgressBar";
import PageLayout from "@/src/components/common/layout/PageLayout";


type FormContentProps = {
    step?: number,
    totalSteps?: number,
    children: ReactNode
    error?: string,

    variant: Variant,
    header: ReactNode,

    onNext?: () => void,
    onBack?: () => void,

    nextLabel?: string

    loading?: boolean
}


export default function FormLayout({
                                       step,
                                       totalSteps,
                                       variant,
                                       header,
                                       children,
                                       onNext,
                                       nextLabel = "Continua",
                                       onBack,
                                       error,
                                       loading = false,
                                   }: FormContentProps) {


    const isStep =
        step !== undefined &&
        totalSteps !== undefined &&
        totalSteps > 0 &&
        onNext !== undefined;


    return (

        <PageLayout header={header}>
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
                    <View>
                        {isStep &&
                            <FormProgressBar
                                step={step}
                                totalSteps={totalSteps}
                                variant={variant}
                            />
                        }
                        {children}
                    </View>
                    <View>
                        {error && (
                            <Text style={styles.submitError}>
                                {error}
                            </Text>
                        )}

                        {isStep &&
                            <FormStepNavigation
                                onNext={onNext}
                                nextLabel={nextLabel}
                                nextVariant={variant}
                                onBack={onBack}
                                loading={loading}
                            />
                        }

                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </PageLayout>
    )
}


const styles = StyleSheet.create({

    keyboardContainer: {
        flex: 1,
    },

    scrollView: {
        flex: 1,
    },

    scrollContent: {
        flexGrow: 1,
        justifyContent: "space-between"
    },


    submitError: {
        marginBottom: 10,
        marginTop: 20,
        color: "#B42318",
        fontSize: 14,
        textAlign: "center",
    },


});