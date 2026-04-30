import { NotificationGateway } from "./notification-gateway.js";

function normalizeHF(value) {
  const num = Number(value);
  if (!Number.isFinite(num) || num === 0) return Infinity;
  return num;
}

function getHFIcon(value) {
  if (value === Infinity) return "♾️";
  if (value > 2) return "💚";
  if (value > 1.5) return "💛";
  if (value > 1.2) return "🧡";
  if (value > 1) return "❤️";
  return "💔";
}

function formatHFValue(value, digits = 2) {
  if (value === Infinity) return "∞";
  return value.toFixed(digits);
}

function shortenAddress(address) {
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
}

export function formatHealthFactorAlertMessage(walletMap) {
  let hasCritical = false;
  const walletBlocks = [];

  for (const [wallet, networksMap] of walletMap.entries()) {
    const networks = [];

    for (const [network, rawHF] of networksMap.entries()) {
      const hf = normalizeHF(rawHF);

      if (hf < 1.2) {
        hasCritical = true;
      }

      networks.push({
        name: network,
        hf,
        icon: getHFIcon(hf),
      });
    }

    networks.sort((a, b) => a.hf - b.hf);

    const lines = networks.map((n) => {
      const displayName = n.name.charAt(0) + n.name.slice(1).toLowerCase();
      return `${displayName.padEnd(12)} ${n.icon}  ${formatHFValue(n.hf)}`;
    });

    walletBlocks.push(
      `💼 <b>${shortenAddress(wallet)}</b>\n\n<pre>\n${lines.join("\n")}\n</pre>`,
    );
  }

  const header = hasCritical
    ? "🚨 <b>Health Factor Alert</b>"
    : "📊 <b>Health Factor Overview</b>";

  return `${header}\n\n${walletBlocks.join("\n\n")}`;
}

export function formatPriceAlertMessage(alerts) {
  let message = `🚨📈 <b>Price Alert</b>\n\n`;

  for (const [network, assets] of alerts) {
    message += `🌐 <b>Network:</b> <code>${network.name}</code>\n`;

    for (const [address, data] of assets) {
      const { asset, lastPrice, newPrice, change } = data;
      const oldPrice = lastPrice?.price_usd ?? 0;
      const direction = change > 0 ? "📈" : "📉";

      message += `
        <b>${asset.symbol}</b>
        <code>${address}</code>
        Old: <b>$${oldPrice}</b>
        New: <b>$${newPrice}</b>
        Change: ${direction} <b>${change.toFixed(2)}%</b>

        `;
    }

    message += `\n`;
  }

  return message;
}

export async function notifyUser(userId, message, options = {}) {
  return NotificationGateway.sendToUser(userId, message, options);
}
