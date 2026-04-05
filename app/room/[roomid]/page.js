"use client";
import { ZegoUIKitPrebuilt } from "@zegocloud/zego-uikit-prebuilt";

const Room = ({ params }) => {
  const roomID = params.roomid;
  const urlParams = new URLSearchParams(window.location.search);
  let role_str = urlParams.get("role") || "Host";
  const role =
    role_str === "Host"
      ? ZegoUIKitPrebuilt.Host
      : role_str === "Cohost"
        ? ZegoUIKitPrebuilt.Cohost
        : ZegoUIKitPrebuilt.Audience;

  let sharedLinks = [];
  if (role === ZegoUIKitPrebuilt.Host || role === ZegoUIKitPrebuilt.Cohost) {
    sharedLinks.push({
      name: "Join as co-host",
      url: `${window.location.protocol}//${window.location.host}/room/${roomID}?role=Cohost`,
    });
  }

  sharedLinks.push({
    name: "Join as audience",
    url: `${window.location.protocol}//${window.location.host}/room/${roomID}?role=Audience`,
  });

  const myMeeting = async (element) => {
    const appID = +process.env.NEXT_PUBLIC_ZEGOCLOUD_APP_ID;
    const serverSecret = process.env.NEXT_PUBLIC_ZEGOCLOUD_SERVER_SECRET;
    const kitToken = ZegoUIKitPrebuilt.generateKitTokenForTest(
      appID,
      serverSecret,
      roomID,
      Date.now().toString(),
      "shubham",
    );
    const zp = ZegoUIKitPrebuilt.create(kitToken);
    zp.joinRoom({
      container: element,
      sharedLinks,
      scenario: {
        mode: ZegoUIKitPrebuilt.LiveStreaming, // To implement 1-on-1 calls, modify the parameter here to [ZegoUIKitPrebuilt.OneONoneCall]
        config: {
          role,
        },
      },
    });
  };
  return (
    <div
      className="myCallContainer"
      ref={myMeeting}
      style={{ width: "100vw", height: "100vh" }}
    ></div>
  );
};

export default Room;
