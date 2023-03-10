type Coordinate = {x: number, y: number};
//populateDotsCoordinate------------------------------------------
function populateDotsCoordinate(
  dotsDimension: number,
  containerWidth: number,
  containerHeight: number
) {
  let mappedIndex = [];
  let screenCoordinates = [];

  for (let rowIndex = 0; rowIndex < dotsDimension; rowIndex++) {
    for (let columnIndex = 0; columnIndex < dotsDimension; columnIndex++) {
      let offsetX = containerWidth / dotsDimension * columnIndex;
      let offsetY = containerHeight / dotsDimension * rowIndex;

      screenCoordinates.push({
        x: offsetX + containerWidth / dotsDimension / 2,
        y: offsetY + containerWidth / dotsDimension / 2
      });
      mappedIndex.push({x: columnIndex, y: rowIndex});
    }
  }

  return {
    mappedIndex,
    screenCoordinates
  };
}
//----------------------------------------------------------------
//getIntermediateDotIndexes
function getIntermediateDotIndexes(
  anchorCoordinate: Coordinate,
  focusCoordinate: Coordinate,
  dimension: number
) {
  let intermediateDotIndexes = [];
  let testIndex = [];

  // check horizontal
  if (focusCoordinate.y === anchorCoordinate.y) {
    let row = focusCoordinate.y;
    for (
      let col = Math.min(focusCoordinate.x, anchorCoordinate.x) + 1;
      col < Math.max(focusCoordinate.x, anchorCoordinate.x);
      col++
    ) {
      let index = row * dimension + col;
      intermediateDotIndexes.push(index);
    }
  }

  // check vertical
  if (focusCoordinate.x === anchorCoordinate.x) {
    let col = anchorCoordinate.x;
    for (
      let row = Math.min(focusCoordinate.y, anchorCoordinate.y) + 1;
      row < Math.max(focusCoordinate.y, anchorCoordinate.y);
      row++
    ) {
      let index = row * dimension + col;
      intermediateDotIndexes.push(index);
    }
  }

  // check diagonal
  let dx = focusCoordinate.x - anchorCoordinate.x;
  let dy = focusCoordinate.y - anchorCoordinate.y;
  if (Math.abs(dx) === Math.abs(dy)) {
    let loopCount = 1;

    let getCalculatedCol = (iterator: number) => {
      if (dx === dy) {
        // diagonal from top left to bottom right or vice versa
        let col = Math.min(focusCoordinate.x, anchorCoordinate.x);
        return col + iterator;
      } else {
        // diagonal from top right to bottom left or vice versa
        let col = Math.max(focusCoordinate.x, anchorCoordinate.x);
        return col - iterator;
      }
    };

    for (
      let row = Math.min(focusCoordinate.y, anchorCoordinate.y) + 1;
      row < Math.max(focusCoordinate.y, anchorCoordinate.y);
      row++
    ) {
      let index = row * dimension + getCalculatedCol(loopCount);
      intermediateDotIndexes.push(index);
      loopCount++;
    }
  }

  return intermediateDotIndexes;
}
//----------------------------------------------------------------
const DEFAULT_HIT_SLOP = 25;
function getDotIndex(
  gestureCoordinate: Coordinate,
  dots: Array<Coordinate>,
  hitSlop?: number = DEFAULT_HIT_SLOP
) {
  let dotIndex;
  let {x, y} = gestureCoordinate;
  for (let i = 0; i < dots.length; i++) {
    let {x: dotX, y: dotY} = dots[i];
    if (
      dotX + hitSlop >= x &&
      dotX - hitSlop <= x &&
      (dotY + hitSlop >= y && dotY - hitSlop <= y)
    ) {
      dotIndex = i;
      break;
    }
  }
  return dotIndex;
}

export {
  populateDotsCoordinate,
  getDotIndex,
  getIntermediateDotIndexes
};
