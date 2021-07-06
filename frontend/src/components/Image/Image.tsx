import React, { useEffect, useRef, useState } from "react"
import s from './Image.module.scss';

interface ImageProps {
  imageMeta: Image,
  width?: number,
  height?: number,
  widths?: number[],
  sizes?: string[],
  aspectRatio?: number
}

const Image: React.FunctionComponent<ImageProps> = ({ width, imageMeta, widths, sizes, aspectRatio }) => {
  const imageRef = useRef<HTMLImageElement>(null);
  const pictureRef = useRef<HTMLPictureElement>(null);
  const [loaded, setLoaded] = useState(false);
  
  useEffect(() => {
    if (imageRef.current)
      imageRef.current.src = imageRef.current.dataset.src as string;
  }, [])

  useEffect(() => {
    if(pictureRef.current) {
      // set correct srcset and sizes on load
      pictureRef.current.childNodes.forEach(childNode => {
        if(childNode instanceof HTMLSourceElement) {
          childNode.srcset = childNode.dataset.srcset || '';
          childNode.sizes = childNode.dataset.sizes || '';
        }
      })

      // listen to load and remove blur
      const loadListener = (e: Event) => setLoaded(true);
      const img = pictureRef.current.querySelector('img');
      if(img) {
        img.addEventListener('load', loadListener);
        return () => img.removeEventListener('load', loadListener);
      }
    }
  })

  if (widths && sizes && aspectRatio)
    return (
      <div className={s.wrapper} data-loaded={loaded}>

        <picture ref={pictureRef} className={s.image}>
          <source
            type="image/avif"
            srcSet={imageMeta.lqip}
            data-srcset={
              widths.map(width => `${imageMeta.url}.avif?width=${width}&height=${width / aspectRatio} ${width}w`).join(',')
            }
            data-sizes={sizes.join(',')}
          />
          <source
            type="image/webp"
            srcSet={imageMeta.lqip}
            data-srcset={
              widths.map(width => `${imageMeta.url}.webp?width=${width}&height=${width / aspectRatio} ${width}w`).join(',')
            }

            data-sizes={sizes.join(',')}
          />
          <source
            type="image/jpeg"
            srcSet={imageMeta.lqip}
            data-srcset={
              widths.map(width => `${imageMeta.url}.jpg?width=${width}&height=${width / aspectRatio} ${width}w`).join(',')
            }
            data-sizes={sizes.join(',')}
          />
          <img
            src={`${imageMeta.url}.jpg`}
          />
        </picture>
      </div>
    )

  return (
    <img
      className={s.image}
      style={{ width: '100%', clipPath: "polygon(0 0, 100% 0, 100% 100%, 0 100%)" }}
      src={imageMeta.lqip}
      data-src={`${imageMeta.url}.avif?${width ? '&width=' + width * 2 : ''}`}
      ref={imageRef}
    />
  )
}

export default Image;