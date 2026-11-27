// Historical browser recipes also run against frozen previews that predate the workshop envelope.
module.exports = text => {
  const data = JSON.parse(text);
  return data.schema === 'microcosme.workshop' ? data.active : data;
};
