export default class Region {
  constructor(id, name) {
    this.id = id;
    this.name = name;
  }

  getRandomPosition() {
    const pos = {
      latitude: 0,
      longitude: 0
    };
    switch (this.name) {
      case "NORTH_AMERICA":
        {
          pos.latitude = 54;
          pos.longitude = -106;
        }
        break;
      case "EUROPE":
        {
          pos.latitude = 50;
          pos.longitude = 21;
        }
        break;
      case "SOUTH_AMERICA":
        {
          pos.latitude = -10;
          pos.longitude = -58;
        }
        break;
      case "ASIA_PACIFIC":
        {
          pos.latitude = 47;
          pos.longitude = 109;
        }
        break;
      case "JAPAN":
        {
          pos.latitude = 36;
          pos.longitude = 139;
        }
        break;
      case "AUSTRALIA":
        {
          pos.latitude = -25;
          pos.longitude = 135;
        }
        break;
      default: {
        console.warn("Unexpected region: ", this.name);
      }
    }
    return pos;
  }
}
