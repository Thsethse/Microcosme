(function (root, factory) {
  const api = factory(
    typeof module === "object"
      ? require("./material-world.js")
      : root.MaterialWorld,
  );
  if (typeof module === "object") module.exports = api;
  else root.MaterialStorage = api;
})(globalThis, function (W) {
  "use strict";
  const KEY = "microcosme-material-lab-v1",
    MAX_BYTES = 2000000;
  function serialize(state) {
    W.validateState(state);
    return JSON.stringify(state);
  }
  function deserialize(text) {
    if (typeof text !== "string" || text.length > MAX_BYTES)
      throw new Error("Export trop volumineux ou non textuel");
    const state = JSON.parse(text);
    W.validateState(state);
    return state;
  }
  function save(storage, state) {
    try {
      const text = serialize(state);
      if (!storage) throw new Error("stockage indisponible");
      storage.setItem(KEY, text);
      return { ok: true, message: "Sauvegarde locale du laboratoire à jour." };
    } catch (e) {
      return {
        ok: false,
        message:
          "Sauvegarde impossible : " +
          e.message +
          ". La session reste en mémoire ; exporte le JSON.",
      };
    }
  }
  function load(storage) {
    try {
      if (!storage) throw new Error("stockage indisponible");
      const text = storage.getItem(KEY);
      return {
        state: text === null ? null : deserialize(text),
        blocked: false,
        message:
          text === null
            ? "Nouvelle session du laboratoire."
            : "Laboratoire restauré.",
      };
    } catch (e) {
      return {
        state: null,
        blocked: true,
        message:
          "Chargement impossible : " +
          e.message +
          ". Sauvegarde automatique suspendue ; export disponible.",
      };
    }
  }
  return { KEY, serialize, deserialize, save, load };
});
