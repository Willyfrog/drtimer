import React from 'react';
import { StyleSheet, TouchableOpacity} from 'react-native';
import { Text, View} from './Themed';

type Props = {
  milis: number;
};

const textStyle = {
  fontFamily: "alarm-clock",
  fontSize: 64,
  textAlign: "left" as const,
  color: "white" as const,
};

const viewStyle = {
  backgroundColor: "grey" as const,
  borderRadius: 4,
  padding: 5,
  margin: 10,
}

export default function Display({milis}: Props) {
  const value = (milis/1000.0).toFixed(1).toString().padStart(5, 0);
  return (<View style={viewStyle}>
    <Text style={textStyle}>{value}</Text>
  </View>);
};