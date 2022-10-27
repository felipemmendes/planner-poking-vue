export type Room = {
  id: string;
} & (
  | {
      voteType: "ap";
      startAt: number;
      commonDifference: number;
    }
  | {
      voteType: "fib";
    }
);

export type User = {
  id: string;
  username: string;
  isReady: boolean;
};

export type Votes = {
  [key: number]: User[];
};
