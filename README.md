# Magento Playwright Automation

This project contains automated tests for a Magento-based e-commerce website, written using Playwright.

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

You need to have Node.js and npm installed on your machine.

- [Node.js](https://nodejs.org/)

### Installation

1.  Clone the repository:
    ```bash
    git clone https://github.com/Can-Kizilay/magento-automation.git
    ```
2.  Navigate to the project directory:
    ```bash
    cd magento-automation
    ```
3.  Install the dependencies:
    ```bash
    npm install
    ```
4.  Install Playwright browsers:
    ```bash
    npx playwright install
    ```

## Running the tests

To run the end-to-end tests, use the following command:

```bash
npm test
```

This will execute the Playwright tests and generate a report.

## Project Structure

```
.
├── helpers/              # Helper functions for tests
├── pages/                # Page Object Models
├── tests/                # Test files
├── test-data/            # Test data files
├── package.json          # Project metadata and dependencies
└── playwright.config.ts  # Playwright configuration
```

## Dependencies

- [Playwright](https://playwright.dev/): For browser automation and end-to-end testing.
- [@faker-js/faker](https://fakerjs.dev/): For generating fake data for testing.
