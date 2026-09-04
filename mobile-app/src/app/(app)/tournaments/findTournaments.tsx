import {StyleSheet, TextInput, View} from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";


export default function FindTournaments() {

    return (<View style={styles.findTournamentContent}>
        <View style={styles.searchContainer}>
            <Ionicons
                name="search-outline"
                size={21}
                color="#7A8781"
            />

            <TextInput
                placeholder="Cerca un Torneo..."
                placeholderTextColor="#9AA39F"
                style={styles.searchInput}
            />
        </View>
    </View>)

}


const styles = StyleSheet.create({
    findTournamentContent: {
        flex: 1,
    },

    searchContainer: {
        height: 50,

        flexDirection: "row",
        alignItems: "center",

        paddingHorizontal: 16,
        gap: 10,

        backgroundColor: "#FFFFFF",

        borderRadius: 14,
        borderWidth: 1,
        borderColor: "#DDE5E1",

        shadowColor: "#000000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.05,
        shadowRadius: 4,

        elevation: 2,
    },

    searchInput: {
        flex: 1,
        height: "100%",

        fontSize: 15,
        fontWeight: "500",

        color: "#173D2C",
    },
})