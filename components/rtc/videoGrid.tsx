import { PeerState } from "@/types/peerModel";
import React from "react";
import { View } from "react-native";
import PeerVideo from "./peerVideo";

interface VideoGridProps {
  peers: PeerState;
}

export default function VideoGrid({
  peers,
}: VideoGridProps) {
  const peerEntries = Object.entries(peers);

  return (
    <View className="flex-1 justify-center">
      <View
        className={`flex-row flex-wrap gap-2 ${peerEntries.length <= 1 ? "justify-center" : ""
          }`}
      >
        {peerEntries.map(([id, peer]) => (
          <View
            key={id}
            className={peerEntries.length <= 1 ? "w-full h-full flex-1 justify-center" : "w-1/2"}
          >
            <PeerVideo
              peerID={id}
              peerUsername={peer.username ?? "Unknown"}
              stream={peer.stream}
              hasAudio={peer.hasAudio}
              hasVideo={peer.hasVideo}
            />
          </View>
        ))}
      </View>
    </View>
  );
}
