import React, {useState} from 'react';
import { Button, StyleSheet, TextInput, TouchableOpacity } from 'react-native';
import Display from '../components/Display';
import Memo from '../components/Memo';
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
  const [timer, setTimer] = useState("0.0"); // used for display and to hold the original value
  const [countDown, setCountDown] = useState(Number(timer)*1000); // used to do the countdown
  const [Memo1, setMemo1] = useState(2000); // we might want to keep it from run to run
  const [Memo2, setMemo2] = useState(10000);
  const [Memo3, setMemo3] = useState(20000);
  const [Memo4, setMemo4] = useState(60000);

  // TODO: handle stop
  const switchSonoff = () => {
    const time = Number(timer);
    if (isNaN(time) || time <= 0) {
      return // raise error
    }
    setInProgress(true);
    sendSwitch("192.168.0.14", "8081", "1000c81355", 'on'); //TODO: find where the sonoff lives
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

  const setTime = (value: number) => {
    const val = value > 0 ? value : 0;
    setCountDown(val);
    setTimer((val/1000).toString());
  }

  const setMemo = (setter: (v: number)=>void) => () => setter(countDown);
  const getMemo = (v: number) => (() => setTime(v))

  const modify = (mod: number) => () => {
    const value = countDown + mod*1000;
    setTime(value);
  }

  return (
    <View style={styles.container}>
      <View style={styles.bigContainer}>
        <View style={styles.miniRow}>
          <Button title="+100" onPress={modify(100)} disabled={inProgress}/>
          <Button title="+10" onPress={modify(10)}  disabled={inProgress}/>
          <Button title="+1" onPress={modify(1)}  disabled={inProgress}/>
          <Button title="+.1" onPress={modify(0.1)}  disabled={inProgress}/>
        </View>
        <View style={styles.bigRow}>
          <View style={{flex:1}}/>
          <Display milis={countDown}/>
          <View style={{flex:1}}/>
        </View>
        <View style={styles.miniRow}>
          <Button title="-100" onPress={modify(-100)} disabled={inProgress}/>
          <Button title="-10" onPress={modify(-10)} disabled={inProgress}/>
          <Button title="-1" onPress={modify(-1)} disabled={inProgress}/>
          <Button title="-.1" onPress={modify(-0.1)} disabled={inProgress}/>
        </View>
      </View>
      <View style={styles.row}/>
      <View
        style={styles.miniRow}
      >
        <Memo 
          milis={Memo1}
          enabled={!inProgress}
          getter={getMemo(Memo1)}
          setter={setMemo(setMemo1)}
        />
        <Memo 
          milis={Memo2}
          enabled={!inProgress}
          getter={getMemo(Memo2)}
          setter={setMemo(setMemo2)}
        />
      </View>
      <View
        style={styles.miniRow}
      >
        <Memo 
          milis={Memo3}
          enabled={!inProgress}
          getter={getMemo(Memo3)}
          setter={setMemo(setMemo3)}
        />
        <Memo 
          milis={Memo4}
          enabled={!inProgress}
          getter={getMemo(Memo4)}
          setter={setMemo(setMemo4)}
        />
      </View>
      <Button
        onPress={switchSonoff}
        title={inProgress ? 'Stop' : 'Start'}
        disabled={inProgress} //TODO: stop the timer on second press
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
  bigContainer: {
    flex: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  miniRow: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    marginTop: 5,
    marginBottom: 5,
    maxHeight: 120,
  },
  bigRow: {
    flex: 3,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    marginTop: 5,
    marginBottom: 5,
    maxHeight: 300,
  },
  row: {
    flex: 2,
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
