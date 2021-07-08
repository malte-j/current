import React, { useState } from "react";
import { useAuth } from "../../services/Auth";
import { uploadImage } from "../../services/Images.service";
import s from './ImageUpload.module.scss';

export interface ImageUploadProps {
  currentImage: Image | null;
  setCurrentImage(image: Image | null): void;
}

const ImageUpload: React.FunctionComponent<ImageUploadProps> = ({currentImage, setCurrentImage}) => {

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [imgPreviewSrc, setImgPreviewSrc] = useState<string | null>(null);

  const auth = useAuth();
  /**
   * Upload the selected Image
   * @param e click event
   */
  async function handleUpload(e: React.MouseEvent) {
    e.preventDefault();
    if(!selectedFile)
      return;

    const newImageMetadata = await uploadImage(auth.user!.authToken, selectedFile);
    setCurrentImage(newImageMetadata);
    setSelectedFile(null);
    setImgPreviewSrc(null);
  }

  /**
   * Generate and set preview image on file selection
   * @param images value from a file input
   */
  function selectImage(images: FileList | null): void {
    console.log(images)

    if(!images || images.length == 0) {
      setImgPreviewSrc(null);
      setSelectedFile(null);
      return;
    }

    const reader = new FileReader();
    reader.onload = e => {
      if(e.target?.result && typeof e.target.result == "string")
        setImgPreviewSrc(e.target.result);
      }
      
    setSelectedFile(images[0]);
    reader.readAsDataURL(images[0]);
  }

  if(currentImage)
  return (
    <div className={`${s.uploadContainer} ${s.uploadedImage}`}>
      <div className={s.realImage}>
        {/* @TODO: use Image component here */}
        <img src={`${currentImage.url}.jpg?width=400`} alt="thumbnail for the post" />
      </div>
      <div className={s.bottom}>
        <button onClick={() => setCurrentImage(null)} className={s.deleteButton}>entfernen</button> 
      </div>
    </div>
  )

  return (
    <div className={`${s.uploadContainer} ${imgPreviewSrc ? s.fileSelected : ''}`}>
      <form onReset={() => setImgPreviewSrc(null)}>
        <label htmlFor="image" className={s.label}>
          <input
            type="file"
            name="image"
            id="image"
            accept="image/png, image/jpeg"
            className={s.uploadInput}
            onChange={e => {selectImage(e.target.files); console.log(e)}}  
          />

          {
            imgPreviewSrc ? <>
              <label tabIndex={0} className={s.resetButton}>
                <input type="reset" value="" />
                <img src="/icons/cancel_dark.svg" alt="cancel" />
              </label>
              <img className={s.previewImage} src={imgPreviewSrc} alt="" />
            </> : <>
              <img src="/icons/upload.svg" alt="uploadIcon" />
              Clicken oder Bild hinziehen, um Thumnail hochzuladen
            </>
          }
        </label>
        <div className={s.bottom}>
          {/* <label htmlFor="image">entfernen</label> */}
          <label htmlFor="image" tabIndex={0} >ändern</label> 
          <button onClick={e => handleUpload(e)}>hochladen</button>
        </div>

      </form>
    </div>
  )
}

export default ImageUpload; 