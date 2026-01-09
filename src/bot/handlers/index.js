import { assetHandler } from './asset.handler.js';
import { priceHandler } from './price.handler.js';
import { upgradeHandler } from './upgrade.handler.js';
import { walletAddHears } from './walletAdd.handler.js';
import { walletDeleteHandler } from './walletDelete.handler.js';
import { walletRemoveHandler } from './walletRemove.handler.js';

export function registerHandlers(bot) {
  assetHandler(bot);
  priceHandler(bot);
  upgradeHandler(bot);
  walletAddHears(bot);
  walletRemoveHandler(bot);
  walletDeleteHandler(bot); 
}
