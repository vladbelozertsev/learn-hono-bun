export type Equal<T, U> = (<G>() => G extends T ? 1 : 2) extends <G>() => G extends U ? 1 : 2
  ? { value: U; valid: any }
  : { value: never; valid: never };

export type Extend<T, U> = T extends U ? { value: U; valid: any } : { value: never; valid: never };
