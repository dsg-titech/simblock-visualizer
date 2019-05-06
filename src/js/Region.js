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
        return getRnd(50, -106, 18, 36);
      }
      case "EUROPE": {
        return getRnd(50, 21, 25, 25);
      }
      case "SOUTH_AMERICA": {
        return getRnd(-10, -58, 25, 25);
      }
      case "ASIA_PACIFIC": {
        return getRnd(47, 109, 25, 25);
      }
      case "JAPAN": {
        return getRnd(36, 139, 25, 25);
      }
      case "AUSTRALIA": {
        return getRnd(-25, 135, 25, 25);
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
