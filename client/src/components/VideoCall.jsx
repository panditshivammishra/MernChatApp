import React, { useCallback, useEffect, useRef, useState } from 'react';
import { ChatState } from '../Context/ChatProvider';
import animationData from "./animations/Accept.json"
import rejectCallAnimation from "./animations/reject.json"
import { SlCallEnd } from "react-icons/sl";
import Lottie from 'react-lottie';
import './styles.css';
import { Box, Spinner, IconButton ,useColorMode} from '@chakra-ui/react';
import { ArrowBackIcon } from "@chakra-ui/icons";
import peer from "./Service/peer";
import { Radio } from 'react-loader-spinner'
const VideoCall = ({ setVideoCall, videoCall,setFetchAgain,fetchAgain}) => {
  const { colorMode } = useColorMode();
  const { socket, selectedChat, setCheckCallChat, checkCallChat, callRoomId, setCallRoomId } = ChatState();
  const [remoteSocketId, setRemoteSocketId] = useState(null);
  const [myStream, setMyStream] = useState(null);
  const [initiator, setInitiator] = useState(true);
  const [remoteStream, setRemoteStream] = useState(null);
  const [endCall, setEndCall] = useState(false);
  const videoRef = useRef(null);
  const remoteVideoRef = useRef(null);
  const [isRemoteStreamPlaying, setIsRemoteStreamPlaying] = useState(false);
  const [leaveVideoCallPage, setleaveVideoCallPage] = useState(false);
  const [userDisconnect, setUserDisconnect] = useState(false);



   const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: animationData,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  };
  const reject = {
     loop: true,
    autoplay: true,
    animationData: rejectCallAnimation,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  }


  
  useEffect(() => {
    if (leaveVideoCallPage && videoCall) {
      setFetchAgain(!fetchAgain)
      setVideoCall(false);
    }
  }, [leaveVideoCallPage, selectedChat]);

  const handleJoinedUser = (data) => {
    setRemoteSocketId(data.Id);
   
  };

  useEffect(() => {
    const handleNegotiationNeeded = async () => {
      if (!remoteSocketId) return;
      const offer = await peer.getOffer();
      socket.emit('peer:nego:needed', { to: remoteSocketId, offer });
    };

    peer.peer.addEventListener('negotiationneeded', handleNegotiationNeeded);

    return () => {
      peer.peer.removeEventListener('negotiationneeded', handleNegotiationNeeded);
    };
  }, [remoteSocketId, socket]);

  useEffect(() => {
    const receiveRemoteStream = async (ev) => {
      const [stream] = ev.streams;
      setRemoteStream(stream);
    };

    peer.peer.addEventListener('track', receiveRemoteStream);
    return () => {
      peer.peer.removeEventListener('track', receiveRemoteStream);
    };
  }, []);

  useEffect(() => {
    const remoteVideo = remoteVideoRef.current;
    if (remoteVideo) {
      const handlePlay = () => setIsRemoteStreamPlaying(true);
      const handlePause = () => setIsRemoteStreamPlaying(false);

      remoteVideo.addEventListener('play', handlePlay);
      remoteVideo.addEventListener('pause', handlePause);

      return () => {
        remoteVideo.removeEventListener('play', handlePlay);
        remoteVideo.removeEventListener('pause', handlePause);
      };
    }
  }, [remoteStream]);

  useEffect(() => {
    if (myStream && videoRef.current) {
      videoRef.current.srcObject = myStream;
    }
    if (remoteStream && remoteVideoRef.current) {
      remoteVideoRef.current.srcObject = remoteStream;
    }

    return () => {
      if (videoRef.current) {
        videoRef.current.srcObject = null;
      }
      if (remoteVideoRef.current) {
        remoteVideoRef.current.srcObject = null;
      }
    };
  }, [myStream, remoteStream]);

  const sendTrack = () => {
    if (!myStream) return;
    myStream.getTracks().forEach(track => {
      if (peer.peer.getSenders().find(sender => sender.track === track)) return;
      peer.peer.addTrack(track, myStream);
    });
  };

  const handleIncomingCall = async ({ from, offer }) => {
    setInitiator(false);
    setRemoteSocketId(from);
   
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true, video: true });
    setMyStream(stream);
    const ans = await peer.getAnswer(offer);
    socket.emit("call-accepted", { to: from, ans });

    return () => {
      if (myStream) {
        myStream.getTracks().forEach(track => track.stop());
      }
    };
  };

  const handleCallAccepted = ({ from, ans }) => {
    peer.setLocalDescription(ans);
   
    sendTrack();
  };

  const handleFinalNego = async ({ from, ans }) => {
    await peer.setLocalDescription(ans);
  };

  const endAllStreams = () => {
    setMyStream(null);
    setRemoteStream(null);
    setRemoteSocketId(null);
    setInitiator(true);
    setEndCall(false);
    setCheckCallChat(null);
    if (remoteVideoRef.current) remoteVideoRef.current.srcObject = null;
    if (videoRef.current) videoRef.current.srcObject = null;

    socket.emit('leave-room', callRoomId);
    setleaveVideoCallPage(true);

  };

  const handleEndCall = () => {
    if (peer.peer) {
      peer.peer.close();
      peer.createPeerConnection(); // Reinitialize the peer connection
    }
    if (myStream) {
      setMyStream(null);
      myStream.getTracks().forEach(track => track.stop());
    }
    endAllStreams();
  };

  const rejectCall =useCallback( () => {
   
    if (myStream) {
      myStream.getTracks().forEach(track => track.stop());
    }
    if (remoteStream) {
      myStream.getTracks().forEach(track => track.stop());
    }
    socket.emit("end-call", remoteSocketId);
    if (peer.peer) {
      peer.peer.close();
      peer.createPeerConnection(); // Reinitialize the peer connection
    }
    endAllStreams();
  },[myStream]);
       
  useEffect(() => {
    const handleConnectionStateChange = () => {
      if (peer.peer.connectionState === 'disconnected' || peer.peer.connectionState === 'failed' || peer.peer.connectionState === 'closed') {
      
        setUserDisconnect(true);
      
        // rejectCall();
      }
    };

    const handleIceConnectionStateChange = () => {
      if (peer.peer.iceConnectionState === 'disconnected' || peer.peer.iceConnectionState === 'failed' || peer.peer.iceConnectionState === 'closed') {
        // console.log('ICE connection state changed to disconnected/failed/closed');
        setUserDisconnect(true);
        
      }
    };

    peer.peer.addEventListener('connectionstatechange', handleConnectionStateChange);
    peer.peer.addEventListener('iceconnectionstatechange', handleIceConnectionStateChange);

    return () => {
      peer.peer.removeEventListener('connectionstatechange', handleConnectionStateChange);
      peer.peer.removeEventListener('iceconnectionstatechange', handleIceConnectionStateChange);
    };
  }, [peer.peer]);

  useEffect(() => {
    socket.on("user-connected", handleJoinedUser);
    socket.on("call-incoming", handleIncomingCall);
    socket.on("call-accepted", handleCallAccepted);
    socket.on("peer:nego:needed", async ({ from, offer }) => {
      const ans = await peer.getAnswer(offer);
      socket.emit("peer:nego:done", { to: from, ans });
    });
    socket.on("peer:nego:final", handleFinalNego);
    socket.on("end-call", handleEndCall);

    return () => {
      socket.off("user-connected", handleJoinedUser);
      socket.off("call-incoming", handleIncomingCall);
      socket.off("call-accepted", handleCallAccepted);
      socket.off("peer:nego:needed");
      socket.off("peer:nego:final", handleFinalNego);
      socket.off("end-call", handleEndCall);
    };
  }, [socket, handleJoinedUser, handleIncomingCall, handleCallAccepted, handleFinalNego]);

  useEffect(() => {
    const handleCallUser = async () => {
       const stream = await navigator.mediaDevices.getUserMedia({ audio: true, video: true });
        setMyStream(stream);
      const offer = await peer.getOffer();
      socket.emit("call:user", { to: remoteSocketId, offer });
    };

    if (initiator && remoteSocketId) {
      handleCallUser();
    }

    return () => {

      if (myStream) {
        myStream.getTracks().forEach(track => track.stop());
      }
    };
  }, [remoteSocketId, initiator]);
  const backToChatBox = () => {
    setVideoCall(false);
  }
    
  return (
    <Box
      display={{ base: selectedChat ? 'flex' : 'none', md: 'flex' }}
      alignItems="center"
      justifyContent="center"
      w={{ base: '100%', md: '68%' }}
      
     
      position="relative"
      overflow="hidden"
      bg={colorMode=="dark"&&"gray.700"}
    >
      {myStream ? (
        <>
          {(remoteStream || myStream) && (
            <Box position="relative" w="100%" h="100%" overflow="hidden"  padding= '0'
                    margin='0' >
              {userDisconnect && (
                <Box position="absolute" left="50%" top="50%" transform="translate(-50%, -50%)">
                  <Spinner size="xl" />
                </Box>
              )}

              {remoteStream && (
                <video
                  ref={remoteVideoRef}
                  autoPlay
                  style={{
                    height: isRemoteStreamPlaying ? '100%' : '0%',
                    width: isRemoteStreamPlaying ? '100%' : '0%',
                    padding: '0',
                    margin:'0',
                    
                    objectFit: 'cover',
                  }}
                />
              )}

              {myStream && (
                <Box
                  position={isRemoteStreamPlaying ? 'absolute' : 'relative'}
                  bottom={isRemoteStreamPlaying ? '10px' : '0'}
                  right={isRemoteStreamPlaying ? '10px' : '0'}
                  h={isRemoteStreamPlaying ? '40%' : '100%'}
                  w={isRemoteStreamPlaying ? '40%' : '100%'}
                  overflow="hidden"
                
                  padding= '0'
                    margin='0'
                >
                  <video
                    ref={videoRef}
                    autoPlay
                    muted
                    style={{
                      padding: '0',
                    margin:'0',
                      height: '100%',
                      width: '100%',
                      objectFit: 'cover',
                    }}
                  />
                </Box>
              )}

              <Box
                position="absolute"
                bottom="0"
                width="100%"
                display="flex"
                justifyContent={(!remoteStream||isRemoteStreamPlaying)?"center":"space-between"}
                px="2"
                alignItems="center"
              >
                {!endCall && (
                  <>
                    {remoteSocketId && !initiator && (
                      <Box
                        onClick={() => {
                          setEndCall(true);
                          sendTrack();
                        }}
                      >
                        <Lottie
                          options={defaultOptions}
                          height={70}
                          width={70}
                          style={{ marginBottom: 0, marginLeft: 0 }}
                        />
                      </Box>
                    )}
                    {!initiator && (
                      <Box onClick={rejectCall}>
                        <Lottie
                          options={reject}
                          height="140px"
                          width="140px"
                          style={{ marginBottom: 0, marginLeft: 0 }}
                        />
                      </Box>
                    )}
                  </>
                )}

                {(initiator||isRemoteStreamPlaying) && (
                  <button onClick={rejectCall} className="button-24"  padding="5" borderRadius="50%" backgroundColor="red">
                    <SlCallEnd />
                  </button>
                )}
              </Box>
            </Box>
          )}
        </>
      ) : (<><Box position="absolute" left="4" top="4" onClick={backToChatBox}>
          
           <IconButton
              d={{ base: "flex", md: "none" }}
              icon={<ArrowBackIcon  color={colorMode==="light"?"rgb(30 179 26)":"#ffff"}/>}
            />
        
        </Box>
        <Radio
          visible={true}
          height="80"
          width="80"
          color="black"
          ariaLabel="radio-loading"
          wrapperStyle={{}}
          wrapperClass=""
        /></>
      )}
    </Box>
  );
};

export default VideoCall;
