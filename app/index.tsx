import AsyncStorage from '@react-native-async-storage/async-storage';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect } from 'react';
import { Pressable, PressableProps, ScrollView, StyleSheet, Text, TextStyle, View } from 'react-native';


type ButtonProps = PressableProps & { title?: string, textStyle?: TextStyle }

let Button = (props: ButtonProps) => {
  return(
    <Pressable
      onPress={props.onPress}
      disabled={props.disabled}
      style={props.style}
    >
      <Text style={props.textStyle}>{props.title}</Text>
    </Pressable>
  )
}

type PlayerData = {
  name: string;
  money: number;
  bid: number;
};

type PlayerProps = {
  name: string;
  money: number;
  bid: number;
  onMoneyChange: (delta: number) => void;
  onBidChange: (delta: number) => void;
  onWon: () => void;
  isMoneyLocked?: boolean;
}

let Player = (props: PlayerProps) => {
  type CounterProps = {
    value: number;
    onIncrement: () => void;
    onDecrement: () => void;
    isLocked?: boolean;
  }

  let Counter = (cProps: CounterProps) => {
    return(    
      <View>
        <Button 
          disabled={cProps.isLocked}
          onPress={cProps.onIncrement}
          title='+'
          style={{
            backgroundColor: '#023047',
            justifyContent: 'center',
            alignItems: 'center',
            borderTopLeftRadius: 5,
            borderTopRightRadius: 5,
          }}
          textStyle={{
            color: 'white',
          }}/>
        <View
          style={{
            backgroundColor: 'white',
            justifyContent: 'center',
            alignItems: 'center',
            width: 30,
          }}>
          <Text>{cProps.value}</Text>
        </View>
        <Button 
          disabled={cProps.isLocked}
          onPress={cProps.onDecrement}
          title='-'
          style={{
            backgroundColor: '#023047',
            justifyContent: 'center',
            alignItems: 'center',
            borderBottomLeftRadius: 5,
            borderBottomRightRadius: 5,
          }}
          textStyle={{
            color: 'white',
          }}/>
      </View>
    )
  }

  return(
    <View 
      style={{
        flexDirection: 'row',
        width: '90%',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 5,
        backgroundColor: '#219EBC',
        padding: 10,
        borderRadius: 10,
      }}>
      <Text style={{fontSize: 32}}>{props.name}</Text>
      
      <View
        style={{
          flexDirection: 'row',
          width: '50%',
          height: '100%',
          justifyContent: 'space-around',
        }}>
        <Button 
          style={{
            backgroundColor: '#023047',
            justifyContent: 'center',
            alignItems: 'center',
            borderRadius: 5,
          }}
          textStyle={{
            margin: 7,
            color: 'white',
            fontSize: 24,
          }}
          onPress={props.onWon}
          title='Won'/>
        <Counter 
          value={props.money}
          onIncrement={() => props.onMoneyChange(1)}
          onDecrement={() => props.onMoneyChange(-1)}
          isLocked={props.isMoneyLocked}
        />
        <Counter 
          value={props.bid}
          onIncrement={() => props.onBidChange(1)}
          onDecrement={() => props.onBidChange(-1)}
        />
      </View>
    </View>
  );
};

type ScoreboardProps = {
  players: PlayerData[];
  isMoneyLocked: boolean;
  onMoneyChange: (index: number, delta: number) => void;
  onBidChange: (index: number, delta: number) => void;
  onWon: (index: number) => void;
}

let Scoreboard = (props: ScoreboardProps) => {
  return(
    <View style={{ width: '100%', alignItems: 'center' }}>
      {props.players.map((player, index) => (
        <Player
          key={player.name + index}
          name={player.name}
          money={player.money}
          bid={player.bid}
          onMoneyChange={(delta) => props.onMoneyChange(index, delta)}
          onBidChange={(delta) => props.onBidChange(index, delta)}
          onWon={() => props.onWon(index)}
          isMoneyLocked={props.isMoneyLocked}
        />
      ))}
    </View>
  )
}

const STORAGE_KEY = '@players_data';

const savePlayers = async (players: PlayerData[]) => {
  try {
    const toSave = players.map(p => ({ name: p.name, money: p.money, bid: 0 }));
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(toSave));
  } catch (e) {
    console.error('Failed to save players', e);
  }
};

