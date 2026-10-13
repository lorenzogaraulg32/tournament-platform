import {ReactNode} from "react";
import {Pressable, StyleSheet, View} from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import {
    Authority,
    authorityCardPalettes,
    teamCardColors,
    tournamentCardColors
} from "@/src/constants/palette/CardPalettesManager";
import {CardBackground} from "@/src/components/common/cards/CardBackground";
import {roleCardPalettes} from "@/src/constants/palette/RolePalette";
import {SportRole} from "@/src/services/sportDTO";

type HorizontalCardContainerProps = {
    // Variante della card
    variant: "team" | "tournament" | "authority" | "player";


    // Contenuto / Componente interno
    children: ReactNode;

    // Pressione della card
    onPress: () => void;

    // Personalizzazione
    authority?: Authority;
    role?: SportRole
    icon?: keyof typeof Ionicons.glyphMap;
    iconColor?: string;
};

/**
 * Il container si occupa di gestire il background e la pressione
 * <li> Recupera la palette in base alla variante e imposta lo sfondo corrispondente
 * <li> Dichiara la card come pressable, quindi gestisce onPress
 * <li> Children è l'istanza della card da mostrare
 * <li> authority è utile in caso di card di tipo autorità, per specificare di che autorità si tratta
 * <li> icon, iconColor sono utili quando la card può avere più funzioni sull'onPress, ci dà un feedback grafico sull'azione corrente
 *
 */
export default function CardContainerHorizontal({
                                                    variant,
                                                    children,
                                                    onPress,
                                                    authority,
                                                    role,
                                                    icon = "chevron-forward",
                                                    iconColor,
                                                }: HorizontalCardContainerProps) {

    function getPalette() {
        switch (variant) {
            case "team":
                return teamCardColors;

            case "tournament":
                return tournamentCardColors;

            case "player":
                return role ?
                    roleCardPalettes[role]
                    : teamCardColors

            case "authority":
                return authority
                    ? authorityCardPalettes[authority]
                    : teamCardColors;
        }
    }

    const palette = getPalette();

    const isCompact =
        variant === "authority" || variant === "player";

    return (
        <Pressable
            style={({pressed}) => [
                styles.card,
                isCompact
                    ? styles.authorityCard
                    : styles.standardCard,
                pressed && styles.cardPressed,
            ]}
            onPress={onPress}
        >

            {<CardBackground
                palette={palette}
                compact={isCompact}
            />}

            {children}


            <View
                style={[
                    styles.arrowContainer, {backgroundColor: palette.accentBackground}]}
            >
                <Ionicons
                    name={icon}
                    size={17}
                    color={iconColor ?? palette.accent}
                />
            </View>

        </Pressable>
    )
}


const styles = StyleSheet.create({
    card: {
        position: "relative",
        flexDirection: "row",
        alignItems: "center",
        paddingHorizontal: 12,
    },

    standardCard: {
        width: "100%",
        height: 56,
    },

    authorityCard: {
        flex: 1,
        height: 46,
    },

    cardPressed: {
        opacity: 0.9,
        transform: [{scale: 0.985}],
    },

    arrowContainer: {
        width: 28,
        height: 28,
        borderRadius: 14,
        marginLeft: 8,
        alignItems: "center",
        justifyContent: "center",
    },
});