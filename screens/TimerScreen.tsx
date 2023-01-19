import React, {useState} from 'react';
import { Button, StyleSheet, TextInput, TouchableOpacity } from 'react-native';
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

export default function TimerScreen() {
  const [inProgress, setInProgress] = useState(false);
  const [timer, setTimer] = useState("0.0");
  const [countDown, setCountDown] = useState(Number(timer)*1000);

  const switchSonoff = () => {
    const time = Number(timer);
    if (isNaN(time) || time <= 0) {
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
        setCountDown(time*1000);
      }, 
      time*1000
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.row}>
        <View style={{flex:1}}/>
        <Display milis={countDown}/>
        <TouchableOpacity style={styles.editButton} onPress={ () => {
          console.log('pulsó');
        }}>
          <FontAwesome size={30} name={"pencil"} />
        </TouchableOpacity>
        <View style={{flex:1}}/>
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
        title={'Start'}
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
  row: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
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
  editButton: {
    flex: 1,
    backgroundColor: 'lightgrey',
    justifyContent: 'center',
    borderRadius: 4,
    padding: 2,
    margin: 2,
  },
  startButton: {
    backgroundColor: 'lightgrey',
    borderRadius: 4,
    padding: 2,
    margin: 2,
  },
});
