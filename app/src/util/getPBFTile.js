import Pbf from 'pbf';
import { VectorTile } from 'vector-tile';

export default (tileUrl) => {
  const vectorTilePromise = fetch(tileUrl).then((response) => {
    if (!response.ok) {
      throw new Error(`could not load tile ${tileUrl}`);
    }
    return response.blob().then((blob) => {
      const reader = new FileReader();
      return new Promise((resolve) => {
        reader.addEventListener('loadend', () => {
          // reader.result contains the contents of blob as a typed array
          // blob.type === 'application/x-protobuf'
          const pbf = new Pbf(reader.result);
          const vectorTile = new VectorTile(pbf);
          return resolve(vectorTile);
        });
        reader.readAsArrayBuffer(blob);
      });
    });
  }).catch((err) => {
    console.warn(err);
  });
  return vectorTilePromise;
};
