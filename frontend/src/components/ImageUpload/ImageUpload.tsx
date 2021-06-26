import React, { useState } from "react";
import s from './ImageUpload.module.scss';



const ImageUpload: React.FunctionComponent = () => {

  const [selectedFile, setSelectedFile] = useState<File | undefined>(undefined);
  const [imgPreviewSrc, setImgPreviewSrc] = useState<string | null>(null);

  function handleUpload(e: React.MouseEvent) {
    e.preventDefault();
  }

  /**
   * Generate and set preview image on file selection
   * @param images value from a file input
   */
  function selectImage(images: FileList | null): void {
    if(!images) {
      setImgPreviewSrc(null);
      return;
    }

    const reader = new FileReader();
    reader.onload = e => {
      if(e.target?.result && typeof e.target.result == "string")
        setImgPreviewSrc(e.target.result);
    }

    reader.readAsDataURL(images[0]);
  }

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
            onChange={e => selectImage(e.target.files)}  
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