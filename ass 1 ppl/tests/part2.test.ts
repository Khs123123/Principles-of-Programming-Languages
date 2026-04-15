import { countVowels, isPalindrome, treeToSentence, WordTree } from "../src/part2";

describe("Assignment 1 Part 2", () => {
    describe("countVowels", () => {
        it("counts letters", () => {
            expect(countVowels("aaabbbb")).toEqual(3);
        });
        it("counts letters", () => {
            expect(countVowels("AaaBbbb")).toEqual(3);
        });
        it("counts letters", () => {
            expect(countVowels("ABbbaab")).toEqual(3);
        });
        it("counts letters", () => {
            expect(countVowels("I am robot")).toEqual(4);
        });
        it("counts letters", () => {
            expect(countVowels("abcABCaabbcc d")).toEqual(4);
        });
    });

    describe("isPalindrome", () => {

        it("should return true for a simple palindrome", () => {
            expect(isPalindrome("racecar")).toBe(true);
        });

        it("should return true for a palindrome with mixed case", () => {
            expect(isPalindrome("RaceCar")).toBe(true);
        });

        it("should return true for a palindrome ignoring spaces and punctuation", () => {
            expect(isPalindrome("A man, a plan, a canal, Panama!")).toBe(true);
        });

        it("should return false for a non-palindrome", () => {
            expect(isPalindrome("Not a palindrome")).toBe(false);
        });

        it("should return true for an empty string", () => {
            expect(isPalindrome("")).toBe(true);
        });

        it("should return true for a single-character string", () => {
            expect(isPalindrome("a")).toBe(true);
        });

        it("should handle numeric palindromes", () => {
            expect(isPalindrome("12321")).toBe(true);
        });

        it("should handle palindromes with special characters", () => {
            expect(isPalindrome("No lemon <=> No melon")).toBe(true);
        });

    });

    describe("treeToSentence", () => {
        it("Represents a tree as a sentence", () => {
            const t1: WordTree = {root:"hello", children:[{root: "world", children:[]}]}
            expect(treeToSentence(t1)).toBe("hello world");
        });

        it("Represents a tree as a sentence", () => {
            const t2: WordTree = {root:"hello", children:[{root: "there", children:[]}, {root:"!", children:[]}]}
            expect(treeToSentence(t2)).toBe("hello there !");
        });
        it("Represents a tree as a sentence", () => {
            const t3: WordTree = {root:"hello", children:[{root: "there", children:[{root:"!", children:[]}]}]}
            expect(treeToSentence(t3)).toBe("hello there !");
        });
        it("Represents a tree as a sentence", () => {
            const t4: WordTree = {root:"hello", children:[]}
            expect(treeToSentence(t4)).toBe("hello");
        });
        it("Represents a tree as a sentence", () => {
            const t5: WordTree = {root:"", children:[]}
            expect(treeToSentence(t5)).toBe("");
        });
    });
});

