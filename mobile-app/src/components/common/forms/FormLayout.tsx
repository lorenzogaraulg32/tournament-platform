import {ReactNode} from "react";
import PageLayout from "@/src/components/common/PageLayout";
import HeaderContainer from "@/src/components/common/headers/HeaderContainer";
import {KeyboardAvoidingView, Platform, ScrollView, StyleSheet, View} from "react-native";

type FormLayoutProps = {
    header : ReactNode
    children: ReactNode
    variant : "team" | "tournament"
}


export default function FormLayout( {header, children, variant} : FormLayoutProps) {

    return(
       <PageLayout header={
           <HeaderContainer variant={(variant === "team" ? "orange" : "purple")}>
               {header}
           </HeaderContainer>
       }  >
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

       </PageLayout>
    )
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


})