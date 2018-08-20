# Design patterns

## Fail early and fail loud
I used require to reduce unnecessary code execution in the event that an exception will be thrown.

## Factory
Marketplace uses Factory pattern to create shops instances, the logic behind was following, when a seller creates a shop he becomes an owner of this shop, so even if the marketplace stops, his shop will continue working. Such approach reflects a Web3 philosophy, also it allows to divide marketplace and shop logics and separate their storages.

## Circuit Breakers / Pausable
If something goes wrong shop owner can temporary block some functionality of his shop, it can be used for upgrading app UI, transferring data to a new version of a shop, investigation, storage updating etc.

## Destrucsible / Mortal
For a public block chain old unused application can be a big issue, so I believe that ANY contract should have self destruction method, which transfers money to an owner and clears a blockchains storage.

## Upgradeability
Marketplace works through proxy (data storage is placed in proxy), so we can easily upgrade it without loosing any data

## Iterable list
Accordingly to the requirements the DApp should show list of shops and products. I tried to create a logic that returns pages of ids and then UI loaded an instance of shop or a product using ID. Such an approach is complex and don't have any advantages compare to iterable logic. Iterable takes fewer requests to get data, it has less code, simpler logic and much fewer vulnerabilities. List is implemented as a linked list turned to a ring. I took the idea from Colony project.

## Restricting Access
As soon as different users should have different roles in the project I used Ownable and Roles, to implement access rules.

## Safe Math
As a developer I know that a hacker will always be smarter than me, or more cautious,
and any my mistake can cause financial loses for users. That is why I decided even not to think possible issues with over floating I just use SafeMath for ANY mathematical operation, it something goes wrong it will throw exception and stops.

## Withdrawal
A shop owner should be able to withdraw his money from shop, otherwise his shop doesn't make any sense, that is why this pattern was used.
