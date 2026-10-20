import FormImageField from "@/src/components/common/forms/fileds/FormImageField";
import {Media} from "@/src/services/media/mediaService";
import type {Variant} from "@/src/constants/palette/PaletteManager";
import FormFileField from "@/src/components/common/forms/fileds/FormFileField";

type LogoStepProps = {
    variant: Variant;
    image: Media | null;
    file: Media | null
    onChangeImage: (logo: Media | null) => void;
    onChangeFile: (file: Media | null) => void;
    disabled: boolean;
    errorMessageImage?: string;
    errorMessageFile?: string;
};

export default function LogoAndRulesStep({
                                             variant,
                                             image,
                                             file,
                                             onChangeImage,
                                             onChangeFile,
                                             disabled,
                                             errorMessageImage,
                                             errorMessageFile,
                                         }: LogoStepProps) {
    return (<>
            <FormImageField
                variant={variant}
                value={image}
                onChange={onChangeImage}
                disabled={disabled}
                errorMessage={errorMessageImage}
            />
            <FormFileField
                variant={variant}
                value={file}
                onChange={onChangeFile}
                label="Regolamento"
                optional
                disabled={disabled}
                errorMessage={errorMessageFile}
                allowedMimeTypes={[
                    "application/pdf",
                ]}
                allowedExtensions={[
                    ".pdf",
                ]}
                maxFileSize={
                    5 * 1024 * 1024
                }
                acceptedFormatsLabel="PDF · massimo 5 MB"
            />
        </>
    );
}