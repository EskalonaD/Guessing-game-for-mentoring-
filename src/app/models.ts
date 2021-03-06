export interface Message {
    text: string;
    person: 'guesser' | 'puzzler';
    isFirst?: boolean;
    stop?: boolean;
}

export type ScrollDirection = 'top' | 'bottom';

export type GuessWay = 'more' | 'less' | 'match';
