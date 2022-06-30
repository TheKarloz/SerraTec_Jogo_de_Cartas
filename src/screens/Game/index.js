import { useEffect, useState } from "react";
import { View, Text, Image, TouchableHighlight } from "react-native";
import { getCards } from "../../services/axiosClient";

const Game = ({ route }) => {

  const { deckId } = route.params;
  const [cards, setCards] = useState(null);
  const [total, setTotal] = useState(null);
  const botCount = 3;
  const [botCards, setBotCards] = useState(null);
  const [botTotal, setBotTotal] = useState(null);

  const getCard = async () => {
    const get = async () => {
      const deck = await getCards(deckId, 4);
      var deckBot = [];

      for (var i = 0; i <= botCount; i++) {
        var card = deck.cards[i]
        if (i == 0) {
          setCards([...cards, card]);
          somarTotal(card.value);
        } else {
          if (i == 1) {
            console.log([...botCards[i - 1], card]);
            deckBot = [[...botCards[i - 1], card]];
          } else {
            console.log([...botCards[i - 1], card]);
            deckBot = [...deckBot, [...botCards[i - 1], card]];
          }
        }
      };
      console.log(deckBot);
      setBotCards(deckBot);
    };
    get();
  }

  const finalizar = async () => {
    const get = async () => {
      alert("VOCÊ VENCEU!")
    };
    get();
  }

  //Inicio do jogo
  useEffect(() => {
    const get = async () => {
      const deck = await getCards(deckId, 4);
      var deckBot = [];

      for (var i = 0; i <= botCount; i++) {
        var card = deck.cards[i]
        if (i == 0) {
          setCards([card]);
          somarTotal(card.value);
        } else {
          if (i == 1) {
            deckBot = [[card]];
          } else {
            deckBot = [...deckBot, [card]];
          }
        }
      };

      setBotCards(deckBot);
    }
    get();
  }, []);

  useEffect(() => {
    console.log(botCards)
  }, [botCards]);

  useEffect(() => {
    if (total > 21) {
      for (var i = 0; i <= botCount; i++) {
        console.log(botCards)
      }
      alert("VOCÊ PERDEU!")
    }
  }, [total]);

  function somarTotal(value) {
    value = (value == "ACE" && 1 || parseInt(value) || 10)
    setTotal(total + value)
  }

  return (
    <>
      <View>
        <Text>Meus pontos: {total}</Text>
      </View>
      <View style={{ flexDirection: "row", padding: "5%", flexWrap: "wrap", justifyContent: "space-between" }}>
        {cards && cards.map((card) =>
          <>
            <Image
              source={card.image}
              style={{ height: 100, width: 70 }}
              imageStyle={{ resizeMode: "contain", transform: [{ scale: 2.3 }] }}
            >
            </Image>
          </>
        )}
      </View>
      <TouchableHighlight underlayColor='blue' onPress={getCard}>
        <View>
          <Text>Comprar carta</Text>
        </View>
      </TouchableHighlight>
      <TouchableHighlight underlayColor='blue' onPress={finalizar}>
        <View>
          <Text>Parar</Text>
        </View>
      </TouchableHighlight>
    </>
  );
};

export default Game;
