import fetch from 'fetch'
import { Configuration, OpenAIApi } from 'openai';
import { env } from 'process';



const configuration = new Configuration({
    apiKey: env.OPEN_AI_API_KEY,
});
const openai = new OpenAIApi(configuration);

// const fetchSummonerId = async (name) => {
//     try {
//         const response = await fetch(`https://na1.api.riotgames.com/lol/summoner/v4/summoners/by-name/${name}?api_key=${riotApiKey}`);
//         const data = await response.json();
//         return data.id;
//     } catch (err) {
//         console.log(err)
//     }
// }

const fetchListOfMatches = async () => {
    try {
        const response = await fetch(`https://americas.api.riotgames.com/lol/match/v5/matches/by-puuid/${env.PUUID}/ids?type=ranked&start=0&count=1&api_key=${env.RIOT_API_KEY}`)
        const data = await response.json();
        return data;
    } catch (err) {
        console.log(err)
    }
}

const fetchMatchData = async (matchId) => {
    try {
        const response = await fetch(`https://americas.api.riotgames.com/lol/match/v5/matches/${matchId}?api_key=${env.RIOT_API_KEY}`)
        const data = await response.json();
        return data;
    } catch (err) {
        console.log(err)
    }
}

export const gatherMyMatchData = async () => {
    const aggregatedMatchData = [];
    const listOfMatches = await fetchListOfMatches();
    for (const match of listOfMatches) {
        const matchData = await fetchMatchData(match);
        const myParticipant = matchData.info.participants.find(p => p.puuid === env.PUUID);
        if (myParticipant) {
            aggregatedMatchData.push(myParticipant);
        }
    }
    return aggregatedMatchData;
}

export const analyzeData = async (userInput, data) => {
    try {
        const response = await openai.createCompletion({
            model: "text-davinci-003",
            prompt: `${userInput}\n\n${data}`,
            temperature: 0.7,
            max_tokens: 256,
            top_p: 1,
            frequency_penalty: 0,
            presence_penalty: 0,
        });
        return response;
    } catch (error) {
        throw error;
    }
};



