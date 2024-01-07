## How to set up Typescript + Node.js + Express project
```
npm init -y
npm i -D typescript  // install typescript dependecies
npm i -D ts-node // directly run ts file without compiling to JS
npx tsc --init // init tsconfig.json to complie TS to JS file
npm i -D express morgan helmet cors
npm i -D @types/express @types/morgan @types/cors
```

## Set up nodemon config
- Add a new file called `nodemon.json`
- restartable: default command is "rs", change it to "r" for convenience
- ignore: an array of files we don't want the program to reload when changing
- watch: an array of paths we want the program to reload when changing
- ext: watching file extension that we want nodemon to actively monitor

## Set up [Prettier](https://prettier.io/docs/en/cli.html#file-patterns) config
- Add a new file called `.prettierrc`
- Add prettier rules in the `.prettierrc` file
- npm i -D --save-exact prettier
- Add two scripts to package.json
    - "prettier src/ --write --config ./prettierrc"
        - prettifier the src folder 
        - rewrites all processed files using `--write` flag
        - manually specify the configuration file `.prettierrc` 
            - (optional), could be helpful if you have this file in other folder

## Set up [ESLint](https://eslint.org/docs/latest/use/getting-started) config
- npm init @eslint/config

## Coding conventions guidelines
The codespace uses Prettier for formatting and ESlint for catching bugs.
- Prettier: 
    - add semicolons
    - Single quotes
    - 100 characters at most in one line
    - 2 space indentation
    - indent with tabs instead of space
    - `arrowParens`: Omit parens when possible. Example: `x => x`
    - `bracketSpacing`: Print spaces between brackets in object literals.
        - Example: { foo: bar }.
- [ESlint](https://eslint.org/docs/latest/rules/): 
    - `no-unused-vars`: disallow unused variables
    - `prefer-const`: require const declrations for variables that are never reassigned after declared
    - `no-var`: require let or const instead of var
    - `no-useless-return`: disallow redundant return statements
    - `no-unreachable`: disallow unreachable code after return, throw, continue, and break statements