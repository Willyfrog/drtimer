import React, {useState} from 'react';
import { Button, StyleSheet, TextInput } from 'react-native';
import Display from '../components/Display';
import { FontAwesome } from '@expo/vector-icons';

import { View } from '../components/Themed';
import { RootTabScreenProps } from '../types';

const sendSwitch = (ip: string, port: (string|number), deviceId: string, newStatus: string) => {
  fetch(`http://${ip}:${port}/zeroconf/switch`, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      "data": {
          "switch": newStatus,
      },
      "deviceid": deviceId,
    })
  });

}

export default function TabOneScreen({ navigation }: RootTabScreenProps<'TabOne'>) {
  const [inProgress, setInProgress] = useState(false);
  const [timer, setTimer] = useState("0.0");
  const [countDown, setCountDown] = useState(Number(timer)*1000);

  const switchSonoff = () => {
    const time = Number(timer);
    if (isNaN(time)) {
      return // raise error
    }
    setInProgress(true);
    sendSwitch("192.168.0.14", "8081", "1000c81355", 'on');
    //setSonoff(!sonoff);
    const endTimer = setInterval(
      () => {
        setCountDown((prevCount) => prevCount - 100);
      },
      100);
    setTimeout(
      () => {
        sendSwitch("192.168.0.14", "8081", "1000c81355", 'off');
        clearInterval(endTimer);
        setInProgress(false);
        setCountDown(Number(timer)*1000);
      }, 
      time*1000
    );
  };

  return (
    <View style={styles.container}>
      <View>
        <Display milis={countDown}/>
        <FontAwesome size={30} style={{ marginBottom: -3 }} name={"pencil"} >
          <Button 
            title=""
            onPress={() => {
              console.log('pulso!');
            }}
          />
        </FontAwesome>
      </View>
      <TextInput
        value={timer.toString()}
        keyboardType={"decimal-pad"}
        onChangeText={(v) => {
          setTimer(v);  // TODO: remember to validate before trying to start, should be a sw keyboard but might not be.
          setCountDown(Number(v)*1000);
        }}
      />
      <Button
        onPress={switchSonoff}
        title={'Switch Sonoff'}
        disabled={inProgress}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: '80%',
  },
});
