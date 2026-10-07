import {useEffect, useState} from "react";
import FormationSelector from "@/src/components/pagesComponents/teams/field/FormationSelector";
import {Sport, UserInfo} from "@/src/services/users/userDTO";
import {FORMATIONS_BY_SPORT} from "@/src/components/pagesComponents/teams/field/consts/FieldConst";
import SportField from "@/src/components/pagesComponents/teams/field/SportField";
import {Pressable, StyleSheet, Text, View} from "react-native";
import FullPageModal from "@/src/components/common/FullPageModal";
import PlayerCard from "@/src/components/common/carousel&cards/userCards/PlayerCard";
import FieldPlayerCard from "@/src/components/common/carousel&cards/userCards/FieldPlayerCard";
import Sortable from "react-native-sortables";
import {colors} from "@/src/constants/theme";
import {TeamFormation} from "@/src/services/teams/teamDTO";
import ButtonSolid from "@/src/components/common/buttons/ButtonSolid";
import SportSelector from "@/src/components/pagesComponents/teams/field/SportSelector";


type FieldLineupProps = {
    sport: Sport;
    players: UserInfo[];
    formation: TeamFormation;
    canEdit: boolean;
    isSaving: boolean;
    disabled: boolean;
    onFormationSave: (formation: TeamFormation) => Promise<void>;
    onSportChange: (sport: Sport) => void;
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
                                        onSportChange
                                    }: FieldLineupProps) {

    const availableFormations = FORMATIONS_BY_SPORT[sport] ?? [];

    /*
     * false -> visualizzazione formazione
     * true  -> modifica formazione
     */
    const [isModFormation, setIsModFormation] = useState(false);

    /*
     * disabled / isSaving bloccano realmente l'intero componente.
     *
     * canEdit invece NON deve bloccare la visualizzazione,
     * perché un utente deve comunque poter cliccare sui giocatori
     * e aprirne il profilo.
     */
    const isInteractionDisabled = disabled || isSaving;

    /*
     * La formazione può essere modificata solamente quando:
     * - l'utente ha i permessi;
     * - ha premuto "Modifica formazione";
     * - il componente non è temporaneamente disabilitato.
     */
    const canModifyFormation =
        canEdit &&
        isModFormation &&
        !isInteractionDisabled;


    /* -------------------------------------------------------------------------- */
    /*                         Gestione formazione scelta                         */
    /* -------------------------------------------------------------------------- */

    const [formationName, setFormationName] = useState<string | null>(null);

    const selectedFormation = availableFormations.find(
        (formation) => formation.name === formationName
    );


    const onFormationChange = (name: string) => {
        if (!canModifyFormation || name === formationName) return;

        setSelectedFormationSlotId(null);
        setSlotAssignment({});
        setBenchOrder([]);
        setFormationName(name);
    };


    const handleSportChange = (newSport: Sport) => {
        if (!canModifyFormation || newSport === sport) return;

        onSportChange(newSport);
    };


    /* -------------------------------------------------------------------------- */
    /*                          Gestione slot formazione                          */
    /* -------------------------------------------------------------------------- */

    const [selectedFormationSlotId, setSelectedFormationSlotId] =
        useState<string | null>(null);

    const [slotAssignment, setSlotAssignment] =
        useState<Record<string, string>>({});


    /*
     * Slot attualmente selezionato durante la modifica.
     */
    const selectedSlot = selectedFormation?.slots.find(
        (formationSlot) =>
            formationSlot.role === selectedFormationSlotId
    );


    /*
     * Giocatore presente nello slot attualmente selezionato.
     * Serve per non mostrarlo nuovamente nella modale di selezione.
     */
    const selectedPlayerId =
        selectedFormationSlotId !== null
            ? slotAssignment[selectedFormationSlotId]
            : undefined;


    /*
     * ID dei giocatori già schierati in campo.
     */
    const playersIdOnField = new Set(
        (selectedFormation?.slots ?? [])
            .map((slot) => slotAssignment[slot.role])
            .filter(
                (id): id is string =>
                    id !== undefined
            )
    );


    function openPlayerSelection(slotId: string) {
        if (!canModifyFormation) return;

        setSelectedFormationSlotId(slotId);
    }


    function assignPlayerToSlot(playerId: string) {
        if (!canModifyFormation || !selectedFormationSlotId) return;

        const targetSlotId = selectedFormationSlotId;

        setSlotAssignment((previous) => {
            const next = {...previous};

            /*
             * Controlliamo se il giocatore selezionato
             * occupa già un altro slot.
             */
            const sourceSlotId = Object.keys(previous).find(
                (slotId) =>
                    previous[slotId] === playerId
            );

            if (sourceSlotId === targetSlotId) {
                return previous;
            }

            /*
             * Giocatore eventualmente presente nello slot
             * che stiamo per occupare.
             */
            const replacedPlayerId = previous[targetSlotId];


            /*
             * Se il giocatore arriva da un altro slot:
             *
             * - se lo slot destinazione era occupato,
             *   scambiamo i due giocatori;
             *
             * - altrimenti liberiamo semplicemente
             *   lo slot precedente.
             */
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
        if (!canModifyFormation || !selectedFormationSlotId) return;

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


    /* -------------------------------------------------------------------------- */
    /*                              Gestione panchina                             */
    /* -------------------------------------------------------------------------- */

    const [benchOrder, setBenchOrder] = useState<string[]>([]);
    const [benchWidth, setBenchWidth] = useState(0);


    const benchColumns = Math.max(
        1,
        Math.floor(
            (benchWidth + BENCH_GAP) /
            (BENCH_CARD_WIDTH + BENCH_GAP)
        )
    );


    /*
     * Tutti i giocatori non presenti negli slot
     * vengono considerati giocatori in panchina.
     */
    const availableBenchPlayers = players.filter(
        (player) =>
            !playersIdOnField.has(String(player.id))
    );


    /*
     * Posizione salvata dei giocatori in panchina.
     */
    const benchPositions = new Map(
        benchOrder.map(
            (id, index) => [id, index]
        )
    );


    const benchPlayers = [...availableBenchPlayers].sort(
        (a, b) =>
            (benchPositions.get(String(a.id)) ?? Infinity) -
            (benchPositions.get(String(b.id)) ?? Infinity)
    );


    /* -------------------------------------------------------------------------- */
    /*                            Inizializzazione dati                            */
    /* -------------------------------------------------------------------------- */

    useEffect(() => {

        setFormationName(
            formation.name ??
            availableFormations[0]?.name ??
            null
        );

        setSlotAssignment(
            formation.slotAssignment
        );

        setBenchOrder(
            formation.benchOrder
        );

    }, [formation]);


    /*
     * Se usciamo dalla modalità modifica,
     * chiudiamo eventuali selezioni ancora aperte.
     */
    useEffect(() => {

        if (!canModifyFormation) {
            setSelectedFormationSlotId(null);
        }

    }, [canModifyFormation]);


    /* -------------------------------------------------------------------------- */
    /*                         Modifica / salvataggio                             */
    /* -------------------------------------------------------------------------- */

    function enableFormationModification() {
        if (!canEdit || isInteractionDisabled) return;

        setIsModFormation(true);
    }


    async function saveFormation() {
        if (!canModifyFormation) return;

        await onFormationSave({
            name: formationName,

            slotAssignment: {
                ...slotAssignment,
            },

            benchOrder: benchPlayers.map(
                (player) => String(player.id)
            ),
        });

        /*
         * Torniamo in modalità visualizzazione
         * solamente dopo un salvataggio completato.
         */
        setIsModFormation(false);
    }


    function handleFormationButtonPress() {
        if (isInteractionDisabled) return;

        if (!isModFormation) {
            enableFormationModification();
            return;
        }

        void saveFormation();
    }


    /* -------------------------------------------------------------------------- */
    /*                                   Render                                   */
    /* -------------------------------------------------------------------------- */

    return (

        <View
            style={styles.container}
            pointerEvents={
                isInteractionDisabled
                    ? "none"
                    : "auto"
            }
        >

            {/* ------------------------------------------------------------------ */}
            {/*                             Selettori                              */}
            {/* ------------------------------------------------------------------ */}

            <View style={styles.selectorsContainer}>

                {/*
                    In modalità visualizzazione mostriamo il selettore,
                    ma impediamo che riceva interazioni.

                    Non dipendiamo quindi da una prop "disabled"
                    di FormationSelector.
                */}
                <View
                    pointerEvents={
                        canModifyFormation
                            ? "auto"
                            : "none"
                    }
                >
                    <FormationSelector
                        sport={sport}
                        onChange={onFormationChange}
                        value={formationName}
                    />
                </View>


                <View
                    pointerEvents={
                        canModifyFormation
                            ? "auto"
                            : "none"
                    }
                >
                    <SportSelector
                        sport={sport}
                        onChange={handleSportChange}
                    />
                </View>

            </View>


            {/* ------------------------------------------------------------------ */}
            {/*                                Campo                               */}
            {/* ------------------------------------------------------------------ */}

            <SportField sport={sport}>

                {selectedFormation?.slots.map((slot) => {

                    const assignedPlayerId =
                        slotAssignment[slot.role];

                    const assignedPlayer = players.find(
                        (player) =>
                            String(player.id) === assignedPlayerId
                    );


                    /*
                     * SLOT OCCUPATO
                     *
                     * Se siamo in modifica:
                     * onClick apre la selezione giocatore.
                     *
                     * Se siamo in visualizzazione:
                     * onClick viene omesso e FieldPlayerCard
                     * utilizzerà il proprio comportamento standard,
                     * cioè la navigazione al profilo.
                     */
                    if (assignedPlayer) {

                        return (

                            <View
                                key={slot.role}
                                style={[
                                    styles.slot,
                                    {
                                        left: `${slot.position.x}%`,
                                        top: `${slot.position.y}%`,
                                    },
                                ]}
                            >

                                <FieldPlayerCard
                                    player={assignedPlayer}
                                    sport={sport}
                                    role={slot.role}
                                    roleLabel={slot.label}
                                    onClick={
                                        canModifyFormation
                                            ? () => openPlayerSelection(slot.role)
                                            : undefined
                                    }
                                />

                            </View>

                        );
                    }


                    /*
                     * SLOT VUOTO
                     *
                     * In modalità visualizzazione non deve essere
                     * interagibile.
                     *
                     * In modalità modifica apre normalmente
                     * la selezione del giocatore.
                     */
                    return (

                        <Pressable
                            key={slot.role}
                            onPress={() =>
                                openPlayerSelection(slot.role)
                            }
                            accessibilityRole="button"
                            disabled={!canModifyFormation}
                            accessibilityLabel={
                                `Scegli un giocatore per ${slot.label}`
                            }
                            style={({pressed}) => [

                                styles.slot,
                                styles.slotBk,

                                {
                                    left: `${slot.position.x}%`,
                                    top: `${slot.position.y}%`,
                                    opacity:
                                        pressed &&
                                        canModifyFormation
                                            ? 0.65
                                            : 1,
                                },

                            ]}
                        >

                            <Text style={styles.slotLabel}>
                                {slot.label}
                            </Text>

                        </Pressable>

                    );

                })}

            </SportField>


            {/* ------------------------------------------------------------------ */}
            {/*                       Selezione giocatore                          */}
            {/* ------------------------------------------------------------------ */}

            <FullPageModal
                visible={
                    canModifyFormation &&
                    selectedSlot !== undefined
                }
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
                            disabled={!canModifyFormation}
                            style={styles.removePlayerButton}
                        >

                            <Text style={styles.removePlayerText}>
                                Sposta in panchina
                            </Text>

                        </Pressable>

                    )}


                <View style={{gap: 12}}>

                    {players.length === 0 ? (

                        <Text>
                            Nessun giocatore disponibile
                        </Text>

                    ) : (

                        players
                            .filter(
                                (player) =>
                                    String(player.id) !== selectedPlayerId
                            )
                            .map((player) => (

                                <PlayerCard
                                    key={player.id}
                                    player={player}
                                    sport={sport}
                                    onClick={() =>
                                        assignPlayerToSlot(
                                            String(player.id)
                                        )
                                    }
                                />

                            ))

                    )}

                </View>

            </FullPageModal>


            {/* ------------------------------------------------------------------ */}
            {/*                              Panchina                              */}
            {/* ------------------------------------------------------------------ */}

            <View style={{gap: 10}}>

                <View style={styles.benchHeader}>

                    <Text style={styles.benchLabel}>
                        Panchina
                    </Text>

                    <View style={styles.benchCountBadge}>

                        <Text style={styles.benchCount}>
                            {benchPlayers.length}
                        </Text>

                    </View>

                </View>


                <View
                    onLayout={({nativeEvent}) => {

                        setBenchWidth(
                            nativeEvent.layout.width
                        );

                    }}
                >

                    {benchPlayers.length === 0 ? (

                        <Text
                            style={{
                                color: colors.labelSecondary,
                            }}
                        >
                            Pochi giocatori, grandi ambizioni. Invita qualcuno!
                        </Text>

                    ) : benchWidth > 0 ? (

                        <Sortable.Grid
                            columns={benchColumns}
                            sortEnabled={canModifyFormation}
                            data={benchPlayers}
                            keyExtractor={
                                (player) =>
                                    String(player.id)
                            }
                            columnGap={BENCH_GAP}
                            rowGap={BENCH_GAP}
                            dragActivationDelay={300}
                            overDrag="none"
                            activeItemScale={1}

                            onDragEnd={({data}) => {

                                if (!canModifyFormation) return;

                                setBenchOrder(
                                    data.map(
                                        (player) =>
                                            String(player.id)
                                    )
                                );

                            }}

                            renderItem={({item}) => (

                                <View
                                    style={{
                                        alignItems: "center",
                                    }}
                                >

                                    <FieldPlayerCard
                                        player={item}
                                        sport={sport}

                                        /*
                                         * MODIFICA:
                                         * impediamo il comportamento standard
                                         * della card, perché deve essere usata
                                         * per il drag.
                                         *
                                         * VISUALIZZAZIONE:
                                         * onClick non esiste -> profilo.
                                         */
                                        onClick={
                                            canModifyFormation
                                                ? () => {}
                                                : undefined
                                        }
                                    />

                                </View>

                            )}
                        />

                    ) : null}

                </View>

            </View>


            {/* ------------------------------------------------------------------ */}
            {/*                      Modifica / Salva formazione                   */}
            {/* ------------------------------------------------------------------ */}

            {canEdit && (

                <ButtonSolid
                    variant="teams"
                    disabled={isInteractionDisabled}
                    accessibilityRole="button"
                    accessibilityState={{
                        disabled: isInteractionDisabled,
                        busy: isSaving,
                    }}
                    style={[
                        styles.saveBtn,
                        {
                            opacity:
                                isInteractionDisabled
                                    ? 0.5
                                    : 1,
                        },
                    ]}
                    onPress={handleFormationButtonPress}
                    text={
                        isSaving
                            ? "Salvataggio…"
                            : isModFormation
                                ? "Salva formazione"
                                : "Modifica formazione"
                    }
                />

            )}

        </View>

    );
}


const styles = StyleSheet.create({

    container: {
        gap: 20,
    },


    selectorsContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
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


    removePlayerButton: {
        padding: 14,
        borderRadius: 12,
        backgroundColor: "#FEE2E2",
        marginBottom: 12,
    },


    removePlayerText: {
        color: "#B91C1C",
        fontWeight: "700",
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
        borderColor: colors.orangeBorder,
    },


    benchCount: {
        fontSize: 13,
        fontWeight: "800",
        color: colors.orangeDefault,
    },


    saveBtn: {
        height: 40,
    },

});