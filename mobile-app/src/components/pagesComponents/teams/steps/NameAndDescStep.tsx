import { View } from "react-native";
import FormInputField from "@/src/components/common/forms/components/FormInputField";
import FormSwitch from "@/src/components/common/forms/components/FormSwitch";
import type { RecruitmentStatus } from "@/src/services/teams/teamsConst";
import type { Variant } from "@/src/constants/PaletteManager";

const RECRUITMENT_OPTIONS: {
    value: RecruitmentStatus;
    label: string;
}[] = [
    { value: "OPEN", label: "Aperte" },
    { value: "CLOSED", label: "Chiuse" },
];

type NameAndDescStepProps = {
    variant: Variant;
    nameValue: string;
    descValue: string;
    switchValue: RecruitmentStatus;
    onChangeName: (name: string) => void;
    onChangeDesc: (description: string) => void;
    onChangeSwitch: (status: RecruitmentStatus) => void;
    errorMsgName?: string;
    errorMsgDesc?: string;
    editable: boolean;
};

export default function NameAndDescStep({
                                            variant,
                                            nameValue,
                                            descValue,
                                            switchValue,
                                            onChangeName,
                                            onChangeDesc,
                                            onChangeSwitch,
                                            errorMsgName,
                                            errorMsgDesc,
                                            editable,
                                        }: NameAndDescStepProps) {
    return (
        <View>
            <FormInputField
                variant={variant}
                label="Nome squadra"
                labelIconName="shield-outline"
                placeholder="Es. FC Bar Ci Siamo"
                value={nameValue}
                onChangeText={onChangeName}
                errorMessage={errorMsgName}
                maxLength={20}
                minLength={5}
                editable={editable}
            />

            <FormInputField
                variant={variant}
                label="Descrizione"
                optional
                labelIconName="chatbubble-ellipses-outline"
                placeholder="Racconta qualcosa della tua squadra..."
                value={descValue}
                onChangeText={onChangeDesc}
                errorMessage={errorMsgDesc}
                multiline
                maxLength={160}
                textAlignVertical="top"
                editable={editable}
                inputStyle={{ minHeight: 120 }}
            />

            <FormSwitch
                variant={variant}
                label="Iscrizioni"
                labelIconName="person-add-outline"
                options={RECRUITMENT_OPTIONS}
                value={switchValue}
                onChange={onChangeSwitch}
                disabled={!editable}
            />
        </View>
    );
}