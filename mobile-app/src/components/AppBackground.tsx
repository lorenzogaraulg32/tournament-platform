import {ReactNode} from "react";
import {StyleSheet} from "react-native";
import {LinearGradient} from "expo-linear-gradient";
import {colors} from "../constants/theme"


type AppBackgroundProps = {
    children: ReactNode;
};

export default function AppBackground({children}: AppBackgroundProps) {
    return (
        <LinearGradient
            colors={[colors.backgroundStart, colors.backgroundMiddle, colors.backgroundEnd]}
            start={{x: 0, y: 0}}
            end={{x: 1, y: 1}}
            style={styles.container}
        >
            {children}
        </LinearGradient>

    );
}


const styles = StyleSheet.create({
    container: {
        flex : 1
    },
});