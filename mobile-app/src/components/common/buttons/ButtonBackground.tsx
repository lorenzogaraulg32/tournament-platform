import {ImageBackground, Pressable, StyleSheet, Text, View} from "react-native";
import {FontAwesome6} from "@expo/vector-icons";

type ButtonBGProps = {
    text: string
    onPress: () => void
    variant: "orange" | "purple"
}


export default function ButtonBackground({text, onPress, variant}: ButtonBGProps) {

    return (
        <Pressable
            onPress={onPress}
            accessibilityRole="button"
            accessibilityLabel="Crea una nuova squadra"
            style={({pressed}) => [
                styles.btnWrapper,
                pressed && styles.btnPressed,
            ]}
        >
            <ImageBackground
                source={
                    variant === "orange" ? require("../../../../assets/images/backgrounds/orangeBackground.png")
                        : variant === "purple" ? require("../../../../assets/images/backgrounds/purpleBackground.png")
                        : require("../../../../assets/images/backgrounds/greenBackground.png")
                }
                style={styles.btn}
                imageStyle={styles.btnBg}
            >
                <View style={styles.icon}>
                    <FontAwesome6
                        name="plus"
                        size={19}
                        color="#FFFFFF"
                    />
                </View>

                <Text style={[styles.btnText]}>
                    {text}
                </Text>
            </ImageBackground>
        </Pressable>
    )

}


const RADIUS = 18;

const styles = StyleSheet.create({
    btn: {
        minHeight: 52,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "flex-start",
        gap: 10,

        marginTop: 12,
        marginBottom: 12,
        paddingHorizontal: 15,
        borderRadius: RADIUS,
        borderWidth: 1,
        borderColor: "#ffffff",


        shadowColor: "#000000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.08,
        shadowRadius: 4,
        elevation: 2,
    },

    btnWrapper: {
        borderRadius: RADIUS,

        shadowColor: "#000000",
        shadowOffset: {
            width: 0,
            height: 3,
        },
        shadowOpacity: 0.18,
        shadowRadius: 5,
        elevation: -4,
        paddingHorizontal: 10,
    },


    btnBg: {
        borderRadius: RADIUS,
    },

    icon: {
        width: 36,
        height: 36,
        alignItems: "center",
        justifyContent: "center",
    },


    btnContainer: {
        paddingHorizontal: 10
    },


    btnPressed: {
        opacity: 0.75,
        transform: [
            {
                scale: 0.99,
            },
        ],
    },

    btnText: {
        color: "#ffffff",
        fontSize: 16,
        fontWeight: "700",
    },

})

