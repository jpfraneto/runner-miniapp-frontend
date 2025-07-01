// Dependencies
import React, { useRef, useState } from "react";

// Types
import { BaseModalProps } from "../../types";
import { WorkoutImageSelectionData } from "../../types";

// Components
import Typography from "@/shared/components/Typography";
import Button from "@/shared/components/Button";

// StyleSheet
import styles from "./WorkoutImageSelectionModal.module.scss";

interface WorkoutImageSelectionModalProps
  extends BaseModalProps<WorkoutImageSelectionData> {}

const WorkoutImageSelectionModal: React.FC<WorkoutImageSelectionModalProps> = ({
  title,
  message,
  onImageSelect,
  handleClose,
}) => {
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    const selectedFilesArray = Array.from(files);
    setSelectedFiles(selectedFilesArray);
  };

  const handleUpload = async () => {
    if (selectedFiles.length === 0) return;

    setIsUploading(true);
    try {
      await onImageSelect(selectedFiles);
      handleClose();
    } catch (error) {
      console.error("Error uploading images:", error);
    } finally {
      setIsUploading(false);
    }
  };

  const handleSelectImages = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const removeFile = (index: number) => {
    setSelectedFiles((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <div className={styles.modal}>
      <div className={styles.header}>
        <Typography
          variant="gta"
          weight="wide"
          size={24}
          lineHeight={24}
          className={styles.title}
        >
          {title}
        </Typography>
        <Typography
          variant="geist"
          weight="regular"
          size={14}
          lineHeight={18}
          className={styles.message}
        >
          {message}
        </Typography>
      </div>

      <div className={styles.content}>
        {selectedFiles.length === 0 ? (
          <div className={styles.emptyState}>
            <div className={styles.uploadArea} onClick={handleSelectImages}>
              <div className={styles.uploadIcon}>📸</div>
              <Typography
                variant="geist"
                weight="medium"
                size={16}
                lineHeight={20}
                className={styles.uploadText}
              >
                Tap to select workout images
              </Typography>
              <Typography
                variant="geist"
                weight="regular"
                size={12}
                lineHeight={16}
                className={styles.uploadHint}
              >
                Select up to 2 images from your device
              </Typography>
            </div>
          </div>
        ) : (
          <div className={styles.selectedFiles}>
            <Typography
              variant="geist"
              weight="medium"
              size={14}
              lineHeight={18}
              className={styles.selectedTitle}
            >
              Selected Images ({selectedFiles.length}/2)
            </Typography>
            <div className={styles.fileList}>
              {selectedFiles.map((file, index) => (
                <div key={index} className={styles.fileItem}>
                  <div className={styles.filePreview}>
                    <img
                      src={URL.createObjectURL(file)}
                      alt={`Preview ${index + 1}`}
                      className={styles.previewImage}
                    />
                  </div>
                  <div className={styles.fileInfo}>
                    <Typography
                      variant="geist"
                      weight="medium"
                      size={12}
                      lineHeight={14}
                      className={styles.fileName}
                    >
                      {file.name}
                    </Typography>
                    <Typography
                      variant="geist"
                      weight="regular"
                      size={10}
                      lineHeight={12}
                      className={styles.fileSize}
                    >
                      {(file.size / 1024 / 1024).toFixed(2)} MB
                    </Typography>
                  </div>
                  <button
                    onClick={() => removeFile(index)}
                    className={styles.removeButton}
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
            {selectedFiles.length < 2 && (
              <Button
                variant="secondary"
                caption="Add More Images"
                onClick={handleSelectImages}
                className={styles.addMoreButton}
              />
            )}
          </div>
        )}
      </div>

      <div className={styles.actions}>
        <Button
          variant="secondary"
          caption="Cancel"
          onClick={handleClose}
          className={styles.cancelButton}
        />
        <Button
          variant="primary"
          caption={isUploading ? "Uploading..." : "Upload & Share"}
          onClick={handleUpload}
          disabled={selectedFiles.length === 0 || isUploading}
          className={styles.uploadButton}
        />
      </div>

      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        multiple
        accept="image/*"
        onChange={handleFileSelect}
        style={{ display: "none" }}
      />
    </div>
  );
};

export default WorkoutImageSelectionModal;
