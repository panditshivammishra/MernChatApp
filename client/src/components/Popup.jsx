import React from 'react';
import {
  Popover,
  PopoverContent,
  PopoverHeader,
  PopoverBody,
  PopoverArrow,
  PopoverCloseButton,
} from '@chakra-ui/react';

export default function Popup({ data,popup,setPopup}) {
    // const { popup, setPopup } = ChatState();
  console.log("You are in Popup Component");

  return (
    <Popover isOpen={popup} onClose={() => setPopup(false)}>
      <PopoverContent>
        <PopoverArrow />
        <PopoverCloseButton onClick={() => setPopup(false)} />
        <PopoverHeader>Video Call</PopoverHeader>
        <PopoverBody>{data.name} is Calling</PopoverBody>
      </PopoverContent>
    </Popover>
  );
}