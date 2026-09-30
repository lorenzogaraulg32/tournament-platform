import FormImageField from "@/src/components/common/forms/components/FormImageField";
import type {SelectedImage} from "@/src/services/fileService";
import type {Variant} from "@/src/constants/PaletteManager";
import FormFileField, {SelectedFile} from "@/src/components/common/forms/components/FormFileField";

type LogoStepProps = {
    variant: Variant;
    image: SelectedImage | null;
    file: SelectedFile | null
    existingLogoSource?: string;
    existingFileSource?: string;
    onChangeImage: (logo: SelectedImage | null) => void;
    onChangeFile: (file: SelectedFile | null) => void;
    onRemoveImage?: () => void;
    onRemoveFile?: () => void;
    disabled: boolean;
    errorMessageImage?: string;
    errorMessageFile?: string;
    localImage?: boolean;
    localFile?: boolean;
};

export default function LogoAndRulesStep({
                                             variant,
                                             image,
                                             file,
                                             existingLogoSource,
                                             existingFileSource,
                                             onChangeImage,
                                             onChangeFile,
                                             onRemoveImage,
                                             onRemoveFile,
                                             disabled,
                                             errorMessageImage,
                                             errorMessageFile,
                                             localImage,
                                             localFile
                                         }: LogoStepProps) {
    return (<>
            <FormImageField
                variant={variant}
                value={image}
                existingLogoSource={existingLogoSource}
                onChange={onChangeImage}
                onRemove={onRemoveImage}
                disabled={disabled}
                errorMessage={errorMessageImage}
                local={localImage}
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