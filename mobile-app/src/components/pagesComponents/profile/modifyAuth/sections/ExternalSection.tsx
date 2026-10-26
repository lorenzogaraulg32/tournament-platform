import {StyleSheet, Text, View} from "react-native";

type ExternalSectionProps = {
    onBack:() => void;
};

export default function ExternalSection({onBack}: ExternalSectionProps) {
    return (
        <View>
            <Text>
                Sezione provider esterni
            </Text>

        </View>
    )
}


const styles = StyleSheet.create({});