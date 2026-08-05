import Background from "@/src/components/common/Background";
import {Pressable, ScrollView, StyleSheet, View} from "react-native";
import ProfileHeader from "@/src/components/app/profile/ProfileHeader";
import * as UserServices from "@/src/services/userService";
import Ionicons from "@expo/vector-icons/Ionicons";
import TitleApp from "@/src/components/common/headers/HeaderMain";
import {colors} from "@/src/constants/theme"

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

                <ProfileHeader/>


                <View style={styles.profileContent}>
                </View>

            </ScrollView>

            <View style={styles.logoutContainer}>

                <Pressable
                    style={({pressed})=> [
                        styles.logoutBtn,
                        pressed && styles.logoutBtnPressed
                    ]}

                    onPress={UserServices.handleLogout}>
                    <Ionicons
                        name="log-out-outline"
                        size={28}
                        color="#ffffff"
                        style={{transform: [{translateX: +3}]}}
                    />
                </Pressable>

            </View>
        </Background>
    );
}


const styles = StyleSheet.create({
    scrollView: {
        flex: 1,
    },

    scrollContent: {
        flexGrow: 1,
        gap: 10,
    },

    profileContent: {
        flex: 1,
    },

    logoutContainer: {
        position: "absolute",
        bottom: 15,
        right: 15,
        width: 58,
    },

    logoutBtn:{
        width: 58,
        height: 58,
        borderRadius: 28,
        backgroundColor: colors.orangeDefault,
        borderWidth: 2,
        borderColor: "rgba(255, 255, 255, 0.16)",
        alignItems: "center",
        justifyContent: "center",
        shadowColor: "#000",
        shadowOffset: {width: 0, height: 8},
        shadowOpacity: 0.20,
        shadowRadius: 12,
        elevation: 8,
    },

    logoutBtnPressed: {
        transform: [{scale: 0.98}],
        opacity: 0.9,
    },

});