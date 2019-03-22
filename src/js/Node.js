export default class Node {
  constructor(timestamp, id, region) {
    this.timestamp = timestamp;
    this.id = id;
    this.region = region;
    this.blockList = [];
    this.initPosition();
  }

  initPosition() {
    this.latitude = 73.482;
    this.longitude = 54.5854;
  }

  makeBubble() {
    return {
      nodeId: this.id,
      timestamp: this.timestamp,
      regionId: this.region.id,
      lastBlockId: this.lastBlock.id,
      radius: 15,
      latitude: this.latitude,
      longitude: this.longitude
    };
  }
}
