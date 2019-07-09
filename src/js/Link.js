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
    const endBlock = this.endNode.getNextBlock(timestamp);
    if (beginBlock === null || endBlock === null) {
      return;
    }
    // beginNode -> endNode
    let isFlowing =
      timestamp >= endBlock.sendingTimestamp &&
      timestamp <= endBlock.receivingTimestamp &&
      this.beginNode.id === endBlock.fromNode.id;
    let isJustRecepted =
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
    const strokeColor = this.endNode.getStrokeColor(
      endBlock.receivingTimestamp
    );
    ctx.beginPath();
    ctx.moveTo(beginPos.x, beginPos.y);
    ctx.lineTo(endPos.x, endPos.y);
    ctx.lineWidth = isJustRecepted ? 3 : 1;
    ctx.strokeStyle = `rgba(${strokeColor.r}, ${strokeColor.g}, ${
      strokeColor.b
    }, ${strokeColor.a * 0.8})`;
    ctx.stroke();
    ctx.closePath();
  }
}
