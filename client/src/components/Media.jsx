import React from 'react'
import "./styles.css"
import MediaModal from '../miscellaneous/MediaModal';
import { Spinner } from '@chakra-ui/react';
export default function Media({ media }) {
    const checkLinkType=(url) =>{
    const imageExtensions = ['jpg', 'jpeg', 'png', 'gif', 'bmp', 'webp', 'svg'];
    const videoExtensions = ['mp4', 'avi', 'mov', 'wmv', 'flv', 'webm', 'mkv', 'm4v'];
    const parsedUrl = new URL(url);
    const pathname = parsedUrl.pathname;
    const extension = pathname.split('.').pop().toLowerCase();

    if (imageExtensions.includes(extension)) {
        return 'image';
    } else if (videoExtensions.includes(extension)) {
        return 'video';
    } else {
        return 'unknown';
    }
}

    const type = checkLinkType(media);

  return <>
      {media?
       (type=="image"?(<div className="imageDiv">{<MediaModal><img src={media} alt="image not loaded"/></MediaModal>}</div>):(<div className="videoDiv"><video src={media} controls></video></div>)):<Spinner/>
   }
  </>
};
