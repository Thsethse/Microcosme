(function (root, factory) {
  const api = factory(
    typeof module === "object" ? require("./v1-engines.js") : root.MicrocosmeV1,
  );
  if (typeof module === "object") module.exports = api;
  else root.V1Storage = api;
})(globalThis, function (V) {
  "use strict";
  const KEY = "microcosme-six-engines-v1",
    MAX_BYTES = 8000000;
  function serialize(s) {
    V.validate(s);
    return JSON.stringify(s);
  }
  function deserialize(text) {
    if (typeof text !== "string" || text.length > MAX_BYTES)
      throw new Error("Snapshot V1 trop volumineux ou non textuel");
    const s = JSON.parse(text);
    V.validate(s);
    return s;
  }
  function save(storage, state) {
    try {
      storage.setItem(KEY, serialize(state));
      return { ok: true, message: "V1 sauvegardée localement." };
    } catch (e) {
      return {
        ok: false,
        message:
          "Sauvegarde impossible : " +
          e.message +
          ". Session en mémoire ; export disponible.",
      };
    }
  }
  function load(storage) {
    try {
      const text = storage.getItem(KEY);
      return {
        state: text === null ? null : deserialize(text),
        blocked: false,
        message:
          text === null ? "Nouvelle expérience V1." : "V1 restaurée en pause.",
      };
    } catch (e) {
      return {
        state: null,
        blocked: true,
        message:
          "Chargement impossible : " +
          e.message +
          ". Sauvegarde suspendue ; export disponible.",
      };
    }
  }
  return { KEY, serialize, deserialize, save, load };
});
