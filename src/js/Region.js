export default class Region {
  constructor(worldMap, id, name) {
    this.worldMap = worldMap;
    this.id = id;
    this.name = name;
  }

  getRandomPosition() {
    const getRnd = (centerLat, centerLng, radiusLat, radiusLng) => {
      let cnt = 0;
      // eslint-disable-next-line no-constant-condition
      while (true) {
        const diffLat = (Math.random() * 2 - 1) * radiusLat;
        const diffLng = (Math.random() * 2 - 1) * radiusLng;
        const _diffLng = (diffLng * radiusLat) / radiusLng;
        const dSq = diffLat * diffLat + _diffLng * _diffLng;
        if (dSq < radiusLat * radiusLat) {
          return {
            latitude: centerLat + diffLat,
            longitude: centerLng + diffLng
          };
        }
        cnt++;
        if (cnt > 10000) {
          console.warn("alert!");
          break;
        }
      }
    };
    switch (this.name) {
      case "NORTH_AMERICA": {
        return getRnd(54, -100, 17, 35);
      }
      case "EUROPE": {
        return getRnd(52, 17, 18, 32);
      }
      case "SOUTH_AMERICA": {
        return getRnd(-11, -58, 12, 17);
      }
      case "ASIA_PACIFIC": {
        return getRnd(34, 98, 16, 18);
      }
      case "JAPAN": {
        return getRnd(38, 138, 9, 7);
      }
      case "AUSTRALIA": {
        return getRnd(-25, 134, 9, 15);
      }
      default: {
        console.warn("Unexpected region: ", this.name);
      }
    }
  }

  // _getRandomPositionInCircle(centerX, centerY, radius) {
  //   let cnt = 0;
  //   // eslint-disable-next-line no-constant-condition
  //   while (true) {
  //     const diffX = (Math.random() * 2 - 1) * radius;
  //     const diffY = (Math.random() * 2 - 1) * radius;
  //     const dSq = diffX * diffX + diffY * diffY;
  //     if (dSq < radius * radius) {
  //       return {
  //         x: centerX + diffX,
  //         y: centerY + diffY
  //       };
  //     }
  //     cnt++;
  //     if (cnt > 10000) {
  //       console.warn("alert!");
  //       break;
  //     }
  //   }
  // }
}
