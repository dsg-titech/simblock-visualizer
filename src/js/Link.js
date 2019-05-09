export default class Link {
  constructor(worldMap, timestamp, beginNode, endNode) {
    this.worldMap = worldMap;
    this.timestamp = timestamp;
    this.beginNode = beginNode;
    this.endNode = endNode;
  }

  draw(ctx, timestamp) {
    // this._drawLink(ctx);
    this._drawFlow(ctx, timestamp);
  }

  _drawLink(ctx) {
    const beginPos = this.worldMap.latLngToPixel(
      this.beginNode.latitude,
      this.beginNode.longitude
    );
    const endPos = this.worldMap.latLngToPixel(
      this.endNode.latitude,
      this.endNode.longitude
    );
    ctx.beginPath();
    ctx.moveTo(beginPos.x, beginPos.y);
    ctx.lineTo(endPos.x, endPos.y);
    ctx.lineWidth = 0.5;
    ctx.strokeStyle = "rgba(0.8, 0.8, 0.8, 0.02)";
    ctx.stroke();
    ctx.closePath();
  }

  _drawFlow(ctx, timestamp) {
    const beginBlock = this.beginNode.getBlock(timestamp);
    const endBlock = this.endNode.getBlock(timestamp);
    if (beginBlock === null || endBlock === null) {
      return;
    }
    // beginNode -> endNode
    const isFlowing =
      timestamp === endBlock.receivingTimestamp &&
      this.beginNode.id === endBlock.fromNode.id;
    if (!isFlowing) {
      return;
    }
    const beginPos = this.worldMap.latLngToPixel(
      this.beginNode.latitude,
      this.beginNode.longitude
    );
    const endPos = this.worldMap.latLngToPixel(
      this.endNode.latitude,
      this.endNode.longitude
    );
    const strokeColor = this.endNode.getStrokeColor(timestamp);
    ctx.beginPath();
    ctx.moveTo(beginPos.x, beginPos.y);
    ctx.lineTo(endPos.x, endPos.y);
    ctx.lineWidth = 1;
    ctx.strokeStyle = `rgba(${strokeColor.r}, ${strokeColor.g}, ${
      strokeColor.b
    }, ${strokeColor.a})`;
    ctx.stroke();
    ctx.closePath();
  }
}
