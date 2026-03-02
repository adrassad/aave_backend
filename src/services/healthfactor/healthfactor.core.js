//src/services/healthfactor/healthfactor.core.js
import { db } from "../../db/index.js";
import { getUserHealthFactor } from "../../blockchain/index.js";

export async function calculateAndStoreHF({
  address,
  network,
  checkChange = true, // 👈 важно
}) {
  const rawHF = await getUserHealthFactor(network.name, "aave", address);
  if (rawHF == null)
    return {
      address,
      network: network.name,
      healthfactor: null,
      isChanged: false,
    };
  const healthfactor =
    rawHF === Infinity ? Infinity : Number(Number(rawHF).toFixed(2));

  let isChanged = true;

  if (checkChange) {
    isChanged = await db.hf.create({
      address: address,
      protocol: "aave",
      network_id: network.id,
      healthfactor,
    });
  }

  return {
    address,
    network: network.name,
    healthfactor,
    isChanged,
  };
}
