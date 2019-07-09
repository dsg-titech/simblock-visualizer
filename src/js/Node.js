import u from "@/js/utils";

export default class Node {
  constructor(worldMap, timestamp, id, region) {
    this.worldMap = worldMap;
    this.timestamp = timestamp;
    this.id = id;
    this.region = region;
    this.blockList = [];
    this.selected = false;
    this.initPosition();
  }

  select() {
    this.selected = true;
  }

  unselect() {
    this.selected = false;
  }

  initPosition() {
    const pos = this.region.getRandomPosition();
    this.latitude = pos.latitude;
    this.longitude = pos.longitude;
  }

  draw(ctx, timestamp) {
    const pos = this.worldMap.latLngToPixel(this.latitude, this.longitude);
    const fillColor = this.getFillColor(timestamp);
    const strokeColor = this.getStrokeColor(timestamp);
    ctx.beginPath();
    ctx.arc(pos.x, pos.y, this.getRadius(timestamp), 0, Math.PI * 2, false);
    ctx.fillStyle = `rgba(${fillColor.r}, ${fillColor.g}, ${fillColor.b}, ${fillColor.a})`;
    ctx.fill();
    ctx.lineWidth = 0.5;
    ctx.strokeStyle = `rgba(${strokeColor.r}, ${strokeColor.g}, ${strokeColor.b}, ${strokeColor.a})`;
    ctx.stroke();
    ctx.closePath();
  }

  collide(mouseX, mouseY, timestamp) {
    const pos = this.worldMap.latLngToPixel(this.latitude, this.longitude);
    const dSq =
      (pos.x - mouseX) * (pos.x - mouseX) + (pos.y - mouseY) * (pos.y - mouseY);
    const r = this.getRadius(timestamp);
    return dSq < r * r;
  }

  getRadius(timestamp) {
    const block = this.getBlock(timestamp);
    return (
      4.5 * (this.selected ? 1.2 : 1.0) * (this.isMiner(block) ? 3.0 : 1.0)
    );
  }

  getFillColor(timestamp) {
    const block = this.getBlock(timestamp);
    const blockId = (block === null ? -1 : block.id) + 1;
    const color = u.getColor((blockId + (this.selected ? 0.1 : 0.0)) * 0.23);
    const alpha = this.selected ? 0.9 : 0.5;
    return { r: color.r, g: color.g, b: color.b, a: alpha };
  }

  getStrokeColor(timestamp) {
    const block = this.getBlock(timestamp);
    const blockId = (block === null ? -1 : block.id) + 1;
    const color = u.getColor((blockId + (this.selected ? 0.1 : 0.0)) * 0.23);
    const alpha = this.selected ? 1.0 : 0.8;
    return { r: color.r, g: color.g, b: color.b, a: alpha };
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

  getNextBlock(timestamp) {
    for (const block of this.blockList) {
      if (block.receivingTimestamp >= timestamp) {
        return block;
      }
    }
    return null;
  }

  isMiner(block) {
    return block !== null && block.ownerNode.id === this.id;
  }
}
