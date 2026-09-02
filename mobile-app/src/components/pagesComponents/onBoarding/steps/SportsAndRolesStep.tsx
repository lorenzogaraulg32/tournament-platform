import {Pressable, Text, View} from "react-native";
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

type SportsAndRolesStepProps = {
    sports: Sport[];
    roles: UserSportRole[];
    errorMessage?: string;
    onToggleSport: (sport: Sport) => void;
    onToggleRole: (sport: Sport, role: SportRole) => void;
    onBack: () => void;
    onNext: () => void;
};

export default function SportsAndRolesStep({
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
                            {Object.values(Sport).map(sport => {
                                const selected =
                                    sports.includes(sport);

                                return (
                                    <Pressable
                                        key={sport}
                                        style={[
                                            styles.option,
                                            selected &&
                                            styles.optionSelected,
                                        ]}
                                        onPress={() =>
                                            onToggleSport(sport)
                                        }
                                    >
                                        <Text
                                            style={[
                                                styles.optionText,
                                                selected &&
                                                styles.optionTextSelected,
                                            ]}
                                        >
                                            {SPORT_LABELS[sport]}
                                        </Text>
                                    </Pressable>
                                );
                            })}
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
                                    {SPORT_ROLES[sport].map(role => {
                                        const selected = roles.some(
                                            selectedRole =>
                                                selectedRole.sport ===
                                                    sport &&
                                                selectedRole.role === role
                                        );

                                        return (
                                            <Pressable
                                                key={role}
                                                style={[
                                                    styles.roleOption,
                                                    selected &&
                                                    styles.optionSelected,
                                                ]}
                                                onPress={() =>
                                                    onToggleRole(
                                                        sport,
                                                        role
                                                    )
                                                }
                                            >
                                                <Text
                                                    style={[
                                                        styles.optionText,
                                                        selected &&
                                                        styles.optionTextSelected,
                                                    ]}
                                                >
                                                    {ROLE_LABELS[role]}
                                                </Text>
                                            </Pressable>
                                        );
                                    })}
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
