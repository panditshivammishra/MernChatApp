class PeerService {
    constructor() {
        this.createPeerConnection();
    }

    createPeerConnection() {
        this.peer = new RTCPeerConnection({
            iceServers: [
                {
                    urls: [
                        "stun:stun.l.google.com:19302",
                        "stun:global.stun.twilio.com:3478",
                    ],
                },
            ],
        });

        this.remoteStream = new MediaStream();
        this.peer.ontrack = (event) => {
            this.remoteStream.addTrack(event.track);
         
        };

      

        this.peer.onconnectionstatechange = (event) => {
            if (this.peer.connectionState === 'closed' || this.peer.connectionState === 'failed') {
              
                this.createPeerConnection();
            }
        };
    }

    async getOffer() {
        if (this.peer.signalingState === 'closed') {
            this.createPeerConnection();
        }

        const offer = await this.peer.createOffer();
        await this.peer.setLocalDescription(new RTCSessionDescription(offer));
        return offer;
    }

    async getAnswer(offer) {
        if (this.peer.signalingState === 'closed') {
            this.createPeerConnection();
        }

        await this.peer.setRemoteDescription(offer);
        const answer = await this.peer.createAnswer();
        await this.peer.setLocalDescription(new RTCSessionDescription(answer));
        return answer;
    }

    async setLocalDescription(answer) {
        if (this.peer.signalingState === 'closed') {
            this.createPeerConnection();
        }

        await this.peer.setRemoteDescription(new RTCSessionDescription(answer));
    }

    getRemoteStream() {
        return this.remoteStream;
    }
}

export default new PeerService();

