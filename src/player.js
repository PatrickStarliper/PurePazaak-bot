module.exports = class Player {
    constructor(username, money, currentCount, currentCards, roundWins) {
        this.name = username;
        this.money = money;
        this.currentCount = currentCount;
        this.currentCards = currentCards;
        this.roundWins = roundWins;
    }

    getTag() { return this.name; }
    setTag(username) { this.name = username; }
};
