import FormDateField from "@/src/components/common/forms/components/FormDateField";
import {parseDateForPicker} from "@/src/constants/helpers/parsingHelper";
import {LocalDateString} from "@/src/services/common";

type DateStepProps = {
    startDate: LocalDateString | null;
    endDate: LocalDateString | null;
    startDateError?: string;
    endDateError?: string;

    onStartDateChange: (value: LocalDateString) => void;
    onEndDateChange: (value: LocalDateString) => void;


    disabled?: boolean;
};

export default function DateStep({
                                     startDate,
                                     endDate,
                                     startDateError,
                                     endDateError,
                                     onStartDateChange,
                                     onEndDateChange,
                                     disabled = false,
                                 }: DateStepProps) {

    return (
        <>
            <FormDateField
                variant="tournaments"
                label="Data di inizio"
                value={startDate}
                onChange={onStartDateChange}
                placeholder="Seleziona la data di inizio"
                minimumDate={new Date()}
                errorMessage={startDateError}
                disabled={disabled}
            />

            <FormDateField
                variant="tournaments"
                label="Data di fine"
                value={endDate}
                onChange={onEndDateChange}
                placeholder="Seleziona la data di fine"
                minimumDate={
                    startDate
                        ? parseDateForPicker(startDate)
                        : new Date()
                }
                errorMessage={endDateError}
                disabled={disabled}
            />
        </>
    );
}