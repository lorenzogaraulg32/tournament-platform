import {View} from "react-native";
import FormInputField from "@/src/components/common/forms/FormInputField";
import Switch from "@/src/components/pagesComponents/teams/createTeam/Switch";
import {RecruitmentStatus} from "@/src/services/teams/teamCreationService";


type NameAndDescStepProps = {
    nameValue: string,
    descValue: string,
    switchValue: RecruitmentStatus,
    onChangeName: (name : string) => void
    onChangeDesc: (desc : string) => void
    onChangeSwitch: (status : RecruitmentStatus) => void
    errorMsgName?: string,
    errorMsgDesc?: string,
    editable: boolean,
}

export default function NameAndDescStep({
                                            nameValue,
                                            descValue,
                                            switchValue,
                                            onChangeName,
                                            onChangeDesc,
                                            onChangeSwitch,
                                            errorMsgName,
                                            errorMsgDesc,
                                            editable
                                        }: NameAndDescStepProps) {
    return (
        <View>
            <FormInputField
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
                label="Descrizione"
                optional
                labelIconName="chatbubble-ellipses-outline"
                placeholder="Racconta qualcosa della tua squadra..."
                value={descValue}
                onChangeText={onChangeDesc}
                multiline
                errorMessage={errorMsgDesc}
                maxLength={160}
                textAlignVertical="top"
                editable={editable}
                inputStyle={{
                    minHeight: 120,
                }}
            />

            <Switch
                value={switchValue}
                onChange={onChangeSwitch
                }
            />
        </View>)
}
