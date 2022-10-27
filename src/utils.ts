import type { User, Votes } from "./types";

export const calculateAPCards = ({
  startAt,
  commonDifference,
  size,
}: {
  startAt: number;
  commonDifference: number;
  size: number;
}) => {
  let cardsArr = [startAt];
  for (let i = 1; i < size; i++) {
    cardsArr.push(startAt + commonDifference * i);
  }
  return cardsArr;
};

export const calculateFibCards = (size: number) => {
  let cardsArr = [0, 1];
  for (let i = 1; i <= size - 1; i++) {
    cardsArr.push(cardsArr[i - 1] + cardsArr[i]);
  }
  cardsArr.splice(1, 1);

  return cardsArr;
};

export const calculateAverage = (votes: Votes | null) => {
  if (!votes) {
    return null;
  }

  let sum = 0;
  let voters = 0;

  for (const value in votes) {
    const currVotes = votes[value].length;
    sum += +value * currVotes;
    voters += currVotes;
  }

  return voters !== 0 ? (sum / voters).toFixed(2) : null;
};
