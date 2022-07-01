import { useEffect, useState } from "react";
import { View, Text, Image, TouchableHighlight } from "react-native";
import { getDeckId, getCards } from "../../services/axiosClient";

const Game = ({ route }) => {

  var { deckId } = route.params;
  const [cards, setCards] = useState(null);
  const [total, setTotal] = useState(null);
  const botCount = 3;
  const [botCards, setBotCards] = useState(null);
  const [botTotal, setBotTotal] = useState(null);
  const [botTotalFinal, setBotTotalFinal] = useState(null);
  const [status, setStatus] = useState(0);
  const [msg, setMsg] = useState(null);

  const getCard = async () => {
    const get = async () => {
      const deck = await getCards(deckId, botCount + 1);
      var card = deck.cards[0]

      setCards([...cards, card]);
      somarTotal(card.value);
    };
    get();
  }

  const finalizar = async () => {
    ligarBots()
  }

  function resultado() {
    var ganhador;
    var maiorValor = 0;
    var tipo = 0;

    if (total <= 21) {
      ganhador = "Você"
      maiorValor = total
      tipo = 1
    }

    for (var i = 0; i < botCount; i++) {
      if (botTotalFinal[i] > maiorValor && botTotalFinal[i] <= 21) {
        ganhador = "Bot " + (i + 1)
        maiorValor = botTotalFinal[i]
        tipo = 1
      } else if (maiorValor == botTotalFinal[i]) {
        ganhador = ganhador + " e Bot " + (i + 1)
        tipo = 2
      }
    }

    if (tipo == 0) {
      setMsg("Todos jogadores perderam")
    } else if (tipo == 2) {
      setMsg("Os jogadores " + ganhador + " empataram")
    } else {
      setMsg("O jogador " + ganhador + " ganhou")
    }
  }

  function startGame() {
    const get = async () => {

      const deck = await getCards(deckId, botCount + 1);
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
      setStatus(1);
    }
    get();
  }

  function restartGame() {
    setCards(null);
    setTotal(null);
    setBotCards(null);
    setBotTotal(null);
    setBotTotalFinal(null);
    setStatus(0);
  }

  useEffect(() => {
    for (var i = 0; i < botCount; i++) {
      if (botCards) {

        var totalBotCards = 0;
        for (var j = 0; j < botCards[i].length; j++) {
          if (!totalBotCards) {
            totalBotCards = [botCards[i][j].value];
          } else {
            totalBotCards = [...totalBotCards, botCards[i][j].value];
          }
        }

        somarBotTotal(i, totalBotCards)
      }
    }
  }, [botCards]);

  useEffect(() => {
    if (status == 2) {
      resultado()
    }
  }, [botTotalFinal]);

  useEffect(() => {
    if (status == 0) {
      startGame();
    }
  }, [status]);

  useEffect(() => {
    if (total > 21) {
      alert("VOCÊ PERDEU!")
      finalizar()
    }
  }, [total]);

  function somarTotal(value) {
    value = (value == "ACE" && 1 || parseInt(value) || 10)
    setTotal(total + value)
  }

  function somarBotTotal(bot, value) {
    var somarBot;

    for (var i = 0; i < value.length; i++) {
      value[i] = (value[i] == "ACE" && 1 || parseInt(value[i]) || 10)

      if (!somarBot) {
        somarBot = value[i];
      } else {
        somarBot = somarBot + value[i];
      }
    }

    calculo(bot, somarBot)
  }

  var save = []
  function calculo(bot, somarBot) {
    if (bot == 0) {
      save = [somarBot]
    } else {
      save = [...save, somarBot]
    }

    if (bot == botCount - 1) {
      setBotTotal(save)
    }
  }

  useEffect(() => {
    setBotTotalFinal(botTotal)
  }, [botTotal]);

  function ligarBots() {
    const get = async () => {
      const deck = await getCards(deckId, botCount);
      var deckBot;
      var preCards;
      var jogadasExtras;

      for (var i = 0; i < botCount; i++) {
        jogadasExtras = Math.floor(Math.random() * 2)
        preCards = [...botCards[i], deck.cards[i]];

        if (i == 0) {
          for (var j = 1; j <= jogadasExtras; j++) {
            const deckUn = await getCards(deckId, 1);
            preCards = [...preCards, deckUn.cards[0]]
          }

          deckBot = [preCards];
        } else {
          for (var j = 1; j <= jogadasExtras; j++) {
            const deckUn = await getCards(deckId, 1);
            preCards = [...preCards, deckUn.cards[0]]
          }

          deckBot = [...deckBot, preCards];
        }

      };

      setBotCards(deckBot);
      setStatus(2)
    };
    get();
  }

  function placar() {
    var text = "Eu: " + (total <= 21 && total || "Perdeu")
    if (status == 2) {
      for (var i = 0; i < botCount; i++) {
        if (botTotal) {
          text = text + "\nBot " + (i + 1) + ": " + (botTotal[i] <= 21 && botTotal[i] || "Perdeu")
        } else {
          text = text + "\nBot " + (i + 1) + ": 0"
        }
      }
      text = text + "\n\n=> " + msg + " <="
    }

    return text
  }

  return (
    <>
      <View>
        <Text>{placar()}</Text>
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
      <Text>Meus Pontos: {total}</Text>
      {status == 1 &&
        <>
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
      }

      {status == 2 && <TouchableHighlight underlayColor='blue' onPress={restartGame}>
        <View>
          <Text>Reiniciar</Text>
        </View>
      </TouchableHighlight>}
    </>
  );
};

export default Game;
