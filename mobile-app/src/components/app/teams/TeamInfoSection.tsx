import {
    ActivityIndicator,
    Image,
    ImageBackground,
    StyleSheet,
    Text,
    View,
} from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import SectionContainer from "../infoSectionContainer";

export type TeamDetails = {
    id: number;
    name: string;
    logoUrl?: string | null;
    creatorId: string;
    playerIds: string[];
};

type TeamInfoSectionProps = {
    team: TeamDetails | null;
    isLoading?: boolean;
    error?: string | null;
};

const TEAM_BACKGROUND = require(
    "../../../../assets/images/teaminfoSectionBkg.png"
);

export default function TeamInfoSection({
                                            team,
                                            isLoading = false,
                                            error = null,
                                        }: TeamInfoSectionProps) {
    return (
        <SectionContainer
            backgroundSource={TEAM_BACKGROUND}
            overlayColor="rgba(31, 10, 2, 0.25)"
            borderColor="rgba(255, 154, 72, 0.25)"
        >
            {isLoading ? (
                <FeedbackContent>
                    <ActivityIndicator
                        size="large"
                        color="#FFFFFF"
                    />

                    <Text style={styles.feedbackText}>
                        Caricamento squadra...
                    </Text>
                </FeedbackContent>
            ) : error ? (
                <FeedbackContent>
                    <Ionicons
                        name="alert-circle-outline"
                        size={30}
                        color="#FFFFFF"
                    />

                    <Text style={styles.feedbackText}>
                        {error}
                    </Text>
                </FeedbackContent>
            ) : !team ? (
                <FeedbackContent>
                    <Text style={styles.feedbackText}>
                        Squadra non disponibile
                    </Text>
                </FeedbackContent>
            ) : (
                <TeamData team={team}/>
            )}
        </SectionContainer>
    );
}

type TeamDataProps = {
    team: TeamDetails;
};

function TeamData({team}: TeamDataProps) {
    const playersCount = team.playerIds?.length ?? 0;

    return (
        <View style={styles.dataContainer}>
            <TeamLogo logoUrl={team.logoUrl}/>

            <View style={styles.verticalSeparator}/>

            <View style={styles.textContainer}>
                <Text
                    style={styles.teamName}
                    numberOfLines={2}
                >
                    {team.name.toUpperCase()}
                </Text>

                <View style={styles.infoBadge}>
                    <Ionicons
                        name="people"
                        size={15}
                        color="#FFFFFF"
                    />

                    <Text style={styles.infoBadgeText}>
                        {playersCount}{" "}
                        {playersCount === 1
                            ? "giocatore"
                            : "giocatori"}
                    </Text>
                </View>
            </View>
        </View>
    );
}

type TeamLogoProps = {
    logoUrl?: string | null;
};

function TeamLogo({logoUrl}: TeamLogoProps) {
    return (
        <View style={styles.imageContainer}>
            {logoUrl ? (
                <Image
                    source={{uri: logoUrl}}
                    style={styles.logo}
                    resizeMode="cover"
                />
            ) : (
                <ImageBackground
                    source={require(
                        "../../../../assets/images/placeholder for teams.webp"
                    )}
                    style={styles.logo}
                    resizeMode="cover"
                />
            )}
        </View>
    );
}

type FeedbackContentProps = {
    children: React.ReactNode;
};

function FeedbackContent({
                             children,
                         }: FeedbackContentProps) {
    return (
        <View style={styles.feedbackContainer}>
            {children}
        </View>
    );
}

const styles = StyleSheet.create({
    dataContainer: {
        minHeight: 128,
        flexDirection: "row",
        alignItems: "center",
        paddingHorizontal: 18,
        paddingVertical: 18,
    },

    imageContainer: {
        width: 88,
        height: 88,
        borderRadius: 44,
        overflow: "hidden",

        borderWidth: 3,
        borderColor: "#FFFFFF",
        backgroundColor: "#D9D9D9",
    },

    logo: {
        width: "100%",
        height: "100%",
    },

    verticalSeparator: {
        width: 1,
        height: 76,
        marginHorizontal: 18,
        backgroundColor: "rgba(255, 255, 255, 0.24)",
    },

    textContainer: {
        flex: 1,
        minWidth: 0,
        justifyContent: "center",
    },

    teamName: {
        color: "#FFFFFF",
        fontSize: 22,
        lineHeight: 27,
        fontWeight: "800",
        letterSpacing: 0.2,
    },

    infoBadge: {
        alignSelf: "flex-start",
        flexDirection: "row",
        alignItems: "center",

        marginTop: 14,
        paddingHorizontal: 11,
        paddingVertical: 6,

        borderRadius: 18,
        gap: 6,

        backgroundColor: "rgba(255, 255, 255, 0.14)",

        borderWidth: 1,
        borderColor: "rgba(255, 255, 255, 0.18)",
    },

    infoBadgeText: {
        color: "#FFFFFF",
        fontSize: 13,
        fontWeight: "700",
    },

    feedbackContainer: {
        minHeight: 120,
        alignItems: "center",
        justifyContent: "center",
        paddingHorizontal: 24,
        gap: 10,
    },

    feedbackText: {
        color: "#FFFFFF",
        fontSize: 15,
        fontWeight: "600",
        textAlign: "center",
    },
});