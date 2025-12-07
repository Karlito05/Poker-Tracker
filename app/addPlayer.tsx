import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Pressable, PressableProps, Text, TextInput, TextStyle, View } from 'react-native';

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

let addPlayer = () => {
    let [money, setMoney] = useState(0);
    let [name, setName] = useState('');

    const navigation = useRouter();
    return (
    <View
        style={{
            width: '100%',
            height: '100%',
            backgroundColor: '#8ECAE6'
        }}
    >
        <View
            style={{
                marginTop: 50,
                width: '90%',
                alignSelf: 'center',
            }}
            >
            <Text
                style={{
                    fontSize: 32,
                }}
            >Add Player</Text>
            <Text
                style={{
                    fontSize: 20,
                }}
            >Name:</Text>
            <TextInput 
                placeholder='Enter player name'
                onChangeText={newText => setName(newText)}
                style={{
                    color: 'black',
                    outlineColor: 'black',
                    outlineWidth: 2,
                    borderRadius: 5,
                    marginBottom: 20,
                    padding: 10,
                }}
                placeholderTextColor={'black'}
                cursorColor='black'
            />
            <Text
                style={{
                    fontSize: 20,
                }}
            >Starting Money:</Text>
            <TextInput 
                placeholder='Enter starting money'
                keyboardType='numeric'
                onChangeText={newText => setMoney(parseInt(newText))}
                style={{
                    color: 'black',
                    outlineColor: 'black',
                    outlineWidth: 2,
                    borderRadius: 5,
                    marginBottom: 20,
                    padding: 10,
                }}
                placeholderTextColor={'black'}
                cursorColor='black'
            />
            <View style={{
                flexDirection: 'row',
                width: '100%',
                alignSelf: 'center',
                justifyContent: 'space-between',
            }}>
                <Button 
                    title='Add Player'
                    onPress={() => {
                        navigation.push({
                        pathname: "./",
                        params: { name: name, money: money, type: "add" }
                        });

                    }}
                    style={{
                        borderColor: 'black', 
                        minWidth:150,
                        borderWidth: 1, 
                        backgroundColor: '#023047',
                        borderRadius: 10,
                    }}
                    textStyle={{
                        color: 'white',
                        textAlign: 'center', 
                        margin: 10,
                        fontSize: 16
                    }}
                />
                <Button 
                    title='Cancel'
                    onPress={() => navigation.back()}
                    style={{
                        borderColor: 'black', 
                        borderWidth: 1, 
                        minWidth:150,
                        backgroundColor: '#023047',
                        borderRadius: 10,
                    }}
                    textStyle={{
                        color: 'white',
                        textAlign: 'center', 
                        margin: 10,
                        fontSize: 16
                    }}
                />
            </View>
        </View>
    </View>
    );
}


export default addPlayer;