import { Button, StyleSheet, Text, View, Image, ActivityIndicator, TouchableHighlight } from 'react-native';
import { useState, useEffect } from 'react'
import api from '../../services/api';

export const Blackjack = () => {

    const [playerCards, setPlayerCards] = useState([{
        cartas: {
            valor: undefined,
            img: undefined
        }
    }]);
    
    const [idDeck, setIdDeck] = useState();
    const [deck, setDeck] = useState([]);
    const [card, setCard] = useState([]);
    const [gameOn, setGameOn] = useState(false)
    const [playerPoints, setPlayerPoints] = useState([]);
    const [total, setTotal] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    const getDeck = async () => {
        const { data } = await api.get('new/shuffle/?deck_count=1')
        setDeck([data]);
        setIdDeck([data.deck_id])
    }

    const handlePlayer = () =>{
        card.map(cards => {
            handleValor(),
                setPlayerCards([...playerCards, {
                    cartas: {
                        valor: cards.value,
                        img: cards.images.png
                    }
                }]),
            setPlayerPoints([...playerPoints, parseInt(cards.value)]);
        })
        if (total > 21) {
            alert("VOCÊ PERDEU!!! 😜")
        }

        if (playerCards.indexOf(undefined)) {
            playerCards.shift();
        }
    }

    const getCards = async () => {
        const { data } = await api.get(`${idDeck}/draw/?count=1`);
        setCard(data.cards);
        setGameOn(true);
        handlePlayer();
        if (card.length > 0) {
            setIsLoading(false)
        }
        console.log(card)
        console.log(playerCards)
        console.log(playerPoints)
    }

    const cardGet = () =>{
        
    }

    const handleValor = () => {
        card.map(cards => {
            if (isNaN(cards.value)) {
                return cards.value = parseInt(10)
            }
            else {
                return parseInt(cards.value);
            }
        })
    }
    
    const somaValor = () => {
        return setTotal(playerPoints.reduce(function (a, b) { return a + b }, 0))
    }

    const handleParar = () => {
        if (total > 21) {
            alert("VOCÊ PERDEU!!!")
        }
        else if (total <= 21 && total !== 0) {
            alert("VOCÊ VENCEU")
        }
    }

    useEffect(() => {
        getDeck();
    }, []);

    return (
        <View style={styles.container}>
            {playerCards && <Text style={{paddingTop: '5%'}}>TOTAL JOGADOR: {total}</Text>}
            <View style={{ flex: 4, justifyContent: 'flex-start', flexDirection: 'row', flexWrap: 'wrap' }}>
                {isLoading ? <ActivityIndicator /> : playerCards.map(card => {
                    return (
                        <Image style={styles.card} source={{ uri: card.cartas.img }} />
                    )
                })}
            </View>
            
            <View style={{margin: '20%',flexDirection: 'row' }}>
                <Button onPress={somaValor} title="soma"></Button>
                {!gameOn && 
                <TouchableHighlight  underlayColor='blue' onPress={() => setGameOn(true)}>
                    <View style={styles.button}>
                        <Text>INICIAR</Text>
                    </View>
                </TouchableHighlight>}
                
                {gameOn && 
                <TouchableHighlight underlayColor='blue' onPress={getCards}>
                    <View style={[styles.button]}>
                        <Text>Pegar nova carta</Text>
                    </View>
                </TouchableHighlight>}

                {gameOn && 
                <TouchableHighlight underlayColor='blue' onPress={handleParar}>
                    <View style={[styles.button,{marginLeft: '10%'}]}>
                        <Text>Parar</Text>
                    </View>
                </TouchableHighlight>}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#289B49',
      alignItems: 'center',
      justifyContent: 'center',
    },
    card: {
      shadowRadius: 3,
      margin: 10,
      height: 150,
      width: 100,
      borderRadius: 10
    },
    button: {
        alignItems: "center",
        backgroundColor: "#DDDDDD",
        padding: 10
    },
  });