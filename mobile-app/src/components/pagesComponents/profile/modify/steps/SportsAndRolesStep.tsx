import {StyleSheet, Text, View} from "react-native";
import type {Variant} from "@/src/constants/PaletteManager";
import {colors} from "@/src/constants/theme";
import {
    ROLE_LABELS,
    Sport,
    SPORT_LABELS,
    SPORT_ROLES,
    type SportRole,
    type UserSportRole,
} from "@/src/services/users/userConstants";
import FormLabel from "@/src/components/common/labels/FormLabel";
import FormSelectionButton from "@/src/components/common/forms/components/FormSelectionButton";

type ProfileSportsAndRolesStepProps = {
    variant: Variant;
    sports: Sport[];
    roles: UserSportRole[];
    onToggleSport: (sport: Sport) => void;
    onToggleRole: (sport: Sport, role: SportRole) => void;
    sportsError?: string;
    rolesError?: string;
    disabled?: boolean;
};

export default function ProfileSportsAndRolesStep({
                                                      variant,
                                                      sports,
                                                      roles,
                                                      onToggleSport,
                                                      onToggleRole,
                                                      sportsError,
                                                      rolesError,
                                                      disabled = false,
                                                  }: ProfileSportsAndRolesStepProps) {
    return (
        <View
            style={styles.container}
            pointerEvents={disabled ? "none" : "auto"}
        >
            <View style={styles.section}>
                <FormLabel
                    text="Sport"
                    labelIconName="trophy-outline"
                    variant={variant}
                />

                <View style={styles.options}>
                    {Object.values(Sport).map(sport => (
                        <FormSelectionButton
                            key={sport}
                            variant={variant}
                            label={SPORT_LABELS[sport]}
                            selected={sports.includes(sport)}
                            onPress={() => onToggleSport(sport)}
                            accessibilityRole="checkbox"
                        />
                    ))}
                </View>

                {!!sportsError && (
                    <Text style={styles.error}>{sportsError}</Text>
                )}
            </View>

            {sports.map(sport => (
                <View key={sport} style={styles.section}>
                    <FormLabel
                        text={`Ruoli · ${SPORT_LABELS[sport]}`}
                        labelIconName="people-outline"
                        variant={variant}
                    />

                    <View style={styles.options}>
                        {SPORT_ROLES[sport].map(role => (
                            <FormSelectionButton
                                key={role}
                                variant={variant}
                                label={ROLE_LABELS[role]}
                                selected={roles.some(
                                    item =>
                                        item.sport === sport &&
                                        item.role === role
                                )}
                                onPress={() => onToggleRole(sport, role)}
                                accessibilityRole="checkbox"
                            />
                        ))}
                    </View>
                </View>
            ))}

            {!!rolesError && (
                <Text style={styles.error}>{rolesError}</Text>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        gap: 20,
    },
    section: {
        gap: 8,
    },
    options: {
        flexDirection: "row",
        flexWrap: "wrap",
        gap: 8,
    },
    error: {
        color: colors.error,
        fontSize: 13,
    },
});