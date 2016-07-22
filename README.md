# legistar-client

An ES6 client for Legistar APIs.

## Installation

## Usage

```
import LegistarClient from 'legistar'
const legistar = new LegistarClient('Seattle')

async function main () {
  const matters = legistar.getAllMatters() // automatically pages the API, returning more than 1000 records
  matters.length; // 1791
}
main()
```


