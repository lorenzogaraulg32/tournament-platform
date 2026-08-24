import {ActivityIndicator, Alert, Pressable, StyleSheet, Text, TextInput, View,} from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import {useEffect, useState} from "react";
import * as Location from "expo-location";
import FormLabel from "@/src/components/common/labels/formLabel";
import { colors } from "@/src/constants/theme";


type PositionFieldVariant =
    "createTeam" | "createUser";

export type TeamLocation = {
    label: string;
    latitude: number;
    longitude: number;
};

type LocationSuggestion = {
    placeId: string;
    label: string;
};

type TeamLocationSectionProps = {
    variant: PositionFieldVariant;
    value: TeamLocation | null;
    onChange: (location: TeamLocation | null) => void;
    errorMessage?: string;
};

const GOOGLE_API_KEY = process.env.EXPO_PUBLIC_GOOGLE_PLACES_API_KEY;

export default function TeamLocationSection({
                                                variant,
                                                value,
                                                onChange,
                                                errorMessage,
                                            }: TeamLocationSectionProps) {

    const isCreateUser = variant === "createUser";

    const [isLocating, setIsLocating] = useState(false);

    const [query, setQuery] = useState("");
    const [suggestions, setSuggestions] = useState<LocationSuggestion[]>([]);

    const [isLoading, setIsLoading] = useState(false);
    const [isFocused, setIsFocused] = useState(false);

    const [searchError, setSearchError] = useState<string | null>(null);

    const isError = Boolean(errorMessage);

    useEffect(() => {
        const trimmedQuery = query.trim();

        if (
            trimmedQuery.length < 3 ||
            value?.label === query
        ) {
            setSuggestions([]);
            return;
        }

        const timeout = setTimeout(() => {
            void searchLocations(trimmedQuery);
        }, 400);

        return () => clearTimeout(timeout);
    }, [query, value]);

    async function useCurrentLocation() {
        try {
            setIsLocating(true);
            setSearchError(null);

            const permission =
                await Location.requestForegroundPermissionsAsync();

            if (permission.status !== "granted") {
                Alert.alert(
                    "Permesso necessario",
                    "Consenti l'accesso alla posizione per utilizzare la tua posizione corrente."
                );
                return;
            }

            const currentPosition =
                await Location.getCurrentPositionAsync({
                    accuracy: Location.Accuracy.Balanced,
                });

            const {latitude, longitude} =
                currentPosition.coords;

            const addresses =
                await Location.reverseGeocodeAsync({
                    latitude,
                    longitude,
                });

            const address = addresses[0];

            const label = address
                ? [
                    address.city,
                    address.region,
                    address.country,
                ]
                    .filter(Boolean)
                    .join(", ")
                : `${latitude}, ${longitude}`;

            const selectedLocation: TeamLocation = {
                label,
                latitude,
                longitude,
            };

            onChange(selectedLocation);
            setQuery(label);
            setSuggestions([]);
        } catch {
            setSearchError(
                "Impossibile recuperare la posizione corrente"
            );
        } finally {
            setIsLocating(false);
        }
    }

    async function searchLocations(searchQuery: string) {
        if (!GOOGLE_API_KEY) {
            setSearchError("Chiave Google Places mancante");
            return;
        }

        try {
            setIsLoading(true);
            setSearchError(null);

            const response = await fetch(
                "https://places.googleapis.com/v1/places:autocomplete",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        "X-Goog-Api-Key": GOOGLE_API_KEY,
                    },
                    body: JSON.stringify({
                        input: searchQuery,
                        includedRegionCodes: ["it"],
                        languageCode: "it",
                    }),
                }
            );

            if (!response.ok) {
                throw new Error(
                    "Errore durante la ricerca della posizione"
                );
            }

            const data = await response.json();

            const results: LocationSuggestion[] =
                data.suggestions
                    ?.map((item: any) => {
                        const prediction =
                            item.placePrediction;

                        if (!prediction?.placeId) {
                            return null;
                        }

                        return {
                            placeId: prediction.placeId,
                            label:
                                prediction.text?.text ?? "",
                        };
                    })
                    .filter(Boolean) ?? [];

            setSuggestions(results);
        } catch (error) {
            setSuggestions([]);
            setSearchError(
                error instanceof Error
                    ? error.message
                    : "Errore durante la ricerca"
            );
        } finally {
            setIsLoading(false);
        }
    }

    async function selectLocation(
        suggestion: LocationSuggestion
    ) {
        if (!GOOGLE_API_KEY) {
            return;
        }

        try {
            setIsLoading(true);
            setSearchError(null);

            const response = await fetch(
                `https://places.googleapis.com/v1/places/${suggestion.placeId}`,
                {
                    headers: {
                        "X-Goog-Api-Key": GOOGLE_API_KEY,
                        "X-Goog-FieldMask":
                            "displayName,formattedAddress,location",
                    },
                }
            );

            if (!response.ok) {
                throw new Error(
                    "Impossibile recuperare la posizione"
                );
            }

            const place = await response.json();

            const selectedLocation: TeamLocation = {
                label:
                    place.formattedAddress ??
                    place.displayName?.text ??
                    suggestion.label,
                latitude: place.location.latitude,
                longitude: place.location.longitude,
            };

            onChange(selectedLocation);
            setQuery(selectedLocation.label);
            setSuggestions([]);
        } catch (error) {
            setSearchError(
                error instanceof Error
                    ? error.message
                    : "Errore durante la selezione"
            );
        } finally {
            setIsLoading(false);
        }
    }

    function clearLocation() {
        onChange(null);
        setQuery("");
        setSuggestions([]);
    }

    return (
        <View style={styles.container}>
            {isCreateUser ? (
                <View style={styles.createUserLabelContainer}>
                    <Text style={styles.createUserLabel}>
                        Posizione
                    </Text>

                    <Text style={styles.createUserOptional}>
                        Opzionale
                    </Text>
                </View>
            ) : (
                <FormLabel
                    text="Posizione"
                    optional
                    labelIconName="location-outline"
                />
            )}
            <View
                style={[
                    styles.inputContainer,

                    isCreateUser &&
                    styles.inputContainerCreateUser,

                    isFocused &&
                    (
                        isCreateUser
                            ? styles.inputContainerFocusedCreateUser
                            : styles.inputContainerFocused
                    ),

                    isError &&
                    styles.inputContainerError,
                ]}
            >
                <Ionicons
                    name="search-outline"
                    size={21}
                    color={
                        isCreateUser
                            ? "rgba(255,255,255,0.65)"
                            : "#929292"
                    }
                />
                <TextInput
                    value={query}
                    onChangeText={(text) => {
                        setQuery(text);

                        if (value) {
                            onChange(null);
                        }
                    }}
                    onFocus={() => setIsFocused(true)}
                    onBlur={() => setIsFocused(false)}
                    placeholder="Cerca città o zona..."
                    placeholderTextColor={
                        isCreateUser
                            ? "rgba(255,255,255,0.50)"
                            : "#929292"
                    }
                    selectionColor="#C8480A"
                    style={[
                        styles.input,
                        isCreateUser && styles.inputCreateUser,
                    ]}
                />

                {isLoading && (
                    <ActivityIndicator
                        size="small"
                        color="#C8480A"
                    />
                )}
            </View>

            {suggestions.length > 0 && (
                <View
                    style={[
                        styles.suggestionsContainer,
                        isCreateUser &&
                        styles.suggestionsContainerCreateUser,
                    ]}
                >
                    {suggestions.map((suggestion) => (
                        <Pressable
                            key={suggestion.placeId}
                            onPress={() =>
                                void selectLocation(
                                    suggestion
                                )
                            }
                            style={({pressed}) => [
                                styles.suggestion,

                                isCreateUser &&
                                styles.suggestionCreateUser,

                                pressed &&
                                (
                                    isCreateUser
                                        ? styles.suggestionPressedCreateUser
                                        : styles.suggestionPressed
                                ),
                            ]}
                        >
                            <Ionicons
                                name="location-outline"
                                size={19}
                                color={
                                    isCreateUser
                                        ? "#FFFFFF"
                                        : "#C8480A"
                                }
                            />
                            <Text
                                style={[
                                    styles.suggestionText,
                                    isCreateUser &&
                                    styles.suggestionTextCreateUser,
                                ]}
                            >
                                {suggestion.label}
                            </Text>
                        </Pressable>
                    ))}
                </View>
            )}

            <Pressable
                onPress={() => void useCurrentLocation()}
                disabled={isLocating}
                style={({pressed}) => [
                    styles.currentLocationButton,

                    isCreateUser &&
                    styles.currentLocationButtonCreateUser,

                    pressed &&
                    styles.currentLocationButtonPressed,

                    isLocating &&
                    styles.currentLocationButtonDisabled,
                ]}
            >
                {isLocating ? (
                    <ActivityIndicator
                        size="small"
                        color="#C8480A"
                    />
                ) : (
                    <Ionicons
                        name="locate-outline"
                        size={20}
                        color={
                            isCreateUser
                                ? "#FFFFFF"
                                : "#C8480A"
                        }
                    />
                )}

                <Text
                    style={[
                        styles.currentLocationText,
                        isCreateUser &&
                        styles.currentLocationTextCreateUser,
                    ]}
                >
                    Usa la mia posizione
                </Text>
            </Pressable>

            <View
                style={[
                    styles.selectedLocation,
                    isCreateUser &&
                    styles.selectedLocationCreateUser,
                ]}
            >
                <Ionicons
                    name={
                        value
                            ? "location-sharp"
                            : "location-outline"
                    }
                    size={24}
                    color={
                        isCreateUser
                            ? value
                                ? "#FFFFFF"
                                : "rgba(255,255,255,0.55)"
                            : value
                                ? "#C8480A"
                                : "#A0A0A0"
                    }
                />

                <Text
                    style={[
                        styles.selectedLocationText,
                        isCreateUser &&
                        styles.selectedLocationTextCreateUser,
                    ]}
                    numberOfLines={1}
                >
                    {value?.label ?? "Nessuna posizione selezionata"}
                </Text>

                {value && (
                    <Pressable
                        onPress={clearLocation}
                        hitSlop={10}
                        accessibilityRole="button"
                        accessibilityLabel="Rimuovi posizione"
                        style={({pressed}) => [
                            styles.clearButton,

                            isCreateUser &&
                            styles.clearButtonCreateUser,

                            pressed &&
                            styles.clearButtonPressed,
                        ]}
                    >
                        <Ionicons
                            name="close"
                            size={23}
                            color={
                                isCreateUser
                                    ? "#FFFFFF"
                                    : "#A0A0A0"
                            }
                        />
                    </Pressable>
                )}
            </View>

            {(errorMessage || searchError) && (
                <Text style={styles.errorText}>
                    {errorMessage ?? searchError}
                </Text>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        width: "100%",
        marginBottom: 20,
        gap: 5,
    },

    labelContainer: {
        flexDirection: "row",
        alignItems: "center",
        gap: 10,
        marginBottom: 9,
    },

    iconContainer: {
        width: 40,
        height: 40,
        alignItems: "center",
        justifyContent: "center",
        borderRadius: 20,
        backgroundColor: "rgba(200, 72, 10, 0.12)",
    },

    label: {
        color: "#1C1C1C",
        fontSize: 17,
        fontWeight: "800",
    },

    inputContainer: {
        minHeight: 54,
        flexDirection: "row",
        alignItems: "center",
        gap: 10,
        paddingHorizontal: 16,
        borderRadius: 18,
        borderWidth: 1.5,
        borderColor: "#D8D8D8",
        backgroundColor: "#F5F5F5",
    },

    inputContainerFocused: {
        borderColor: "#C8480A",
        backgroundColor: "#FFFFFF",
    },

    inputContainerError: {
        borderColor: "#B42318",
        backgroundColor: "#FFF7F6",
    },

    input: {
        flex: 1,
        minHeight: 52,
        color: "#1C1C1C",
        fontSize: 16,
        fontWeight: "500",
    },

    suggestionsContainer: {
        marginTop: 6,
        overflow: "hidden",
        borderRadius: 14,
        borderWidth: 1,
        borderColor: "#D8D8D8",
        backgroundColor: "#FFFFFF",
    },

    suggestion: {
        minHeight: 50,
        flexDirection: "row",
        alignItems: "center",
        gap: 10,
        paddingHorizontal: 14,
        paddingVertical: 10,
        borderBottomWidth: StyleSheet.hairlineWidth,
        borderBottomColor: "#E2E2E2",
    },

    suggestionPressed: {
        backgroundColor: "#F7F1EE",
    },

    suggestionText: {
        flex: 1,
        color: "#1C1C1C",
        fontSize: 14,
    },

    selectedLocation: {
        minHeight: 58,
        flexDirection: "row",
        alignItems: "center",
        gap: 12,

        marginTop: 10,
        paddingHorizontal: 16,
        paddingVertical: 10,

        borderRadius: 16,
        borderWidth: 1,
        borderColor: "rgba(200, 72, 10, 0.25)",
        backgroundColor: "rgba(200, 72, 10, 0.06)",
    },

    selectedLocationText: {
        flex: 1,
        color: "#1C1C1C",
        fontSize: 15,
        fontWeight: "700",
    },


    currentLocationButton: {
        minHeight: 44,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        gap: 8,

        marginTop: 8,
        borderRadius: 14,
        borderWidth: 1,
        borderColor: "rgba(200, 72, 10, 0.28)",
        backgroundColor: "rgba(200, 72, 10, 0.06)",
    },

    currentLocationButtonPressed: {
        opacity: 0.7,
    },

    currentLocationButtonDisabled: {
        opacity: 0.6,
    },

    currentLocationText: {
        color: "#C8480A",
        fontSize: 14,
        fontWeight: "700",
    },


    clearButton: {
        width: 36,
        height: 36,
        alignItems: "center",
        justifyContent: "center",
        borderRadius: 18,
        backgroundColor: "#EEEEEE",
    },

    clearButtonPressed: {
        opacity: 0.7,
    },
    errorText: {
        marginTop: 6,
        marginLeft: 4,
        color: "#B42318",
        fontSize: 13,
        fontWeight: "500",
    },

    createUserLabelContainer: {
        flexDirection: "row",
        alignItems: "center",
        gap: 6,
        marginLeft: 10,
        marginBottom: 13,
    },

    createUserLabel: {
        color: "#FFFFFF",
        fontSize: 16,
        lineHeight: 20,
        fontWeight: "800",
    },

    createUserOptional: {
        color: "rgba(255,255,255,0.55)",
        fontSize: 12,
    },

    inputContainerCreateUser: {
        backgroundColor: "rgba(255,255,255,0.30)",
        borderColor: "rgba(255,255,255,0.35)",
    },

    inputContainerFocusedCreateUser: {
        borderColor: "#C8480A",
        backgroundColor: "rgba(255,255,255,0.40)",
    },

    inputCreateUser: {
        color: "#FFFFFF",
    },


    suggestionsContainerCreateUser: {
        backgroundColor: "rgba(20,60,45,0.95)",
        borderColor: "rgba(255,255,255,0.25)",
    },

    suggestionCreateUser: {
        borderBottomColor: "rgba(255,255,255,0.15)",
    },

    suggestionPressedCreateUser: {
        backgroundColor: "rgba(255,255,255,0.12)",
    },

    suggestionTextCreateUser: {
        color: "#FFFFFF",
    },

    currentLocationButtonCreateUser: {
        borderColor: "rgba(255,255,255,0.28)",
        backgroundColor: colors.orangeDefault,
    },

    currentLocationTextCreateUser: {
        color: "#FFFFFF",
    },

    clearButtonCreateUser: {
        backgroundColor: "rgba(255,255,255,0.18)",
    },

    selectedLocationCreateUser: {
        borderColor: "rgba(255,255,255,0.25)",
        backgroundColor: "rgba(255,255,255,0.16)",
    },

    selectedLocationTextCreateUser: {
        color: "#FFFFFF",
    },

});