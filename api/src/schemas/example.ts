import * as z from "zod";

const Player = z.object({
  username: z.string(),
  xp: z.number(),
});

Player.parse({ username: "billie", xp: 100 });
// => returns { username: "billie", xp: 100 }

//If schema uses certain async api like async refinement or transomf you need to use parseAsync instead of parse
await Player.parseAsync({ username: "billie", xp: 100 });

//handle error
// When validation fails, the.parse() method will
// throw a ZodError instance with granular information about the validation issues.

try {
  Player.parse({ username: 42, xp: "100" });
} catch (error) {
  if (error instanceof z.ZodError) {
    error.issues;
    /* [
      {
        expected: 'string',
        code: 'invalid_type',
        path: [ 'username' ],
        message: 'Invalid input: expected string'
      },
      {
        expected: 'number',
        code: 'invalid_type',
        path: [ 'xp' ],
        message: 'Invalid input: expected number'
      }
    ] */
  }
}

// To avoid a try/catch block, you can use the .safeParse() method to get back a plain result object
// containing either the successfully parsed data or a ZodError.
// The result type is a discriminated union, so you can handle both cases conveniently.
const result = Player.safeParse({ username: 42, xp: "100" });
if (!result.success) {
  result.error; // ZodError instance
} else {
  result.data; // { username: string; xp: number }
}

//if use of async api like async refinement or transform you need to use safeParseAsync instead of safeParse
const asyncResult = await Player.safeParseAsync({ username: 42, xp: "100" });

// Zod infers a static type from your schema definitions.
// You can extract this type with the z.infer <> utility and use it however you like.

const Playera = z.object({
  username: z.string(),
  xp: z.number(),
});

// extract the inferred type
type Playera = z.infer<typeof Player>;

// use it in your code
const player: Playera = { username: "billie", xp: 100 };

// In some cases, the input & output types of a schema can diverge.
// For instance, the.transform() API can convert
// the input from one type to another.In these cases,
// you can extract the input and output types independently:

const mySchema = z.string().transform((val) => val.length);

type MySchemaIn = z.input<typeof mySchema>;
// => string

type MySchemaOut = z.output<typeof mySchema>; // equivalent to z.infer<typeof mySchema>
// number
