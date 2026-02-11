import { formatUnits, MaxUint256 } from "ethers";

/**
 * Универсальный форматтер Health Factor из Aave
 *
 * @param {bigint|string|number|null|undefined} rawHealthFactor
 * @param {number} decimals (по умолчанию 18 для Aave)
 * @returns {string} готовое значение для UI
 */
export function formatHealthFactor(rawHealthFactor, decimals = 18) {
  try {
    if (rawHealthFactor === null || rawHealthFactor === undefined) {
      return "0.0000";
    }

    // Если это MaxUint256 → бесконечный HF
    if (rawHealthFactor === MaxUint256) {
      return "∞";
    }

    // ethers v6 возвращает bigint
    if (typeof rawHealthFactor === "bigint") {
      // защита от MaxUint256 через bigint сравнение
      if (rawHealthFactor === MaxUint256) {
        return "∞";
      }

      const formatted = formatUnits(rawHealthFactor, decimals);
      return Number(formatted).toFixed(4);
    }

    // Если пришла строка
    if (typeof rawHealthFactor === "string") {
      const num = Number(rawHealthFactor);
      if (!Number.isFinite(num)) return "∞";
      return num.toFixed(4);
    }

    // Если number
    if (typeof rawHealthFactor === "number") {
      if (!Number.isFinite(rawHealthFactor)) return "∞";
      return rawHealthFactor.toFixed(4);
    }

    return "0.0000";
  } catch (e) {
    console.warn("⚠️ formatHealthFactor failed:", e.message);
    return "0.0000";
  }
}
