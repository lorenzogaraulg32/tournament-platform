import {useState} from "react";
import ModuleSelector from "@/src/components/pagesComponents/teams/Fields/ModuleSelector";
import {Sport} from "@/src/services/users/userConstants";
import {FORMATIONS_BY_SPORT} from "@/src/components/pagesComponents/teams/Fields/FieldConst";
import FootballField from "@/src/components/pagesComponents/teams/Fields/FootballField";
import {Pressable, StyleSheet, Text, View} from "react-native";
import {UserInfo} from "@/src/services/users/userService";
import FullPageModal from "@/src/components/common/FullPageModal";
import PlayerCard from "@/src/components/common/carousel&cards/userCards/PlayerCard";
import FieldPlayerCard from "@/src/components/common/carousel&cards/userCards/FieldPlayerCard";
import Sortable from "react-native-sortables";
import {colors} from "@/src/constants/theme";

type FieldLineupProps = {
    sport: Sport
    players: UserInfo[]
}

const BENCH_CARD_WIDTH = 72;
const BENCH_GAP = 12;

export default function FieldLineup({sport, players}: FieldLineupProps) {


    const formations = FORMATIONS_BY_SPORT[sport] ?? [];

    const [formationId, setFormationId] = useState<string | null>(
        () => formations[0]?.id ?? null
    );

    const selectedFormation = formations.find(
        (formation) => formation.id === formationId
    );

    const onFormationChange = (id: string) => {
        setSelectedSlotId(null);
        setFormationId(id);
    };

    const [selectedSlotId, setSelectedSlotId] = useState<string | null>(null);
    const [slotAssignment, setSlotAssignment] = useState<Partial<Record<string, string>>>({})
    const [benchOrder, setBenchOrder] = useState<string[]>([]);

    const [benchWidth, setBenchWidth] = useState(0);

    const benchColumns = Math.max(
        1,
        Math.floor(
            (benchWidth + BENCH_GAP) /
            (BENCH_CARD_WIDTH + BENCH_GAP)
        )
    );


    const selectedSlot = selectedFormation?.slots.find(
        (slot) => slot.id === selectedSlotId
    );

    function closePlayerSelection() {
        setSelectedSlotId(null);
    }

    function assignPlayer(playerId: string) {
        if (!selectedSlotId) return;

        const targetSlotId = selectedSlotId;

        setSlotAssignment((previous) => {
            const next = {...previous};


            const sourceSlotId = Object.keys(previous).find(
                (slotId) => previous[slotId] === playerId
            );


            if (sourceSlotId === targetSlotId) return previous;

            const replacedPlayerId = previous[targetSlotId];

            if (sourceSlotId) {
                if (replacedPlayerId !== undefined) {
                    next[sourceSlotId] = replacedPlayerId;
                } else {
                    delete next[sourceSlotId];
                }
            }

            next[targetSlotId] = playerId;

            return next;
        });

        setSelectedSlotId(null);
    }

    function deAssignPlayer() {
        if (!selectedSlotId) return;

        const slotId = selectedSlotId;

        setSlotAssignment((previous) => {
            const next = {...previous};
            delete next[slotId];
            return next;
        });

        setSelectedSlotId(null);
    }

    const fieldPlayerIds = new Set(
        (selectedFormation?.slots ?? [])
            .map((slot) => slotAssignment[slot.id])
            .filter((id): id is string => id !== undefined)
    );

    const availableBenchPlayers = players.filter(
        (player) => !fieldPlayerIds.has(String(player.id))
    );

    const benchPositions = new Map(
        benchOrder.map((id, index) => [id, index])
    );

    const benchPlayers = [...availableBenchPlayers].sort(
        (a, b) =>
            (benchPositions.get(String(a.id)) ?? Infinity) -
            (benchPositions.get(String(b.id)) ?? Infinity)
    );

    const selectedPlayerId = selectedSlotId !== null
        ? slotAssignment[selectedSlotId]
        : undefined;

    return (
        <View style={styles.container}>
            <ModuleSelector sport={sport} onChange={onFormationChange} value={formationId}/>
            <FootballField>
                {selectedFormation?.slots.map((slot) => {

                        const assignedPlayerId = slotAssignment[slot.id]

                        const assignedPlayer = players.find(
                            (player) => String(player.id) === assignedPlayerId
                        )

                        return (
                            <Pressable
                                key={slot.id}
                                onPress={() => setSelectedSlotId(slot.id)}
                                accessibilityRole="button"
                                accessibilityLabel={`Scegli un giocatore per ${slot.label}`}
                                style={({pressed}) => [
                                    !assignedPlayer && styles.slotBk,
                                    styles.slot,
                                    {
                                        left: `${slot.position.x}%`,
                                        top: `${slot.position.y}%`,
                                        opacity: pressed ? 0.65 : 1,
                                    },
                                ]}
                            >
                                {assignedPlayer ? (
                                    <FieldPlayerCard
                                        key={assignedPlayer.id}
                                        player={assignedPlayer}
                                        sport={sport}/>
                                ) : (
                                    <Text style={styles.slotLabel}>{slot.label}</Text>
                                )}

                            </Pressable>
                        )
                    }
                )}
            </FootballField>
            <FullPageModal
                visible={selectedSlot !== undefined}
                onClose={closePlayerSelection}
                label={
                    selectedSlot
                        ? `Giocatori · ${selectedSlot.label}`
                        : "Giocatori"
                }
                iconName="people-outline"
            >
                {selectedSlotId !== null &&
                    slotAssignment[selectedSlotId] !== undefined && (
                        <Pressable
                            onPress={deAssignPlayer}
                            accessibilityRole="button"
                            style={{
                                padding: 14,
                                borderRadius: 12,
                                backgroundColor: "#FEE2E2",
                                marginBottom: 12,
                            }}
                        >
                            <Text
                                style={{
                                    color: "#B91C1C",
                                    fontWeight: "700",
                                    textAlign: "center",
                                }}
                            >
                                Sposta in panchina
                            </Text>
                        </Pressable>
                    )}
                <View style={{gap: 12}}>
                    {players.length === 0 ? (
                        <Text>Nessun giocatore disponibile</Text>
                    ) : (
                        players
                            .filter((player) => String(player.id) !== selectedPlayerId)
                            .map((player) => (
                                <PlayerCard
                                    key={player.id}
                                    player={player}
                                    sport={sport}
                                    onClick={() => assignPlayer(String(player.id))}
                                />
                            ))
                    )}
                </View>
            </FullPageModal>
            <View style={{gap: 10}}>
                <View style={styles.benchHeader}>
                    <Text style={styles.benchLabel}>Panchina</Text>

                    <View style={styles.benchCountBadge}>
                        <Text style={styles.benchCount}>
                            {benchPlayers.length}
                        </Text>
                    </View>
                </View>

                <View
                    onLayout={({nativeEvent}) => {
                        setBenchWidth(nativeEvent.layout.width);
                    }}
                >
                    {benchPlayers.length === 0 ? (
                        <Text>Nessun giocatore in panchina</Text>
                    ) : benchWidth > 0 ? (
                        <Sortable.Grid
                            columns={benchColumns}
                            data={benchPlayers}
                            keyExtractor={(player) => String(player.id)}
                            columnGap={BENCH_GAP}
                            rowGap={BENCH_GAP}
                            dragActivationDelay={300}
                            overDrag="none"
                            activeItemScale={1}
                            onDragEnd={({data}) => {
                                setBenchOrder(
                                    data.map((player) => String(player.id))
                                );
                            }}
                            renderItem={({item}) => (
                                <View style={{alignItems: "center"}}>
                                    <FieldPlayerCard
                                        player={item}
                                        sport={sport}
                                    />
                                </View>
                            )}
                        />
                    ) : null}
                </View>
            </View>
        </View>
    )


}


const styles = StyleSheet.create({

    container: {
        gap: 5,
    },

    slot: {
        position: "absolute",
        width: 72,
        height: 70,

        transform: [
            {translateX: -36},
            {translateY: -35},
        ],

        alignItems: "center",
        justifyContent: "center",

    },

    slotBk: {
        borderRadius: 12,
        borderWidth: 1,
        borderStyle: "dashed",
        borderColor: "#FFFFFF",
        backgroundColor: "rgba(0, 0, 0, 0.20)",
    },

    slotLabel: {
        color: "#FFFFFF",
        fontSize: 10,
        textAlign: "center",
    },

    benchHeader: {
        flexDirection: "row",
        alignItems: "center",
        gap: 8,
    },

    benchLabel: {
        fontSize: 18,
        fontWeight: "700",
        color: "#202724",
    },

    benchCountBadge: {
        minWidth: 28,
        height: 28,
        paddingHorizontal: 8,
        borderRadius: 14,
        backgroundColor: colors.orangeDefaultBK,
        alignItems: "center",
        justifyContent: "center",
        borderWidth: 1,
        borderColor: colors.orangeBorder
    },

    benchCount: {
        fontSize: 13,
        fontWeight: "800",
        color: colors.orangeDefault,
    },

});