import React from 'react';
import { Button, StyleSheet, TouchableOpacity} from 'react-native';
import { Text, View} from './Themed';

type Props = {
  milis: number;
  enabled: boolean;
  getter: () => void;
  setter: () => void;
};

const textStyle = {
  fontFamily: "alarm-clock",
  fontSize: 16,
  textAlign: "right" as const,
  color: "blue" as const,
  backgroundColor: "grey" as const,
};

const viewStyle = {
  flex: 1,
  backgroundColor: "grey" as const,
  borderRadius: 4,
  padding: 5,
  margin: 10,
  maxHeight: 32,
}
export default function Memo({milis, enabled, getter, setter}: Props) {
  const value = (milis/1000.0).toFixed(1).toString().padStart(5, "0");
  return (
    <TouchableOpacity
      disabled={!enabled}
      onPress={getter}
      onLongPress={setter}
    >
      <View
       style={viewStyle}
      >
        <Text style={textStyle}>{value}</Text>
      </View>
    </TouchableOpacity>
  );
}