const loadPlayers = async (): Promise<PlayerData[] | null> => {
  try {
    const data = await AsyncStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : null;
  } catch (e) {
    console.error('Failed to load players', e);
    return null;
  }
};

let UI = () => {
  const params = useLocalSearchParams() as { type?: string; name?: string; money?: string };
  const navigation = useRouter();
  
  const [players, setPlayers] = React.useState<PlayerData[]>([]);
  const [isLoaded, setIsLoaded] = React.useState(false);
  const [isMoneyLocked, setIsMoneyLocked] = React.useState(false);

  // Load players on mount
  useEffect(() => {
    loadPlayers().then((saved) => {
      if (saved && saved.length > 0) {
        setPlayers(saved.map(p => ({ ...p, bid: p.bid || 0 })));
      } else {
        setPlayers([
          { name: "Alice", money: 100, bid: 0 },
          { name: "Bob", money: 150, bid: 0 }
        ]);
      }
      setIsLoaded(true);
    });
  }, []);

  // Handle add/remove from params
  useEffect(() => {
    if (!isLoaded) return;
    
    if (params.name && params.money && params.type === "add") {
      setPlayers(prev => {
        const newPlayers = [...prev, { name: params.name!, money: Number(params.money) || 0, bid: 0 }];
        savePlayers(newPlayers);
        return newPlayers;
      });
    }
    if (params.name && params.type === "remove") {
      setPlayers(prev => {
        const newPlayers = prev.filter((player) => player.name !== params.name);
        savePlayers(newPlayers);
        return newPlayers;
      });
    }
  }, [params.type, params.name, params.money, isLoaded]);

  const handleMoneyChange = (index: number, delta: number) => {
    setPlayers(prev => {
      const updated = [...prev];
      updated[index] = { ...updated[index], money: updated[index].money + delta };
      savePlayers(updated);
      return updated;
    });
  };

  const handleBidChange = (index: number, delta: number) => {
    setPlayers(prev => {
      const updated = [...prev];
      updated[index] = { ...updated[index], bid: updated[index].bid + delta };
      return updated;
    });
  };

  const handleWon = (winnerIndex: number) => {
    setPlayers(prev => {
      const updated = [...prev];
      let sum = 0;
      updated.forEach((player, i) => {
        if (i !== winnerIndex) {
          sum += player.bid;
          updated[i] = { ...player, money: player.money - player.bid, bid: 0 };
        }
      });
      updated[winnerIndex] = {
        ...updated[winnerIndex],
        money: updated[winnerIndex].money + sum,
        bid: 0
      };
      savePlayers(updated);
      return updated;
    });
  };

  if (!isLoaded) {
    return (
      <View style={{flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#8ECAE6'}}>
        <Text>Loading...</Text>
      </View>
    );
  }
  
  return (
    <View style={{
      backgroundColor: '#8ECAE6',
      width: '100%',
      height: '100%',
    }}>
      <View style={{
        marginTop: 50,
        flexDirection: 'row',
        justifyContent: 'space-around'
      }}>
        <Button 
          title={isMoneyLocked ? "Unlock money" : "Lock Money"} 
          onPress={() => setIsMoneyLocked(!isMoneyLocked)}
          style={styles.TopButtonStyle}
          textStyle={styles.TopButtonTextStyle}
        />
        <Button 
          title="Remove Players" 
          onPress={() => navigation.navigate('./removePlayer')}
          style={styles.TopButtonStyle}
          textStyle={styles.TopButtonTextStyle}
        />
        <Button 
          title="Add Player" 
          onPress={() => navigation.navigate('./addPlayer')}
          style={styles.TopButtonStyle}
          textStyle={styles.TopButtonTextStyle}
        />
      </View>

      <ScrollView style={{ marginTop: 15, width: '100%' }}>
        <Scoreboard 
          players={players} 
          isMoneyLocked={isMoneyLocked}
          onMoneyChange={handleMoneyChange}
          onBidChange={handleBidChange}
          onWon={handleWon}
        />
      </ScrollView>
    </View>
  );
}

export default UI;

const styles = StyleSheet.create({
  Background: {
    backgroundColor: '#8ECAE6',
    height: '100%'
  },
  TopButtonStyle: {
    borderColor: 'black', 
    borderWidth: 1, 
    backgroundColor: '#023047',
    borderRadius: 10,
  },
  TopButtonTextStyle: {
    color: 'white',
    textAlign: 'center', 
    margin: 10,
    fontSize: 16
  },
});