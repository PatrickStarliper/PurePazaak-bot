module.exports = class Player {
    constructor(username, funds, count, cards, numWins) {
        this.name = username;
        this.money = funds;
        this.currentCount = count;
        this.playingCards = cards;
        this.roundWins = numWins;
    }
    // playerList.push(new Player('player', 0, 0, [], 0)); (default values)

    getTag() { return this.name; }
    setTag(tag) { this.name = tag; }
    getPlayingCards() { return this.playingCards; }
    setPlayingCards(cards) { this.playingCards = cards; }
    getCurrentCount() { return this.currentCount; }
    setCurrentCount(number) { this.currentCount = number; }
};
