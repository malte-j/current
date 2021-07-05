import React, { useEffect, useRef } from "react"
import s from './Image.module.scss';

interface ImageProps {
  imageMeta: Image,
  width?: number,
  height?: number,
  widths?: number[],
  sizes?: string[],
  aspectRatio?: number
}

const Image: React.FunctionComponent<ImageProps> = ({width, imageMeta, widths, sizes, aspectRatio}) => {
  const imageRef = useRef<HTMLImageElement>(null);

  useEffect(()=>{
    if(imageRef.current)
      imageRef.current.src = imageRef.current.dataset.src as string;
  })

  

  // let widths = [
  //   '1340',
  //   '670',
  //   '400',
  //   '300'
  // ]

  // let sizes = [
  //   "(min-width: 700px) 700px",
  //   "(max-width: 700px) 99vw"
  // ]
  if(widths && sizes && aspectRatio)
  return (
    <picture>
       <source
        type="image/avif"

        srcSet={
          widths.map(width => `${imageMeta.url}.avif?width=${width}&height=${width/aspectRatio} ${width}w`).join(',')
        }

        sizes={sizes.join(',')}
        // srcSet={`${imageMeta.url}.webp?${width ? '&width=' + width*2 : ''}`}
      />

      <source
        type="image/webp"

        srcSet={
          widths.map(width => `${imageMeta.url}.webp?width=${width}&height=${width/aspectRatio} ${width}w`).join(',')
        }

        sizes={sizes.join(',')}
        // srcSet={`${imageMeta.url}.webp?${width ? '&width=' + width*2 : ''}`}
      />

<source
        type="image/jpeg"

        
        srcSet={
          widths.map(width => `${imageMeta.url}.jpg?width=${width}&height=${width/aspectRatio} ${width}w`).join(',')
        }

        sizes={sizes.join(',')}
        // srcSet={`${imageMeta.url}.webp?${width ? '&width=' + width*2 : ''}`}
      />
      <img src={`${imageMeta.url}.jpg`}/>

    </picture>
  )

  return (
    <img
      className={s.image}
      style={{width: '100%', clipPath: "polygon(0 0, 100% 0, 100% 100%, 0 100%)"}}
      src={imageMeta.lqip}
      data-src={`${imageMeta.url}.avif?${width ? '&width=' + width*2 : ''}`}  
      ref={imageRef}
    />
  )
}

export default Image;