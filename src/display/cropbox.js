otre.display.getCropbox = function(region, intersects) {
  var util = otre.util,
      boardRegions = enums.boardRegions,
      region = region || boardRegions.ALL,
      maxPoint = intersects - 1, // Everything we do is 0-indexed
      halfInts = Math.ceil(maxPoint / 2),
      // default number of points
      top = 0,
      left = 0,
      bot = maxPoint,
      right = maxPoint;

  switch(region) {
    // X X
    // X X
    case boardRegions.ALL: break;

    // X -
    // X -
    case boardRegions.LEFT: right = halfInts + 1; break;

    // - X
    // - X
    case boardRegions.RIGHT: left = halfInts - 1; break;

    // X X
    // - -
    case boardRegions.TOP: bot = halfInts + 1; break;

    // - -
    // X X
    case boardRegions.BOTTOM: top = halfInts - 1; break;

    // X -
    // - -
    case boardRegions.TOP_LEFT:
        bot = halfInts + 1; right = halfInts + 2; break;

    // - X
    // - -
    case boardRegions.TOP_RIGHT:
        bot = halfInts + 1; left = halfInts - 2; break;

    // - -
    // X -
    case boardRegions.BOTTOM_LEFT:
        top = halfInts - 1; right = halfInts + 2; break;

    // - -
    // - X
    case boardRegions.BOTTOM_RIGHT:
        top = halfInts - 1; left = halfInts - 2; break;
    default: break
  }

  var box = otre.display.bboxFromPts(
      util.point(left, top), util.point(right, bot));
  return box;
};
