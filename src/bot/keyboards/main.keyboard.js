// src/bot/keyboards/main.keyboard.js
import { Markup } from 'telegraf';
import { BUTTONS } from '../constants/buttons.js';

export function mainKeyboard() {
  return Markup.keyboard([
    [BUTTONS.ADD_WALLET],
    [BUTTONS.REMOVE_WALLET]
  ])
    .resize()
    .persistent();
}
