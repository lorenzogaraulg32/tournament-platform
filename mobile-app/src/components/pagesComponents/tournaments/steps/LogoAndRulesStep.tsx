import FormImageField from "@/src/components/common/forms/components/FormImageField";
import {Media} from "@/src/services/mediaService";
import type {Variant} from "@/src/constants/PaletteManager";
import FormFileField from "@/src/components/common/forms/components/FormFileField";

type LogoStepProps = {
    variant: Variant;
    image: Media | null;
    file: Media | null
    existingFileSource?: string;
    onChangeImage: (logo: Media | null) => void;
    onChangeFile: (file: Media | null) => void;
    onRemoveFile?: () => void;
    disabled: boolean;
    errorMessageImage?: string;
    errorMessageFile?: string;
    localFile?: boolean;
};

export default function LogoAndRulesStep({
                                             variant,
                                             image,
                                             file,
                                             existingFileSource,
                                             onChangeImage,
                                             onChangeFile,
                                             onRemoveFile,
                                             disabled,
                                             errorMessageImage,
                                             errorMessageFile,
                                             localFile
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
                onRemove={onRemoveFile}
                existingFileSource={existingFileSource}
                label="Regolamento"
                local={localFile}
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