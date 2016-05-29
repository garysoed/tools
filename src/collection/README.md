Provides various collection related utilities.

Dependencies (the one at the top can depend on the lower ones):
-   Arrays
-   Sets
-   Iterables
-   Records
-   Maps

The more restrictive ones depend on the more general ones.


BaseFluent
- Iterables (addAll, iterate)
  - NonIndexables (filter, find, forEach, forOf, map, asSet)
    - Sets
  - Mappables
    - Maps
    - Records

  - Indexables
    - Array
    - SortedSet

|- NonIterables
   |- Graphs
     |- Trees
       |- Binary Trees
     |- Directed Graphs
