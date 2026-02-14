//src/services/healthfactor/healthfactor.core.js
import { db } from "../../db/index.js";
import { getUserHealthFactor } from "../../blockchain/index.js";

export async function calculateAndStoreHF({
  address,
  walletId,
  userId,
  network,
  checkChange = true, // 👈 важно
}) {
  const rawHF = await getUserHealthFactor(network.name, "aave", address);

  const healthfactor =
    rawHF === Infinity ? Infinity : Number(Number(rawHF).toFixed(2));

  let isChanged = true;

  if (checkChange) {
    isChanged = await db.hf.create({
      wallet_id: walletId,
      protocol: "aave",
      network_id: network.id,
      healthfactor,
    });
  }

  return {
    userId,
    address,
    network: network.name,
    healthfactor,
    isChanged,
  };
}
