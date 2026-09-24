import {useEffect, useState} from "react";
import FormationSelector from "@/src/components/pagesComponents/teams/Fields/FormationSelector";
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
import {TeamFormation} from "@/src/services/teams/teamsConst";
import ButtonSolid from "@/src/components/common/buttons/ButtonSolid";


type FieldLineupProps = {
    sport: Sport;
    players: UserInfo[];
    formation: TeamFormation;
    canEdit: boolean;
    isSaving: boolean;
    disabled: boolean;
    onFormationSave: (formation: TeamFormation) => Promise<void>;
};

const BENCH_CARD_WIDTH = 72;
const BENCH_GAP = 12;

export default function FieldLineup({
                                        sport,
                                        players,
                                        formation,
                                        canEdit,
                                        isSaving,
                                        disabled,
                                        onFormationSave,
                                    }: FieldLineupProps) {


    const availableFormations = FORMATIONS_BY_SPORT[sport] ?? [];


    /*---- Gestione formazione selezionata, questi metodi vengono utilizzati dal formationSelector ----*/
    const [formationName, setFormationName] = useState<string | null>(null);

    const selectedFormation = availableFormations.find(
        (formation) => formation.name === formationName
    );

    const onFormationChange = (name: string) => {
        if (isInteractionDisabled || name === formationName) return;

        setSelectedFormationSlotId(null);
        setSlotAssignment({});
        setBenchOrder([]);
        setFormationName(name);
    };


    /*---- Gestione degli slot nella formazione ----*/
    const [selectedFormationSlotId, setSelectedFormationSlotId] = useState<string | null>(null);
    const [slotAssignment, setSlotAssignment] = useState<Record<string, string>>({})

    //rappresenta lo slot selezionato quando dobbiamo assegnarci un giocatore
    const selectedSlot = selectedFormation?.slots.find(
        (formationSlot) => formationSlot.role === selectedFormationSlotId
    );

    // quando si vuole switchare un giocatore bisogna sapere qual'è
    const selectedPlayerId = selectedFormationSlotId !== null
        ? slotAssignment[selectedFormationSlotId]
        : undefined;

    // id dei giocatori schierati in campo
    const playersIdOnField = new Set(
        (selectedFormation?.slots ?? [])
            .map((slot) => slotAssignment[slot.role])
            .filter((id): id is string => id !== undefined)
    );

    function assignPlayerToSlot(playerId: string) {
        if (isInteractionDisabled || !selectedFormationSlotId) return;

        const targetSlotId = selectedFormationSlotId;

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

        setSelectedFormationSlotId(null);
    }

    function removePlayerFromSlot() {
        if (isInteractionDisabled || !selectedFormationSlotId) return;

        const slotId = selectedFormationSlotId;

        setSlotAssignment((previous) => {
            const next = {...previous};
            delete next[slotId];
            return next;
        });

        setSelectedFormationSlotId(null);
    }

    function closePlayerSelection() {
        setSelectedFormationSlotId(null);
    }

    /*---- Gestione panchina con suo ordine ----*/
    const [benchOrder, setBenchOrder] = useState<string[]>([]);
    const [benchWidth, setBenchWidth] = useState(0);

    const benchColumns = Math.max(
        1,
        Math.floor(
            (benchWidth + BENCH_GAP) /
            (BENCH_CARD_WIDTH + BENCH_GAP)
        )
    );


    // id dei giocatori in panchina
    const availableBenchPlayers = players.filter(
        (player) => !playersIdOnField.has(String(player.id))
    );

    // ordinamento della panchina
    const benchPositions = new Map(
        benchOrder.map((id, index) => [id, index])
    );

    const benchPlayers = [...availableBenchPlayers].sort(
        (a, b) =>
            (benchPositions.get(String(a.id)) ?? Infinity) -
            (benchPositions.get(String(b.id)) ?? Infinity)
    );

    //init tramite i valori presenti nel team
    useEffect(() => {
        setFormationName(formation.name ?? availableFormations[0]?.name ?? null);
        setSlotAssignment(formation.slotAssignment)
        setBenchOrder(formation.benchOrder)
    }, [formation]);

    //Interazione con utente
    const isInteractionDisabled = !canEdit || disabled || isSaving;

    useEffect(() => {
        if (isInteractionDisabled) {
            setSelectedFormationSlotId(null);
        }
    }, [isInteractionDisabled]);


    return (
        <View style={styles.container} pointerEvents={isInteractionDisabled ? "none" : "auto"}>
            <FormationSelector sport={sport} onChange={onFormationChange} value={formationName}/>
            <FootballField>
                {selectedFormation?.slots.map((slot) => {

                        const assignedPlayerId = slotAssignment[slot.role]

                        const assignedPlayer = players.find(
                            (player) => String(player.id) === assignedPlayerId
                        )

                        return (
                            <Pressable
                                key={slot.role}
                                onPress={() => setSelectedFormationSlotId(slot.role)}
                                accessibilityRole="button"
                                disabled={isInteractionDisabled}
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
                visible={!isInteractionDisabled && selectedSlot !== undefined}
                onClose={closePlayerSelection}
                label={
                    selectedSlot
                        ? `Giocatori · ${selectedSlot.label}`
                        : "Giocatori"
                }
                iconName="people-outline"
            >
                {selectedFormationSlotId !== null &&
                    slotAssignment[selectedFormationSlotId] !== undefined && (
                        <Pressable
                            onPress={removePlayerFromSlot}
                            accessibilityRole="button"
                            disabled={isInteractionDisabled}
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
                                    onClick={() => assignPlayerToSlot(String(player.id))}
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
                        <Text style={{color: colors.labelSecondary}}>Pochi giocatori, grandi ambizioni. Invita
                            qualcuno!</Text>
                    ) : benchWidth > 0 ? (
                        <Sortable.Grid
                            columns={benchColumns}
                            sortEnabled={!isInteractionDisabled}
                            data={benchPlayers}
                            keyExtractor={(player) => String(player.id)}
                            columnGap={BENCH_GAP}
                            rowGap={BENCH_GAP}
                            dragActivationDelay={300}
                            overDrag="none"
                            activeItemScale={1}
                            onDragEnd={({data}) => {
                                if (isInteractionDisabled) return;

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
            {canEdit && (

                <ButtonSolid
                    variant="buttonRegister"
                    textVariant="textRegister"
                    disabled={isInteractionDisabled}
                    accessibilityRole="button"
                    accessibilityState={{
                        disabled: isInteractionDisabled,
                        busy: isSaving,
                    }}
                    style={[styles.saveBtn, {opacity: isInteractionDisabled ? 0.5 : 1}]}
                    onPress={() => {
                        if (isInteractionDisabled) return;

                        void onFormationSave({
                            name: formationName,
                            slotAssignment: {...slotAssignment},
                            benchOrder: benchPlayers.map(
                                (player) => String(player.id)
                            ),
                        });
                    }}
                    text={isSaving ? "Salvataggio…" : "Salva formazione"}
                />


            )}
        </View>
    )


}


const styles = StyleSheet.create({

    container: {
        gap: 20,
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

    saveBtn: {
        height: 40,
    }


});