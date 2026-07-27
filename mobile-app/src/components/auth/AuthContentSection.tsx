import {ReactNode} from "react";
import {StyleProp, StyleSheet, View, ViewStyle} from "react-native";


type AuthContentSectionProps = {
    children: ReactNode
    style?: StyleProp<ViewStyle>;
}


export default function AuthContentSection({children, style}: AuthContentSectionProps) {
    return (
        <View style={[styles, style]}>
            {children}
        </View>
    )
}


const styles = StyleSheet.create({

})