"use strict";

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var ONE_SECOND = 1000;
var MATCH_LIMIT = 8;

var GamePlay =
/*#__PURE__*/
function () {
  function GamePlay() {
    _classCallCheck(this, GamePlay);

    this.first_card = undefined;
    this.flip_count = 0;

    this.wait = function (ms) {
      return new Promise(function (r, j) {
        return setTimeout(r, ms);
      });
    };

    this.deck = [];
    this.move = 0;
    this.match_count = 0;
    this.game_time_seconds = 0;
    this.game_time_minutes = 0;
    this.game_timer = null;
    this.status = false; // check game starter
  }

  _createClass(GamePlay, [{
    key: "new_game",
    value: function new_game() {
      this.status = true;
      this.move = 0;
      this.match_count = 0;
      this.update_move_count(this.move);
      this.flip_count = 0;
      this.first_card = undefined;
      this.start_timer();
      this.deck = [];
      this.new_deck();
      $('.popup').fadeOut();
      $('#move-used').html('');
      $('#time-used').html('');
    }
  }, {
    key: "new_deck",
    value: function new_deck() {
      // create new deck
      $('.card-game i').attr('class', 'fal'); // remove previous icon

      $('.card-game__item').attr('class', 'card-game__item');
      var full_deck = this.shuffle_deck();
      full_deck.forEach(function (val, index) {
        var card = document.getElementById("".concat(index + 1));
        card.querySelector('.fal').setAttribute('class', "fal ".concat(val['symbol']));
      });
    }
  }, {
    key: "create_deck",
    value: function create_deck() {
      var icon = ['pegasus', 'paw-claws', 'dragon', 'bat', 'jack-o-lantern', 'heart', 'leaf-maple', 'smile', 'snowflake', 'stars', 'ad', 'chess', 'chess-king-alt', 'cactus', 'globe-asia', 'island-tropical', 'usd-circle', 'swords', 'thumbs-up', 'piggy-bank', 'peace', 'yin-yang', 'grin-hearts', 'grin-wink', 'user-astronaut', 'futbol', 'trophy-alt', 'galaxy', 'planet-ringed', 'axe-battle'];
      var icon_index = [];
      var count = 0;

      while (count < 16) {
        // random choose 8 different icons with combination of 16  
        var icon_count = Math.floor(Math.random() * icon.length);

        if (!icon_index.includes(icon_count)) {
          icon_index.push(icon_count);
          this.deck[count] = {
            symbol: 'fa-' + icon[icon_count],
            faceup: false,
            matched: false
          };
          this.deck[count + 1] = {
            symbol: 'fa-' + icon[icon_count],
            faceup: false,
            matched: false
          };
          count += 2;
        }
      }
    }
  }, {
    key: "shuffle_deck",
    value: function shuffle_deck() {
      // shuffle deck
      this.create_deck();
      var card_deck = this.deck;
      var current_index = card_deck.length;
      var temporary_value;
      var random_index;

      while (current_index !== 0) {
        random_index = Math.floor(Math.random() * current_index);
        current_index -= 1;
        temporary_value = card_deck[current_index];
        card_deck[current_index] = card_deck[random_index];
        card_deck[random_index] = temporary_value;
      }

      return card_deck;
    }
  }, {
    key: "turn_up",
    value: function turn_up(selected_card_index) {
      var selectedCard = document.getElementById("".concat(selected_card_index));
      selectedCard.setAttribute('class', 'card-game__item card-game__item--active');
    }
  }, {
    key: "turn_down",
    value: function turn_down(selected_card_index) {
      var selectedCard = document.getElementById("".concat(selected_card_index));
      selectedCard.setAttribute('class', 'card-game__item');
    }
  }, {
    key: "turn",
    value: function turn(selected_card_index) {
      if (selected_card_index === null) {
        return false;
      }

      if (this.first_card === selected_card_index) {
        return false;
      }

      if (this.deck[selected_card_index - 1].matched) {
        return false;
      } // Ignore clicks until the preceeding pair of cards have been evaluated


      if (this.flip_count > 1) {
        return false;
      }

      this.turn_up(selected_card_index);
      this.flip_count += 1;

      if (this.flip_count === 1) {
        this.first_card = selected_card_index;
      } else {
        // Update move count
        this.move += 1;
        this.update_move_count(this.move); // Check matched icon

        if (this.icon_match(this.first_card, selected_card_index)) {
          this.pair_match(this.first_card, selected_card_index);
        } else {
          this.pair_not_matched(this.first_card, selected_card_index);
        }
      } // Check for the end of the current game


      if (this.match_count >= MATCH_LIMIT) {
        this.stop_timer();
        $('.popup').fadeIn();
        $('#move-used').html(this.move);
        var desc = this.game_time_seconds + ' seconds';

        if (this.game_time_minutes > 0) {
          desc = this.game_time_minutes + ' minutes ' + desc;
        }

        $('#time-used').html(desc);
        return true;
      }
    } // Check is icon match

  }, {
    key: "icon_match",
    value: function icon_match(first_card, second_card) {
      if (this.deck[first_card - 1].symbol == this.deck[second_card - 1].symbol) {
        return true;
      }

      return false;
    } // Update icon matched UI

  }, {
    key: "icon_is_match",
    value: function icon_is_match(first_card, second_card) {
      var card = $('#' + first_card + ', #' + second_card);
      card.addClass('card-game__item--match');
    }
  }, {
    key: "pair_match",
    value: function pair_match(first_card_index, second_card_index) {
      this.match_count += 1;
      this.flip_count = 0;
      this.deck[first_card_index - 1].matched = true;
      this.deck[second_card_index - 1].matched = true;
      this.icon_is_match(first_card_index, second_card_index);
    }
  }, {
    key: "pair_not_matched",
    value: function pair_not_matched(first_card_index, second_card_index) {
      return regeneratorRuntime.async(function pair_not_matched$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              _context.next = 2;
              return regeneratorRuntime.awrap(this.wait(ONE_SECOND));

            case 2:
              this.turn_down(first_card_index);
              this.turn_down(second_card_index);
              this.first_card = undefined;
              this.flip_count = 0;

            case 6:
            case "end":
              return _context.stop();
          }
        }
      }, null, this);
    }
  }, {
    key: "update_move_count",
    value: function update_move_count(move) {
      $('#game-move').html(move + ' Moves');
    } // Set Timer

  }, {
    key: "start_timer",
    value: function start_timer() {
      this.stop_timer();
      this.game_time_minutes = 0;
      this.game_time_seconds = 0;
      this.game_timer = setInterval(this.show_new_time, 1000, this);
    }
  }, {
    key: "stop_timer",
    value: function stop_timer() {
      if (this.game_timer !== null) {
        clearInterval(this.game_timer);
        this.game_timer = null;
      }
    }
  }, {
    key: "show_new_time",
    value: function show_new_time(game_timer) {
      game_timer.game_time_seconds += 1;
      var minutes = game_timer.game_time_minutes;

      if (game_timer.game_time_seconds >= 60) {
        game_timer.game_time_seconds = 0;
        game_timer.game_time_minutes += 1;
        minutes = ("0" + game_timer.game_time_minutes).slice(-2);
      }

      var seconds = ("0" + game_timer.game_time_seconds).slice(-2);
      $('#game-time').html(minutes + ':' + seconds);
    }
  }]);

  return GamePlay;
}();