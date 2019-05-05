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
          pos.latitude = 54 + (Math.random() * 50 - 25);
          pos.longitude = -106 + (Math.random() * 50 - 25);
        }
        break;
      case "EUROPE":
        {
          pos.latitude = 50 + (Math.random() * 50 - 25);
          pos.longitude = 21 + (Math.random() * 50 - 25);
        }
        break;
      case "SOUTH_AMERICA":
        {
          pos.latitude = -10 + (Math.random() * 50 - 25);
          pos.longitude = -58 + (Math.random() * 50 - 25);
        }
        break;
      case "ASIA_PACIFIC":
        {
          pos.latitude = 47 + (Math.random() * 50 - 25);
          pos.longitude = 109 + (Math.random() * 50 - 25);
        }
        break;
      case "JAPAN":
        {
          pos.latitude = 36 + (Math.random() * 50 - 25);
          pos.longitude = 139 + (Math.random() * 50 - 25);
        }
        break;
      case "AUSTRALIA":
        {
          pos.latitude = -25 + (Math.random() * 50 - 25);
          pos.longitude = 135 + (Math.random() * 50 - 25);
        }
        break;
      default: {
        console.warn("Unexpected region: ", this.name);
      }
    }
    return pos;
  }
}
