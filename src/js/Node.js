import u from "@/js/utils";

export default class Node {
  constructor(timestamp, id, region) {
    this.timestamp = timestamp;
    this.id = id;
    this.region = region;
    this.blockList = [];
    this.initPosition();
  }

  initPosition() {
    const pos = this.region.getRandomPosition();
    this.latitude = pos.latitude;
    this.longitude = pos.longitude;
  }

  draw(ctx, worldMap, timestamp) {
    const pos = worldMap.latLngToPixel(this.latitude, this.longitude);
    const radius = 5;
    const color = this.getColorFormat(timestamp);
    ctx.beginPath();
    ctx.arc(pos.x, pos.y, radius, 0, Math.PI * 2, false);
    ctx.fillStyle = color;
    ctx.fill();
    ctx.closePath();
  }

  getColorFormat(timestamp) {
    const block = this.getBlock(timestamp);
    const blockId = (block === null ? -1 : block.id) + 1;
    const color = u.getColor(blockId * 0.23);
    return `rgba(${color.r}, ${color.g}, ${color.b}, ${0.6})`;
  }

  getBlock(timestamp) {
    let result = null;
    for (const block of this.blockList) {
      if (block.receivingTimestamp > timestamp) {
        continue;
      }
      if (
        result === null ||
        block.receivingTimestamp > result.receivingTimestamp
      ) {
        result = block;
      }
    }
    return result;
  }
}
