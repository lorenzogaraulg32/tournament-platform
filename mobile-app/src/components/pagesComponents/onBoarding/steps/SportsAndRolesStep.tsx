import {Text, View} from "react-native";
import AuthContent from "@/src/components/pagesComponents/auth/AuthContent";
import OnBoardingContainer from "@/src/components/pagesComponents/auth/onboarding/OnBoardingContainer";
import OnBoardingNavigationButtons from "@/src/components/pagesComponents/onBoarding/OnBoardingNavigationButtons";
import {onboardingStepStyles as styles} from "@/src/components/pagesComponents/onBoarding/onboardingStepStyles"
import {
    ROLE_LABELS,
    Sport,
    SPORT_LABELS,
    SPORT_ROLES,
    type SportRole,
    type UserSportRole,
} from "@/src/services/users/userConstants";
import {Variant} from "@/src/constants/PaletteManager";
import FormSelectionButton from "@/src/components/common/forms/components/FormSelectionButton";

type SportsAndRolesStepProps = {
    variant?: Variant;
    sports: Sport[];
    roles: UserSportRole[];
    errorMessage?: string;
    onToggleSport: (sport: Sport) => void;
    onToggleRole: (sport: Sport, role: SportRole) => void;
    onBack: () => void;
    onNext: () => void;
};

export default function SportsAndRolesStep({
                                               variant = "profile",
                                               sports,
                                               roles,
                                               errorMessage,
                                               onToggleSport,
                                               onToggleRole,
                                               onBack,
                                               onNext,
                                           }: SportsAndRolesStepProps) {
    return (
        <OnBoardingContainer
            step={4}
            label="Completa la registrazione"
            content={
                <AuthContent style={styles.inputFieldsContainer}>
                    <View>
                        <Text style={styles.sectionLabel}>
                            Quali sport pratichi?
                        </Text>

                        <View style={styles.optionsContainer}>
                            {Object.values(Sport).map(sport => (
                                <FormSelectionButton
                                    key={sport}
                                    label={SPORT_LABELS[sport]}
                                    variant={variant}
                                    selected={sports.includes(sport)}
                                    onPress={() => onToggleSport(sport)}
                                />
                            ))}
                        </View>

                        {sports.map(sport => (
                            <View
                                key={sport}
                                style={styles.rolesSection}
                            >
                                <Text style={styles.sectionLabel}>
                                    Ruolo · {SPORT_LABELS[sport]}
                                </Text>

                                <View style={styles.rolesContainer}>
                                    {SPORT_ROLES[sport].map(role => (
                                        <FormSelectionButton
                                            key={role}
                                            label={ROLE_LABELS[role]}
                                            variant={variant}
                                            selected={roles.some(
                                                item => item.sport === sport && item.role === role
                                            )}
                                            onPress={() => onToggleRole(sport, role)}
                                        />
                                    ))}
                                </View>
                            </View>
                        ))}

                        {errorMessage && (
                            <Text style={styles.fieldError}>
                                {errorMessage}
                            </Text>
                        )}
                    </View>

                    <OnBoardingNavigationButtons
                        onBack={onBack}
                        onNext={onNext}
                    />
                </AuthContent>
            }
        />
    );
}
