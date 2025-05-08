export type Category = 'bullet' | 'blitz' | 'rapid';

export type TimeControl = {
  category: Category;
  time: number;
  increment: number;
  text: string;
};
