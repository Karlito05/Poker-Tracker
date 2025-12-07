import { useRouter } from 'expo-router';
import React from 'react';
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


let removePlayer = () => {
    const navigation = useRouter();

    const [name, setName] = React.useState('');
    return (
    <View
        style={{
            width: '100%',
            height: '100%',
            backgroundColor: '#8ECAE6',
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
            >Remove Player</Text>
            <Text
                style={{
                    fontSize: 20,
                }}
            >Name:</Text>
            <TextInput 
                placeholder='Enter player name to remove'
                onChangeText={newText => setName(newText)}
                style={{
                    color: 'black',
                    outlineWidth: 2,
                    outlineColor: 'black',
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
                    title='Remove Player'
                    onPress={() => {
                        navigation.push({
                        pathname: "./",
                        params: { name: name, type: "remove" }
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
            </View>
        </View>
    </View>
    );
}

export default removePlayer;