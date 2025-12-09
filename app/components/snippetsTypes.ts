// app/code/snippetsTypes.ts

export type RawSnippet = {
    id: number | string;
    title: string;
    level?: number;
    description?: string;
    code?: {
      global?: string;
      preload?: string;
      setup?: string;
      draw?: string;
      [k: string]: string | undefined;
    };
  };
  
  export type SnippetFlat = {
    id: string;
    title: string;
    level: number | null;
    description: string;
    code: string;
    raw?: RawSnippet;
  };
  
  export type PairOption = {
    audio?: SnippetFlat | null;
    visual?: SnippetFlat | null;
  };
  
  export type SnippetPair = {
    audio: SnippetFlat | null;
    visual: SnippetFlat | null;
  };
  