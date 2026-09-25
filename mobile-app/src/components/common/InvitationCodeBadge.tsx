import {useEffect, useRef, useState} from "react";
import * as Clipboard from "expo-clipboard";
import {Alert, Pressable, StyleSheet, Text, View} from "react-native";
import {normalizeApiRequestError} from "@/src/services/errorService";
import Ionicons from "@expo/vector-icons/Ionicons";


type InvitationCodeBadgeProps = {
    code?: string | null;
    canRefresh: boolean;
    onRefresh?: () => Promise<string | undefined>;
};


export function InvitationCodeBadge({
                                        code,
                                        canRefresh,
                                        onRefresh,
                                    }: InvitationCodeBadgeProps) {

    const refreshingRef = useRef(false);
    const [isRefreshing, setIsRefreshing] = useState(false);

    const invitationCode = code ?? "";

    const [copied, setCopied] = useState(false);

    const copiedTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

    async function copyInvitationCode() {
        try {
            await Clipboard.setStringAsync(invitationCode);

            setCopied(true);

            if (copiedTimeout.current) {
                clearTimeout(copiedTimeout.current);
            }

            copiedTimeout.current = setTimeout(() => {
                setCopied(false);
            }, 1500);
        } catch {
            Alert.alert(
                "Copia non riuscita",
                "Non è stato possibile copiare il codice di invito.",
            );
        }

    }

    async function refreshInvitationCode() {
        if (!canRefresh || !onRefresh || refreshingRef.current) {
            return;
        }

        refreshingRef.current = true;
        setIsRefreshing(true);

        try {
            await onRefresh();
        } catch (error) {
            const apiError = normalizeApiRequestError(error);

            if (apiError.status !== 401) {
                Alert.alert(
                    "Impossibile aggiornare il codice",
                    apiError.message,
                );
            }
        } finally {
            refreshingRef.current = false;
            setIsRefreshing(false);
        }
    }

    useEffect(() => {
        setCopied(false);

        if (copiedTimeout.current) {
            clearTimeout(copiedTimeout.current);
            copiedTimeout.current = null;
        }
    }, [code]);


    useEffect(() => {
        return () => {
            if (copiedTimeout.current) {
                clearTimeout(copiedTimeout.current);
            }
        };
    }, []);

    if (!invitationCode) return null;

    return (
        <View style={styles.codeBadge}>

            <Pressable
                onPress={copyInvitationCode}
                style={({pressed}) => [
                    styles.copyArea,
                    pressed && styles.infoBadgePressed,
                ]}
                accessibilityRole="button"
                accessibilityLabel="Copia codice invito"
            >
                <View style={styles.infoBadgeIcon}>
                    <Ionicons
                        name="copy-outline"
                        size={16}
                        color="#FFFFFF"
                    />
                </View>

                <Text
                    style={styles.infoBadgeText}
                    numberOfLines={1}
                >
                    {copied ? "Copiato!" : invitationCode}
                </Text>
            </Pressable>


            {canRefresh && onRefresh &&
                <Pressable
                    onPress={refreshInvitationCode}
                    style={({pressed}) => [
                        styles.refreshCode,
                        pressed && styles.refreshCodePressed,
                    ]}
                    accessibilityRole="button"
                    accessibilityLabel="Genera nuovo codice invito"
                    disabled={isRefreshing}
                >
                    <Ionicons
                        name="refresh"
                        size={18}
                        color="#FFFFFF"
                    />
                </Pressable>
            }
        </View>
    );
}


const styles = StyleSheet.create({


    codeBadge: {
        flexDirection: "row",
        alignItems: "center",

        height: 38,
        maxWidth: 220,

        paddingLeft: 8,
        paddingRight: 6,

        marginTop: 10,
        marginBottom: 15,

        borderRadius: 12,

        backgroundColor: "rgba(255,255,255,0.18)",

        borderWidth: 1,
        borderColor: "rgba(255,255,255,0.28)",
    },

    infoBadgePressed: {
        opacity: 0.8,
    },

    copyArea: {
        flexDirection: "row",
        alignItems: "center",
        flex: 1,
        gap: 6,

    },

    refreshCode: {
        alignItems: "center",
        justifyContent: "center",
        width: 28,
        height: 28,
        borderRadius: 60,
        backgroundColor: "rgba(255,255,255,0.4)",
    },

    refreshCodePressed: {
        opacity: 0.8,
    },

    infoBadgeIcon: {
        width: 24,
        height: 24,
        borderRadius: 9,

        alignItems: "center",
        justifyContent: "center",

        backgroundColor: "rgba(255, 255, 255, 0.16)",
    },

    infoBadgeText: {
        flex: 1,
        minWidth: 0,
        flexShrink: 1,

        color: "#FFFFFF",
        fontSize: 11,
        fontWeight: "800",
    },


});