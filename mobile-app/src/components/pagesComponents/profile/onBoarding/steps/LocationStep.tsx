import {ActivityIndicator, Text, View} from "react-native";
import AuthContent from "@/src/components/pagesComponents/auth/AuthContent";
import PositionField from "@/src/components/common/forms/fileds/FormPositionField";
import OnBoardingContainer from "@/src/components/pagesComponents/profile/onBoarding/OnBoardingContainer";
import {
    onboardingStepStyles as styles
} from "@/src/components/pagesComponents/profile/onBoarding/misc/onboardingStepStyles"
import {GeoLocation} from "@/src/services/common";
import FormStepNavigation from "@/src/components/common/forms/FormStepNavigation";

type LocationStepProps = {
    location: GeoLocation | null;
    errorMessage?: string;
    finalError: string;
    isLoading: boolean;
    onLocationChange: (value: GeoLocation | null) => void;
    onBack: () => void;
    onNext: () => void;
};

export default function LocationStep({
                                         location,
                                         errorMessage,
                                         finalError,
                                         isLoading,
                                         onLocationChange,
                                         onBack,
                                         onNext,
                                     }: LocationStepProps) {
    return (
        <OnBoardingContainer
            step={4}
            label="Completa la registrazione"
            content={
                <AuthContent style={styles.inputFieldsContainer}>
                    <PositionField
                        variant="onBoarding"
                        value={location}
                        onChange={onLocationChange}
                        errorMessage={errorMessage}
                    />

                    <View>
                        {finalError && (
                            <Text style={styles.apiError}>
                                {finalError}
                            </Text>
                        )}

                        {isLoading && (
                            <View style={styles.loadingContainer}>
                                <Text
                                    style={styles.loadingText}
                                    numberOfLines={1}
                                >
                                    Completamento del processo di onboarding...
                                </Text>

                                <ActivityIndicator
                                    size="large"
                                    color="#FFFFFF"
                                />
                            </View>
                        )}

                        <FormStepNavigation
                            onBack={onBack}
                            onNext={onNext}
                            nextVariant={"onBoarding"}
                            loading={isLoading}
                            nextLabel={"Termina"}/>

                    </View>
                </AuthContent>
            }
        />
    );
}
