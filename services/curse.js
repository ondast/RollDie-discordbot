// Local includes
const curses = require('../data/curses.json');

module.exports = {
    interpret() {
        return {
            message: this.generateMessage(),
            embed: null,
        }
    },

    generateMessage() {
        const idx = Math.floor(Math.random() * (curses.length))
        const curse = curses[idx];

        return curse ? curse : 'I... I got nothing';
    },
}