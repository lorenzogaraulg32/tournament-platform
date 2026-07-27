import AuthButton from "@/src/components/auth/AuthButton";
import Background from "@/src/components/common/Background";
import {ScrollView, StyleSheet, View} from "react-native";
import UserInfoSection from "@/src/components/app/profile/UserInfoSection";
import * as UserServices from "@/src/services/userService";
import Ionicons from "@expo/vector-icons/Ionicons";
import TitleApp from "@/src/components/app/TitleHeader";


export default function ProfilePage() {


    return (
        <Background
            header={
                <TitleApp text={"Profilo"}/>
            }>
            <ScrollView
                style={styles.scrollView}
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
            >

                <UserInfoSection/>


                <View style={styles.profileContent}>

                </View>
                <View style={styles.logoutContainer}>

                    <AuthButton
                        variant="logout"
                        onPress={UserServices.handleLogout}
                    >
                        <Ionicons
                            name="log-out-outline"
                            size={26}
                            color="#ffffff"
                            style={{transform: [{translateX: +3}]}}
                        />
                    </AuthButton>

                </View>
            </ScrollView>
        </Background>
    );
}


const styles = StyleSheet.create({
    scrollView: {
        flex: 1,
    },

    scrollContent: {
        flexGrow: 1,
    },

    profileContent: {
        flex: 1,
    },

    logoutContainer: {
        width: "100%",
        alignItems: "flex-end",
        paddingTop: 6,
        paddingRight: 6,
        paddingBottom: 6,
    },


});