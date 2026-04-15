## Part 1: Theoretical Questions

Submit the solution to this part as `part1.md`.

### [25 points] Question 1.1

1. Explain in simple words the following programming paradigms:
   1. [5 points] Imperative:Imperative programming is a way of writing code by telling the computer step by step what to do. The programmer gives a sequence of instructions that change the program’s state. This style often uses variables, assignments, loops, and conditionals. The main focus is on the exact process that leads to the result.

   1. [5 points] Object Oriented:Object-oriented programming organizes code around objects. An object contains both data and the actions that can be done on that data. Usually, objects are created from classes. This makes it easier to organize large programs into smaller and clearer parts, and it helps model real systems in a more natural way.

   1. [5 points] Functional:Functional programming is based mainly on functions. In this paradigm, functions receive input and return output, and programmers try to avoid changing data and shared state as much as possible. Functional programming often uses pure functions, which always give the same result for the same input and do not have side effects. It also uses higher-order functions such as map, filter, and reduce.

1. [5 points] How does the object oriented paradigm improve over the imperative paradigm?
The main improvement of object-oriented programming over imperative programming is better organization of code. In imperative programming, large programs can become hard to manage because the code and the data changes may be spread across many places. OOP improves this by grouping data and behavior together inside objects.

This makes the code more modular, easier to understand, and easier to maintain. OOP also supports encapsulation, which means an object can hide its internal details and expose only what is needed. This helps reduce mistakes and makes the program easier to build and expand.

1. [5 points] How does the functional paradigm improve over the object oriented paradigm?
Functional programming improves over object-oriented programming mainly by reducing side effects and avoiding unnecessary changes in data. In OOP, objects often have mutable state, and different parts of the program may change that state. This can make programs harder to understand and debug.

In functional programming, the focus is on pure functions and immutable data. Because of this, the code is usually more predictable and easier to test. It is often easier to understand what a function does, because its result depends only on its input. This makes functional programming safer and very useful in complex programs.



### [10 points] Question 1.2

Consider the following TypeScript function, which calculates the average price of all discounted products in a given inventory.

```ts
type Product = {
  name: string;
  price: number;
  discounted: boolean;
};

const getDiscountedProductAveragePrice = (inventory: Product[]): number => {
  let discountedPriceSum = 0;
  let discountedProductsCount = 0;

  for (const product of inventory) {
    if (product.discounted) {
      discountedPriceSum += product.price;
      discountedProductsCount++;
    }
  }

  if (discountedProductsCount === 0) {
    return 0;
  }

  return discountedPriceSum / discountedProductsCount;
};
```
export const getDiscountedProductAveragePriceFP = (inventory: Product[]): number => {
    const discountedPrices = inventory
        .filter(product => product.discounted)
        .map(product => product.price);

    return discountedPrices.length === 0 
        ? 0 
        : discountedPrices.reduce((sum, price) => sum + price, 0) / discountedPrices.length;
}


This function uses an imperative approach with loops and conditional statements.

Refactor the function `getDiscountedProductAveragePrice` to adhere to the Functional Programming paradigm. Utilize the built-in array methods `map`, `filter`, and `reduce` to achieve the same functionality without explicit iteration and conditional checks.
Write the new function under the name `getDiscountedProductAveragePriceFP`.

**Important**: the new function should have the same signature.

**Note**: there are no tests for this question, and it will not be executed. The task here is to write the code in a functional way.

### [18 points] Question 1.3

Write the most general type for each expression, using type variables where applicable.
Guidelines:

- Arrays must be homogeneous.
- Arithmetic operations must be performed on numbers.
- Use generics where possible.
- Avoid using `any`.

1. [3 points] `(x, y) => x.some(y)`
<T>(x: T[ ], y: (value: T) => boolean) => boolean

2. [3 points] `x => x.map(y => y * 2)`
(x: number[ ]) => number[ ]

3. [3 points] `(x, y) => x.filter(y)`
<T>(x: T[ ], y: (value: T) => boolean) => T[ ]

4. [3 points] `x => x.reduce((acc, cur) => acc + cur, 0)`
(x: number[ ]) => number

5. [3 points] `(x, y) => x ? y[0] : y[1]`
<T>(x: boolean, y: T[ ]) => T

6. [3 points] `(f,g) => x => f(g(x+1))`
<T, U>(f: (y: T) => U, g: (x: number) => T) => (x: number) => U

