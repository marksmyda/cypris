# Cypris

This project was generated using [Angular CLI](https://github.com/angular/angular-cli) version 19.2.13.

## Development server

This project uses yarn. Run the following once:

```bash
yarn install
```

To start a local development server, run:

```bash
ng serve
```

Once the server is running, open your browser and navigate to `http://localhost:4200/`. The application will automatically reload whenever you modify any of the source files.

## Building

To build the project run:

```bash
ng build
```

This will compile your project and store the build artifacts in the `dist/` directory. By default, the production build optimizes your application for performance and speed.

## Running unit tests

To execute unit tests with the [Karma](https://karma-runner.github.io) test runner, use the following command:

```bash
ng test
```
## Assumptions

1. I am only hitting the "works" endpoint for this project, on account of perceived scope.
2. I have interpreted "keyword" to mean fullText search, since that's how "keyword" is used in the API docs.

## Extra features

- Results from the API are fetched lazily, and pagination is mediated through the API. The dropdown to the right of the navigation controls the number of results per page.
- The table shows an indeterminate progress spinner while the API call is processing and the table data is loading.
- Some columns in the table are sortable, which is also mediated through the API. Use the clear button in the top right to remove sorting.
- Columns are resizeable. Hover the boundaries and click and drag left or right to adjust the sizes.
- Viewed results in the table can be exported to CSV by clicking the Export button.
- The table is scrollable when the number of rows exceeds what would fill the page height. Scroll the rows while retaining view of the chart.
- Table rows are expandable by clicking the caret icon on the left-hand side. This action reveals the abstract of the selected paper.
- Dates on the papers are formatted for "yyyy MMM dd" display and sort chronologically. Invalid dates have the label "Invalid Date".
- The authors list is presented in the comma-delimited format.
- Keyword search is translated to fullText boolean with grouping to conform to the standard in the API docs.
- Invalid groupings by parentheses malformation are intercepted, display an error message, and prevent search.
- Missing abstracts for papers are indicated with the label "Not Available".
- If the API returns an error, an error message is displayed in the table instead.
- Some unit test cases are included and pass.
